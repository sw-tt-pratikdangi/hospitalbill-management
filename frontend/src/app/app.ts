import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  isLoggedIn = false;
  userName = '';
  currentYear = new Date().getFullYear();
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.refreshAuthState(); // check once on initial load
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.refreshAuthState()); // re-check after every navigation
  }

  private refreshAuthState(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    const stored = localStorage.getItem('user');
    this.userName = stored ? JSON.parse(stored).name : '';
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}