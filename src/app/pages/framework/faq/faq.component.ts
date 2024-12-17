import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent {
  faqData: any = [];

  currentSection: number | null = null; // Track currently opened section
  currentFaq: number | null = null; // Track currently opened FAQ


  constructor(private httpClient: HttpClient, private route: ActivatedRoute) {
    this.httpClient.get('assets/json/faq.json').subscribe((data: any) => {
      this.faqData = data.faq;

      this.route.paramMap.subscribe(params => {
        const categoryIndex = params.get('categoryIndex');
        const questionIndex = params.get('questionIndex');

        if (categoryIndex && questionIndex) {
          this.currentSection = +categoryIndex; // Set the opened section
          this.currentFaq = +questionIndex; // Set the opened question
        }
      });
    });
  }

  section: number = 1; // Default section

  
  // Toggle the visibility of the section
  toggleSection(index: number): void {
    this.currentSection = this.currentSection === index ? null : index; // Close if it's already open
    this.currentFaq = null; // Reset currentFaq when changing sections
  }

  // Toggle the visibility of the FAQ question
  toggleFaq(index: number): void {
    this.currentFaq = this.currentFaq === index ? null : index; // Close if it's already open
  }
}
