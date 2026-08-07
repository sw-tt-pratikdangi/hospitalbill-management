import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Service } from '../../models/service.model';
import { ServiceApiService } from '../../services/service-api.service';

@Component({
    selector: 'app-service-form',
    standalone: true,
    imports: [FormsModule, RouterModule],
    templateUrl: './service-form.component.html'
})
export class ServiceFormComponent {
    service: Service = { name: '', category: 'Consultation', price: 0 };
    saving = false;

    constructor(private serviceApi: ServiceApiService, private router: Router) { }

    saveService(): void {
        this.saving = true;
        this.serviceApi.create(this.service).subscribe({
            next: () => this.router.navigate(['/services']),
            error: () => this.saving = false
        });
    }
}