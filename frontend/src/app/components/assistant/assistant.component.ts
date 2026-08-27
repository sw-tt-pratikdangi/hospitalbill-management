import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssistantService } from '../../services/assistant.service';

@Component({
    selector: 'app-assistant',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './assistant.component.html',
    styleUrl: './assistant.component.css'
})
export class AssistantComponent {
    question = '';
    codeContext = '';
    answer = '';
    loading = false;
    copied = false;

    constructor(
        private assistantService: AssistantService,
        private cdr: ChangeDetectorRef
    ) { }

    ask() {
        if (!this.question.trim() && !this.codeContext.trim()) return;

        this.loading = true;
        this.answer = '';
        this.copied = false;
        this.cdr.detectChanges();

        this.assistantService.ask(this.question, this.codeContext).subscribe({
            next: (res) => {
                this.answer = res.answer;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                const errMsg = err.error?.error || err.message || 'Unknown error occurred.';
                const details = err.error?.details ? `\nDetails: ${err.error.details}` : '';
                this.answer = `Error: ${errMsg}${details}`;
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    copyAnswer() {
        if (this.answer) {
            navigator.clipboard.writeText(this.answer);
            this.copied = true;
            setTimeout(() => {
                this.copied = false;
                this.cdr.detectChanges();
            }, 2000);
        }
    }
}