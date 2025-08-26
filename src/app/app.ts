import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Footer,Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Api-Panel-Frontend';
  private router = inject(Router);
  private currentUrl = signal('');

  showNavFooter = computed(() => !this.currentUrl().includes('/login'));

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl.set(event.urlAfterRedirects);
    });
  }
}
