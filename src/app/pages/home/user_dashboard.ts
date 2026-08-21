import { Component } from '@angular/core';

@Component({
  selector: 'user-dashboard',
  standalone: true,
  template: `
    <section class="rounded-2xl border border-blue-200 bg-blue-50/60 p-6 shadow-sm shadow-blue-100/40">
      <p class="text-sm font-medium uppercase tracking-[0.2em] text-blue-700">User dashboard</p>
      <h2 class="mt-1 text-2xl font-bold text-slate-900">Welcome back</h2>
      <p class="mt-3 text-slate-600">Browse inventory items and review the latest catalog updates.</p>
    </section>
  `,
})
export class UserDashboardComponent {}
