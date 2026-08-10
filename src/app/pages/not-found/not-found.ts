import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <p class="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">404</p>
      <h1 class="mt-3 text-4xl font-bold text-slate-900">Page not found</h1>
      <p class="mt-3 text-slate-600">The page you requested does not exist in the inventory manager.</p>
      <a routerLink="/" class="mt-6 inline-flex rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500">
        Return home
      </a>
    </section>
  `,
})
export class NotFoundPageComponent {}
