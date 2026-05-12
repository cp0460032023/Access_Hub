import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subs: Subscription[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.subs.push(
      this.toastService.toastAdded.subscribe(toast => {
        this.toasts = [...this.toasts, toast];
      }),
      this.toastService.toastRemoved.subscribe(id => {
        this.toasts = this.toasts.filter(t => t.id !== id);
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  remove(id: number) {
    this.toastService.remove(id);
  }
}