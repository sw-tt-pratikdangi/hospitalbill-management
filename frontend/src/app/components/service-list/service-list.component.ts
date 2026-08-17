import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Service } from '../../models/service.model';
import { ServiceApiService } from '../../services/service-api.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-service-list',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './service-list.component.html'
})
export class ServiceListComponent implements OnInit {

    services: Service[] = [];
    searchTerm = '';

    loading = true;

    // Pagination
    currentPage = 1;
    itemsPerPage = 5;

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
                this.currentPage = 1; // reset to page 1 on every fresh load
                this.loading = false;
                this.cdr.markForCheck();
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    get filteredServices(): Service[] {
        const term = this.searchTerm.trim().toLowerCase();
        if (!term) return this.services;

        return this.services.filter(s =>
            s.name.toLowerCase().includes(term) || s.category.toLowerCase().includes(term)
        );
    }

    // Derived from filteredServices, not the raw list — this is what keeps
    // search and pagination in sync without any manual "resync" step.
    get totalPages(): number {
        return Math.max(1, Math.ceil(this.filteredServices.length / this.itemsPerPage));
    }

    get paginatedServices(): Service[] {
        // Clamp instead of trusting currentPage blindly: if a search shrinks the
        // result set while you're on page 3, this snaps back to the last valid
        // page instead of returning an empty slice.
        const page = Math.min(this.currentPage, this.totalPages);
        const start = (page - 1) * this.itemsPerPage;
        return this.filteredServices.slice(start, start + this.itemsPerPage);
    }

    get pages(): number[] {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    goToPage(page: number): void {
        this.currentPage = page;
    }

    deleteService(id: string): void {
        if (confirm('Delete this service?')) {
            this.serviceApi.delete(id).subscribe(() => {
                this.loadServices();
            });
        }
    }
}