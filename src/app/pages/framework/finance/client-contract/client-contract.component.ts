import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-client-contract',
  templateUrl: './client-contract.component.html',
  styleUrls: ['./client-contract.component.scss'],
})
export class ClientContractComponent implements OnInit {
  breadCrumbItems!: Array<{}>;

  constructor(
    public commonService: PieworksCommonService,
    private httpClient: HttpClient
  ) {}

  file: any;
  message: any;
  logo: any;
  domain = 'Recruitment';
  domains = ['Recruitment'];

  ngOnInit(): void {

    //for loading client
    this.loadClients();

    //it for links backward and forward
    this.breadCrumbItems = [
      { label: 'Home', active: false, link: '/' },
      { label: 'Manage', active: false, link: '/recr/manage' },
      { label: 'Finance', active: false, link: '/fw/finance' },
      {
        label: 'Client-Contract',
        active: true,
        link: 'fw/client-contracts',
      },
    ];
    //for loading community memeber
    this.loadCommunityMembers();
    
  }


  //This method is for loading client details

  contracts: any = [];
  clientSearch: any = '';
  clients: any = [];
  clientHandle: any = [];
  loadClients(): void {
    this.commonService.showProcessingIcon();

    this.commonService
      .get(
        'mainservice/framework/client?searchText=' +
          this.clientSearch +
          '&communityId=-1'
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.clients = [];
        if (data['result'] === 200) {
          this.clients = data['dataArray'];
        }
      });
  }

  //contract object is for the input of contract details
  contract: any = {
    slabs: [
      { slabName: 'Upto 25', successFeePerc: '0', retainerFee: '0' },
      { slabName: '25 - 50', successFeePerc: '0', retainerFee: '0' },
      { slabName: '50 and above', successFeePerc: '0', retainerFee: '0' },
    ],
  };

  //this variable is to contract update.
  data: any;
  contractToUpload: any;
  urlPrefix: any;
  //this method is used to update contract data
  updateContract(): void {
    if (!this.contractToUpload && !this.contract.contractDoc) {
      this.commonService.showErrorMessage(
        'Error',
        'Please upload the contract document'
      );
      return;
    }
    if (!this.contract.clientGstNo) {
      this.commonService.showErrorMessage(
        'Error',
        'Please enter the client GST number'
      );
      return;
    }
    if (!this.contract.cvValidity) {
      this.commonService.showErrorMessage(
        'Error',
        'Please enter the validity of cv'
      );
      return;
    }
    if (!this.contract.placeOfSupply) {
      this.commonService.showErrorMessage(
        'Error',
        'Please enter the place of supply'
      );
      return;
    }
    if (!this.contract.billingAddress) {
      this.commonService.showErrorMessage(
        'Error',
        'Please enter billing address'
      );
      return;
    }
    for (var i = 0; i < this.contract.slabs.length; i++) {
      switch (i) {
        case 0:
          this.contract.slabs[i].lowerLimit = 0;
          this.contract.slabs[i].upperLimit = parseInt(
            this.contract.slabs[i].slabName.split(' ')[1].trim()
          );
          break;
        case 1:
          this.contract.slabs[i].lowerLimit = parseInt(
            this.contract.slabs[i].slabName.split('-')[0].trim()
          );
          this.contract.slabs[i].upperLimit = parseInt(
            this.contract.slabs[i].slabName.split('-')[1].trim()
          );
          break;
        case 2:
          this.contract.slabs[i].lowerLimit = parseInt(
            this.contract.slabs[i].slabName.split(' ')[0].trim()
          );
          this.contract.slabs[i].upperLimit = 500;
          break;
      }
    }
    this.callBackFunction(this.contract);

    document.getElementById('cancelButton')?.click();
  }

  //filter the change and show the previous contract .
  showPreviousContract:boolean = false;
  filterChanged(): void {
    var clientId = this.getClientId();
    this.commonService
      .get(
        'mainservice/finance/recruitment/contract?clientId=' +
          clientId +
          '&communityId=-1'
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.contracts = [];
        if (data['result'] === 200) {
          this.contracts = data['dataArray'];
          if(this.contracts.length == 0)
          this.showPreviousContract = false;
        else
          this.showPreviousContract = true;
          console.log(this.contracts)
        }
      });
  }

  //this for document which is uploaded
  uploadForm: FormGroup = new FormGroup({});

  //this is for on click on add doc image.
  clickedImage(): void {
    document.getElementById('fileinput')?.click();
  }

  //on selecting the contract file or doc
  onContractSelect(event: any) {
    if (event.target.files.length == 0) {
      return;
    }

    this.file = event.target.files[0];

    if (this.file.size > 60720000) {
      //300*100 Kb limit
      this.message =
        'File size too big. Please choose a file less than 600 KB.';
      this.commonService.showErrorMessage('Error', this.message);
      return;
    }

    this.contractToUpload = this.file;
    if (this.contractToUpload.name.indexOf('.pdf') == -1) {
      this.commonService.showErrorMessage(
        'Error',
        'Please provide a pdf file.'
      );
      return;
    }
    this.uploadFile();
  }

  //on uploading file it is called in callback
  uploadFile() {
    if (this.contractToUpload && this.contractToUpload != null) {
      const formData: FormData = new FormData();

      if (this.contractToUpload && this.contractToUpload !== null) {
        var fileName = this.contractToUpload.name;
        fileName = this.commonService.removeSpecialChar(fileName, '-.', '-');
        formData.append('contractFile', this.contractToUpload, fileName);
      }
      //formData.append('id', this.data.requirementId);
      formData.append('clientId', this.clientId);
      let headers = new HttpHeaders({
        Accept: 'application/json',
        Authorization: localStorage.getItem('accesstoken') + '',
      });
      let options = { headers: headers };
      this.commonService.showProcessingIcon();
      this.message =
        'Extracting data from document, This might take some time.';
      this.commonService
        .post2(
          'mainservice/finance/recruitment/uploadContract',
          formData,
          options
        )
        .subscribe((data: any) => {
          this.message = '';
          this.commonService.hideProcessingIcon();
          this.contract = data['dataObject'];
          this.contract.contractDoc = data['message'];
          if (
            !(
              data['dataObject'] &&
              data['dataObject'].slabs &&
              data['dataObject'].slabs.length == 3
            )
          )
            this.contract.slabs = [
              { slabName: 'Upto 25', successFeePerc: '0', retainerFee: '0' },
              { slabName: '25 - 50', successFeePerc: '0', retainerFee: '0' },
              {
                slabName: '50 and above',
                successFeePerc: '0',
                retainerFee: '0',
              },
            ];
        });
    }
  }

  //this method is for getting client id which is selected in dropdown
  client: any;
  @ViewChild('addContract') addContract: any;
  getClientId(): any {
    for (var i = 0; i < this.clients.length; i++) {
      if (this.clients[i]?.name == this.client?.name) {
        return this.clients[i].id;
      }
    }
    return -1;
  }

  //showing the contract upload modal if client is selected
  clientId: any;
  showContractWindow(): void {
    this.clientId = this.getClientId();

    console.log(this.clientId);

    if (this.clientId < 1) {
      this.commonService.showErrorMessage(
        'Error',
        'Please select a client to update the contract.'
      );
      return;
    } else {
      this.addContract.show();
    }
  }

  showNewContractWindow(contractToPass:any):void
    {
        this.contract = contractToPass;
        var clientId = this.getClientId();
        if(clientId<1)
        {
            this.commonService.showErrorMessage("Error","Please select a client to update the contract.");
            return;
        }
        else
        {
           this.addContract.show()
             
        }
    }
  //call Back Function where put data of contract in db
  userIds: any = '';
  callBackFunction( contract: any): void {
    if (!contract.id) {
      contract.logTime = this.commonService.getFormatedDate(
        new Date(),
        'yyyy-MM-dd hh:mm:ss'
      );
    }
    contract.clientId = this.getClientId();
    var slabs = contract.slabs;
    contract.slabs = undefined;
    var url = 'mainservice/finance/recruitment/contract';
    this.commonService.post(url, contract).subscribe((data: any) => {
      if (data['result'] === 200) {
        for (var i = 0; slabs && i < slabs.length; i++) {
          slabs[i].contractId = data['dataObject'].id;
          if (!slabs[i].id) {
            slabs[i].logTime = this.commonService.getFormatedDate(
              new Date(),
              'yyyy-MM-dd hh:mm:ss'
            );
          }
        }
        url = 'mainservice/finance/recruitment/contract/slab';
        this.commonService.post(url, slabs).subscribe((data: any) => {
          if (data['result'] === 200) {
            this.commonService.hideProcessingIcon();
          }
          var message = 'Contract has been updated for ' + this.client.name;
          this.commonService.sendNotification(
            this.userIds,
            message,
            null,
            'COMMUNITY MEMBER',
            1,
            1
          );
          this.filterChanged();
        });
      }
    });
  }

  //Load Community Members (onInt we are calling it)
  membersTemp: any = [];
  loadCommunityMembers(): void {
    this.commonService.showProcessingIcon();
    var acceptanceByAceValues = '1';
    var acceptanceByAceMakerValues = '1';
    var roleInCommunity = '0,1';
    this.commonService
      .get(
        'mainservice/framework/members/-1?acceptanceByAceValues=' +
          acceptanceByAceValues +
          '&acceptanceByAceMakerValues=' +
          acceptanceByAceMakerValues +
          '&userId=-1&roleInCommunity=' +
          roleInCommunity
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.membersTemp = data['dataArray'];
          // console.log(this.membersTemp)
          if (!this.membersTemp || this.membersTemp.length == 0) {
            return;
          }
        }
        this.userIds = '';
        for (var i = 0; i < this.membersTemp.length; i++) {
          if (this.membersTemp[i].isAceMaker) {
            if (this.userIds.length == 0)
              this.userIds = this.membersTemp[i].user.id;
            else
              this.userIds = this.userIds + ',' + this.membersTemp[i].user.id;
          }
        }
      });
  }

     // it returns the client on search text
  clientLocalSearch(term: string, item: any) {
    return item.name.toUpperCase().indexOf(term.toUpperCase().trim())!=-1;
  }

  // on client search
  onClientSearch(item: any) {
    this.clientSearch = item.term;
      this.loadClients();
  }
  
}
