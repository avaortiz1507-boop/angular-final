import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  standalone: true,
  template: `
    <section class="mx-auto max-w-xl rounded-2xl border border-pink-200 bg-white/90 p-8 shadow-sm shadow-pink-100/40">
      <p class="text-sm font-medium uppercase tracking-[0.2em] text-pink-700">Account</p>
      <h1 class="mt-2 text-3xl font-bold text-slate-900">Register</h1>
      <p class="mt-3 text-slate-600">Use your inventory manager account to review stock and maintain updates.</p>

      <form class="mt-6 space-y-5" (ngSubmit)="register()">
        <div>
          <label for="email" class="mb-2 block text-sm font-semibold text-slate-700">Email</label>
          <input id="email" type="email" [(ngModel)]="email" name="email" class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" placeholder="admin@inventory.app" />
        </div>
        <div>
          <label for="password" class="mb-2 block text-sm font-semibold text-slate-700">Password</label>
          <input id="password" type="password" [(ngModel)]="password" name="password" class="w-full rounded-xl border border-yellow-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100" placeholder="••••••••" />
        </div>

        <div *ngIf="errorMessage()" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {{ errorMessage() }}
        </div>

        <button type="submit" class="w-full rounded-xl bg-gradient-to-r from-pink-400 to-blue-400 px-4 py-3 text-sm font-semibold text-white hover:from-pink-500 hover:to-blue-500">
          Register
        </button>
      </form>
    </section>
  `,
  imports: [CommonModule, FormsModule],
})
export class RegisterPageComponent {
  private readonly router = inject(Router);
  email = '';
  password = '';
  errorMessage = signal('');

  register(): void {
    if (!this.email || !this.password) {
      this.errorMessage.set('Email and password are required.');
      return;
    }

    this.errorMessage.set('');
    this.router.navigate(['/']);
  }
}
