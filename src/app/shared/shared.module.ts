import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// component
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { HorizontalComponent } from '../layouts/horizontal/horizontal.component';

@NgModule({
  declarations: [
    BreadcrumbsComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [BreadcrumbsComponent]
})
export class SharedModule { }
