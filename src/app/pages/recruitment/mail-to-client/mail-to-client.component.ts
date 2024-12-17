import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-mail-to-client',
  templateUrl: './mail-to-client.component.html',
  styleUrls: ['./mail-to-client.component.scss'],
})
export class MailToClientComponent implements OnInit {
  @Input('shortlist') shortlist: any;
  @Input('aceMakersEmailId') aceMakersEmailId: any;
  @Input('parentObj') parentObj: any;

  constructor(
    private commonService: PieworksCommonService,
    private router: Router
  ) {
    this.shortlisting = this.shortlist;
    
    this.aceMakersEmailIds = this.aceMakersEmailId;
    //this.requirementId = data.requirementId;

    //if(this.shortlisting && this.shortlisting.length>0)
    // this.communityClientContacts = this.shortlisting[0].requirement.client.communityClientContacts;
    if (
      this.shortlisting &&
      this.shortlisting.length > 0 &&
      this.shortlisting[0].requirement.client.communityClientContacts
    ) {
      this.communityClientContacts =
        this.shortlisting[0].requirement.client.communityClientContacts;
      // Rest of your code...
    }

    for (var i = 0; i < this.communityClientContacts.length; i++) {
      this.communityClientContacts[i].toCcBcc = 'To';
    }
    //this.loadRequirementDetails();
    this.commonService.loadMyProfile(this, function (myProfile: any, obj: any) {
      obj.otherEmailIds = myProfile.username;
    });
  }
  //requirement;requirementId;
  shortlisting: any = [];
  aceMakersEmailIds: any = [];
  communityClientContacts: any = [];
  ngOnInit(): void {
    
  }

  extraContents: any = '';
  message: any = '';
  newPassword: any = '';
  closeDialog: any = false;
  toEmailId: any = [];
  ccEmailId: any = [];
  bccEmailId: any = [];
  toccbcc: any = ['To', 'Cc', 'Bcc'];
  tempToCcBcc: any = '';
  otherToCcBcc: any = 'To';
  otherEmailIds: any = '';
  othersSelected: any = false;
  roles: any;
  findRoles() {
    
    this.roles = [];
    for (var i = 0; i < this.shortlisting?.length; i++) {
      
      if (
        !this.checkArrayContains(
          this.shortlisting[i].requirement.role.name,
          this.roles
        )
      ) {
        this.roles.push(this.shortlisting[i].requirement.role.name);
      }
    }
  }
  checkArrayContains(obj: any, array: any): boolean {
    for (var i = 0; i < array.length; i++) {
      if (array[i] == obj) return true;
    }
    return false;
  }
  enableAttachment: any = 'no';
  sendMail(getPreview: any): void {
    if (this.communityClientContacts.length == 0) {
      this.commonService.showErrorMessage('Error', 'No client contacts found');
      return;
    }
    this.message = '';
    this.toEmailId = [];
    this.ccEmailId = [];
    this.bccEmailId = [];
    let selectedAtleastOne = false;
    for (var i = 0; i < this.communityClientContacts.length; i++) {
      if (this.communityClientContacts[i].selected) {
        switch (this.communityClientContacts[i].toCcBcc) {
          case 'To':
            selectedAtleastOne = true;
            this.toEmailId.push(this.communityClientContacts[i].emailId);
            break;
          case 'Cc':
            selectedAtleastOne = true;
            this.ccEmailId.push(this.communityClientContacts[i].emailId);
            break;
          case 'Bcc':
            selectedAtleastOne = true;
            this.bccEmailId.push(this.communityClientContacts[i].emailId);
            break;
        }
      }
    }
    if (!selectedAtleastOne) {
      this.commonService.showErrorMessage(
        'Error',
        'No client contact selected'
      );
      return;
    }
    if (this.othersSelected) {
      //will never get selected as its hidden now.
      switch (this.otherToCcBcc) {
        case 'To':
          this.toEmailId.push(this.otherEmailIds);
          break;
        case 'Cc':
          this.ccEmailId.push(this.otherEmailIds);
          break;
        case 'Bcc':
          this.bccEmailId.push(this.otherEmailIds);
          break;
      }
    }
    if (this.toEmailId.length > 1) {
      this.message = "Please mention a single 'To' address.";
      return;
    }
    if (this.shortlisting[0].requirement.clientAnchor) {
      // add client anchor's email id to cc
      var clientAnchorEmailId =
        this.shortlisting[0].requirement.clientAnchor.username;
      if (
        this.toEmailId.toString().indexOf(clientAnchorEmailId) == -1 &&
        this.ccEmailId.toString().indexOf(clientAnchorEmailId) == -1 &&
        this.bccEmailId.toString().indexOf(clientAnchorEmailId) == -1
      )
        this.ccEmailId.push(clientAnchorEmailId);
    }
    if (this.shortlisting[0].requirement.standbyClientAnchor) {
      // add client anchor's email id to cc
      var standbyClientAnchor =
        this.shortlisting[0].requirement.standbyClientAnchor.username;
      if (
        this.toEmailId.toString().indexOf(standbyClientAnchor) == -1 &&
        this.ccEmailId.toString().indexOf(standbyClientAnchor) == -1 &&
        this.bccEmailId.toString().indexOf(standbyClientAnchor) == -1
      )
        this.ccEmailId.push(standbyClientAnchor);
    }
    for (
      var i = 0;
      i < this.aceMakersEmailIds.length;
      i++ //add acemakers email id to bcc
    ) {
      var leaderEmailid = this.aceMakersEmailIds[i];
      if (
        this.toEmailId.toString().indexOf(leaderEmailid) == -1 &&
        this.ccEmailId.toString().indexOf(leaderEmailid) == -1 &&
        this.bccEmailId.toString().indexOf(leaderEmailid) == -1
      )
        this.bccEmailId.push(leaderEmailid);
    }

    var url = 'mainservice/recruitment/shortlisting/emailDiscoveryReport';
    if (this.toEmailId.length > 0) url = url + '?to=' + this.toEmailId;
    else {
      //this.message = "Plese select a 'To' address.";
      //return;
      url = url + '?to=' + clientAnchorEmailId;
      this.toEmailId.push(clientAnchorEmailId);
    }
    if (this.ccEmailId.length > 0) url = url + '&cc=' + this.ccEmailId;
    if (this.bccEmailId.length > 0) url = url + '&bcc=' + this.bccEmailId;
    if (this.extraContents.length > 0)
      url = url + '&extraContents=' + this.extraContents;
    url =
      url +
      '&from=' +
      localStorage.getItem('usersname') +
      '&generatePreview=' +
      getPreview +
      '&enableAttachment=' +
      this.enableAttachment;
    if (getPreview == 'no') this.message = 'Sending mail ...';
    this.commonService.showProcessingIcon();
    let temp: any = [];
    for (var i = 0; i < this.shortlisting.length; i++) {
      if (this.shortlisting[i].selected) temp.push(this.shortlisting[i]);
    }
    this.commonService.post(url, temp).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        if (getPreview == 'no') {
          this.message = 'Mail sent.';
          this.closeDialog = true;
          this.commonService.showInfoMessage('Info', 'Mail sent..');
          this.parentObj.mailToClient.hide();
        } else {
          var newWindow: any = window.open('', '', 'status');
          var newContent = data['message'];
          newWindow.document.write(newContent);
          newWindow.document.close();
        }
      } else {
        this.message = 'Sending mail failed.';
        this.message = data['message'];
      }
    });
  }

  clientId: any;
}
