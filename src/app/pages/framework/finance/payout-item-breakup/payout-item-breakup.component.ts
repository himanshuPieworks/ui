import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-payout-item-breakup',
  templateUrl: './payout-item-breakup.component.html',
  styleUrls: ['./payout-item-breakup.component.scss']
})
export class PayoutItemBreakupComponent implements OnInit {
   @Input('data') data:any;
   @Input('correctionDueToPenalty') correctionDueToPenalty:any
   

  constructor(public commonService: PieworksCommonService) { 
    
  }

  ngOnInit(): void {
    this.getTotal(this.data);
  }
    total=0;
    getTotal(data:any):any
    {
        if(!data)
            return 0;
        var total = data?.candidateInteractionShare+data?.clientAnchorShare+data?.clientRefererShare+
                data?.communityLeaderShare+data?.discovererShare;
        this.total = total;
        return total;
    }
}