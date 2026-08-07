import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Service } from '../../models/service.model';
import { ServiceApiService } from '../../services/service-api.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-service-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './service-list.component.html'
})
export class ServiceListComponent implements OnInit {

    services: Service[] = [];
    paginatedServices: Service[] = [];

    loading = true;

    // Pagination
    currentPage = 1;
    itemsPerPage = 5;
    totalPages = 0;

    constructor(
        private serviceApi: ServiceApiService,
        public authService: AuthService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadServices();
    }

    loadServices(): void {
        this.loading = true;

        this.serviceApi.getAll().subscribe({
            next: (data) => {
                this.services = data || [];
                this.totalPages = Math.ceil(this.services.length / this.itemsPerPage);

                this.updatePagination();

                this.loading = false;
                this.cdr.markForCheck();
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    updatePagination(): void {

        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;

        this.paginatedServices = this.services.slice(start, end);
    }

    nextPage(): void {

        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updatePagination();
        }

    }

    previousPage(): void {

        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePagination();
        }

    }

    goToPage(page: number): void {

        this.currentPage = page;
        this.updatePagination();

    }

    deleteService(id: string): void {

        if (confirm('Delete this service?')) {
            this.serviceApi.delete(id).subscribe(() => {
                this.loadServices();
            });
        }

    }

    get pages(): number[] {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

}