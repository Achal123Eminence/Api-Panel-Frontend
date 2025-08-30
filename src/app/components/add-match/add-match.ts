import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-match',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './add-match.html',
  styleUrl: './add-match.css'
})
export class AddMatch implements OnInit{
  matchForm!: FormGroup;
  sports = [
    { id: '4', name: 'Cricket' },
    { id: '1', name: 'Tennis' },
    { id: '2', name: 'Soccer' },
  ];
  competitionId:any=12345;
  matchTypes = [
    { id: 'A', name: 'Option01' },
    { id: 'B', name: 'Option02' },
    { id: 'C', name: 'Option03' },
  ];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.matchForm = this.fb.group({
      sportId: ['', Validators.required],
      competitionId: ['', Validators.required],
      competitionName: ['', Validators.required],
      eventId: ['',Validators.required],
      eventName: ['',Validators.required],
      marketId: ['',Validators.required],
      matchType: ['', Validators.required],
      openDate: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.matchForm.valid) {
      const formData = this.matchForm.value;
      console.log('Submitting competition:', formData);

      this.showToast("Match added successfully");
      this.matchForm.reset()
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
