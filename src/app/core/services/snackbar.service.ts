import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3500, panelClass: ['snackbar-success'] });
  }

  error(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 4500, panelClass: ['snackbar-error'] });
  }
}
