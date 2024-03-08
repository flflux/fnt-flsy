// login.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ViewUser } from '@fnt-flsy/data-transfer-types';

@Component({
  selector: 'fnt-flsy-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage = '';
  userId:number|null=null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required]),
    });
  }

  login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (user) => {
          console.log('function Clled')
          console.log('function Clled with values', user)
          this.router.navigate(['switchpage']);
          this.userId=user.id
          // this.authService.setUserProfile=user
          this.authService.setUserProfile(user);
        },
        error: (error) => {
          this.errorMessage = 'Invalid email or password';
          console.error('Login error:', error);
        },
      });
    }
  }
}
