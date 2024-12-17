import { Component } from '@angular/core';

@Component({
  selector: 'app-pass-change',
  templateUrl: './pass-change.component.html',
  styleUrls: ['./pass-change.component.scss']
})

// Password Chage Component
export class PassChangeComponent {
  // set the currenr year
  year: number = new Date().getFullYear();
}
