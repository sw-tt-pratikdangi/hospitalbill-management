import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardStats } from '../../models/dashboard-stats.model';
import { DashboardService } from '../../services/dashboard.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    stats: DashboardStats | null = null;
    loading = true;

    constructor(private dashboardService: DashboardService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.dashboardService.getStats().subscribe({
            next: data => {
                this.stats = data;
                this.loading = false;
                this.cdr.markForCheck();  // ← important
            },
            error: () => {
                this.loading = false;
                this.cdr.markForCheck();  // ← important
            }
        });
    }
}