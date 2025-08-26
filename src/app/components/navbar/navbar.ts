import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Api } from '../../core/service/api';
import { User } from '../../core/service/user';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private router = inject(Router);
  private apiService = inject(Api); 
  private userService = inject(User);

  logout(): void{
    this.userService.logout()
  }

  isCricketActive(): boolean {
    return ['/cricket', '/c-event', '/c-market'].includes(this.router.url);
  }

  isSoccerActive(): boolean {
    return ['/soccer', '/s-event', '/s-market'].includes(this.router.url);
  }

  isTennisActive(): boolean {
    return ['/tennis', '/t-event', '/t-market'].includes(this.router.url);
  }

  isListCricketActive(): boolean {
    return ['/cricket-events'].includes(this.router.url);
  }

  isListSoccerActive(): boolean {
    return ['/soccer-events'].includes(this.router.url);
  }

  isListTennisActive(): boolean {
    return ['/tennis-events'].includes(this.router.url);
  }
}
