import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  Output,
  Inject,
} from '@angular/core';
import { Circle } from '../Classes/circle';
import { DiscordServer, mockServerData, ServerMember } from '../Models/server.model';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NetworkComponent implements OnInit, OnDestroy {
  @ViewChild('container', { static: true }) containerRef!: ElementRef;
  @Output() public infoSliderEmitter: EventEmitter<any> =
    new EventEmitter<any>();
  public isPanelClosed = false;
  private circles: Circle[] = [];
  private animationId: number = 0;
  private discordServers: DiscordServer[] = Array.isArray(mockServerData) ? mockServerData : [mockServerData];
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  radius = 50;
  gradientWeight = 1.5;
  collisionTimeoutMS = 100;

  heightmapData: any;

  heightmap = new Image();
  animationStarted = false;

  heightmapCanvas = document.createElement('canvas');
  sidePanel = document.createElement('div');

  constructor() {}

  async ngOnInit() {
    await this.fetchUsers().then((users) => {
      this.circles = this.createCircles(users);
    });

    this.loadHeightmap();
    window.addEventListener('resize', this.resizeCanvas);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', () => {});
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private createCircles(users: ServerMember[]) {
    const circles = [];
    for (let i = 0; i < 5; i++) {
      for (const user of users) {
        const x = Math.random() * this.screenWidth;
        const y = Math.random() * this.screenHeight;
        let circ = this.createCircle(x, y, this.radius, user);
        circles.push(circ);
      }
    }
    return circles;
  }

  private selectAndDeselect(circle: Circle) {
    if (circle.selected) {
      circle.deselect();
      this.infoSliderEmitter.emit(circle);
    } else {
      this.circles.forEach((cir) => {
        if (cir.selected) {
          cir.deselect();
        }
      });
      circle.select();
      this.infoSliderEmitter.emit(circle);
    }
  }

  private resizeCanvas() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.heightmapCanvas.width = this.screenWidth;
    this.heightmapCanvas.height = this.screenHeight;
    this.loadHeightmap();
    this.circles.forEach((circle) => {
      if (circle.x - circle.radius < 0) {
        circle.x = circle.radius;
        circle.vx = Math.abs(circle.vx); // Ensure velocity is positive
      }
      if (circle.x + circle.radius > this.screenWidth) {
        circle.x = this.screenWidth - circle.radius;
        circle.vx = -Math.abs(circle.vx); // Ensure velocity is negative
      }
      if (circle.y - circle.radius < 0) {
        circle.y = circle.radius;
        circle.vy = Math.abs(circle.vy); // Ensure velocity is positive
      }
      if (circle.y + circle.radius > this.screenHeight) {
        circle.y = this.screenHeight - circle.radius;
        circle.vy = -Math.abs(circle.vy); // Ensure velocity is negative
      }
      circle.applyPosition();
    });
  }

  private loadHeightmap() {
    this.heightmapCanvas.width = this.screenWidth;
    this.heightmapCanvas.height = this.screenHeight;
    this.heightmapCanvas.style.position = 'absolute';
    this.heightmapCanvas.style.top = '0';
    this.heightmapCanvas.style.left = '0';
    // Create the side panel
    const sidePanel = document.createElement('div');
    sidePanel.id = 'side-panel';
    document.body.appendChild(sidePanel);

    this.heightmap.crossOrigin = 'Anonymous'; // Allow cross-origin requests
    this.heightmap.src = 'assets/ring.png';
    this.heightmap.onload = () => {
      const ctx = this.heightmapCanvas.getContext('2d');
      if (!ctx) {
        console.error('Failed to get 2D context');
        return;
      }
      ctx.drawImage(
        this.heightmap,
        0,
        0,
        this.heightmapCanvas.width,
        this.heightmapCanvas.height
      );
      this.heightmapData = ctx.getImageData(
        0,
        0,
        this.heightmapCanvas.width,
        this.heightmapCanvas.height
      ).data;
      if (!this.animationStarted) {
        this.animate(); // Start animation after heightmap is loaded
        this.animationStarted = true;
      }
    };
  }

  private animate() {
    this.circles.forEach((circle, index) => {
      circle.update(
        this.heightmapData,
        this.heightmapCanvas.width,
        this.heightmapCanvas.height,
        this.circles
      );

      // Smooth collision handling
      for (let i = index + 1; i < this.circles.length; i++) {
        const otherCircle = this.circles[i];
        const dx = circle.x - otherCircle.x;
        const dy = circle.y - otherCircle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = circle.radius + otherCircle.radius;

        if (distance < minDistance) {
          const angle = Math.atan2(dy, dx);
          const overlap = minDistance - distance;

          // Push circles apart
          circle.x += (overlap / 2) * Math.cos(angle);
          circle.y += (overlap / 2) * Math.sin(angle);
          otherCircle.x -= (overlap / 2) * Math.cos(angle);
          otherCircle.y -= (overlap / 2) * Math.sin(angle);

          // Adjust velocities for smoother bounce
          const tempVx = circle.vx;
          const tempVy = circle.vy;
          circle.vx = otherCircle.vx * 0.8; // Reduce speed slightly on collision
          circle.vy = otherCircle.vy * 0.8;
          otherCircle.vx = tempVx * 0.8;
          otherCircle.vy = tempVy * 0.8;
        }
      }
    });
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  private async fetchUsers(): Promise<ServerMember[]> {
    try {
      // Check if we have Discord servers injected
      if (!this.discordServers || this.discordServers.length === 0) {
        console.error('No Discord servers available');
        return [];
      }

      // Get members from the first server
      // You could also combine members from multiple servers if needed
      const serverMembers = this.discordServers[0].members;
      
      // Validate that we have an array of members
      if (!Array.isArray(serverMembers)) {
        console.error('Expected an array of server members');
        return [];
      }
      
      console.log(`Successfully retrieved ${serverMembers.length} members from server "${this.discordServers[0].name}"`);
      return serverMembers;
    } catch (error) {
      console.error('Error fetching server members:', error);
      return [];
    }
  }

  private initializeCircleEvents(circle: Circle) {
    circle.element.addEventListener('click', () => {
      this.selectAndDeselect(circle);
    });
  }

  private createCircle(x: number, y: number, radius: number, user: ServerMember) {
    const circle = new Circle(x, y, radius, user);
    circle.minSpeed = 0.3; // Set a minimum speed for smoother movement
    circle.maxSpeed = 1.0; // Set a maximum speed for smoother movement
    this.initializeCircleEvents(circle);
    return circle;
  }
}
