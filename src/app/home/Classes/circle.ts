import { EventEmitter } from '@angular/core';
import { ServerMember } from '../Models/server.model';

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const radius = 50;
const gradientWeight = 1.5;
const collisionTimeoutMS = 100;
const energyGainFactor = 0.15; // Maximum energy gain during "energetic" collisions
const energyLossFactor = 0.25; // Maximum energy loss during "dampening" collisions

let heightmapData: any;

let users = [];
let sidePanelVisible = false;

// Add a stronger repulsion constant for selected circles
const repulsionStrength = 0.015; // Regular repulsion strength
const repulsionRange = 1.2; // Regular repulsion range
const selectedRepulsionStrength = 0.035; // Stronger repulsion for selected circles
const selectedRepulsionRange = 1.5; // Wider repulsion range for selected circles

// Add a constant for enabling hardware acceleration and transform-based positioning
const useTransforms = true; // Set to true to use CSS transforms (smoother animation)

export class Circle extends EventEmitter {
  public user: ServerMember;
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public radius: number;
  public maxSpeed = 2;
  public minSpeed = 0.1;
  private lastCollisionTime: number;
  public selected?: boolean;
  public element: HTMLDivElement;

  constructor(
    x: number,
    y: number,
    radius: number,
    user: ServerMember
  ) {
    super();
    this.user = user;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = radius;
    this.lastCollisionTime = 0;
    this.selected = false;

    this.element = document.createElement('div');
    this.element.className = 'circle';
    this.element.style.width = `${radius * 2}px`;
    this.element.style.height = `${radius * 2}px`;
    this.element.style.backgroundImage = `url(${user.avatar})`;
    this.element.style.backgroundSize = 'cover';
    this.element.style.position = 'absolute';
    
    // Enable hardware acceleration to reduce visual artifacts
    if (useTransforms) {
      // Set initial position with transform
      this.element.style.transform = `translate(${x - radius}px, ${y - radius}px)`;
      
      // Add hardware acceleration
      this.element.style.willChange = 'transform';
      this.element.style.backfaceVisibility = 'hidden';
      this.element.style.perspective = '1000px';
      
      // Zero out the left/top since we're using transforms for positioning
      this.element.style.left = '0';
      this.element.style.top = '0';
    } else {
      // Fallback to standard positioning if transforms are disabled
      this.element.style.left = `${x - radius}px`;
      this.element.style.top = `${y - radius}px`;
    }
    
    document.body.appendChild(this.element);
    this.vx = Math.random() * 2 - 1;
    this.vy = Math.random() * 2 - 1;
    this.lastCollisionTime = 0;
    this.selected = false;
  }

  deselect() {
    if (!this.selected) return;
    this.selected = false;
    this.y -= this.radius;
    this.vx = Math.random() * 2 - 1;
    this.vy = Math.random() * 2 - 1;
    this.radius /= 4;
    this.applyPosition();
    this.element.style.width = `${this.radius * 2}px`;
    this.element.style.height = `${this.radius * 2}px`;
  }

  select() {
    this.selected = true;
    this.vx = 0;
    this.vy = 0;
    this.x = screenWidth / 2;
    this.y = screenHeight / 2;
    this.radius *= 4;
    this.applyPosition();
    this.element.style.width = `${this.radius * 2}px`;
    this.element.style.height = `${this.radius * 2}px`;
  }

  public update(
    heightmapData: any,
    width: number,
    height: number,
    circles: Circle[]
  ) {
    this.x += this.vx;
    this.y += this.vy;

    this.checkEdgeCollision(width, height);

    this.checkCircleCollision(circles);

    this.applyPosition();

    this.adjustVelocityBasedOnHeightmap(heightmapData, width);

    this.clampVelocity();
    if (this.selected) {
      this.x = screenWidth / 2;
      this.y = screenHeight / 2;
      this.vx = 0;
      this.vy = 0;
    }
  }

