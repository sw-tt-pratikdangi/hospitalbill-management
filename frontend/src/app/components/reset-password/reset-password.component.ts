import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
    token = '';
    password = '';
    confirmPassword = '';
    saving = false;
    errorMessage = '';
    successMessage = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.token = this.route.snapshot.paramMap.get('token') ?? '';
    }

    get passwordsMismatch(): boolean {
        return this.confirmPassword.length > 0 && this.password !== this.confirmPassword;
    }

    onSubmit(): void {
        this.errorMessage = '';
        if (this.passwordsMismatch) return;

        this.saving = true;
        this.authService.resetPassword(this.token, this.password).subscribe({
            next: () => {
                this.saving = false;
                this.successMessage = 'Password reset successfully. Redirecting to login...';
                setTimeout(() => this.router.navigate(['/login']), 2000);
            },
            error: (err) => {
                this.saving = false;
                this.errorMessage = err?.error?.message || 'Reset link is invalid or has expired.';
            }
        });
    }
}