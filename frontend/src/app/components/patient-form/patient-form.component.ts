
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient.service';

@Component({
    selector: 'app-patient-form',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './patient-form.component.html'
})
export class PatientFormComponent {
    patient: Patient = { name: '', email: '', age: 0, gender: 'Male', phone: '', address: '' };
    saving = false;

    constructor(private patientService: PatientService, private router: Router) { }

    savePatient(): void {
        this.saving = true;
        this.patientService.create(this.patient).subscribe({
            next: () => this.router.navigate(['/patients']),
            error: () => this.saving = false
        });
    }
}