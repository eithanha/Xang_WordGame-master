import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registration',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  errorMessage: string = '';
  passwordVisible: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  async onSubmit() {
    if (this.registrationForm.invalid) {
      this.errorMessage = 'Please fill all fields correctly';
      return;
    }

    const { email, password } = this.registrationForm.value;

    console.log('Registration Data:', { email, password });

    try {
      await this.authService.register(email, password);

      Swal.fire({
        title: 'Registration Successful!',
        text: 'You can now log in.',
        icon: 'success',
        confirmButtonText: 'OK',
      });

      this.router.navigate(['/login']);
    } catch (error: unknown) {
      if (error instanceof Error) {
        Swal.fire({
          title: 'Registration Failed!',
          text:
            'Passwords must have at least one non-alphanumeric character (!@#$%^).\n' +
            "Passwords must have at least one digit ('0'-'9').\n" +
            "Passwords must have at least one uppercase letter ('A'-'Z').",
          icon: 'error',
          confirmButtonText: 'OK',
        });
        this.router.navigate(['/registration']);
        console.error('Registration error:', error);
      } else {
        Swal.fire({
          title: 'Registration Failed!',
          text: 'An unknown error occurred. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  }
}
