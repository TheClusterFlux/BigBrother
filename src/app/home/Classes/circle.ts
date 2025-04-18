import { EventEmitter } from '@angular/core';
import { User } from '../Models/user.model';

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const radius = 50;
const gradientWeight = 1.5;
const collisionTimeoutMS = 100;

let heightmapData: any;

let users = [];
let sidePanelVisible = false;

export class Circle extends EventEmitter {
  public user: User;
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
    user: User
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
    this.element.style.backgroundImage = `url(${user.avatar_url})`;
    this.element.style.backgroundSize = 'cover';
    this.element.style.position = 'absolute';
    this.element.style.left = `${x - radius}px`;
    this.element.style.top = `${y - radius}px`;
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
      if (
        other !== this &&
        currentTime - this.lastCollisionTime > collisionTimeoutMS &&
        currentTime - other.lastCollisionTime > collisionTimeoutMS
      ) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.radius + other.radius) {
          // Simple collision response: exchange velocities
          if (other.selected) {
            this.vx = -this.vx * 2;
            this.vy = -this.vy * 2;
            this.adjustPositions(other, dx, dy, distance);
            this.lastCollisionTime = currentTime;
            return;
          }
          const tempVx = this.vx;
          const tempVy = this.vy;
          this.vx = other.vx;
          this.vy = other.vy;
          other.vx = tempVx;
          other.vy = tempVy;

          this.adjustPositions(other, dx, dy, distance);

          this.lastCollisionTime = currentTime;
          other.lastCollisionTime = currentTime;
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
    this.element.style.left = `${this.x - this.radius}px`;
    this.element.style.top = `${this.y - this.radius}px`;
  }

  private adjustVelocityBasedOnHeightmap(heightmapData: any, width: number) {
    const pixelIndex = (Math.floor(this.y) * width + Math.floor(this.x)) * 4;

    const gradientX =
      (heightmapData[pixelIndex + 4] - heightmapData[pixelIndex - 4]) / 255;
    const gradientY =
      (heightmapData[pixelIndex + width * 4] -
        heightmapData[pixelIndex - width * 4]) /
      255;

    this.vx += gradientX * gradientWeight;
    this.vy += gradientY * gradientWeight;

    // Normalize velocity to prevent excessive speed
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > this.maxSpeed) {
      this.vx = (this.vx / speed) * this.maxSpeed;
      this.vy = (this.vy / speed) * this.maxSpeed;
    }
  }

  private clampVelocity() {
    if (Math.abs(this.vx) < this.minSpeed) {
      this.vx = this.minSpeed * Math.sign(this.vx) || this.minSpeed;
    }
    if (Math.abs(this.vy) < this.minSpeed) {
      this.vy = this.minSpeed * Math.sign(this.vy) || this.minSpeed;
    }

    if (this.vx > this.maxSpeed) {
      this.vx = this.maxSpeed;
    } else if (this.vx < -this.maxSpeed) {
      this.vx = -this.maxSpeed;
    }
    if (this.vy > this.maxSpeed) {
      this.vy = this.maxSpeed;
    } else if (this.vy < -this.maxSpeed) {
      this.vy = -this.maxSpeed;
    }
  }

  public getUserData() {
    return this.user;
  }
}
