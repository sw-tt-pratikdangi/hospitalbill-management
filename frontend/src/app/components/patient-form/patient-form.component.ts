import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient.service';


@Component({
    selector: 'app-patient-form',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './patient-form.component.html'
})
export class PatientFormComponent implements OnInit {
    patient: Patient = { name: '', age: 0, gender: 'Male', phone: '', address: '' };
    saving = false;
    loading = false;

    private patientId: string | null = null;
    get isEditMode(): boolean { return !!this.patientId; }

    constructor(
        private patientService: PatientService,
        private router: Router,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.patientId = this.route.snapshot.paramMap.get('id');
        if (this.patientId) {
            this.loading = true;
            this.patientService.getById(this.patientId).subscribe({
                next: data => {
                    this.patient = data;
                    this.loading = false;
                    this.cdr.markForCheck();
                },
                error: () => {
                    this.loading = false;
                    this.cdr.markForCheck();
                }
            });
        }
    }

    savePatient(): void {
        this.saving = true;
        const request = this.isEditMode
            ? this.patientService.update(this.patientId!, this.patient)
            : this.patientService.create(this.patient);

        request.subscribe({
            next: () => this.router.navigate(['/patients']),
            error: () => this.saving = false
        });
    }
}