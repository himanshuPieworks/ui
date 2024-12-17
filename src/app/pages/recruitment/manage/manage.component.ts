import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PieworksCommonService } from '../../../common/pieworkscommon.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
})
export class ManageComponent {
  breadCrumbItems!: Array<{}>;
  constructor(
    private route: ActivatedRoute,
    public commonService: PieworksCommonService
  ) {
    this.breadCrumbItems = [
      { label: 'Home', link: '/', active: false },
      { label: 'Manage', active: true },
    ];
    setTimeout(() => {
      this.loadNorthStar();
    }, 1000);
  }
  prospectDescription =
    'Do you have a potential client to whom we can make a sales pitch to? This section help you to view, add or manage prospective client.';
  clientDescription = 'This section helps you view, add or manage our clients.';
  links: any = [
    {
      image: 'ri-user-received-line',
      title: 'Prospect',
      description: this.prospectDescription,
      link: '/recr/prospects',
      rbacName: 'manage-prospect',
    },
    {
      image: 'ri-user-follow-line',
      title: 'Client',
      description: this.clientDescription,
      link: '/recr/client',
      rbacName: 'manage-client',
    },
    {
      image: 'bi bi-journal-bookmark',
      title: 'RSPP',
      description: 'Click here to view the RSPPs',
      link: '/recr/rspp',
      rbacName: 'rspp',
    },
    {
      image: 'bi bi-journal-check',
      title: 'Roles',
      description: 'Click here to view the mandates',
      link: '/recr/earn',
      rbacName: 'mandate',
    },
    {
      image: 'mdi mdi-account-group-outline',
      title: 'Community',
      description: 'Click here to view members of the community',
      link: '/fw/community',
      rbacName: 'community',
    },
    {
      image: 'bi bi-currency-rupee',
      title: 'Finance',
      description: 'This section provides various finance features.',
      link: '/fw/finance',
      rbacName: 'finance',
    },
    {
      image: 'bi bi-suit-club',
      title: 'Club',
      description: 'This section provides various finance features.',
      link: '/recr/clubs',
      rbacName: 'manage-clubs',
    },
    {
      image: 'bi bi-globe-americas',
      title: 'Discoveries',
      description: 'This section is about Discovered candidate',
      link: '/recr/discoveries',
      rbacName: 'manage-discoveries',
    },
    {
      image: 'bi bi-gear',
      title: 'RBAC',
      description:
        'This section helps in managing various roles of community member and their rights.',
      link: 'user-roles',
      rbacName: 'rbac',
    },
    {
      image: 'bi bi-book-half',
      title: 'Knowledge Master',
      description: 'This section helps in managing the courses.',
      link: '/recr/course',
      rbacName: 'manage-clubs',
    },
    {
      image: 'bi bi-book-half',
      title: 'Knowledge Hub',
      description: 'This section helps in managing the courses.',
      link: '/recr/learn',
      rbacName: 'mandate',
    },
    {
      image: 'ri-user-settings-line',
      title: 'Role',
      description: 'This section helps in managing the user Roles.',
      link: '/recr/roles',
      rbacName: 'manage-role',
    },
    {
      image: 'bx bx-bar-chart-square',
      title: 'Analytics',
      description: 'This section provides with various analytical reports.',
      link: '/recr/analytics',
      rbacName: 'manage-analytics',
    },
    // {
    //   image: 'bx bx-group',
    //   title: 'Buddy',
    //   description: 'This section provides the details of all your buddies.',
    //   link: '/recr/buddies',
    //   rbacName: 'manage-buddy',
    // },
    {
      image: 'bi bi-newspaper',
      title: 'Bulletin',
      description: 'This section provides the news Bulletin',
      link: '/recr/bulletin',
      rbacName: 'manage-bulletin',
    },
    {
      image: 'bx bxs-report',
      title: 'Reports',
      description:
        'This section provides various reports for the community members',
      link: '/recr/reports',
      rbacName: 'manage-reports',
    },
    {
      image: 'bx bxs-user',
      title: 'Talent Pool',
      description:
        'This sections provides list of all talents available in the platform.',
      link: '/recr/candidates',
      rbacName: 'manage-candidates',
    },
    {
      image: 'bi bi-clipboard-data',
      title: 'Buddy Performance',
      description:
        'This sections provides list of all talents available in the platform.',
      link: '/recr/buddy-performance',
      rbacName: 'manage-clubs',
    },
    {
      image: 'bi bi-calendar',
      title: 'Events',
      description: 'View and manage events.',
      link: '/fw/calendar',
      rbacName: 'community',
    },
    {
      image: 'ri-user-2-fill',
      title: 'Talent Account',
      description:
        'This sections provides list of all talents who have registered with the platform.',
      link: '/fw/ta/account',
      rbacName: 'talent-accounts',
    },
    {
      image: 'bi bi-file-earmark-person',
      title: 'Future Uploads',
      description:
        'This sections provides list of all Future CV Uploaded with the platform.',
      link: '/recr/members-uploads',
      rbacName: 'client-verification',
    },
    {
      image: 'bi bi-gift',
      title: 'Rewards',
      description:
        'This sections provides list of all Rewards you won.',
      link: '/recr/rewards',
      rbacName: 'client-verification',
    },
  ];

  loadNorthStar(): void {
    var url =
      'mainservice/framework2/forward?api=recruitmentservice/discovery/northStarStatus?communityId=' +
      localStorage.getItem('communityId') +
      ',userId=' +
      this.commonService.user.id;

    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.northStar = data['dataArray'];
        if (this.northStar.length > 2)
          this.links[12].sup = this.northStar[2] + '/' + this.northStar[3];
      } else console.error('Error in getting data');

      for (var i = 0; i < this.links.length; ) {
        if (!this.commonService.rbac[this.links[i].rbacName]) {
          this.links.splice(i, 1);
        } else {
          i++;
        }
      }
    });
  }
  northStar: any = [];
}
