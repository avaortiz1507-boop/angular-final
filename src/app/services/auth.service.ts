import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from './user.service';

export interface AuthResult {
  success: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly userService = inject(UserService);
  private readonly tokenKey = 'auth_token';
  private readonly roleKey = 'auth_role';

  constructor(private router: Router) {}

  async register(username: string, password: string): Promise<AuthResult> {
    return this.userService.addUser(username, password);
  }

  async login(username: string, password: string): Promise<boolean> {
    const user = await this.userService.authenticate(username, password);
    if (!user || typeof window === 'undefined') {
      return false;
    }

    const token = JSON.stringify({
      id: user.username,
      email: user.username,
      role: user.role,
      exp: Date.now() + 3600000,
    });

    window.localStorage.setItem(this.tokenKey, token);
    window.localStorage.setItem(this.roleKey, user.role);
    return true;
  }

  logout(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(this.tokenKey);
    window.localStorage.removeItem(this.roleKey);
    void this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  getRole(): 'user' | 'admin' | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const role = window.localStorage.getItem(this.roleKey);
    return role === 'user' || role === 'admin' ? role : null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  isUser(): boolean {
    return this.getRole() === 'user';
  }
}
