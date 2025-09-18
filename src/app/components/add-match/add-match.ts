import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Api } from '../../core/service/api';

@Component({
  selector: 'app-add-match',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-match.html',
  styleUrl: './add-match.css',
})
export class AddMatch implements OnInit {
  private apiService = inject(Api);
  matchForm!: FormGroup;
  sports = [
    { id: '4', name: 'Cricket' },
    { id: '2', name: 'Tennis' },
    { id: '1', name: 'Soccer' },
  ];
  compGrade = [
    { id: 'A', name: 'A' },
    { id: 'B', name: 'B' },
    { id: 'C', name: 'C' },
  ];
  competitionId: any = 12345;
  eventTypes = [
    { id: 'manual', name: 'Manual' },
    { id: 'virtual', name: 'Virtual' },
  ];
  isloading = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.matchForm = this.fb.group({
      sportId: ['', Validators.required],
      competitionId: ['', Validators.required],
      competitionName: ['', Validators.required],
      competitionGrade: ['', Validators.required],
      eventId: ['', Validators.required],
      eventName: ['', Validators.required],
      marketId: ['', Validators.required],
      eventType: ['', Validators.required],
      openDate: ['', Validators.required],
    });
  }

  onSubmit() {
    this.isloading = true;
    if (this.matchForm.valid) {
      const formData = this.matchForm.value;
      this.apiService.addManualEvent(formData).subscribe({
        next: (res) => {
          this.isloading = false;
          this.showToast('Match added successfully');
          this.matchForm.reset();
        },
        error: (err) => {
          this.isloading = false;
          console.error('Error:', err);
          this.showToast(`Error in adding match:${err.error.message}`, true);
        },
      });
    }
  }

  allowAlphaNumeric(event: KeyboardEvent) {
    const char = event.key;
    // allow only a-z, A-Z, 0-9
    if (!/^[a-zA-Z0-9\s]$/.test(char)) {
      event.preventDefault();
    }
  }

  onAlphaNumericPaste(event: ClipboardEvent) {
    const pasteData = event.clipboardData?.getData('text') || '';
    if (!/^[a-zA-Z0-9\s]+$/.test(pasteData)) {
      event.preventDefault();
    }
  }

  allowOnlyAlphabets(event: KeyboardEvent) {
    const char = event.key;
    // allow only a-z and A-Z
    if (!/^[a-zA-Z]$/.test(char)) {
      event.preventDefault();
    }
  }

  onPaste(event: ClipboardEvent) {
    const pasteData = event.clipboardData?.getData('text') || '';
    if (!/^[a-zA-Z]+$/.test(pasteData)) {
      event.preventDefault();
    }
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const char = event.key;
    // allow only digits 0-9
    if (!/^[0-9]$/.test(char)) {
      event.preventDefault();
    }
  }

  onNumberPaste(event: ClipboardEvent) {
    const pasteData = event.clipboardData?.getData('text') || '';
    if (!/^[0-9]+$/.test(pasteData)) {
      event.preventDefault();
    }
  }

  allowDecimal(event: KeyboardEvent) {
    const char = event.key;

    // Allow digits 0–9
    if (/^[0-9]$/.test(char)) {
      return;
    }

    // Allow only one decimal point
    const control = this.matchForm.get('marketId');
    const currentValue = control?.value || '';

    if (char === '.' && !currentValue.includes('.')) {
      return;
    }

    // Block everything else
    event.preventDefault();
  }

  onDecimalPaste(event: ClipboardEvent) {
    const pasteData = event.clipboardData?.getData('text') || '';
    // Allow only numbers with a single decimal point
    if (!/^\d*\.?\d*$/.test(pasteData)) {
      event.preventDefault();
    }
  }

  private showToast(message: string, isError: boolean = false): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: isError ? 'error' : 'success',
      title: message,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  }
}
