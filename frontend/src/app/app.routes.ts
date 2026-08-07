import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { PatientFormComponent } from './components/patient-form/patient-form.component';
import { ServiceListComponent } from './components/service-list/service-list.component';
import { ServiceFormComponent } from './components/service-form/service-form.component';
import { authGuard } from './guards/auth.guard';
export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'patients', component: PatientListComponent, canActivate: [authGuard] },
    { path: 'patients/new', component: PatientFormComponent, canActivate: [authGuard] },
    { path: 'services', component: ServiceListComponent, canActivate: [authGuard] },
    { path: 'services/new', component: ServiceFormComponent, canActivate: [authGuard] }
    // Service and Bill routes get added in the next modules
];
