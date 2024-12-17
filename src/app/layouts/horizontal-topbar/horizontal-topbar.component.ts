import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MenuItem } from './menu.model';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MENU } from './menu';
import {PieworksCommonService} from '../../common/pieworkscommon.service';

@Component({
  selector: 'app-horizontal-topbar',
  templateUrl: './horizontal-topbar.component.html',
  styleUrls: ['./horizontal-topbar.component.scss']
})
export class HorizontalTopbarComponent {
  menu: any;
  menuItems: MenuItem[] = [];
  @ViewChild('sideMenu') sideMenu!: ElementRef;
  @Output() mobileMenuButtonClicked = new EventEmitter();
  bgcolor:any={};  isOpenUrl=false;
  constructor(public commonService: PieworksCommonService,private router: Router, public translate: TranslateService) {
    translate.setDefaultLang('en');
    if(window.location.toString().indexOf("open")>-1)
        this.isOpenUrl=true;
    setTimeout(()=>{this.updateActive(null);},500);
    
    
  }

  ngOnInit(): void {
    // Menu Items
        this.menuItems = MENU;
    //this.menuItems = [];
  }

  toggleMobileMenu(event: any) {
    document.querySelector('.hamburger-icon')?.classList.toggle('open')
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  onToggleMobileMenu(event: any) {     
    if (document.documentElement.clientWidth <= 1024) {
      document.body.classList.toggle('menu');
      event.preventDefault();
      document.querySelector('.hamburger-icon')?.classList.toggle('open')
      this.mobileMenuButtonClicked.emit();
    }
  }
  

  /***
   * Activate droup down set
   */
   ngAfterViewInit() {
    this.initActiveMenu();
  }

  removeActivation(items: any) {   
    items.forEach((item: any) => {
      if (item.classList.contains("menu-link")) {
        if (!item.classList.contains("active")) {
          item.setAttribute("aria-expanded", false);
        }
        (item.nextElementSibling) ? item.nextElementSibling.classList.remove("show") : null;
      }
      if (item.classList.contains("nav-link")) {
        if (item.nextElementSibling) {
          item.nextElementSibling.classList.remove("show");
        }
        item.setAttribute("aria-expanded", false);
      }
      item.classList.remove("active");
    });
  }

  // remove active items of two-column-menu
  activateParentDropdown(item: any) { // navbar-nav menu add active
    item.classList.add("active");
    let parentCollapseDiv = item.closest(".collapse.menu-dropdown");
    if (parentCollapseDiv) {      
      // to set aria expand true remaining
      parentCollapseDiv.classList.add("show");
      parentCollapseDiv.parentElement.children[0].classList.add("active");
      parentCollapseDiv.parentElement.children[0].setAttribute("aria-expanded", "true");
      if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) 
      {
        parentCollapseDiv.parentElement.closest(".collapse").classList.add("show");
        if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling)
        parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.classList.add("active");
        parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.setAttribute("aria-expanded", "true");
      }
      return false;
    }
    return false;
  }

  updateActive(event: any) {
    const ul = document.getElementById("navbar-nav");
    
    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      this.removeActivation(items);
    }
    if(event==null)
    {
        return;
    }
    this.activateParentDropdown(event.target);
  }

  
  initActiveMenu() {
    const pathName = window.location.pathname;
    const ul = document.getElementById("navbar-nav");
    
    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      let activeItems = items.filter((x: any) => x.classList.contains("active")); 
      this.removeActivation(activeItems);
      let matchingMenuItem = items.find((x: any) => {
        return x.pathname === pathName;
      });
      if (matchingMenuItem) {
        this.activateParentDropdown(matchingMenuItem);
      }
    }
  }

  toggleSubItem(event: any) {
    if(event.target && event.target.nextElementSibling)
      event.target.nextElementSibling.classList.toggle("show");
  };

  toggleItem(event: any) {
    let isCurrentMenuId = event.target.closest('a.nav-link');    
    
    let isMenu = isCurrentMenuId.nextElementSibling as any;
    let dropDowns = Array.from(document.querySelectorAll('#navbar-nav .show'));
    dropDowns.forEach((node: any) => {
      node.classList.remove('show');
    });

    (isMenu) ? isMenu.classList.add('show') : null;

    const ul = document.getElementById("navbar-nav");
    if(ul){
      const iconItems = Array.from(ul.getElementsByTagName("a"));
      let activeIconItems = iconItems.filter((x: any) => x.classList.contains("active"));
      activeIconItems.forEach((item: any) => {
        item.setAttribute('aria-expanded', "false")
        item.classList.remove("active");
      });
    } 
    if (isCurrentMenuId) {
      this.activateParentDropdown(isCurrentMenuId);
    }
  }


  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  /**
   * remove active and mm-active class
   */
  _removeAllClass(className: any) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }
  
//  gotoUrl(url:any):void
//  {
//      this.router.navigate(["login"]);
//  }
}
