import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient.service';
import { AuthService } from '../../services/auth.service';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './patient-list.component.html'
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  loading = true;
  errorMessage = '';
  deletingId: string | null = null;
  paginationLoading = false;
  currentPage = 1;
  pageSize = 10;

  totalPages = 0;
  totalRecords = 0;

  constructor(
    private patientService: PatientService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.paginationLoading = true;
    this.loading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.patientService
      .getAll(this.currentPage, this.pageSize)
      .pipe(timeout(1000))
      .subscribe({

        next: (response) => {
          this.patients = response.data;

          this.currentPage = response.pagination.currentPage;
          this.totalPages = response.pagination.totalPages;
          this.totalRecords = response.pagination.totalRecords;

          this.paginationLoading = false;

          this.loading = false;

          this.cdr.markForCheck();

        },

        error: (err) => {

          this.loading = false;
          this.paginationLoading = false;
          if (err.name === 'TimeoutError') {

            this.errorMessage =
              'Request timed out while connecting to server.';

          } else {

            this.errorMessage =
              err?.error?.message || 'Failed to load patients.';

          }

          this.cdr.markForCheck();

        }

      });

  }

  nextPage(): void {

    if (this.currentPage < this.totalPages) {

      this.currentPage++;
      this.loadPatients();

    }

  }

  previousPage(): void {

    if (this.currentPage > 1) {

      this.currentPage--;
      this.loadPatients();

    }

  }

  goToPage(page: number): void {

    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {

      this.loading = true;
      this.currentPage = page;

      this.loadPatients();

    }

  }

  get pages(): number[] {

    return Array.from(
      { length: this.totalPages },
      (_, i) => i + 1
    );

  }

  getPatientId(patient: Patient): string {
    return patient._id || patient.id || '';
  }

  deletePatient(id: string): void {
    if (!id) return;
    if (confirm('Delete this patient?')) {
      this.deletingId = id;
      this.errorMessage = '';
      this.cdr.markForCheck();

      this.patientService.delete(id).pipe(
        timeout(10000)
      ).subscribe({
        next: () => {
          this.patients = this.patients.filter(p => (p._id || p.id) !== id);
          this.deletingId = null;
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        },
        error: err => {
          this.deletingId = null;
          this.errorMessage = err?.error?.message || 'Failed to delete patient.';
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        }
      });
    }
  }
}