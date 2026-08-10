import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

import { InventoryItem, InventoryPayload } from '../models/inventory';

@Injectable({
  providedIn: 'root',
})
export class ObjectsService {
  private readonly baseUrl = 'https://api.restful-api.dev/objects';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.baseUrl).pipe(catchError(this.handleError));
  }

  getById(id: string): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  create(item: InventoryPayload): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(this.baseUrl, item).pipe(catchError(this.handleError));
  }

  update(id: string, item: InventoryPayload): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(`${this.baseUrl}/${id}`, item).pipe(catchError(this.handleError));
  }

  patch(id: string, partialItem: Partial<InventoryPayload>): Observable<InventoryItem> {
    return this.http.patch<InventoryItem>(`${this.baseUrl}/${id}`, partialItem).pipe(catchError(this.handleError));
  }

  delete(id: string): Observable<unknown> {
    return this.http.delete<unknown>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
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

  private handleError = (error: unknown) => {
    return throwError(() => error);
  };
}
