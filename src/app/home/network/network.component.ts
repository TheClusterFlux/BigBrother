import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  Output,
} from '@angular/core';
import { Circle } from '../Classes/circle';
import { User } from '../Models/user.model';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NetworkComponent implements OnInit, OnDestroy {
  @ViewChild('container', { static: true }) containerRef!: ElementRef;
  @Output() public infoSliderEmitter: EventEmitter<any> = new EventEmitter<any>();
  public isPanelClosed = false;
  private circles: Circle[] = [];
  private animationId: number = 0;
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

  private createCircles(users: User[]) {
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
        circle.vx = Math.max(circle.vx, circle.minSpeed);
      }
      if (circle.x + circle.radius > this.screenWidth) {
        circle.x = this.screenWidth - circle.radius;
        circle.vx = Math.min(circle.vx, -circle.minSpeed);
      }
      if (circle.y - circle.radius < 0) {
        circle.y = circle.radius;
        circle.vy = Math.max(circle.vy, circle.minSpeed);
      }
      if (circle.y + circle.radius > this.screenHeight) {
        circle.y = this.screenHeight - circle.radius;
        circle.vy = Math.min(circle.vy, -circle.minSpeed);
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
    this.heightmap.src = '../assets/ring.png';
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
    this.circles.forEach((circle) => {
      circle.update(
        this.heightmapData,
        this.heightmapCanvas.width,
        this.heightmapCanvas.height,
        this.circles
      );
    });
    requestAnimationFrame(() => this.animate());
  }

  private async fetchUsers(): Promise<User[]> {
    try {
      // const response = await fetch('http://localhost:3000/users', {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });

      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }

      // const users = await response.json();
      const users = [
        {
          id: 1,
          username: "john_doe",
          status: "Active",
          avatar_url: "assets/fakeProfileImages/Profile1.jpg",
          created_at: "2025-01-15T10:00:00Z",
          display_name: "John Doe",
          presence: "Online"
        },
        {
          id: 2,
          username: "jane_smith",
          status: "Inactive",
          avatar_url: "assets/fakeProfileImages/Profile2.jpg",
          created_at: "2025-02-20T14:30:00Z",
          display_name: "Jane Smith",
          presence: "Offline"
        },
        {
          id: 3,
          username: "alice_wonder",
          status: "Active",
          avatar_url: "assets/fakeProfileImages/Profile3.jpg",
          created_at: "2025-03-10T08:45:00Z",
          display_name: "Alice Wonder",
          presence: "Away"
        },
        {
          id: 4,
          username: "bob_builder",
          status: "Active",
          avatar_url: "assets/fakeProfileImages/Profile4.jpg",
          created_at: "2025-04-01T12:00:00Z",
          display_name: "Bob Builder",
          presence: "Online"
        },
        {
          id: 5,
          username: "charlie_brown",
          status: "Inactive",
          avatar_url: "assets/fakeProfileImages/Profile5.jpg",
          created_at: "2025-05-05T16:15:00Z",
          display_name: "Charlie Brown",
          presence: "Offline"
        }
      ];

      if (!Array.isArray(users)) {
        throw new Error('Expected an array of users');
      }
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  private initializeCircleEvents(circle: Circle) {
    circle.element.addEventListener('click', () => {
      this.selectAndDeselect(circle);
    });
  }

  private createCircle(x: number, y: number, radius: number, user: User) {
    const circle = new Circle(x, y, radius, user);
    this.initializeCircleEvents(circle);
    return circle;
  }
}
