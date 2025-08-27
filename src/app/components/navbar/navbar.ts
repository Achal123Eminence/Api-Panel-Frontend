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

  isBetfairCompetitionActive(): boolean {
    return ['/home'].includes(this.router.url);
  }

  isBetfairCricketActive(): boolean {
    return ['/betfair-cricket'].includes(this.router.url);
  }

  isBetfairSoccerActive(): boolean {
    return ['/betfair-soccer'].includes(this.router.url);
  }

  isBetfairTennisActive(): boolean {
    return ['/betfair-tennis'].includes(this.router.url);
  }

  isBetfairAllActive(): boolean {
    return ['/betfair-tennis','/betfair-cricket','/betfair-soccer'].includes(this.router.url);
  }

  // isListSoccerActive(): boolean {
  //   return ['/soccer-events'].includes(this.router.url);
  // }

  // isListTennisActive(): boolean {
  //   return ['/tennis-events'].includes(this.router.url);
  // }
}
