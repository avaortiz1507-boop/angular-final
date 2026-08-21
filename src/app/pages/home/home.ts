import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { InventoryItem } from '../../models/inventory';
import { AuthService } from '../../services/auth.service';
import { ObjectsService } from '../../services/objects.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="space-y-6">
      <div class="rounded-3xl bg-gradient-to-r from-pink-200 via-blue-100 to-yellow-100 p-8 text-slate-800 shadow-xl shadow-pink-200/60">
        <p class="text-sm font-medium uppercase tracking-[0.2em] text-pink-700">Inventory Manager</p>
        <h1 class="mt-3 text-3xl font-bold md:text-5xl">Track every item in your catalog</h1>
        <p class="mt-4 max-w-2xl text-slate-700">
          Monitor stock, update pricing, and keep your inventory connected to the public API.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <a routerLink="/objects" class="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-pink-700 transition hover:bg-pink-50">
            View catalog
          </a>
          @if (auth.isAdmin()) {
            <a routerLink="/objects/new" class="rounded-full border border-white/80 bg-emerald-100 px-5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-200">
              Add New Object
            </a>
          }
        </div>
      </div>

      @if (auth.isAdmin()) {
        <section class="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-6 shadow-sm shadow-indigo-100/40">
          <p class="text-sm font-medium uppercase tracking-[0.2em] text-indigo-700">Admin dashboard</p>
          <h2 class="mt-1 text-2xl font-bold text-slate-900">Admin controls</h2>
          <p class="mt-3 text-slate-600">You have administrator access to manage inventory and users.</p>
        </section>
      } @else {
        <section class="rounded-2xl border border-blue-200 bg-blue-50/60 p-6 shadow-sm shadow-blue-100/40">
          <p class="text-sm font-medium uppercase tracking-[0.2em] text-blue-700">User dashboard</p>
          <h2 class="mt-1 text-2xl font-bold text-slate-900">Welcome back</h2>
          <p class="mt-3 text-slate-600">Browse inventory items and review the latest catalog updates.</p>
        </section>
      }

      <section class="rounded-2xl border border-pink-200 bg-white/90 p-6 shadow-sm shadow-pink-100/40">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm font-medium uppercase tracking-[0.2em] text-pink-700">Quick overview</p>
            <h2 class="mt-1 text-2xl font-bold text-slate-900">Recent items</h2>
          </div>
          <a routerLink="/objects" class="text-sm font-semibold text-blue-700 hover:text-blue-600">See all</a>
        </div>

        <div *ngIf="loading()" class="mt-6 flex items-center gap-3 text-slate-600">
          <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-pink-200 border-t-pink-500"></span>
          Loading inventory…
        </div>

        <div *ngIf="errorMessage()" class="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {{ errorMessage() }}
        </div>

        <ul *ngIf="!loading() && recentItems().length" class="mt-6 space-y-3">
          <li *ngFor="let item of recentItems()" class="flex items-center justify-between rounded-xl border border-pink-100 bg-pink-50/60 px-4 py-3">
            <div>
              <p class="font-semibold text-slate-900">{{ item.name }}</p>
              <p class="text-sm text-slate-500">{{ item.data?.color || 'No color listed' }}</p>
            </div>
            <a [routerLink]="['/objects', item.id]" class="text-sm font-semibold text-blue-700 hover:text-blue-600">View</a>
          </li>
        </ul>
      </section>
    </section>
  `,
})
export class HomePageComponent implements OnInit {
  private readonly objectsService = inject(ObjectsService);
  readonly auth = inject(AuthService);

  loading = signal(false);
  errorMessage = signal('');
  items = signal<InventoryItem[]>([]);

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
