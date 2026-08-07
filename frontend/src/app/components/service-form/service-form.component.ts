import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Service } from '../../models/service.model';
import { ServiceApiService } from '../../services/service-api.service';

@Component({
    selector: 'app-service-form',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './service-form.component.html'
})
export class ServiceFormComponent implements OnInit {
    service: Service = { name: '', category: 'Consultation', price: 0 };
    saving = false;
    loading = false;

    private serviceId: string | null = null;
    get isEditMode(): boolean { return !!this.serviceId; }

    constructor(
        private serviceApi: ServiceApiService,
        private router: Router,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.serviceId = this.route.snapshot.paramMap.get('id');

        if (this.serviceId) {
            this.loading = true;
            this.serviceApi.getById(this.serviceId).subscribe({
                next: data => {
                    this.service = data;
                    this.loading = false;
                    this.cdr.markForCheck();
                },
                error: () => this.loading = false
            });
        }
    }

    saveService(): void {
        this.saving = true;
        const request = this.isEditMode
            ? this.serviceApi.update(this.serviceId!, this.service)
            : this.serviceApi.create(this.service);

        request.subscribe({
            next: () => this.router.navigate(['/services']),
            error: () => this.saving = false
        });
    }
}