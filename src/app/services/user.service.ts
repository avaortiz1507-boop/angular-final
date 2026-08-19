import { Injectable } from '@angular/core';
import * as bcrypt from 'bcryptjs';

export interface User {
  username: string;
  passwordHash: string;
  role: 'user' | 'admin';
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly users: User[] = [];
  private readonly saltRounds = 10;

  constructor() {
    void this.addUser('admin@inventory.app', 'admin123', 'admin');
  }

  async addUser(username: string, password: string, role: User['role'] = 'user') {
    if (!username.trim()) {
      return { success: false, message: 'Username cannot be empty' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    if (this.users.some((u) => u.username === username)) {
      return { success: false, message: 'Username already exists' };
    }

    const passwordHash = await bcrypt.hash(password, this.saltRounds);
    this.users.push({ username, passwordHash, role });

    return { success: true };
  }

  async authenticate(username: string, password: string): Promise<User | null> {
    const user = this.users.find((u) => u.username === username);
    if (!user) return null;

    const match = await bcrypt.compare(password, user.passwordHash);
    return match ? { ...user } : null;
  }

  getUsers(): User[] {
    return this.users.map((u) => ({ ...u }));
  }
}