  private checkEdgeCollision(width: number, height: number) {
    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.vx *= -1;
    }
    if (this.x + this.radius > width) {
      this.x = width - this.radius;
      this.vx *= -1;
    }
    if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.vy *= -1;
    }
    if (this.y + this.radius > height) {
      this.y = height - this.radius;
      this.vy *= -1;
    }
  }

  private checkCircleCollision(circles: Circle[]) {
    const currentTime = performance.now();
    for (const other of circles) {
      if (other === this) continue;
      
      const dx = this.x - other.x;
      const dy = this.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = this.radius + other.radius;
      
      // Handle interactions with selected circles differently
      if (this.selected || other.selected) {
        // Calculate the angle of interaction
        const angle = Math.atan2(dy, dx);
        
        // Apply stronger and wider repulsion for selected circles
        const thisRepulsionRange = minDistance * selectedRepulsionRange;
        
        if (distance < thisRepulsionRange) {
          // Apply repulsion based on which circle is selected
          if (this.selected && !other.selected) {
            // Selected circle repelling a regular circle
            const strength = selectedRepulsionStrength * (1 - distance / thisRepulsionRange);
            other.vx -= strength * Math.cos(angle) * 2;
            other.vy -= strength * Math.sin(angle) * 2;
            
            // Ensure no overlap
            if (distance < minDistance) {
              const overlap = minDistance - distance + 1;
              other.x -= overlap * Math.cos(angle);
              other.y -= overlap * Math.sin(angle);
            }
          } else if (!this.selected && other.selected) {
            // Regular circle being repelled by selected circle
            const strength = selectedRepulsionStrength * (1 - distance / thisRepulsionRange);
            this.vx += strength * Math.cos(angle) * 2;
            this.vy += strength * Math.sin(angle) * 2;
            
            // Ensure no overlap
            if (distance < minDistance) {
              const overlap = minDistance - distance + 1;
              this.x += overlap * Math.cos(angle);
              this.y += overlap * Math.sin(angle);
            }
          }
        }
        continue; // Skip regular collision handling
      }
      
      // Apply repulsive forces even before actual collision for regular circles
      const thisRepulsionRange = minDistance * repulsionRange;
      
      if (distance < thisRepulsionRange) {
        // Calculate the angle of the collision
        const angle = Math.atan2(dy, dx);
        
        // Calculate repulsion strength
        const thisRepulsionStrength = repulsionStrength * (1 - distance / thisRepulsionRange);
        
        // ===== IMPROVED COLLISION HANDLING =====
        if (distance < minDistance) {
          // First, separate the circles completely to prevent sticking
          const overlap = minDistance - distance + 0.5; // Small extra separation to prevent immediate re-collision
          
          // Move both circles apart more decisively
          const separationFactor = 0.55; // Slightly more than half to ensure proper separation
          this.x += overlap * separationFactor * Math.cos(angle);
          this.y += overlap * separationFactor * Math.sin(angle);
          other.x -= overlap * separationFactor * Math.cos(angle);
          other.y -= overlap * separationFactor * Math.sin(angle);
          
          // Only proceed with velocity changes if we haven't just handled a collision
          if (currentTime - this.lastCollisionTime > collisionTimeoutMS &&
              currentTime - other.lastCollisionTime > collisionTimeoutMS) {
            
            // Calculate mass based on radius (assuming constant density)
            const m1 = this.radius * this.radius;
            const m2 = other.radius * other.radius;
            const totalMass = m1 + m2;
            
            // Project velocities onto collision axis
            const v1 = this.vx * Math.cos(angle) + this.vy * Math.sin(angle);
            const v2 = other.vx * Math.cos(angle) + other.vy * Math.sin(angle);
            
            // Check for same-direction movement (potential sticking)
            const movingTogether = Math.sign(v1) === Math.sign(v2);
            const relativeVelocity = Math.abs(v1 - v2);
            
            // Apply additional separation force if moving in same direction
            if (movingTogether && relativeVelocity < 0.5) {
              // Add a random perpendicular force to break symmetry
              const perpAngle = angle + Math.PI/2;
              const randomFactor = Math.random() * 0.5 + 0.5; // 0.5 to 1.0
              
              this.vx += Math.cos(perpAngle) * randomFactor;
              this.vy += Math.sin(perpAngle) * randomFactor;
              other.vx -= Math.cos(perpAngle) * randomFactor;
              other.vy -= Math.sin(perpAngle) * randomFactor;
            }
            
            // Calculate initial speeds
            const speed1 = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            const speed2 = Math.sqrt(other.vx * other.vx + other.vy * other.vy);
            
            // Calculate impact intensity based on relative velocities
            const relImpact = Math.abs(v1 - v2) / (this.maxSpeed * 2);  
            
            // Determine speed change factor - higher impact means more energy change
            // This creates variable energy outcomes where some collisions add energy, others remove it
            let energyFactor1: number;
            let energyFactor2: number;
            
            // Use collision angle and velocities to determine if it's an energy-adding
            // or energy-removing collision. Head-on collisions tend to lose energy,
            // while glancing collisions or specific angle hits can gain energy.
            const dotProduct = (this.vx * -other.vx + this.vy * -other.vy) / 
                              (speed1 * speed2 || 1); // Avoid division by zero
            
            // For circle 1
            if (Math.random() < 0.5) {
              // 50% chance of gaining energy
              energyFactor1 = 1 + Math.random() * energyGainFactor * relImpact;
            } else {
              // 50% chance of losing energy
              energyFactor1 = 1 - Math.random() * energyLossFactor * relImpact;
            }
            
            // For circle 2 - slightly negatively correlated with circle 1
            // (if one gains energy, other is more likely to lose it)
            if (Math.random() < 0.4 && energyFactor1 > 1) {
              // 40% chance of also gaining energy if first circle gained energy
              energyFactor2 = 1 + Math.random() * energyGainFactor * relImpact;
            } else if (Math.random() < 0.7 && energyFactor1 < 1) {
              // 70% chance of gaining energy if first circle lost energy
              energyFactor2 = 1 + Math.random() * energyGainFactor * relImpact;
            } else {
              // Otherwise lose energy
              energyFactor2 = 1 - Math.random() * energyLossFactor * relImpact;
            }
            
            // Calculate new velocities with conservation of momentum and variable energy
            const v1Final = ((m1 - m2) * v1 + 2 * m2 * v2) / totalMass * energyFactor1;
            const v2Final = ((m2 - m1) * v2 + 2 * m1 * v1) / totalMass * energyFactor2;
            
            // Get perpendicular velocity components (preserved in collision)
            const v1p = -this.vx * Math.sin(angle) + this.vy * Math.cos(angle);
            const v2p = -other.vx * Math.sin(angle) + other.vy * Math.cos(angle);
            
            // Update velocities by decomposing back to x,y components
            this.vx = v1Final * Math.cos(angle) - v1p * Math.sin(angle);
            this.vy = v1Final * Math.sin(angle) + v1p * Math.cos(angle);
            other.vx = v2Final * Math.cos(angle) - v2p * Math.sin(angle);
            other.vy = v2Final * Math.sin(angle) + v2p * Math.cos(angle);
            
            // Ensure minimum separation velocity to prevent sticking
            const minSeparationSpeed = 0.3;
            if (Math.abs(v1Final) < minSeparationSpeed && Math.abs(v2Final) < minSeparationSpeed) {
              this.vx += minSeparationSpeed * Math.cos(angle);
              this.vy += minSeparationSpeed * Math.sin(angle);
              other.vx -= minSeparationSpeed * Math.cos(angle);
              other.vy -= minSeparationSpeed * Math.sin(angle);
            }
            
            this.lastCollisionTime = currentTime;
            other.lastCollisionTime = currentTime;
          }
        } else if (distance >= minDistance && distance < thisRepulsionRange) {
          // Not in collision but within repulsion range - apply gentle repulsive force
          this.vx += thisRepulsionStrength * Math.cos(angle);
          this.vy += thisRepulsionStrength * Math.sin(angle);
          other.vx -= thisRepulsionStrength * Math.cos(angle);
          other.vy -= thisRepulsionStrength * Math.sin(angle);
        }
      }
    }
  }

  private adjustPositions(
    other: Circle,
    dx: number,
    dy: number,
    distance: number
  ) {
    const overlap = this.radius + other.radius - distance;
    const adjustX = ((dx / distance) * overlap) / 2;
    const adjustY = ((dy / distance) * overlap) / 2;
    if(this.selected) {
      other.x -= adjustX;
      other.y -= adjustY;
    }
    else{
      this.x += adjustX;
      this.y += adjustY;
    }

    if(other.selected) {
      this.x+=adjustX;
      this.y+=adjustY;
    }
    else{
      other.x -= adjustX;
      other.y -= adjustY;}
  }

  public applyPosition() {
    if (useTransforms) {
      // Use CSS transforms for smoother positioning
      // Round to tenths of a pixel for potential performance improvement while maintaining smoothness
      const x = Math.round((this.x - this.radius) * 10) / 10;
      const y = Math.round((this.y - this.radius) * 10) / 10;
      this.element.style.transform = `translate3d(${x}px, ${y}px, 0px)`;
    } else {
      // Fallback to standard positioning
      this.element.style.left = `${this.x - this.radius}px`;
      this.element.style.top = `${this.y - this.radius}px`;
    }
  }

  private adjustVelocityBasedOnHeightmap(heightmapData: any, width: number) {
    // Create a larger sampling area to get a more averaged gradient
    const sampleRadius = 3; // Sample in a 3×3 pixel area
    let avgGradientX = 0;
    let avgGradientY = 0;
    let validSamples = 0;

    // Take multiple samples around the current position for a smoother gradient
    for (let offsetY = -sampleRadius; offsetY <= sampleRadius; offsetY++) {
      for (let offsetX = -sampleRadius; offsetX <= sampleRadius; offsetX++) {
        const sampleX = Math.floor(this.x) + offsetX;
        const sampleY = Math.floor(this.y) + offsetY;
        
        // Skip out of bounds positions
        if (sampleX < 1 || sampleX >= width - 1 || sampleY < 1 || sampleY >= heightmapData.length / (4 * width) - 1) {
          continue;
        }

        const pixelIndex = (sampleY * width + sampleX) * 4;
        
        // Calculate local gradient at this sample point
        const localGradientX = (heightmapData[pixelIndex + 4] - heightmapData[pixelIndex - 4]) / 255;
        const localGradientY = (heightmapData[pixelIndex + width * 4] - heightmapData[pixelIndex - width * 4]) / 255;
        
        // Apply distance-based weight (closer samples matter more)
        const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
        const weight = 1 / (1 + distance);
        
        avgGradientX += localGradientX * weight;
        avgGradientY += localGradientY * weight;
        validSamples += weight;
      }
    }

    // Avoid division by zero
    if (validSamples > 0) {
      avgGradientX /= validSamples;
      avgGradientY /= validSamples;
    }

    // Apply velocity inertia - only change a portion of the velocity each frame
    const inertiaFactor = 0.85; // How much of the previous velocity to keep
    const gradientImpact = 0.15; // How much of the new gradient to apply

    // Smoothly transition to the new velocity
    this.vx = this.vx * inertiaFactor + avgGradientX * gradientWeight * gradientImpact;
    this.vy = this.vy * inertiaFactor + avgGradientY * gradientWeight * gradientImpact;

    // Normalize velocity to prevent excessive speed
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > this.maxSpeed) {
      this.vx = (this.vx / speed) * this.maxSpeed;
      this.vy = (this.vy / speed) * this.maxSpeed;
    }
  }

  private clampVelocity() {
    // Calculate current speed
    const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    
    // Only enforce minimum speed if the circle is moving very slowly
    // This allows post-collision speeds to vary more naturally
    if (currentSpeed < this.minSpeed * 0.8) {
      // Maintain direction but increase speed to minimum
      const angle = Math.atan2(this.vy, this.vx);
      this.vx = Math.cos(angle) * this.minSpeed;
      this.vy = Math.sin(angle) * this.minSpeed;
    }
    
    // For maximum speed, apply a soft cap instead of hard limit
    // This allows occasional bursts of speed after energetic collisions
    if (currentSpeed > this.maxSpeed) {
      const overspeedRatio = currentSpeed / this.maxSpeed;
      
      // Allow up to 20% overspeed for brief periods
      const allowedOverspeed = Math.min(overspeedRatio, 1.2);
      
      // Gradually bring back to normal maximum with some variability
      const reductionFactor = 1 - 0.1 * (allowedOverspeed - 1) * (0.9 + Math.random() * 0.2);
      
      this.vx *= reductionFactor;
      this.vy *= reductionFactor;
    }
  }

  public getUserData() {
    return this.user;
  }
}
