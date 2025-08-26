import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Api } from '../../core/service/api';
import { User } from '../../core/service/user';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit{

  loginForm!: FormGroup;
  errorMessage: string = '';
  passwordVisible: boolean = false;

  constructor(private fb: FormBuilder,private router: Router, private apiService:Api, private UserService: User) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.apiService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          console.log(res,"res")
          const token = res.token;
          this.UserService.setToken(token);
          this.router.navigate(['/home'])
        },
        error: (err: any) => {
          this.errorMessage = err.error.message || 'Login failed';
        }
      });
    }
  }
  
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
