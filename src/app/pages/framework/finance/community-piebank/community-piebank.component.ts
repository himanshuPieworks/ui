import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';
import { PieBankComponent } from '../pie-bank/pie-bank.component';

@Component({
  selector: 'app-community-piebank',
  templateUrl: './community-piebank.component.html',
  styleUrls: ['./community-piebank.component.scss'],
})
export class CommunityPiebankComponent {
  constructor(
    private route: ActivatedRoute,
    public commonService: PieworksCommonService
  ) {
    this.loadCommunityMembers();
  }

  // Access the child component
  @ViewChild(PieBankComponent) pieBankComponent!: PieBankComponent;

  // You can also trigger the child method via a parent method or an event
  triggerChildMethod() {
    this.pieBankComponent.triggerMethodFromParent();
  }
  selectedCommunityMemberId: any;

  members: any;
  users: any;
  loadCommunityMembers(): void {
    this.commonService.showProcessingIcon();
    var acceptanceByAceValues = '1';
    var acceptanceByAceMakerValues = '1';
    this.commonService
      .get(
        'mainservice/framework/members2/' +
          localStorage.getItem('communityId') +
          '?acceptanceByAceValues=' +
          acceptanceByAceValues +
          '&searchText=' +
          this.memberSearch +
          '&acceptanceByAceMakerValues=' +
          acceptanceByAceMakerValues +
          '&userId=-1' +
          '&pageNum=1' +
          '&pageSize=10&approvedOnMonth=&jobFamily='
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.members = data['dataArray'];
          this.users = [];
          for (var i = 0; i < this.members.length; i++) {
            this.users.push(this.members[i].user);
          }
        }
      });
  }

  memberSearch: any = '';
  onMemberSearch(item: any) {
    this.memberSearch = item.term;
    this.loadCommunityMembers();
  }

  // when client is already loaded locally then this method made it local search
  memberLocalSearch(term: string, item: any) {
    return item.name.toString().toUpperCase().indexOf(term.toUpperCase()) > -1;
  }

  viewPiebankCommunity: boolean = false;
  communityId: any;
  viewPieBankDetails() {
    // alert(this.selectedCommunityMemberId);

    setTimeout(() => {
      this.communityId = this.selectedCommunityMemberId;
      this.viewPiebankCommunity = true;
      this.triggerChildMethod();
      // alert(this.communityId)
    }, 100);
  }
}
