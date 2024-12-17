import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-horizontal',
  templateUrl: './horizontal.component.html',
  styleUrls: ['./horizontal.component.scss']
})
export class HorizontalComponent {

  userName:any;

  constructor(public commonService: PieworksCommonService, private route: ActivatedRoute) { 


    this.userName = localStorage.getItem('usersname');

    
    
    

  }

  getFirstName(fullName:any): string {
    // Split the full name and return the first part
    return fullName.split(' ')[0];
  }
  isCondensed = false;

  ngOnInit(): void {
    document.documentElement.setAttribute('data-layout', 'horizontal');
    document.documentElement.setAttribute('data-sidebar', 'dark');
    document.documentElement.setAttribute('data-sidebar-size', 'lg');
    document.documentElement.setAttribute('data-theme', 'default');
    document.documentElement.setAttribute('data-topbar', 'light');
    document.documentElement.setAttribute('data-bs-theme', 'light');
    document.documentElement.setAttribute('data-layout-style', 'default');
    document.documentElement.setAttribute('data-layout-width', 'fluid');
    document.documentElement.setAttribute('data-sidebar-image', 'none');
    document.documentElement.setAttribute('data-layout-position', 'fixed');
    document.documentElement.setAttribute('data-preloader', 'disable');

  }

  /**
   * on settings button clicked from topbar
   */
   onSettingsButtonClicked() {
    document.body.classList.toggle('right-bar-enabled');
    const rightBar = document.getElementById('theme-settings-offcanvas');
    if(rightBar != null){
      rightBar.classList.toggle('show');
      rightBar.setAttribute('style',"visibility: visible;");
    }
  }

  /**
   * On mobile toggle button clicked
   */
   onToggleMobileMenu() {     
   if (document.documentElement.clientWidth <= 1024) {
     document.body.classList.toggle('menu');
   }
 }
}
