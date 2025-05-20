import { Component, EventEmitter, OnInit, Input } from '@angular/core';
import { ServerMember } from '../Models/server.model';
import { Circle } from '../Classes/circle';

@Component({
  selector: 'app-info-slide',
  templateUrl: './info-slide.component.html',
  styleUrls: ['./info-slide.component.scss']
})
export class InfoSlideComponent implements OnInit {
  @Input() infoSliderEmitter!: EventEmitter<Circle>;
  isPanelClosed = true;
  currentUser: ServerMember | null = null;
  activeTab = 'profile'; // Default active tab

  constructor() { }

  ngOnInit() {
    this.infoSliderEmitter.subscribe((circle) => {
      if (circle) {
        this.currentUser = circle.getUserData();
        this.isPanelClosed = !circle.selected;
        console.log('Server member data:', this.currentUser);
      }
    });
  }

  // Calculate time since last online
  getTimeSince(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  }

  // Helper to format date strings in a user-friendly format
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Switch between tabs for different views
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Get the top 3 users this member interacts with
  getTopInteractions(): any[] {
    if (!this.currentUser || !this.currentUser.userData) return [];
    
    // Sort by interaction time in descending order and get top 3
    return [...this.currentUser.userData]
      .sort((a, b) => b.interactionTime - a.interactionTime)
      .slice(0, 3);
  }

  // Get overall activity score based on various metrics
  getActivityScore(): number {
    if (!this.currentUser) return 0;
    
    // Calculate score from various metrics
    let score = 0;
    
    // Consider channel data
    if (this.currentUser.channelData && this.currentUser.channelData.length) {
      // Add points for each active channel
      score += this.currentUser.channelData.length * 5;
      
      // Add points for voice activity
      this.currentUser.channelData.forEach(channel => {
        if (channel.voiceActivity && channel.voiceActivity.totalTime) {
          // Parse hours from totalTime (assuming format like "450h")
          const hoursMatch = channel.voiceActivity.totalTime.match(/(\d+)h/);
          if (hoursMatch && hoursMatch[1]) {
            const hours = parseInt(hoursMatch[1]);
            score += Math.min(hours / 10, 20); // Cap at 20 points
          }
        }
      });
    }
    
    // Consider user interactions
    if (this.currentUser.userData && this.currentUser.userData.length) {
      score += Math.min(this.currentUser.userData.length * 3, 15);
      
      // Add points for recent interactions
      const recentInteractions = this.currentUser.userData.filter(user => {
        const lastSeen = new Date(user.lastSeenTogether);
        const now = new Date();
        const diffDays = (now.getTime() - lastSeen.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays < 7; // Less than a week ago
      });
      
      score += recentInteractions.length * 2;
    }
    
    // Consider roles
    if (this.currentUser.roles) {
      score += this.currentUser.roles.length * 2;
    }
    
    // Cap at 100
    return Math.min(Math.round(score), 100);
  }
}
