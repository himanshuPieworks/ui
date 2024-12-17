import {
  Component,
  ViewChild,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-buddy-performance-report',
  templateUrl: './buddy-performance-report.component.html',
  styleUrls: ['./buddy-performance-report.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class BuddyPerformanceReportComponent implements OnInit {
  // @ViewChild('outerSort', { static: true }) sort: MatSort;
  // @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  // @ViewChildren('innerTables') innerTables: QueryList<MatTable<CoBuddy>>;

  // dataSource: MatTableDataSource<User>;
  usersData: User[] = [];
  USERS: any;
  columnsToDisplay = [
    'buddy',
    'num_of_cobuddies',
    'discoveries',
    'cobuddy_discoveries',
    'total_discoveries',
    'monthly_target',
  ];
  //columnsToDisplay = [{name:'Pod',variable:'Pod'}, {name:'Open_Positions',variable:'Open_Positions'}, {name:'Discoveries',variable:'Discoveries'},{name:'Avg discovery per position',variable:'Avg discovery per position'}];
  innerDisplayedColumns = ['co_buddy', 'discoveries'];

  constructor(
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    public commonService: PieworksCommonService
  ) {}
  communityId: any;
  breadCrumbItems!: Array<{}>;
  ngOnInit() {
    this.communityId = this.route.snapshot.paramMap.get('id');
    this.year = new Date().getFullYear();
    this.years.push(this.year);
    this.years.push(this.year - 1);
    this.years.push(this.year - 2);
    this.years.push(this.year - 3);
    this.month = new Date().getMonth() + 1;
    this.loadData();
    this.breadCrumbItems = [
      { label: 'Manage', link: 'recr/manage', active: false },
      { label: 'buddy-performance', link: '/', active: true },
    ];
  }
  years: any = [];
  year: any;
  months: any = [
    { id: 1, name: 'Jan' }, //01-01-2024 00:00:00
    { id: 2, name: 'Feb' }, //01-02
    { id: 3, name: 'Mar' },
    { id: 4, name: 'Apr' },
    { id: 5, name: 'May' },
    { id: 6, name: 'Jun' },
    { id: 7, name: 'Jul' },
    { id: 8, name: 'Aug' },
    { id: 9, name: 'Sep' },
    { id: 10, name: 'Oct' },
    { id: 11, name: 'Nov' },
    { id: 12, name: 'Dec' },
  ];
  month: any;

  createdOnFrom: any;
  createdOnTill: any;
  loadData(): void {
    setTimeout(() => {
      var monthString = this.month + '';
      if (monthString.length == 1) monthString = '0' + monthString;
      this.createdOnFrom = this.year + '-' + monthString + '-01 00:00:00';
      monthString = this.month + 1 + '';
      if (monthString.length == 1) monthString = '0' + monthString;
      if (monthString == '13') {
        monthString = '01';
        this.createdOnTill = this.year + 1 + '-' + monthString + '-01 00:00:00';
      } else
        this.createdOnTill = this.year + '-' + monthString + '-01 00:00:00';
      var url =
        'mainservice/recruitment/buddy/performanceReport/' +
        2 +
        '?domain=RECRUITMENT&startDate=' +
        this.createdOnFrom +
        '&endDate=' +
        this.createdOnTill;
      this.commonService.showProcessingIcon();
      this.commonService.get(url).subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.USERS = data['dataArray'];
          // console.log(this.USERS)
        }
      });
    }, 200);
  }
}

export interface User {
  buddy: string;
  no_of_cobuddies: string;
  discoveries: string;
  cobuddy_discoveries: string;
  total_discoveries: string;
  target: string;
  // co_buddies?: CoBuddy[] | MatTableDataSource<CoBuddy>;
}

export interface CoBuddy {
  co_buddy: string;
  discoveries: string;
}
