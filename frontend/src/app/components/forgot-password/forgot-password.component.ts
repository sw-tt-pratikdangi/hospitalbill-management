import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
    email = '';
    submitting = false;
    submitted = false;
    errorMessage = '';

    constructor(private authService: AuthService) { }

    onSubmit(): void {
        this.submitting = true;
        this.errorMessage = '';

        this.authService.forgotPassword(this.email).subscribe({
            next: () => { this.submitting = false; this.submitted = true; },
            error: () => { this.submitting = false; this.errorMessage = 'Something went wrong, please try again.'; }
        });
    }
}