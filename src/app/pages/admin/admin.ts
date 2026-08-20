import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  template: `
    <section class="mx-auto max-w-2xl rounded-2xl border border-blue-200 bg-white/90 p-8 shadow-sm shadow-blue-100/40">
      <p class="text-sm font-medium uppercase tracking-[0.2em] text-blue-700">Admin</p>
      <h1 class="mt-2 text-3xl font-bold text-slate-900">Admin dashboard</h1>
      <p class="mt-3 text-slate-600">
        This area is restricted to administrators.
      </p>
    </section>
  `,
})
export class AdminPageComponent {}
