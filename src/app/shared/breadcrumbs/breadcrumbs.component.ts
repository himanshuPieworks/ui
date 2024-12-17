import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router'; 

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent {

  @Input() title: string | undefined;
  @Input()
  breadcrumbItems!: Array<{
    active?: boolean;
    label?: string;
    link?: string;
  }>;

  Item!: Array<{
    label?: string;
  }>;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  goToLink(link:any):void
  {
     this.router.navigate([link]); 
  }
}
