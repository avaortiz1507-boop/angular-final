import { Component } from '@angular/core';

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  template: `
    <section class="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-6 shadow-sm shadow-indigo-100/40">
      <p class="text-sm font-medium uppercase tracking-[0.2em] text-indigo-700">Admin dashboard</p>
      <h2 class="mt-1 text-2xl font-bold text-slate-900">Admin controls</h2>
      <p class="mt-3 text-slate-600">You have administrator access to manage inventory and users.</p>
    </section>
  `,
})
export class AdminDashboardComponent {}
