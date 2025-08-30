import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-competition',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './add-competition.html',
  styleUrl: './add-competition.css'
})
export class AddCompetition implements OnInit{
  competitionForm!: FormGroup;
  sports = [
    { id: '4', name: 'Cricket' },
    { id: '1', name: 'Tennis' },
    { id: '2', name: 'Soccer' },
  ];
  competitionId:any=12345;
  competitionTypes = [
    { id: 'virtual', name: 'virtual' },
    { id: 'manual', name: 'manual' }
  ];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.competitionForm = this.fb.group({
      sportId: ['', Validators.required],
      competitionId: ['', Validators.required],
      competitionName: ['', Validators.required],
      competitionType: ['', Validators.required],
      openDate: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.competitionForm.valid) {
      const formData = this.competitionForm.value;
      console.log('Submitting competition:', formData);

      this.showToast("Competition added successfully");
      this.competitionForm.reset();
      // this.http.post('/api/competitions', formData).subscribe({
      //   next: (res) => console.log('✅ Competition saved:', res),
      //   error: (err) => console.error('❌ Error:', err),
      // });
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
