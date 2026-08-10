import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';

import { InventoryItem, InventoryPayload } from '../models/inventory';

@Injectable({
  providedIn: 'root',
})
export class ObjectsService {
  private readonly baseUrl = 'https://api.restful-api.dev/objects';
  private readonly storageKey = 'inventory-items';
  private readonly apiKey = 'e61bdf20-1bf3-476a-b866-3bf598638d39';

  constructor(private readonly http: HttpClient) {}

  private getHeaders() {
    return {
      'x-api-key': this.apiKey,
    };
  }

  getAll(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.baseUrl, { headers: this.getHeaders() }).pipe(
      map((items) => {
        this.writeStoredItems(items);
        return items;
      }),
      catchError((error: unknown) => {
        const localItems = this.readStoredItems();
        if (localItems.length) {
          return of(localItems);
        }

        return throwError(() => error);
      }),
    );
  }

  getById(id: string): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      map((item) => {
        this.upsertLocalItem(item);
        return item;
      }),
      catchError((error: unknown) => {
        const localItem = this.readStoredItems().find((item) => item.id === id);
        if (localItem) {
          return of(localItem);
        }

        return throwError(() => error);
      }),
    );
  }

  create(item: InventoryPayload): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(this.baseUrl, item, { headers: this.getHeaders() }).pipe(
      map((createdItem) => {
        this.upsertLocalItem(createdItem);
        return createdItem;
      }),
      catchError(() => {
        const fallbackItem = this.createLocalItem(item);
        this.upsertLocalItem(fallbackItem);
        return of(fallbackItem);
      }),
    );
  }

  update(id: string, item: InventoryPayload): Observable<InventoryItem> {
    return this.http.patch<InventoryItem>(`${this.baseUrl}/${id}`, item, { headers: this.getHeaders() }).pipe(
      map((updatedItem) => {
        this.upsertLocalItem(updatedItem);
        return updatedItem;
      }),
      catchError((error: unknown) => {
        if (this.shouldCreateNewObject(error)) {
          return this.createViaApi(item);
        }

        const fallbackItem = this.applyLocalUpdate(id, item);
        return of(fallbackItem);
      }),
    );
  }

  patch(id: string, partialItem: Partial<InventoryPayload>): Observable<InventoryItem> {
    return this.http.patch<InventoryItem>(`${this.baseUrl}/${id}`, partialItem, { headers: this.getHeaders() }).pipe(
      map((updatedItem) => {
        this.upsertLocalItem(updatedItem);
        return updatedItem;
      }),
      catchError((error: unknown) => {
        if (this.shouldCreateNewObject(error)) {
          return this.createViaApi(partialItem as InventoryPayload);
        }

        const fallbackItem = this.applyLocalUpdate(id, partialItem);
        return of(fallbackItem);
      }),
    );
  }

  delete(id: string): Observable<unknown> {
    return this.http.delete<unknown>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      map(() => {
        this.removeLocalItem(id);
        return { success: true };
      }),
      catchError(() => {
        this.removeLocalItem(id);
        return of({ success: true });
      }),
    );
  }

  getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'Unable to reach the inventory server. Please check your connection and try again.';
      }

      if (error.error && typeof error.error === 'object' && 'message' in error.error) {
        return String((error.error as { message: string }).message);
      }

      return `Request failed with status ${error.status}. Please try again.`;
    }

    return 'Something went wrong while contacting the inventory API.';
  }

  private createViaApi(item: InventoryPayload): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(this.baseUrl, item, { headers: this.getHeaders() }).pipe(
      map((createdItem) => {
        this.upsertLocalItem(createdItem);
        return createdItem;
      }),
      catchError(() => {
        const fallbackItem = this.createLocalItem(item);
        this.upsertLocalItem(fallbackItem);
        return of(fallbackItem);
      }),
    );
  }

  private shouldCreateNewObject(error: unknown): boolean {
    if (!(error instanceof HttpErrorResponse)) {
      return false;
    }

    if (error.status !== 405) {
      return false;
    }

    const responseText = typeof error.error === 'string' ? error.error : JSON.stringify(error.error ?? {});
    return /reserved id|cannot be overridden/i.test(responseText);
  }

  private readStoredItems(): InventoryItem[] {
    if (typeof window === 'undefined') {
      return [];
    }

    const rawValue = window.localStorage.getItem(this.storageKey);
    if (!rawValue) {
      return [];
    }

    try {
      return JSON.parse(rawValue) as InventoryItem[];
    } catch {
      return [];
    }
  }

  private writeStoredItems(items: InventoryItem[]): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private upsertLocalItem(item: InventoryItem): void {
    const items = this.readStoredItems();
    const existingIndex = items.findIndex((storedItem) => storedItem.id === item.id);

    if (existingIndex >= 0) {
      items[existingIndex] = item;
    } else {
      items.unshift(item);
    }

    this.writeStoredItems(items);
  }

  private createLocalItem(item: InventoryPayload): InventoryItem {
    return {
      id: `local-${Date.now()}`,
      name: item.name,
      data: item.data ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private applyLocalUpdate(id: string, payload: InventoryPayload | Partial<InventoryPayload>): InventoryItem {
    const items = this.readStoredItems();
    const existingItem = items.find((item) => item.id === id);
    const nextItem: InventoryItem = {
      id,
      name: payload.name ?? existingItem?.name ?? 'Updated item',
      data: {
        ...(existingItem?.data ?? {}),
        ...(payload.data ?? {}),
      },
      createdAt: existingItem?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedItems = existingItem
      ? items.map((item) => (item.id === id ? nextItem : item))
      : [nextItem, ...items];

    this.writeStoredItems(updatedItems);
    return nextItem;
  }

  private removeLocalItem(id: string): void {
    const items = this.readStoredItems().filter((item) => item.id !== id);
    this.writeStoredItems(items);
  }
}
