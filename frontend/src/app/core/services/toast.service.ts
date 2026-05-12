import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  toastAdded = new Subject<Toast>();
  toastRemoved = new Subject<number>();

  success(message: string) { this.add(message, 'success'); }
  error(message: string) { this.add(message, 'error'); }
  info(message: string) { this.add(message, 'info'); }

  private add(message: string, type: 'success' | 'error' | 'info') {
    const id = ++this.counter;
    this.toastAdded.next({ id, message, type });
    setTimeout(() => this.toastRemoved.next(id), 3500);
  }

  remove(id: number) {
    this.toastRemoved.next(id);
  }
}