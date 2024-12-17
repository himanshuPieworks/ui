import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-term-and-condition',
  templateUrl: './term-and-condition.component.html',
  styleUrls: ['./term-and-condition.component.scss'],
})
export class TermAndConditionComponent {
  constructor(
    public commonService: PieworksCommonService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loadDocuments();
  }

  contractUrl: any;
  loadDocuments(): void {
    this.commonService
      .get(
        'mainservice/framework2/open/independentContracts?domain=recruitment'
      )
      .subscribe((data: any) => {
        if (!data['dataArray'] || data['dataArray'].length == 0) {
          return;
        }
        this.contractUrl = this.commonService.getPicUrl(
          data['dataArray'][0]?.url
        );
      });
  }

  backToRegister() {
    var role = localStorage.getItem('role');

    switch (role) {
      case 'COMMUNITY MEMBER':
        this.router.navigate(['auth/register/community']);
        break;

      case 'Client':
        this.router.navigate(['auth/register/client']);
        break;
      case 'Talent':
        this.router.navigate(['auth/register/talent']);
        break;
      default:
        this.router.navigate(['auth/register/']);
        break;
    }
  }
}
