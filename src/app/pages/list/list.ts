import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { InventoryItem } from '../../models/inventory';
import { ObjectsService } from '../../services/objects.service';

@Component({
  selector: 'app-objects-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="space-y-6">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Catalog</p>
          <h1 class="mt-1 text-3xl font-bold text-slate-900">Inventory list</h1>
        </div>
        <a routerLink="/objects/new" class="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500">
          Add object
        </a>
      </div>

      <div *ngIf="loading()" class="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
        Loading inventory…
      </div>

      <div *ngIf="errorMessage()" class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {{ errorMessage() }}
      </div>

      <div *ngIf="!loading() && !items().length" class="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        No inventory items available yet.
      </div>

      <div *ngIf="items().length" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200 text-left">
            <thead class="bg-slate-50 text-sm font-semibold uppercase tracking-wide text-slate-600">
              <tr>
                <th class="px-4 py-3">Name</th>
                <th class="px-4 py-3">Color</th>
                <th class="px-4 py-3">Price</th>
                <th class="px-4 py-3">Category</th>
                <th class="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 text-sm text-slate-700">
              <tr *ngFor="let item of items()">
                <td class="px-4 py-3 font-semibold text-slate-900">{{ item.name }}</td>
                <td class="px-4 py-3">{{ item.data?.color || '—' }}</td>
                <td class="px-4 py-3">{{ formatPrice(item.data?.price) }}</td>
                <td class="px-4 py-3">{{ item.data?.category || 'General' }}</td>
                <td class="px-4 py-3">
                  <div class="flex justify-end gap-2">
                    <a [routerLink]="['/objects', item.id]" class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50">
                      View
                    </a>
                    <a [routerLink]="['/objects', item.id, 'edit']" class="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100">
                      Edit
                    </a>
                    <button type="button" (click)="deleteItem(item.id)" class="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `,
})
export class ObjectsListPageComponent implements OnInit {
  private readonly objectsService = inject(ObjectsService);

  loading = signal(false);
  errorMessage = signal('');
  items = signal<InventoryItem[]>([]);

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading.set(true);
    this.errorMessage.set('');

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

  formatPrice(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return '$0.00';
    }

    return `$${Number(value).toFixed(2)}`;
  }

  deleteItem(id: string): void {
    if (!confirm('Delete this item? This action cannot be undone.')) {
      return;
    }

    this.objectsService.delete(id).subscribe({
      next: () => {
        this.items.update((current) => current.filter((item) => item.id !== id));
      },
      error: (error: unknown) => {
        this.errorMessage.set(this.objectsService.getErrorMessage(error));
      },
    });
  }
}
