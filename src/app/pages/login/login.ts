import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  template: `
    <section class="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <p class="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Account</p>
      <h1 class="mt-2 text-3xl font-bold text-slate-900">Login</h1>
      <p class="mt-3 text-slate-600">Use your inventory manager account to review stock and maintain updates.</p>

      <form class="mt-6 space-y-5" (ngSubmit)="login()">
        <div>
          <label for="email" class="mb-2 block text-sm font-semibold text-slate-700">Email</label>
          <input id="email" type="email" [(ngModel)]="email" name="email" class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="admin@inventory.app" />
        </div>
        <div>
          <label for="password" class="mb-2 block text-sm font-semibold text-slate-700">Password</label>
          <input id="password" type="password" [(ngModel)]="password" name="password" class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="••••••••" />
        </div>

        <div *ngIf="errorMessage()" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {{ errorMessage() }}
        </div>

        <button type="submit" class="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">
          Sign in
        </button>
      </form>
    </section>
  `,
  imports: [CommonModule, FormsModule],
})
export class LoginPageComponent {
  private readonly router = inject(Router);
  email = 'admin@inventory.app';
  password = 'inventory123';
  errorMessage = signal('');

  login(): void {
    if (!this.email || !this.password) {
      this.errorMessage.set('Email and password are required.');
      return;
    }

    this.errorMessage.set('');
    this.router.navigate(['/']);
  }
}
