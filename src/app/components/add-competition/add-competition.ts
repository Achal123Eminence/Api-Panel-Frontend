import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed, inject  } from '@angular/core';
import { Api } from '../../core/service/api';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-competition',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-competition.html',
  styleUrl: './add-competition.css',
})
export class AddCompetition implements OnInit {
  private apiService = inject(Api);
  competitionForm!: FormGroup;
  sports = [
    { id: '4', name: 'Cricket' },
    { id: '2', name: 'Tennis' },
    { id: '1', name: 'Soccer' },
  ];
  competitionTypes = [
    { id: 'virtual', name: 'virtual' },
    { id: 'manual', name: 'manual' },
  ];
  maunalCompetitionList = signal<any[]>([]);
  isloading = false;


  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.competitionForm = this.fb.group({
      sportId: ['', Validators.required],
      competitionId: [{ value: '', disabled: true }], // auto-generated, read-only
      competitionName: ['', Validators.required],
      competitionType: ['', Validators.required],
      openDate: ['', Validators.required],
    });

    this.getNextCompetitionId();
    this.getManualCompetitionList();
  }

  onSubmit() {
    this.isloading = true
    if (this.competitionForm.valid) {
      const formData = this.competitionForm.getRawValue();
      delete formData.competitionId;
      this.apiService.addManualCompetition(formData).subscribe({
        next: (res) => {
          this.isloading = false;
          this.resetForm();
          this.showToast('Competition added successfully');
          this.getNextCompetitionId();
          this.getManualCompetitionList();
        },
        error: (err) => {
          this.isloading = false;
          this.showToast('Error in adding Competition!!');
          console.error('Error:', err);
        },
      });
    }
  }

  private resetForm() {
    this.competitionForm.reset({
      sportId: '',
      competitionName: '',
      competitionType: '',
      openDate: '',
      // competitionId will be filled by getNextCompetitionId()
    });
  }

  getNextCompetitionId() {
    this.apiService.getNextManual().subscribe({
      next: (res: any) => {
        const nextId = res.nextId;
        this.competitionForm.patchValue({ competitionId: nextId });
      },
      error: (err) => {
        console.log('Error in getting competition next id');
      },
    });
  }

  getManualCompetitionList() {
    this.isloading = true;
    this.apiService.getManualCompetitionList().subscribe({
      next: (res: any) => {
        this.isloading = false;
        this.maunalCompetitionList.set(res.data);
        console.log(this.maunalCompetitionList(), 'manual list');
      },
      error: (err) => {
        this.isloading = false;
        console.log('Error in getting manual competition list!!');
      },
    });
  }

  updateManualComeptiiton(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to Hide this Competition?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Hide it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.isloading = true;
        this.apiService.updateManualCompetition({ id }).subscribe({
          next: (res: any) => {
            this.isloading = false;
            this.getManualCompetitionList();
            this.showToast('Competition Hidden successfully');
          },
          error: (err) => {
            this.isloading = false;
            console.log('Error in updating competition', err);
            this.showToast(`Error in hiding competition:${err.error.message}`);
          },
        });
      }
    });
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
