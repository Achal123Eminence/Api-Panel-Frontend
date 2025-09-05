// src/app/pages/currency-master/currency-master.component.ts
import {
  Component,
  OnInit,
  signal,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule,FormBuilder,ReactiveFormsModule,Validators,FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import { Api } from '../../core/service/api';

@Component({
  selector: 'app-currency',
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './currency.html',
  styleUrl: './currency.css',
})
export class Currency implements OnInit {
  private api = inject(Api);
  isLoading = false;

  allCurrencies = signal<any[]>([]);
  base: any;

  addCurrencyForm!:FormGroup;
  updateForm!: FormGroup;

  constructor(private fb: FormBuilder){}

  ngOnInit(): void {
    this.addCurrencyForm = this.fb.group({
      name:['', Validators.required],
      value:['', Validators.required],
    })
    
    this.updateForm = this.fb.group({
      currencies: this.fb.array([])
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
        res.data.forEach((c: any) => this.currencies.push(this.buildCurrencyGroup(c)));
        console.log(this.currencies);
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
        this.api.deleteCurrency(id).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.showToast('Currency deleted successfully');
            this.getAllCurrency();
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

  createCurrency(){
    if (this.addCurrencyForm.invalid) {
      this.addCurrencyForm.markAllAsTouched();
      return;
    };

    this.isLoading = true;
    this.api.addCurrency(this.addCurrencyForm.value).subscribe({
      next:(res:any)=>{
        this.isLoading = false;
        this.showToast("Currency created successfully");
        this.addCurrencyForm.reset()
        this.getAllCurrency();
      },
      error:(err)=>{
        this.isLoading = false;
        this.showToast(err.error.message || "Error creating currency", true)
      }
    })
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
        this.getAllCurrency();
      },
      error: (err) => {
        this.isLoading = false;
        this.showToast(err.error.message || 'Error updating currencies', true);
      },
    });
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
