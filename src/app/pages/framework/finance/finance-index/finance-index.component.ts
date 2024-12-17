import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PieworksCommonService } from '../../../../common/pieworkscommon.service';

@Component({
  selector: 'app-finance-index',
  templateUrl: './finance-index.component.html',
  styleUrls: ['./finance-index.component.scss'],
})
export class FinanceIndexComponent {
  breadCrumbItems!: Array<{}>;
  constructor(
    private route: ActivatedRoute,
    public commonService: PieworksCommonService
  ) {
    this.breadCrumbItems = [
      { label: 'Home', link: '/', active: false },
      { label: 'Manage', link: '/recr/manage', active: false },
      { label: 'Finance', active: true },
    ];
  }
  prospectDescription =
    'Do you have a potential client to whom we can make a sales pitch to? This section help you to view, add or manage prospective client.';
  clientDescription = 'This section helps you view, add or manage our clients.';
  links: any = [
    {
      image: 'mdi mdi-file-certificate-outline',
      title: 'Upload IDC',
      description: 'This section helps to upload and view independent contract',
      link: '/fw/idc',
      rbacName: 'finance',
    },
    {
      image: 'mdi mdi-certificate-outline',
      title: 'Client contracts',
      description: 'This section helps in maintaining client contracts',
      link: '/fw/client-contracts',
      rbacName: 'finance',
    },
    {
      image: 'mdi mdi-cash',
      title: 'Member payouts',
      description:
        'The section helps to manage member payout requests raised by community members.',
      link: '/fw/member-payouts',
      rbacName: 'finance',
    },
    {
      image: 'mdi mdi-registered-trademark',
      title: 'Retainer invoices',
      description: 'This section helps to generate retainer invoices',
      link: '/fw/retainer-invoices',
      rbacName: 'finance',
    },
    {
      image: 'mdi mdi-alpha-s-circle-outline',
      title: 'Success invoices',
      description: 'This section helps to generate success invoices.',
      link: '/fw/success-invoices',
      rbacName: 'finance',
    },
    {
      image: 'bi bi-currency-rupee',
      title: 'Invoices',
      description:
        'This section provides details of all the invoices generated in the past.',
      link: '/fw/invoices',
      rbacName: 'finance',
    },
    {
      image: 'bx bx-bar-chart-square',
      title: 'Reports',
      description: 'This section provides reports.',
      link: '/fw/finance-reports',
      rbacName: 'finance',
    },
    {
      image: 'bi bi-people',
      title: 'Community Piebank',
      description: 'This section provides reports.',
      link: '/fw/community-piebank',
      rbacName: 'finance',
    },
  ];
}
