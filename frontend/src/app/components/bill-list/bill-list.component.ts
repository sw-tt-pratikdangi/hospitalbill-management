import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Bill } from '../../models/bill.model';
import { BillService } from '../../services/bill.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-bill-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './bill-list.component.html'
})
export class BillListComponent implements OnInit {
    bills: Bill[] = [];
    loading = true;

    constructor(private billService: BillService, private cdr: ChangeDetectorRef, public authService: AuthService) { }

    ngOnInit(): void {
        this.loadBills();
    }

    loadBills(): void {
        this.loading = true;
        this.billService.getAll().subscribe({
            next: data => { this.bills = data; this.loading = false; this.cdr.markForCheck(); },
            error: () => this.loading = false
        });
    }

    patientName(bill: Bill): string {
        return typeof bill.patient === 'object' ? bill.patient.name : bill.patient;
    }

    toggleStatus(bill: Bill): void {
        const next = bill.status === 'Paid' ? 'Unpaid' : 'Paid';
        this.billService.updateStatus(bill._id!, next).subscribe(() => this.loadBills());
    }

    statusClasses(status?: string): string {
        if (status === 'Paid') return 'bg-green-50 text-green-700';
        if (status === 'Partial') return 'bg-yellow-50 text-yellow-700';
        return 'bg-red-50 text-red-700';
    }

    deleteBill(id: string): void {
        if (confirm('Delete this bill?')) {
            this.billService.delete(id).subscribe(() => this.loadBills());
        }
    }
}