import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
// import { NgxAsideComponent } from 'ngx-aside/lib/aside.component';
import { DATA_PRELOADER, LAYOUT_MODE, LAYOUT_POSITION, LAYOUT_THEME, LAYOUT_VERTICAL, LAYOUT_WIDTH, SIDEBAR_COLOR, SIDEBAR_IMAGE, SIDEBAR_SIZE, SIDEBAR_VIEW, TOPBAR } from '../layout.model';
import { EventService } from 'src/app/core/services/event.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-rightsidebar',
  templateUrl: './rightsidebar.component.html',
  styleUrls: ['./rightsidebar.component.scss']
})
export class RightsidebarComponent {

  rightsidebar: any;
  layout: string | undefined;
  theme: string | undefined;
  mode: string | undefined;
  width: string | undefined;
  position: string | undefined;
  topbar: string | undefined;
  size: string | undefined;
  sidebarView: string | undefined;
  sidebar: string | undefined;
  attribute: any;
  sidebarImage: any;
  sidebarVisibility: any;
  preLoader: any;
  grd: any;

  @Output() settingsButtonClicked = new EventEmitter();
  // @ViewChild('offcanvasExample', { static: false }) offcanvasExample?: NgxAsideComponent;

  constructor(private eventService: EventService, private router: Router, private spinner: NgxSpinnerService,public commonService: PieworksCommonService) { }

  ngOnInit(): void {
    this.layout = LAYOUT_VERTICAL;
    this.theme = LAYOUT_THEME
    this.mode = LAYOUT_MODE;
    this.width = LAYOUT_WIDTH;
    this.position = LAYOUT_POSITION;
    this.topbar = TOPBAR;
    this.size = SIDEBAR_SIZE;
    this.sidebarView = SIDEBAR_VIEW;
    this.sidebar = SIDEBAR_COLOR;
    this.sidebarImage = SIDEBAR_IMAGE;
    this.preLoader = DATA_PRELOADER;
    this.attribute = '';
  }

  //  Filter Offcanvas Set
  openEnd() {
    document.querySelector('.custom-offcanvas')?.classList.add('show')
    document.getElementById('backdrop')?.classList.add('show')
    // this.offcanvasExample?.show()
    setTimeout(() => {
      this.attribute = document.documentElement.getAttribute('data-layout')
      if (this.attribute == 'vertical') {
        var vertical = document.getElementById('customizer-layout01') as HTMLInputElement;
        if (vertical != null) {
          vertical.setAttribute('checked', 'true');
        }
      }
      if (this.attribute == 'horizontal') {
        const horizontal = document.getElementById('customizer-layout02');
        if (horizontal != null) {
          horizontal.setAttribute('checked', 'true');
        }
      }
      if (this.attribute == 'twocolumn') {
        const Twocolumn = document.getElementById('customizer-layout03');
        if (Twocolumn != null) {
          Twocolumn.setAttribute('checked', 'true');
        }
      }
      if (this.attribute == 'semibox') {
        const Twocolumn = document.getElementById('customizer-layout04');
        if (Twocolumn != null) {
          Twocolumn.setAttribute('checked', 'true');
        }
      }
    }, 100);
  }

  closeoffcanvas(){
    document.querySelector('.custom-offcanvas')?.classList.remove('show')
    document.getElementById('backdrop')?.classList.remove('show')
  }
  /**
   * Change the layout onclick
   * @param layout Change the layout
   */
  changeLayout(layout: string) {
    this.attribute = layout;
    this.eventService.broadcast('changeLayout', layout);
    document.documentElement.setAttribute('data-layout', layout);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1000);
  }

  changeTheme(theme: string) {
    this.spinner.show();
    this.theme = theme
    if (theme == 'minimal') {
      document.documentElement.setAttribute('data-sidebar', 'light')
    } else {
      document.documentElement.setAttribute('data-sidebar', 'dark')
    }
    document.documentElement.setAttribute('data-theme', theme);

    setTimeout(() => {
      this.spinner.hide();
      //   window.dispatchEvent(new Event('resize'));
    }, 1000);
  }

  // Add Active Class
  addActive(grdSidebar: any) {
    this.grd = grdSidebar;
    document.documentElement.setAttribute('data-sidebar', grdSidebar)
    document.getElementById('collapseBgGradient')?.classList.toggle('show');
    document.getElementById('collapseBgGradient1')?.classList.add('active');
  }

  // Remove Active Class
  removeActive() {
    this.grd = '';
    document.getElementById('collapseBgGradient1')?.classList.remove('active');
    document.getElementById('collapseBgGradient')?.classList.remove('show');
  }

  // When the user clicks on the button, scroll to the top of the document
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  // Mode Change
  changeMode(mode: string) {
    this.mode = mode;
    document.documentElement.setAttribute('data-bs-theme', mode)
    document.documentElement.setAttribute('data-topbar', mode)
  }

  // Visibility Change
  changeVisibility(visibility: string) {
    this.sidebarVisibility = visibility;
    document.documentElement.setAttribute('data-sidebar-visibility', visibility)
  }


  // Width Change
  changeWidth(width: string, size: string) {
    this.width = width;
    document.documentElement.setAttribute('data-layout-width', width);
    document.documentElement.setAttribute('data-sidebar-size', size);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);
  }
  // Position Change
  changePosition(position: string) {
    this.position = position;
    document.documentElement.setAttribute('data-layout-position', position);
  }

  // Topbar Change
  changeTopColor(color: string) {
    this.topbar = color;
    document.documentElement.setAttribute('data-topbar', color);
  }

  // Sidebar Size Change
  changeSidebarSize(size: string) {
    this.size = size;
    document.documentElement.setAttribute('data-sidebar-size', size);
  }

  // Sidebar Size Change
  changeSidebar(sidebar: string) {
    this.sidebarView = sidebar;
    document.documentElement.setAttribute('data-layout-style', sidebar);
  }

  // Sidebar Color Change
  changeSidebarColor(color: string) {
    this.sidebar = color;
    document.documentElement.setAttribute('data-sidebar', color);
  }

  // Sidebar Image Change
  changeSidebarImage(img: string) {
    this.sidebarImage = img;
    document.documentElement.setAttribute('data-sidebar-image', img);
  }

  // PreLoader Image Change
  changeLoader(loader: string) {
    this.preLoader = loader;
    document.documentElement.setAttribute('data-preloader', loader);
    var preloader = document.getElementById("preloader");
    if (preloader) {
      setTimeout(function () {
        (document.getElementById("preloader") as HTMLElement).style.opacity = "0";
        (document.getElementById("preloader") as HTMLElement).style.visibility = "hidden";
      }, 1000);
    }
  }

  

}
