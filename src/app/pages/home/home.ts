import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { InventoryItem } from '../../models/inventory';
import { ObjectsService } from '../../services/objects.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="space-y-6">
      <div class="rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 p-8 text-white shadow-xl">
        <p class="text-sm font-medium uppercase tracking-[0.2em] text-indigo-100">Inventory Manager</p>
        <h1 class="mt-3 text-3xl font-bold md:text-5xl">Track every item in your catalog</h1>
        <p class="mt-4 max-w-2xl text-indigo-50">
          Monitor stock, update pricing, and keep your inventory connected to the public API.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <a routerLink="/objects" class="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50">
            View catalog
          </a>
          <a routerLink="/objects/new" class="rounded-full border border-white/70 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
            Add item
          </a>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Loaded inventory</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">{{ totalItems() }}</p>
        </article>
        <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Average price</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">{{ averagePrice() }}</p>
        </article>
        <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Latest update</p>
          <p class="mt-3 text-lg font-semibold text-slate-900">{{ latestLabel() }}</p>
        </article>
      </div>

      <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Quick overview</p>
            <h2 class="mt-1 text-2xl font-bold text-slate-900">Recent items</h2>
          </div>
          <a routerLink="/objects" class="text-sm font-semibold text-indigo-600 hover:text-indigo-500">See all</a>
        </div>

        <div *ngIf="loading()" class="mt-6 flex items-center gap-3 text-slate-500">
          <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600"></span>
          Loading inventory…
        </div>

        <div *ngIf="errorMessage()" class="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {{ errorMessage() }}
        </div>

        <ul *ngIf="!loading() && recentItems().length" class="mt-6 space-y-3">
          <li *ngFor="let item of recentItems()" class="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
            <div>
              <p class="font-semibold text-slate-900">{{ item.name }}</p>
              <p class="text-sm text-slate-500">{{ item.data?.color || 'No color listed' }}</p>
            </div>
            <a [routerLink]="['/objects', item.id]" class="text-sm font-semibold text-indigo-600 hover:text-indigo-500">View</a>
          </li>
        </ul>
      </section>
    </section>
  `,
})
export class HomePageComponent implements OnInit {
  private readonly objectsService = inject(ObjectsService);

  loading = signal(false);
  errorMessage = signal('');
  items = signal<InventoryItem[]>([]);

  totalItems = computed(() => this.items().length);

  averagePrice = computed(() => {
    const validPrices = this.items()
      .map((item) => Number(item.data?.price ?? 0))
      .filter((value) => Number.isFinite(value) && value > 0);

    if (!validPrices.length) {
      return '$0.00';
    }

    const average = validPrices.reduce((total, value) => total + value, 0) / validPrices.length;
    return `$${average.toFixed(2)}`;
  });

  latestLabel = computed(() => {
    const latest = this.items().at(-1);
    return latest ? latest.name : 'No items yet';
  });

  recentItems = computed(() => this.items().slice(0, 4));

  ngOnInit(): void {
    this.loading.set(true);
    this.objectsService.getAll().subscribe({
      next: (items: InventoryItem[]) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.errorMessage.set(this.objectsService.getErrorMessage(error));
        this.loading.set(false);
      },
    });
  }
}
