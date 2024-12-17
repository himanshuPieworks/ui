import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from '../../../common/pieworkscommon.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-rspp-view',
  templateUrl: './rspp-view.component.html',
  styleUrls: ['./rspp-view.component.scss'],
})
export class RsppViewComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    public commonService: PieworksCommonService
  ) {}

  ngOnInit(): void {
    this.rsppId = this.route.snapshot.paramMap.get('id');
    this.loadRspp();
    this.showBudget = this.commonService.getParameterFromUrl('showBudget');
    if (window.location.toString().indexOf('open') > 0) 
        this.isOpenUrl = true;
      if (!this.isOpenUrl)
      {
          this.showBudget = true;
      }
  }
  showBudget: any;
  isOpenUrl = false;
  loadRspp(): void {
    var url = 'mainservice/recruitment/open/requirement/' + this.rsppId;
    this.commonService.showProcessingIcon();
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.rspp = data['dataObject'];
        this.loadProcesses();
      }
    });
  }
  processes:any=[];
  loadProcesses(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get('mainservice/recruitment3/requirement/open/process/' + this.rsppId)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.processes = [];
        if (data['result'] === 200) {
          this.processes = data['dataArray'];
        }
      });
  }
  notValidated = true;
  welcome = '';
  rspp: any = {};
  roleDescriptions: any = [];
  roleDesc: any;
  rsppId: any;
  message = '';
  hidePrintDiv = true;
  setFileName:any;
  printConfirmation(printarea:any):void
  {
      Swal.fire({
          title: 'Confirmation required',
          text: 'Whom do you want the pdf to be shared with ?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'rgb(3, 142, 220)',
          cancelButtonColor: 'rgb(3, 142, 220)',
          confirmButtonText: 'Candidate',
          cancelButtonText: 'Client'
        }).then((result: any) => {
            this.commonService.showInfoMessage("Info","Please wait, the file is being downloaded.");
          if (result.value) {
              this.showBudget = false;
              this.printRspp(printarea);
          }
          else
          {
              this.printRspp(printarea);
          }
        });
  }
  printRspp(divName: any): void {
    //document.getElementById("printDiv").innerHTML = data["message"];
    // this.hidePrintDiv=false;
    // setTimeout(()=>{this.commonService.downloadAsPDF(document.getElementById("printDiv")?.innerHTML,1,()=>{
    //                 this.hidePrintDiv=true;});},500);

    setTimeout(() => {
      const tableElement = document.getElementById('printDiv');
      this.setFileName =  this.rspp.orgName+"-"+this.rspp.role.name.trim();
      if (tableElement) {
        this.commonService.downloadAsPDF(tableElement, 1, () => {
          this.hidePrintDiv = true;
          this.showBudget = true;
        },this.setFileName);
      }
    }, 500);
  }

  copyLink(forCandidate: boolean): void {
    var url =
      this.commonService.uiPrefix + 'recr/open/rspp-view/' + this.rsppId;
    if (forCandidate) url = url + '?showBudget=true';
    this.commonService.copyMessage(url);
    this.commonService.showInfoMessage('Info', 'Link copied to clipboard');
  }
}
