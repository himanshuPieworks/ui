import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-retainer-invoices',
  templateUrl: './retainer-invoices.component.html',
  styleUrls: ['./retainer-invoices.component.scss'],
})
export class RetainerInvoicesComponent implements OnInit {
  constructor(public commonService: PieworksCommonService) {}

  breadCrumbItems!: Array<{}>;
  dueDate: any;
  date: any;
  bankAccount: any = 'pieworks';
  invoiceNumber: any = '';

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home', active: false, link: '/' },
      { label: 'Manage', active: false, link: '/recr/manage' },
      { label: 'Finance', active: false, link: '/fw/finance' },
      {
        label: 'Retainer Invoice',
        active: true,
        link: 'fw/retainer-invoices',
      },
    ];

    var future = new Date();
    future.setDate(future.getDate() + 30);
    this.dueDate = this.commonService.getFormatedDate(future, 'dd-MM-yyyy');
    this.date = this.commonService.getFormatedDate(new Date(), 'dd-MM-yyyy');

    this.loadClients();
    // this.loadInvoices();
  }

  pageNum = 1;
  pageSize = 12;
  paginationMessage = '';
  next(): void {
    if (this.paginationMessage.length > 0) {
      var temp = this.paginationMessage.split(' of ');
      if (parseInt(temp[1]) <= this.pageNum) return;
    }
    this.pageNum = this.pageNum + 1;
  }
  previous(): void {
    if (this.pageNum == 1) return;
    this.pageNum = this.pageNum - 1;
  }
  first(): void {
    this.pageNum = 1;
  }
  last(): void {
    var temp = this.paginationMessage.split(' of ');
    this.pageNum = parseInt(temp[1]);
  }
  // it returns the client on search text
  clientLocalSearch(term: string, item: any) {
    return item.name.toUpperCase().startsWith(term.toUpperCase());
  }

  // on client search
  clientSearch: any = '';
  onClientSearch(item: any) {
    this.clientSearch = item.term;
      this.loadClients();
  }
  filterChanged(): void {
    setTimeout(() => {
    if(this.client)
        this.clientId = this.client.id;
      this.pageNum = 1;
      this.loadUnbilledItems();
      this.loadInvoices();
      this.loadClients();
    }, 1000);
  }
  clientHandle: any;
  clients: any = [];
  client: any = '';
  endingDate: any = '';
  startingDate: any = '';
  clientId: any = -1;
  loadClients(): void {
    var todayDate = new Date().toISOString().slice(0, 10);
    var d = new Date(todayDate);
    d.setMonth(d.getMonth() - 12);
    d.setDate(16);
    this.startingDate = d.toISOString().slice(0, 10);

    this.endingDate = this.commonService.getFormatedDate(
      new Date(),
      'yyyy-MM-dd hh:mm:ss'
    );
    if (this.clientHandle) this.clientHandle.unsubscribe();
    this.commonService.showProcessingIcon();
    this.clientHandle = this.commonService
      .get(
        'mainservice/finance/recruitment/clientsWithOpenRequirements?searchText=' +
          this.clientSearch +
          '&startingDate=' +
          this.startingDate +
          '&endingDate=' +
          this.endingDate
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.clients = [];

        //  if(data["result"]===200)
        {
          this.clients = data['dataArray'];
        }
      });
  }

  unbilledHandle: any;

  loadUnbilledItems(): void {
    var todayDate = new Date().toISOString().slice(0, 10);
    var d = new Date(todayDate);
    d.setMonth(d.getMonth() - 3);
    d.setDate(16);
    this.startingDate = d.toISOString().slice(0, 10);

    this.endingDate = this.commonService.getFormatedDate(
      new Date(),
      'yyyy-MM-dd hh:mm:ss'
    );
    if (this.unbilledHandle) this.unbilledHandle.unsubscribe();
    this.commonService.showProcessingIcon();
    for (var i = 0; i < this.clients.length; i++) {
      // if(this.clients[i].name==this.client)
      // {
      //     this.clientId=this.clients[i].id;
      //     break;
      // }
    }
    this.unbilledHandle = this.commonService
      .get(
        'mainservice/finance/recruitment/unbilledItems?clientId=' +
          this.clientId +
          '&startingDate=' +
          this.startingDate +
          '&endingDate=' +
          this.endingDate
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        this.unbilledItems = [];
        if (data['result'] === 200) {
          this.unbilledItems = data['dataArray'];
          console.log(this.unbilledItems);
          this.calculateTotal();
          this.loadContract();
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

  total: any;

  calculateTotal(): void {
    this.total = 0;
    for (var i = 0; i < this.unbilledItems.length; i++) {
      if (!this.unbilledItems[i].ignore)
        this.total =
          this.total +
          this.unbilledItems[i].retainerFee *
            this.unbilledItems[i].noOfVaccancyPending;
    }
    this.addTempItems();
  }

  taxType = 'GST';
  tempItems: any = [];
  addTempItems(): void {
    this.tempItems = [];
    for (var i = 0; i < this.unbilledItems.length; i++) {
      //            if(this.unbilledItems[i].retainerFee*this.unbilledItems[i].noOfVaccancyPending==0)
      //                continue;
      if (!this.unbilledItems[i].ignore) {
        // console.log(this.unbilledItems[i].ignore);
        var obj: any={};
        obj.requirement = this.unbilledItems[i];
        obj.particulars =
          'Retainer Fee - ' +
          this.unbilledItems[i].role.name +
          ' - ' +
          this.getRetainerMonthDisplayString(
            this.unbilledItems[i].retainerMonth
          );
        obj.saccode = '998311';
        obj.qty = this.unbilledItems[i].noOfVaccancyPending;
        obj.amount =
          this.unbilledItems[i].retainerFee *
          this.unbilledItems[i].noOfVaccancyPending;

        this.tempItems.push(obj);
      }
    }
  }

  ignoreSelected(): void {
    for (var i = 0; i < this.unbilledItems.length; i++) {
      if (this.unbilledItems[i].selected) this.unbilledItems[i].ignore = true;
    }
    this.calculateTotal();
  }

  // Get Preview of invoices
  getPreviewNew(): void {
    this.commonService.showProcessingIcon();
    if(this.contract.billingAddress)
    {
    this.contract.billingAddress = this.contract.billingAddress
      .replace('&', '%26')
      .replace('#', '%23');
    }
    else
    {
        this.contract.billingAddress = "Not available";
    }
    var url =
      'mainservice/finance/recruitment/retainerInvoicePreview?type=RETAINER&taxType=' +
      this.taxType +
      '&billingAddress=' +
      this.contract.billingAddress +
      '&clientGstNumber=' +
      this.contract.clientGstNo +
      '&placeOfSupply=' +
      this.contract.placeOfSupply +
      '&bankAccount=' +
      this.bankAccount +
      '&date=' +
      this.date +
      '&dueDate=' +
      this.dueDate +
      '&invoiceNumber=' +
      this.invoiceNumber;
    if (this.invoiceInDollar)
      url = url + '&considerUsd=yes&conversionRate=' + this.conversionRate;
    else url = url + '&considerUsd=no&conversionRate=' + this.conversionRate;
    this.commonService.post(url, this.tempItems).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.commonService.hideProcessingIcon();
        // document.getElementById("printDiv").innerHTML = data["message"];
        //this.downloadAsPDF(data["message"],1);
        const printDiv = document.getElementById('printDiv');
        if (printDiv) {
          printDiv.innerHTML = data['message'];
        } else {
          console.error("Element with ID 'printDiv' not found.");
        }

        var newWindow = window.open('', '', 'status');
        var newContent = data['message'];
        newWindow?.document.write(newContent);
        newWindow?.document.close();
        this.hidePrintDiv=true;
      }
    });
  }

  getRetainerMonthDisplayString(month: any): string {
    var result = '';
    try {
      switch (month) {
        case 1:
          result = '1<sup>st</sup> Month';
          break;
        case 2:
          result = '2<sup>nd</sup> Month';
          break;
        case 3:
          result = '3<sup>rd</sup> Month';
          break;
      }
    } catch (e) {}
    return result;
  }

  //load's all the contract with client. = look into it please
  contract: any = {};
  unbilledItems: any = [];
  loadContract(): void {
    this.commonService.showProcessingIcon();
    this.contract = {};
    var url =
      'mainservice/finance/recruitment/contract?clientId=' + this.clientId;
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        if (data['dataArray'] && data['dataArray'].length > 0) {
          this.contract = data['dataArray'][0];
          for (var i = 0; i < this.unbilledItems.length; i++) {
            for (var j = 0; j < this.contract.slabs.length; j++) {
              if (
                this.unbilledItems[i].maxLpa >
                  this.contract.slabs[j].lowerLimit &&
                this.unbilledItems[i].maxLpa <=
                  this.contract.slabs[j].upperLimit
              ) {
                this.unbilledItems[i].retainerFee =
                  this.contract.slabs[j].retainerFee;
                break;
              }
            }
          }
          this.calculateTotal();
          if (this.unbilledItems.length > 0)
            this.commonService.showInfoMessage(
              'Info',
              'Retainer fee calculated based on the latest contract available.'
            );
        }
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

  confirmInvoiceGeneration(): void {
    if (this.clientId < 1) {
      this.commonService.showErrorMessage('Error', 'Please select a client');
      return;
    }
    if (!this.contract.billingAddress) {
      this.commonService.showErrorMessage('Error', 'Please upload a contract.');
      return;
    }
    //        if(this.total==0)
    //        {
    //            this.commonService.showAlertWindow("Error","Invalid total amount for invoice generation.");
    //            return;
    //        }
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
          this.generateInvoiceNew();
        }
      });
  }

  generateInvoiceNew(): void {
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
      'mainservice/finance/recruitment/retainerinvoice/generateNew?clientId=' +
      this.clientId +
      '&taxType=' +
      this.taxType +
      '&bankAccount=' +
      this.bankAccount +
      '&date=' +
      this.date +
      '&dueDate=' +
      this.dueDate +
      '&invoiceNumber=' +
      this.invoiceNumber +
      '&invoiceInUsd=' +
      (this.invoiceInDollar ? 'yes' : 'no') +
      '&conversionRate=' +
      this.conversionRate;
    this.commonService.post(url, this.tempItems).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.loadUnbilledItems();
        this.loadInvoices();
        this.showGeneratedInvoice(data['dataObject'].id);
          this.commonService.showInfoMessage("Update","Generated invoice")
      }
      else
      {
          this.commonService.showErrorMessage("Error","Couldnt generate invoice.")
      }
    });
  }

  status:any;
  invoices:any = [];
  loadInvoices(): void {
    this.commonService.showProcessingIcon();
    this.contract = {};
    var url =
      'mainservice/finance/recruitment/invoice?type=RETAINER&clientId=' +
      this.clientId+
      '&pageNum=' +
      this.pageNum +
      '&pageSize=15';

    this.commonService.get(url).subscribe((data: any) => {
      console.log(data)
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.invoices = data['dataArray'];
        console.log(this.invoices)
      }
    });
  }

  showGeneratedInvoice(invoiceId: any): void {
    this.commonService.showProcessingIcon();
    var url =
      'mainservice/finance/recruitment/printablePreviousInvoice/' + invoiceId;
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.commonService.hideProcessingIcon();
        //  document.getElementById("printDiv").innerHTML = data["message"];

        const printDiv = document.getElementById('printDiv');
        if (printDiv) {
          printDiv.innerHTML = data['message'];
        } else {
          console.error("Element with ID 'printDiv' not found.");
        }

        this.downloadAsPDF(data['message'], 1);

        //               var newWindow = window.open("","","status");
        //               var newContent = data["message"];
        //               newWindow.document.write(newContent);
        //               newWindow.document.close();
      }
    });
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
}
