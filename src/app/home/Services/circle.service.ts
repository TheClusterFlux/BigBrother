// import { ElementRef, Injectable } from '@angular/core';
// import { Circle } from '../Models/circle.model'; // Adjust the import path as needed
// import { User } from '../Models/user.model';

// @Injectable({
//   providedIn: 'root',
// })
// export class CircleService {
//   private containerWidth: number = 0;
//   private containerHeight: number = 0;
//   private circles: Circle[] = [];

//   constructor() {}

//   getCircles(): Circle[] {
//     return this.circles;
//   }

//   async addCircle(user: User, containerRef: ElementRef): Promise<void> {
//     return new Promise<void>((resolve) => {
//       this.containerWidth = containerRef.nativeElement.clientWidth;
//       this.containerHeight = containerRef.nativeElement.clientHeight;
//       let cx = 500;
//       let cy = 500;

//       if (
//         typeof this.containerWidth === 'number' &&
//         !isNaN(this.containerWidth) &&
//         this.containerWidth > 0
//       ) {
//         cx = this.containerWidth / 2;
//         cy = this.containerHeight / 2;
//       } else {
//         console.warn('Invalid container dimensions:', {
//           width: this.containerWidth,
//           height: this.containerHeight,
//         });
//       }

//       const position = this.getRandomPosition();
      
//       const circle: Circle = {
//         user: user,
//         x: position.x,
//         y: position.y,
//         vx: 0,
//         vy: 0,
//         targetX: position.x,
//         targetY: position.y,
//         repulsionX: 0,
//         repulsionY: 0,
//         profilePic: user.avatar_url,
//         selected: false,
//       };

//       this.circles.push(circle);
//       this.updateDOM(containerRef);

//       // Wait for next frame to ensure DOM update
//       requestAnimationFrame(() => {
//         resolve();
//       });
//     });
//   }

//   private updateDOM(containerRef: ElementRef) {
//     const container = containerRef.nativeElement;
//     container.innerHTML = '';

//     // Add SVG layer for lines
//     const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
//     svg.style.cssText = `
//       position: absolute;
//       width: 100%;
//       height: 100%;
//       z-index: 5;
//     `;
//     container.appendChild(svg);

//     // Create lines between all circles
//     this.circles.forEach((circle1, i) => {
//       this.circles.slice(i + 1).forEach((circle2, j) => {
//         const line = document.createElementNS(
//           'http://www.w3.org/2000/svg',
//           'line'
//         );
//         line.classList.add(`line-${i}-${j}`);
//         line.style.cssText = `
//           stroke: rgba(255, 255, 255, 0.2);
//           stroke-width: 10;
//         `;
//         svg.appendChild(line);
//       });
//     });

//     // Create circles
//     this.circles.forEach((circle, index) => {
//       const div = document.createElement('div');
//       div.classList.add('circle', `circle${index}`);
//       div.style.cssText = `
//         width: 100px;
//         height: 100px;
//         background-image: url(${circle.profilePic});
//         background-size: cover;
//         position: absolute;
//         border-radius: 50%;
//         border: transparent;
//         z-index: ${10 + index};
//         transform: translate(-50%, -50%);
//       `;

//       // Add click event listener
//       div.addEventListener('click', () => this.onCircleClick(circle, index));

//       container.appendChild(div);
//     });
//   }

//   private onCircleClick(circle: Circle, index: number) {
//     const element = document.querySelector(`.circle${index}`) as HTMLElement;

//     if (circle.selected) {
//       // Shrink back to normal size and resume animations
//       circle.selected = false;

//       if (element) {
//         element.style.width = '100px';
//         element.style.height = '100px';
//       }
//     } else {
//       // Center the circle on the screen and stop animations
//       circle.targetX = window.innerWidth / 2;
//       circle.targetY = window.innerHeight / 2;
//       circle.selected = true;

//       // Immediately update the circle's position
//       circle.x = circle.targetX;
//       circle.y = circle.targetY;

//       if (element) {
//         element.style.width = '200px';
//         element.style.height = '200px';
//       }
//     }

//     // Update the circle's position
//     if (element) {
//       element.style.transform = `translate(${Math.round(
//         circle.x
//       )}px, ${Math.round(circle.y)}px) translate(-50%, -50%)`;
//     }
//   }



// //HELPER functions
// private getRandomPosition() {
//   const centerX = window.innerWidth / 2;
//   const centerY = window.innerHeight / 2;
//   const radius = 500;
//   const angle = Math.random() * 2 * Math.PI;

//   return {
//     x: centerX + radius * Math.cos(angle),
//     y: centerY + radius * Math.sin(angle),
//   };
// }
