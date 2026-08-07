import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Patient } from '../../models/patient.model';
import { Service } from '../../models/service.model';
import { BillItem } from '../../models/bill.model';
import { ServiceApiService } from '../../services/service-api.service';
import { BillService } from '../../services/bill.service';
import { PatientService } from '../../services/patient.service';

@Component({
    selector: 'app-bill-form',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './bill-form.component.html'
})
export class BillFormComponent implements OnInit {
    patients: Patient[] = [];
    services: Service[] = [];

    selectedPatientId = '';
    selectedServiceId = '';
    quantity = 1;

    items: BillItem[] = [];
    discount = 0;
    tax = 0;

    saving = false;
    errorMessage = '';

    constructor(
        private serviceApi: ServiceApiService,
        private billService: BillService,
        private router: Router,
        private patientService: PatientService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {

        this.loadPatients();
        this.serviceApi.getAll().subscribe(data => this.services = data);
    }
    loadPatients(): void {

        this.patientService.getPatientDropdown().subscribe({
            next: (data) => {
                this.patients = data;
                this.cdr.markForCheck();
            }
        });

    }

    // Add the currently-selected service (with quantity) to the bill's item list
    addItem(): void {
        if (!this.selectedServiceId || this.quantity < 1) return;

        const service = this.services.find(s => s._id === this.selectedServiceId);
        if (!service) return;

        // If the same service is added again, just bump the quantity instead of duplicating the row
        const existing = this.items.find(i => i.service === service._id);
        if (existing) {
            existing.quantity += this.quantity;
        } else {
            this.items.push({
                service: service._id!,
                name: service.name,
                price: service.price,
                quantity: this.quantity
            });
        }

        this.selectedServiceId = '';
        this.quantity = 1;
    }

    removeItem(index: number): void {
        this.items.splice(index, 1);
    }

    // ---- Live totals (recalculated whenever items/discount/tax change) ----
    get subtotal(): number {
        return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    get grandTotal(): number {
        return this.subtotal - (this.discount || 0) + (this.tax || 0);
    }

    saveBill(): void {
        this.errorMessage = '';

        if (!this.selectedPatientId) {
            this.errorMessage = 'Please select a patient';
            return;
        }
        if (this.items.length === 0) {
            this.errorMessage = 'Add at least one service to the bill';
            return;
        }

        this.saving = true;
        this.billService.create({
            patient: this.selectedPatientId,
            items: this.items,
            discount: this.discount,
            tax: this.tax
        }).subscribe({
            next: () => this.router.navigate(['/bills']),
            error: () => { this.saving = false; this.errorMessage = 'Failed to save bill'; }
        });
    }
}