import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { PatientFormComponent } from './components/patient-form/patient-form.component';
import { ServiceListComponent } from './components/service-list/service-list.component';
import { ServiceFormComponent } from './components/service-form/service-form.component';
import { BillListComponent } from './components/bill-list/bill-list.component';
import { BillFormComponent } from './components/bill-form/bill-form.component';
import { BillDetailComponent } from './components/bill-detail/bill-detail.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },

    { path: 'patients', component: PatientListComponent, canActivate: [authGuard] },
    { path: 'patients/new', component: PatientFormComponent, canActivate: [authGuard] },
    { path: 'patients/:id/edit', component: PatientFormComponent, canActivate: [authGuard] },

    { path: 'services', component: ServiceListComponent, canActivate: [authGuard] },
    { path: 'services/new', component: ServiceFormComponent, canActivate: [authGuard] },
    { path: 'services/:id/edit', component: ServiceFormComponent, canActivate: [authGuard] },

    { path: 'bills', component: BillListComponent, canActivate: [authGuard] },
    { path: 'bills/new', component: BillFormComponent, canActivate: [authGuard] },
    { path: 'bills/:id', component: BillDetailComponent, canActivate: [authGuard] }
    // Service and Bill routes get added in the next modules
];
