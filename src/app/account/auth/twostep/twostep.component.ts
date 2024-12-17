import { Component } from '@angular/core';

@Component({
  selector: 'app-twostep',
  templateUrl: './twostep.component.html',
  styleUrls: ['./twostep.component.scss']
})
  
// Two step component
export class TwostepComponent {
  // set the currenr year
  year: number = new Date().getFullYear();
}
