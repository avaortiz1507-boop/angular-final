import { Injectable, inject } from '@angular/core';

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

  async register(username: string, password: string): Promise<AuthResult> {
    return this.userService.addUser(username, password);
  }

  async login(username: string, password: string): Promise<boolean> {
    const user = await this.userService.authenticate(username, password);
    if (!user || typeof window === 'undefined') {
      return false;
    }

    window.localStorage.setItem(this.tokenKey, username);
    window.localStorage.setItem(this.roleKey, user.role);
    return true;
  }

  logout(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(this.tokenKey);
    window.localStorage.removeItem(this.roleKey);
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
}
