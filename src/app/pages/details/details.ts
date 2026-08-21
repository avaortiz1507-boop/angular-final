import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { InventoryItem } from '../../models/inventory';
import { AuthService } from '../../services/auth.service';
import { ObjectsService } from '../../services/objects.service';

@Component({
  selector: 'app-object-details-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="space-y-6">
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-sm font-medium uppercase tracking-[0.2em] text-pink-700">Details</p>
          <h1 class="mt-1 text-3xl font-bold text-slate-900">{{ item()?.name || 'Inventory item' }}</h1>
        </div>
        <div class="flex gap-2">
          @if (auth.isAdmin()) {
            <a [routerLink]="['/objects', itemId(), 'edit']" class="rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-700 hover:bg-yellow-100">
              Edit
            </a>
          }
          <a routerLink="/objects" class="rounded-xl border border-pink-200 bg-white px-3 py-2 text-sm font-semibold text-pink-700 hover:bg-pink-50">
            Back to list
          </a>
        </div>
      </div>

      <div *ngIf="loading()" class="rounded-2xl border border-blue-200 bg-blue-50/80 p-8 text-slate-600">
        Loading item details…
      </div>

      <div *ngIf="errorMessage()" class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {{ errorMessage() }}
      </div>

      <article *ngIf="item() as currentItem" class="rounded-2xl border border-pink-200 bg-white/90 p-6 shadow-sm shadow-pink-100/40">
        <dl class="grid gap-5 md:grid-cols-2">
          <div>
            <dt class="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">ID</dt>
            <dd class="mt-2 text-base font-medium text-slate-900">{{ currentItem.id }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Name</dt>
            <dd class="mt-2 text-base font-medium text-slate-900">{{ currentItem.name }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Color</dt>
            <dd class="mt-2 text-base text-slate-700">{{ currentItem.data?.color || 'Not specified' }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Price</dt>
            <dd class="mt-2 text-base text-slate-700">{{ formatPrice(currentItem.data?.price) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Year</dt>
            <dd class="mt-2 text-base text-slate-700">{{ currentItem.data?.year || 'Not specified' }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Category</dt>
            <dd class="mt-2 text-base text-slate-700">{{ currentItem.data?.category || 'General' }}</dd>
          </div>
        </dl>

        <div class="mt-8 rounded-xl bg-slate-50 p-4">
          <h2 class="text-lg font-semibold text-slate-900">Raw data</h2>
          <pre class="mt-3 overflow-x-auto text-sm text-slate-700">{{ formatJson(currentItem.data) }}</pre>
        </div>
      </article>
    </section>
  `,
})
export class ObjectDetailsPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly objectsService = inject(ObjectsService);
  readonly auth = inject(AuthService);

  itemId = signal('');
  item = signal<InventoryItem | null>(null);
  loading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage.set('Missing inventory item identifier.');
      return;
    }

    this.itemId.set(id);
    this.loadItem(id);
  }

  loadItem(id: string): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.objectsService.getById(id).subscribe({
      next: (item: InventoryItem) => {
        this.item.set(item);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.errorMessage.set(this.objectsService.getErrorMessage(error));
        this.loading.set(false);
      },
    });
  }

  formatPrice(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return '$0.00';
    }

    return `$${Number(value).toFixed(2)}`;
  }

  formatJson(data: unknown): string {
    return JSON.stringify(data ?? { message: 'No additional data provided' }, null, 2);
  }
}
