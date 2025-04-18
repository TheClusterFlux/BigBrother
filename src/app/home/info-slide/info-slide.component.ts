import { Component, EventEmitter, OnInit, Input } from '@angular/core';
import { User } from '../Models/user.model';
import { Circle } from '../Classes/circle';

@Component({
  selector: 'app-info-slide',
  templateUrl: './info-slide.component.html',
  styleUrls: ['./info-slide.component.scss']
})
export class InfoSlideComponent implements OnInit {
  @Input() infoSliderEmitter!: EventEmitter<Circle>;
  isPanelClosed = true;
  currentUser: User | null = null;

  constructor() { }

  ngOnInit() {
    this.infoSliderEmitter.subscribe((circle) => {
      if (circle) {
        this.currentUser = circle.getUserData();
        this.isPanelClosed = !circle.selected;
        console.log('User data:', this.currentUser);
      }
    });
  }
}
