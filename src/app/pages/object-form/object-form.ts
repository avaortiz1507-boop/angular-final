import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { InventoryItem, InventoryPayload } from '../../models/inventory';
import { ObjectsService } from '../../services/objects.service';

@Component({
  selector: 'app-object-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="mx-auto max-w-3xl space-y-6">
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{{ isEditing() ? 'Update' : 'Create' }}</p>
          <h1 class="mt-1 text-3xl font-bold text-slate-900">{{ isEditing() ? 'Edit inventory item' : 'Create new item' }}</h1>
        </div>
        <a routerLink="/objects" class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          Back to list
        </a>
      </div>

      <div *ngIf="loading()" class="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
        Saving item…
      </div>

      <div *ngIf="errorMessage()" class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {{ errorMessage() }}
      </div>

      <form *ngIf="!loading()" [formGroup]="form" (ngSubmit)="submitForm()" class="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label for="name" class="mb-2 block text-sm font-semibold text-slate-700">Name</label>
          <input
            id="name"
            type="text"
            formControlName="name"
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="e.g. Smart Speaker"
          />
          <div *ngIf="nameControl.invalid && (nameControl.dirty || nameControl.touched)" class="mt-2 text-sm text-red-600">
            <span *ngIf="nameControl.errors?.['required']">Name is required.</span>
            <span *ngIf="nameControl.errors?.['minlength']">Name must contain at least 3 characters.</span>
          </div>
        </div>

        <div class="grid gap-5 md:grid-cols-2">
          <div>
            <label for="color" class="mb-2 block text-sm font-semibold text-slate-700">Color</label>
            <input id="color" type="text" formControlName="color" class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="Blue" />
            <div *ngIf="colorControl.invalid && (colorControl.dirty || colorControl.touched)" class="mt-2 text-sm text-red-600">
              <span *ngIf="colorControl.errors?.['required']">Color is required.</span>
              <span *ngIf="colorControl.errors?.['minlength']">Color should be at least 2 characters.</span>
            </div>
          </div>

          <div>
            <label for="price" class="mb-2 block text-sm font-semibold text-slate-700">Price</label>
            <input id="price" type="number" min="0" formControlName="price" class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="299.99" />
            <div *ngIf="priceControl.invalid && (priceControl.dirty || priceControl.touched)" class="mt-2 text-sm text-red-600">
              <span *ngIf="priceControl.errors?.['required']">Price is required.</span>
              <span *ngIf="priceControl.errors?.['min']">Price cannot be negative.</span>
            </div>
          </div>
        </div>

        <div class="grid gap-5 md:grid-cols-2">
          <div>
            <label for="category" class="mb-2 block text-sm font-semibold text-slate-700">Category</label>
            <input id="category" type="text" formControlName="category" class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="Electronics" />
          </div>

          <div>
            <label for="year" class="mb-2 block text-sm font-semibold text-slate-700">Year</label>
            <input id="year" type="number" min="1900" formControlName="year" class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="2024" />
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-end gap-3">
          <button type="button" routerLink="/objects" class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" [disabled]="form.invalid || loading()" class="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300">
            {{ isEditing() ? 'Save changes' : 'Create item' }}
          </button>
        </div>
      </form>
    </section>
  `,
})
export class ObjectFormPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly objectsService = inject(ObjectsService);

  isEditing = signal(false);
  loading = signal(false);
  errorMessage = signal('');

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    color: ['', [Validators.required, Validators.minLength(2)]],
    price: [0, [Validators.required, Validators.min(0)]],
    category: ['General'],
    year: [new Date().getFullYear(), [Validators.min(1900)]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.isEditing.set(true);
    this.loading.set(true);

    this.objectsService.getById(id).subscribe({
      next: (item) => {
        this.form.patchValue({
          name: item.name,
          color: item.data?.color || '',
          price: Number(item.data?.price ?? 0),
          category: item.data?.category || 'General',
          year: Number(item.data?.year ?? new Date().getFullYear()),
        });
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(this.objectsService.getErrorMessage(error));
        this.loading.set(false);
      },
    });
  }

  get nameControl() {
    return this.form.get('name')!;
  }

  get colorControl() {
    return this.form.get('color')!;
  }

  get priceControl() {
    return this.form.get('price')!;
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    const payload: InventoryPayload = {
      name: this.form.value.name.trim(),
      data: {
        color: this.form.value.color.trim(),
        price: Number(this.form.value.price),
        category: this.form.value.category?.trim() || 'General',
        year: Number(this.form.value.year),
      },
    };

    this.loading.set(true);
    this.errorMessage.set('');

    const request = id
      ? this.objectsService.update(id, payload)
      : this.objectsService.create(payload);

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/objects']);
      },
      error: (error) => {
        this.errorMessage.set(this.objectsService.getErrorMessage(error));
        this.loading.set(false);
      },
    });
  }
}
