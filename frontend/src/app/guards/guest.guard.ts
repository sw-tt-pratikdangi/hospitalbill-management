import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        router.navigate(['/dashboard']);
        return false; // block access to the route (login/register) since already logged in
    }

    return true; // not logged in, let them see the login/register page
};