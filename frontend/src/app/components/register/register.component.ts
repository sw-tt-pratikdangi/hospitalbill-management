import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    form = { name: '', email: '', password: '', role: 'Receptionist' };
    saving = false;
    errorMessage = '';

    constructor(private authService: AuthService, private router: Router) { }

    onRegister(): void {
        this.errorMessage = '';
        this.saving = true;

        this.authService.register(this.form).subscribe({
            next: () => this.router.navigate(['/dashboard']), // register() logs them in immediately, same as login()
            error: (err) => {
                this.saving = false;
                this.errorMessage = err?.error?.message || 'Registration failed';
            }
        });
    }
}