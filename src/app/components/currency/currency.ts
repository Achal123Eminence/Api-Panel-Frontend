// src/app/pages/currency-master/currency-master.component.ts
import {
  Component,
  OnInit,
  computed,
  signal,
  inject,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule,FormBuilder,ReactiveFormsModule,Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Api } from '../../core/service/api';

interface CurrencyModel {
  _id?: string;
  name: string;
  value: number;
  isBase: boolean;
}

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
    this.getBaseCurrency();
    this.getAllCurrency();
    this.addCurrencyForm = this.fb.group({
      name:['', Validators.required],
      value:['', Validators.required],
    })

    this.updateForm = this.fb.group({
      value:['',Validators.required]
    })
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
        console.log('Error in getting cricket competition list: ', err);
      },
    });
  }

  getAllCurrency() {
    this.isLoading = true;
    this.api.getCurrency().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.allCurrencies.set(res.data);
        console.log(this.allCurrencies());
      },
      error: (err) => {
        this.isLoading = false;
        console.log('Error in getting cricket competition list: ', err);
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
        this.getAllCurrency();
        this.addCurrencyForm.reset()
      },
      error:(err)=>{
        this.isLoading = false;
        this.showToast(err.error.message || "Error creating currency", true)
      }
    })
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
