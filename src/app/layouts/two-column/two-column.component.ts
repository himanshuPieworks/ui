import { Component } from '@angular/core';
import { EventService } from 'src/app/core/services/event.service';

@Component({
  selector: 'app-two-column',
  templateUrl: './two-column.component.html',
  styleUrls: ['./two-column.component.scss']
})
  
/**
 * TwoColumnComponent
 */
export class TwoColumnComponent {

  constructor(private eventService: EventService) { }
  isCondensed = false;

  ngOnInit(): void {
    document.documentElement.setAttribute('data-layout', 'twocolumn');
    document.documentElement.setAttribute('data-topbar', 'light');
    document.documentElement.setAttribute('data-sidebar', 'dark');
    document.documentElement.setAttribute('data-sidebar-size', 'lg');
    document.documentElement.setAttribute('data-layout-style', 'default');
    document.documentElement.setAttribute('data-theme', 'default');
    document.documentElement.setAttribute('data-bs-theme', 'light');
    document.documentElement.setAttribute('data-layout-width', 'fluid');
    document.documentElement.setAttribute('data-sidebar-image', 'none');
    document.documentElement.setAttribute('data-layout-position', 'fixed');
    document.documentElement.setAttribute('data-preloader', 'disable');

    window.addEventListener('resize', function () {
      if (document.documentElement.getAttribute('data-layout') == "twocolumn") {
        if (document.documentElement.clientWidth <= 767) {
          document.documentElement.setAttribute('data-layout', 'vertical');
        } else {
          document.documentElement.setAttribute('data-layout', 'twocolumn');
          document.getElementById('side-bar')?.classList.add('d-none');
        }
      }else{
        if (document.documentElement.clientWidth <= 767) {
          document.documentElement.setAttribute('data-layout', 'vertical');
        } else {
          document.documentElement.setAttribute('data-layout', 'twocolumn');
          document.getElementById('side-bar')?.classList.add('d-none');
        }
      }
    })
  }


  /**
   * On mobile toggle button clicked
   */
  onToggleMobileMenu() {
    if (document.documentElement.clientWidth <= 767) {
      document.body.classList.toggle('vertical-sidebar-enable');
    } else {
      document.body.classList.toggle('twocolumn-panel');
    }
  }

  /**
   * on settings button clicked from topbar
   */
  onSettingsButtonClicked() {
    document.body.classList.toggle('right-bar-enabled');
    const rightBar = document.getElementById('theme-settings-offcanvas');
    if (rightBar != null) {
      rightBar.classList.toggle('show');
      rightBar.setAttribute('style', "visibility: visible;");
    }
  }

  isTwoColumnLayoutRequested() {
    return 'twocolumn' === document.documentElement.getAttribute('data-layout');

  }

  issemiboxLayoutRequested() {
    return 'semibox' === document.documentElement.getAttribute('data-layout');
  }

}
