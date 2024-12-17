import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PieworksCommonService } from '../../../common/pieworkscommon.service';

@Component({
  selector: 'app-analytics-index',
  templateUrl: './analytics-index.component.html',
  styleUrls: ['./analytics-index.component.scss'],
})
export class AnalyticsIndexComponent {
  breadCrumbItems!: Array<{}>;
  constructor(
    private route: ActivatedRoute,
    public commonService: PieworksCommonService
  ) {
    this.breadCrumbItems = [
      { label: 'Home', link: '/', active: false },
      { label: 'Manage', link: '/recr/manage', active: false },
      { label: 'Analytics', active: true },
    ];
  }
  prospectDescription =
    'Do you have a potential client to whom we can make a sales pitch to? This section help you to view, add or manage prospective client.';
  clientDescription = 'This section helps you view, add or manage our clients.';
  links: any = [
    {
      image: 'mdi mdi-file-certificate-outline',
      title: 'Delivery Analytics',
      description:
        'This section provides with various analytics reports on delivery',
      link: '/recr/delivery-analytics',
      rbacName: 'manage-analytics',
    },
    {
      image: 'mdi mdi-certificate-outline',
      title: 'Community Analytics',
      description:
        'This section provides with various analytics reports on community performance',
      link: '/recr/community-analytics',
      rbacName: 'manage-analytics',
    },
    {
      image: 'bi bi-bar-chart-line',
      title: 'Client Analytics',
      description:
        'This section provides with various analytics reports on Growth performance',
      link: '/recr/growth-analytics',
      rbacName: 'manage-analytics',
    },
    {
      image: 'bi bi-people-fill',
      title: 'Candidate Analytics',
      description:
        'This section provides with various analytics reports on Candidate and Client Interaction',
      link: '/recr/candidate-analytics',
      rbacName: 'manage-analytics',
    },
  ];
}
