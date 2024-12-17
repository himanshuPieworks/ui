import { Component } from '@angular/core';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-redeem-rewards',
  templateUrl: './redeem-rewards.component.html',
  styleUrls: ['./redeem-rewards.component.scss'],
})
export class RedeemRewardsComponent {
  constructor(public commonService: PieworksCommonService) {
    this.pendingScratchCard();
  }

  pendingCard: any;

  pendingScratchCard() {
    var url =
      'mainservice/framework2/forward?api=frameworkservice/scratchCard/getScratchCards?userId=' +
      this.commonService.user.id;
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.pendingCard = data['dataObject'];
        // alert(this.pendingCard)
        this.pendingCardArray;
      }
    });
  }
  get pendingCardArray(): number[] {
    return Array.from({ length: this.pendingCard }, (_, i) => i + 1);
  }

  scratchCards = [
    {
      message: '🎉 You unlocked a 50% discount! 🎉',
      imagePath: 'assets/images/Group.png',
    },
    {
      message: '🎁 You won a free gift! 🎁',
      imagePath: 'assets/images/Group.png',
    },
    {
      message: '💸 You earned a cashback! 💸',
      imagePath: 'assets/images/Group.png',
    },
  ];

  reward:any;
  piecoineAmount()
  {
    var url = 'mainservice/framework2/forward?api=frameworkservice/scratchCard/getScratchCardValue?userId='+this.commonService.user.id;
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.reward = data['dataObject'];
        alert(this.reward)
      }
    });
  }

  onScratchComplete(): void {
    console.log(`Scratch card completed:`);
    this.piecoineAmount();
    // Add your logic here (e.g., navigate, display modal, etc.)
  }
}
