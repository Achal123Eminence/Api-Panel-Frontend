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

  isMtypeActive(): boolean {
    return ['/mType'].includes(this.router.url);
  }

  // isBetfairCricketActive(): boolean {
  //   return ['/betfair-cricket'].includes(this.router.url);
  // }

  // isBetfairSoccerActive(): boolean {
  //   return ['/betfair-soccer'].includes(this.router.url);
  // }

  // isBetfairTennisActive(): boolean {
  //   return ['/betfair-tennis'].includes(this.router.url);
  // }

  isBetfairAllActive(): boolean {
    return ['/betfair'].includes(this.router.url);
  }

  isAddActive(): boolean {
    return ['/add-match','/add-competition'].includes(this.router.url);
  }

  isAddCompetitionActive(): boolean {
    return ['/add-competition'].includes(this.router.url);
  }

  isAddMatchActive(): boolean {
    return ['/add-match'].includes(this.router.url);
  }

  isSettingsActive(): boolean {
    return ['/default-settings','/currency','/competition-setting'].includes(this.router.url);
  }

  isDefaultSettingsActive(): boolean {
    return ['/default-settings'].includes(this.router.url);
  }

  isCurrencyActive(): boolean {
    return ['/currency'].includes(this.router.url);
  }

  // isLimitSettingsActive(): boolean {
  //   return ['/competition-setting'].includes(this.router.url);
  // }

  isCompetitionSettingsActive(): boolean {
    return ['/competition-setting'].includes(this.router.url);
  }

  isRunningMatchActive(): boolean {
    return ['/running-match/4','/running-match/1','/running-match/2',].includes(this.router.url);
  }

  isRunningCricketActive(): boolean {
    return ['/running-match/4'].includes(this.router.url);
  }

  isRunningSoccerActive(): boolean {
    return ['/running-match/1'].includes(this.router.url);
  }

  isRunningTennisActive(): boolean {
    return ['/running-match/2'].includes(this.router.url);
  }
}
