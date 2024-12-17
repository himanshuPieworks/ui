import { Component, ElementRef, ViewChild } from '@angular/core';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-login-left',
  templateUrl: './login-left.component.html',
  styleUrls: ['./login-left.component.scss']
})

// Login Component
export class LoginLeftComponent {
  colorTheme: any = 'theme-blue';

  // set the current year
  year: number = new Date().getFullYear();

  constructor(public commonService: PieworksCommonService) {
  }
  
  @ViewChild('videoFrame') videoFrame!:ElementRef;
    
  ngOnInit(): void 
  {

  }

  // ngAfterViewInit() {
  //   const iframe = this.videoFrame.nativeElement;
  //   iframe.addEventListener('ended', () => {
  //     // Reload the iframe with loop parameter added
  //     iframe.src = 'https://www.youtube.com/embed/54sU3Dx7Gvw?autoplay=1&mute=1&loop=1';
  //   });
  // }
 
}
