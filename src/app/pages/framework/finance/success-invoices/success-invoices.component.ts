import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-success-invoices',
  templateUrl: './success-invoices.component.html',
  styleUrls: ['./success-invoices.component.scss'],
})
export class SuccessInvoicesComponent implements OnInit {
  constructor(public commonService: PieworksCommonService) {}

  breadCrumbItems!: Array<{}>;
  bankAccount: any = 'pieworks';
  dueDate: any = '';
  date: any = '';
  invoiceNumber: any = '';
  showTables: boolean = false;
  status = ['TO_SEND', 'SENT_TO_CLIENT', 'PAYMENT_RECEIVED','PAYMENT_REVOKED'];

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home', active: false, link: '/' },
      { label: 'Manage', active: false, link: '/recr/manage' },
      { label: 'Finance', active: false, link: '/fw/finance' },
      {
        label: 'Success Invoices',
        active: true,
        link: '/recr/manage/finance/success-invoices',
      },
    ];

    this.loadEligibleClients();

    var future = new Date();
    future.setDate(future.getDate() + 30);
    this.dueDate = this.commonService.getFormatedDate(future, 'dd-MM-yyyy');
    this.date = this.commonService.getFormatedDate(new Date(), 'dd-MM-yyyy');
  }

  // this function load clients in search box
  loadEligibleClients(): void {
    var todayDate = new Date().toISOString().slice(0, 10);
    var d = new Date(todayDate);
    d.setMonth(d.getMonth() - 3);
    d.setDate(16);
    this.startingDate = d.toISOString().slice(0, 10);

    this.endingDate = this.commonService.getFormatedDate(
      new Date(),
      'yyyy-MM-dd hh:mm:ss'
    );
    if (this.clientHandle) this.clientHandle.unsubscribe();
    this.commonService.showProcessingIcon();
    var date = new Date();
    var lastMonth = date.getMonth(); //it gives 4 for May. 4 for us is April
    var lastYear = date.getFullYear();
    if (lastMonth == 0) {
      lastMonth = 12;
      lastYear = lastYear - 1;
    }
    if (lastMonth < 10)
      this.startingDate = lastYear + '-0' + lastMonth + '-01 00:00:00';
    else this.startingDate = lastYear + '-' + lastMonth + '-01 00:00:00';
    this.startingDate = '2022-01-01 00:00:00';
    this.clientHandle = this.commonService
      .get(
        'mainservice/finance/recruitment/clientsForSuccessFee?startingDate=' +
          this.startingDate +
          '&endingDate=' +
          this.endingDate
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.clients = [];
        if (data['result'] === 200) {
          this.clients = data['dataArray'];
        }
      });
  }

  //this filter the client from search box and calls loadSuccessfulDiscoveriesOfClient()
  //and loadInvoices() both function
  filterChanged(): void {
    setTimeout(() => {
      this.loadSuccessfulDiscoveriesOfClient();
      this.loadInvoices();
    }, 1000);
  }

  // load invoice function as it say's load all the invoices
  invoices: any = [];
  clientId = -1;
  pageNum = 1;
  block: boolean = false;
  loadInvoices(): void {
    if (this.client) this.clientId = this.client.id;
    else this.clientId = -1;
    this.commonService.showProcessingIcon();
    var url =
      'mainservice/finance/recruitment/invoice?type=BOTH&clientId=' +
      this.clientId +
      '&pageNum=' +
      this.pageNum +
      '&pageSize=15';
    url = url + '&searchText=' + this.clientSearch;
    this.block = true;
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.invoices = data['dataArray'];
      }
    });
  }

  discoveries: any = [];
  endingDate: any = '';
  startingDate: any = '';
  clientHandle: any;
  clients: any = [];
  client: any;

  // all the successful clients which discovered
  loadSuccessfulDiscoveriesOfClient(): void {
    this.commonService
      .get(
        'mainservice/finance/recruitment/discoveriesForSuccessFee?clientId=' +
          this.client.id +
          '&startingDate=' +
          this.startingDate +
          '&endingDate=' +
          this.endingDate
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.discoveries = [];
        if (data['result'] === 200) {
          this.discoveries = data['dataArray'];
          this.showTables = true;
          this.loadContract();
        }
      });
  }

  //load's all the contract with client. = look into it please
  contract: any = {};
  loadContract(): void {
    this.commonService.showProcessingIcon();
    this.contract = {};
    var url =
      'mainservice/finance/recruitment/contract?clientId=' + this.client.id;
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        if (data['dataArray'] && data['dataArray'].length > 0) {
          this.contract = data['dataArray'][0];
          for (var i = 0; i < this.discoveries.length; i++) {
            for (var j = 0; j < this.contract.slabs.length; j++) {
              var joinedAtCtcLpa = this.discoveries[i].joinedAtCtc;
              if (joinedAtCtcLpa > 1000)
                joinedAtCtcLpa = joinedAtCtcLpa / 100000;
              if (
                joinedAtCtcLpa > this.contract.slabs[j].lowerLimit &&
                joinedAtCtcLpa <= this.contract.slabs[j].upperLimit
              ) {
                this.discoveries[i].requirement.percentageBilling =
                  this.contract.slabs[j].successFeePerc;
                break;
              }
            }
          }
          // we have to look into it
          if (this.discoveries.length > 0)
            this.commonService.showInfoMessage(
              'Info',
              'Success fee calculated based on the latest contract available.'
            );
        }
        this.calculateTotal();
      }
    });
  }

  total: any;
  // calculate the total of the bill and calls addTempItems
  calculateTotal(): void {
    this.total = 0;
    for (var i = 0; i < this.discoveries.length; i++) {
      if (!this.discoveries[i].requirement.percentageBilling)
        this.discoveries[i].requirement.percentageBilling = '0';
      if (!this.discoveries[i].ignore)
        this.total =
          this.total +
          this.getSuccessFee(this.discoveries[i]) -
          this.discoveries[i].requirement.retainerFee;
    }
    this.addTempItems();
  }

  // it give us success fee
  getSuccessFee(disc: any): any {
    if (!disc.requirement.percentageBilling)
      disc.requirement.percentageBilling = '0';
    return (
      (disc.joinedAtCtc *
        parseFloat(
          disc.requirement.percentageBilling.toString().replace('%', '').trim()
        )) /
      100
    );
  }

  // add's all the GST and selected item
  taxType: any = 'GST';
  tempItems: any = [];
  addTempItems(): void {
    this.tempItems = [];
    for (var i = 0; i < this.discoveries.length; i++) {
      if (
        this.discoveries[i].retainerFee *
          this.discoveries[i].noOfVaccancyPending ==
        0
      )
        continue;
      if (!this.discoveries[i].ignore) {
        var obj: any = {};
        obj.discovery = this.discoveries[i];
        obj.particulars =
          'Success Fee - ' + this.discoveries[i].requirement.role.name;
        obj.saccode = '998311';
        obj.qty = 1;

        if (this.discoveries[i].joinedAtCtc < 1000)
          this.discoveries[i].joinedAtCtc =
            this.discoveries[i].joinedAtCtc * 100000; //converting into actual figures

        var successFee = this.discoveries[i].requirement.percentageBilling + '';
        successFee = successFee.split('%').join('').trim();
        obj.amount =
          Math.round(
            (parseFloat(successFee) * this.discoveries[i].joinedAtCtc) / 100
          ) - this.discoveries[i].requirement.retainerFee;
        if (obj.amount == 0) continue;
        this.tempItems.push(obj);
      }
    }
  }

  // it returns the client on search text
  clientLocalSearch(term: string, item: any) {
    return item.name.toUpperCase().startsWith(term.toUpperCase());
  }

  // on client search
  clientSearch = '';
  onClientSearch(item: any) {
    this.clientSearch = item.term;
      this.loadEligibleClients();
  }

  // this function download invoice as pdf
  hidePrintDiv: any = false;
  public downloadAsPDF(content: any, count: any) {
    this.hidePrintDiv = false;
    //        this.generarPDF();
    var date = Math.random() * 100;
    let DATA: any = document.getElementById('printDiv');
    this.commonService.showProcessingIcon();
    html2canvas(DATA, { allowTaint: true }).then((canvas) => {
      try {
        let fileWidth = 208;
        let fileHeight = (canvas.height * fileWidth) / canvas.width;
        const FILEURI = canvas.toDataURL('image/png'); //('image/png');
        if (FILEURI.toString().length < 10 && count == 1) {
          count = count + 1;
          return this.downloadAsPDF(content, count);
        }
        let PDF = new jsPDF('p', 'mm', 'a4');
        let position = 0;
        PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
        PDF.save('retainer-invoice-' + this.client.name + '.pdf');
        this.hidePrintDiv = true;
        const printDiv = document.getElementById('printDiv');
        if (printDiv) {
          printDiv.innerHTML = '';
        } else {
          console.error("Element with ID 'printDiv' not found.");
        }
        this.commonService.hideProcessingIcon();
      } catch (e) {
        this.commonService.showErrorMessage(
          'Error',
          "Couldn't show preview. Please try again."
        );
        this.commonService.hideProcessingIcon();
      }
    });
  }

  invoiceInDollar = false;
  conversionRate = 80;
  // get in USD
  getInUsd(inr: any, roundOff: any) {
    if (!inr) return inr;
    if (this.invoiceInDollar) {
      if (roundOff)
        return Math.round((inr / this.conversionRate) * 100) / 100.0 + ' USD';
      else
        return Math.round((inr * 100) / this.conversionRate) / 100.0 + ' USD';
    } else {
      if (roundOff) return Math.round(inr) + ' INR';
      else return inr + ' INR';
    }
  }

  // for saving the invoices this function is used
  saveInvoice(invoice: any): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/finance/recruitment/saveInvoiceStatus', invoice)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] !== 200) {
          this.commonService.showErrorMessage(
            'Error',
            'Couldnt update the status. Please try again later.'
          );
        }
      });
  }

  // get the conversion rate in usd
  getInUsdWithConversionRate(
    inr: any,
    conversionRate: any,
    invoiceInDollar: any
  ) {
    if (!inr) return inr;
    if (invoiceInDollar == 'yes')
      return Math.round((inr / conversionRate) * 100) / 100.0 + ' USD';
    else return Math.round(inr * 100) / 100.0 + ' INR';
  }

  // for generating invoice
  generateInvoice(): void {
    /*if(!this.invoiceNumber || this.invoiceNumber.length==0)
        {
            this.commonService.showNotificationWindow("Please enter the invoice number");
            return;
        }*/
    if (this.invoiceNumber && this.invoiceNumber.length > 0) {
      if (
        this.invoiceNumber.split('/').length !== 2 ||
        this.invoiceNumber.split('-').length !== 2
      ) {
        this.commonService.showErrorMessage(
          'Error',
          'Please mention the invoice number in the format xxx/YYYY-YY'
        );
        return;
      }
    }
    this.commonService.showProcessingIcon();
    var url =
      'mainservice/finance/recruitment/successinvoice/generate?taxType=' +
      this.taxType +
      '&date=' +
      this.date +
      '&dueDate=' +
      this.dueDate +
      '&clientId=' +
      this.client.id +
      '&bankAccount=' +
      this.bankAccount +
      '&invoiceInUsd=' +
      (this.invoiceInDollar ? 'yes' : 'no') +
      '&conversionRate=' +
      this.conversionRate;
    if (!this.invoiceNumber || this.invoiceNumber.length == 0) {
      url = url + '&invoiceNumber=null';
    } else {
      url = url + '&invoiceNumber=' + this.invoiceNumber;
    }
    this.commonService.post(url, this.tempItems).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.loadSuccessfulDiscoveriesOfClient();
        this.loadInvoices();
        this.showGeneratedInvoice(data['dataObject'].id);
      } else {
        // this.commonService.showInfoMessage(data["message"]);
      }
    });
  }
  // for showing the invoice
  showGeneratedInvoice(invoiceId: any): void {
    this.commonService.showProcessingIcon();
    var url =
      'mainservice/finance/recruitment/printablePreviousInvoice/' + invoiceId;
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.commonService.hideProcessingIcon();
        const printDiv = document.getElementById('printDiv');
        if (printDiv) {
          printDiv.innerHTML = data['message'];
        } else {
          console.error("Element with ID 'printDiv' not found.");
        }
        this.downloadAsPDF(data['message'], 1);
          this.commonService.showInfoMessage("Update","Generated success invoice")
        //               var newWindow = window.open("","","status");
        //               var newContent = data["message"];
        //               newWindow.document.write(newContent);
        //               newWindow.document.close();
      }
    });
  }

  //saving the invoice send receive status
  saveInvoiceStatus(invoice: any): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/finance/recruitment/saveInvoiceStatus', invoice)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.commonService.showSuccessMessage(
          'Success',
          'Successfully Updated Status'
        );
        if (data['result'] !== 200) {
          this.commonService.showErrorMessage(
            'Error',
            "Couldn't update the status. Please try again later."
          );
        }
      });
  }

  // Get Preview of invoices
  getPreview(): void {
    this.commonService.showProcessingIcon();
    this.contract.billingAddress = this.contract.billingAddress
      .replace('&', '%26')
      .replace('#', '%23');
    var url =
      'mainservice/finance/recruitment/successInvoicePreview?taxType=' +
      this.taxType +
      '&date=' +
      this.date +
      '&dueDate=' +
      this.dueDate +
      '&invoiceNumber=' +
      this.invoiceNumber +
      '&type=SUCCESS_FEE&billingAddress=' +
      this.contract.billingAddress +
      '&clientGstNumber=' +
      this.contract.clientGstNo +
      '&placeOfSupply=' +
      this.contract.placeOfSupply +
      '&bankAccount=' +
      this.bankAccount;
    if (this.invoiceInDollar)
      url = url + '&considerUsd=yes&conversionRate=' + this.conversionRate;
    else url = url + '&considerUsd=no&conversionRate=' + this.conversionRate;
    this.commonService.post(url, this.tempItems).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.commonService.hideProcessingIcon();
        var newWindow = window.open('', '', 'status');
        var newContent = data['message'];
        newWindow?.document.write(newContent);
        newWindow?.document.close();
      }
    });
  }

  // it is for confirmation the invoice generation
  confirmInvoiceGeneration(): void {
    if (this.client.id < 1) {
      this.commonService.showErrorMessage('Error', 'Please select a client');
      return;
    }
    if (!this.contract.billingAddress) {
      this.commonService.showErrorMessage('Error', 'Please upload a contract.');
      return;
    }
    if (this.total == 0) {
      this.commonService.showErrorMessage(
        'Error',
        'Invalid total amount for invoice generation.'
      );
      return;
    }
    
    Swal.fire({
        title: 'Confirmation',
        text:
          'Hope you have verified the invoice via preview option. Are you sure you want to proceed with invoice generation ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'rgb(3, 142, 220)',
        cancelButtonColor: 'rgb(243, 78, 78)',
        confirmButtonText: 'Yes',
      }).then((result:any) => {
        if (result.value) {
          this.generateInvoice();
        }
      });
  }

  // Ignore selected invoice not to be added in the bill
  ignoreSelected(): void {
    for (var i = 0; i < this.discoveries.length; i++) {
      if (this.discoveries[i].selected) this.discoveries[i].ignore = true;
    }
    this.calculateTotal();
  }
}
