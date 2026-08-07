import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Bill } from '../../models/bill.model';
import { BillService } from '../../services/bill.service';

@Component({
    selector: 'app-bill-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './bill-detail.component.html'
})
export class BillDetailComponent implements OnInit {
    bill: Bill | null = null;
    loading = true;

    constructor(private route: ActivatedRoute, private billService: BillService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id')!;
        this.billService.getById(id).subscribe({
            next: data => { this.bill = data; this.loading = false; this.cdr.markForCheck(); },
            error: () => this.loading = false
        });
    }

    get patientName(): string {
        if (!this.bill) return '';
        return typeof this.bill.patient === 'object' ? this.bill.patient.name : '';
    }

    get patientPhone(): string {
        if (!this.bill) return '';
        return typeof this.bill.patient === 'object' ? this.bill.patient.phone : '';
    }

    printInvoice(): void {
        window.print();
    }
}