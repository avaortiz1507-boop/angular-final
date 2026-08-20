import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="mx-auto max-w-xl rounded-2xl border border-amber-200 bg-white/90 p-8 text-center shadow-sm shadow-amber-100/40">
      <p class="text-sm font-medium uppercase tracking-[0.2em] text-amber-700">403</p>
      <h1 class="mt-3 text-4xl font-bold text-slate-900">Access forbidden</h1>
      <p class="mt-3 text-slate-600">You do not have permission to view this page.</p>
      <a routerLink="/dashboard" class="mt-6 inline-flex rounded-xl bg-gradient-to-r from-amber-400 to-blue-400 px-4 py-2.5 text-sm font-semibold text-white hover:from-amber-500 hover:to-blue-500">
        Go to dashboard
      </a>
    </section>
  `,
})
export class ForbiddenPageComponent {}
