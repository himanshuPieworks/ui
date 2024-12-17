import {
  Component,
  QueryList,
  ViewChild,
  ViewChildren,
  TemplateRef,
  OnInit,
} from '@angular/core';
import { sales, orders, products } from './data';
import { Observable } from 'rxjs';
import { IndexService } from './index.service';
import { DecimalPipe } from '@angular/common';
import {
  NgbdIndexsSortableHeader,
  OrderSortEvent,
} from './index-sortable.directive';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers: [IndexService, DecimalPipe],
})
export class IndexComponent implements OnInit {
  constructor(
    private modalService: BsModalService,
    public commonService: PieworksCommonService,
    private router: Router
  ) {}


  ngOnInit(): void {}
}
