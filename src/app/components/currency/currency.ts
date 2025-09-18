// src/app/pages/currency-master/currency-master.component.ts
import {
  Component,
  OnInit,
  signal,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormsModule,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormArray,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { Api } from '../../core/service/api';

@Component({
  selector: 'app-currency',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './currency.html',
  styleUrl: './currency.css',
})
export class Currency implements OnInit {
  private api = inject(Api);
  isLoading = false;

  allCurrencies = signal<any[]>([]);
  base: any = { name: '' };

  addCurrencyForm!: FormGroup;
  updateForm!: FormGroup;
  isloading = false;


  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.addCurrencyForm = this.fb.group({
      name: ['', Validators.required],
      value: ['', Validators.required],
    });

    this.updateForm = this.fb.group({
      currencies: this.fb.array([]),
    });

    this.getAllCurrency();
    this.getBaseCurrency();
  }
  get currenciesControls() {
    return this.currencies.controls;
  }

  get currencies(): FormArray {
    return this.updateForm.get('currencies') as FormArray;
  }

  private buildCurrencyGroup(currency: any): FormGroup {
    return this.fb.group({
      _id: [currency._id],
      name: [currency.name, Validators.required],
      value: [currency.value, [Validators.required, Validators.min(0)]],
      isBase: [currency.isBase || false],
    });
  }

  getBaseCurrency() {
    this.isLoading = true;
    this.api.getBaseCurrency().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.base = res.data;
        this.cd.detectChanges();
        console.log(this.base, 'res');
      },
      error: (err) => {
        this.isLoading = false;
        console.log('Error in getting Base Currency: ', err);
      },
    });
  }

  getAllCurrency() {
    this.isLoading = true;
    this.api.getCurrency().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.currencies.clear();
        // backend already returns only non-base
        (res.data || []).forEach((c: any) =>
          this.currencies.push(this.buildCurrencyGroup(c))
        );

        this.cd.detectChanges();
        console.log('Currencies (non-base):', this.currencies.value);
      },
      error: (err) => {
        this.isLoading = false;
        console.log('Error in getting Currency list', err);
      },
    });
  }

  deleteCurrency(id: any) {
    this.isLoading = true;

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to Delete this currency?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.deleteCurrency({id:id}).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.showToast('Currency deleted successfully');
            // refresh both base + non-base
            this.getAllCurrency();
            this.getBaseCurrency();
          },
          error: (err) => {
            this.isLoading = false;
            this.showToast(
              `Error in deleting currency:${err.error.message}`,
              true
            );
          },
        });
      }
    });
  }

  createCurrency() {
    if (this.addCurrencyForm.invalid) {
      this.addCurrencyForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.api.addCurrency(this.addCurrencyForm.value).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.showToast('Currency created successfully');
        this.addCurrencyForm.reset();
        // refresh both base + non-base
        this.getAllCurrency();
        this.getBaseCurrency();
      },
      error: (err) => {
        this.isLoading = false;
        this.showToast(err.error.message || 'Error creating currency', true);
      },
    });
  }

  updateCurrencies() {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    const payload = { currencies: this.currencies.value };

    this.isLoading = true;
    this.api.UpdateMultipleCurrency(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.showToast('Currencies updated successfully');
        // refresh both lists
        this.getAllCurrency();
        this.getBaseCurrency();
      },
      error: (err) => {
        this.isLoading = false;
        this.showToast(err.error.message || 'Error updating currencies', true);
      },
    });
  }

  updateBaseCurrency(data: any) {
    this.isLoading = true;
    const payload = {
      id: this.base?._id,
      name: this.base?.name,
    };
    console.log(payload, 'payload');
    this.api.updateCurrency(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.showToast('Base currency updated successfully');
        this.getAllCurrency();
        this.getBaseCurrency();
      },
      error: (err) => {
        this.isLoading = false;
        this.showToast(
          err.error.message || 'Error updating base currencies',
          true
        );
      },
    });
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

  allowDecimal(event: KeyboardEvent) {
    const char = event.key;

    // Allow digits 0–9
    if (/^[0-9]$/.test(char)) {
      return;
    }

    // Allow only one decimal point
    const control = this.addCurrencyForm.get('marketId');
    const currentValue = control?.value || '';

    if (char === '.' && !currentValue.includes('.')) {
      return;
    }

    // Block everything else
    event.preventDefault();
  }

  allowDecimal02(event: KeyboardEvent) {
    const char = event.key;

    // Allow digits 0–9
    if (/^[0-9]$/.test(char)) {
      return;
    }

    // Allow only one decimal point
    const control = this.updateForm.get('marketId');
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
