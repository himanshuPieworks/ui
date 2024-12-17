import { Component, OnInit, ViewChild } from '@angular/core';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
})
export class InvoicesComponent implements OnInit {
  constructor(public commonService: PieworksCommonService) {}
  @ViewChild('remarksWindow') remarksWindow: any;
  breadCrumbItems!: Array<{}>;
  toggleClientWiseView: boolean = false;
  today: any = new Date();
  status: any = [
    'TO_SEND',
    'SENT_TO_CLIENT',
    'PAYMENT_RECEIVED',
    'PAYMENT_DECLINED',
    'RAISED_CREDIT_NOTE',
  ];
  outstandingBalance: any = 0;
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home', active: false, link: '/' },
      { label: 'Manage', active: false, link: '/recr/manage' },
      { label: 'Finance', active: false, link: '/fw/finance' },
      {
        label: 'Invoices',
        active: true,
        link: '/fw/invoices',
      },
    ];
    // loading invoice
    this.loadClients();
    this.filterChanged();

    window.onscroll = (ev) => {
      this.scrollListener(ev);
    };
  }

  // Showing the invoice
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
      }
    });
  }
  showGeneratedCN(invoiceId: any): void {
    this.commonService.showProcessingIcon();
    var url = 'mainservice/finance/recruitment/printableCN/' + invoiceId;
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
      }
    });
  }

  // loading invoices method
  clientId = -1;
  invoices: any = [];
  client: any = '';
  loadInvoices(): void {
    var selectedStatus = this.status;
    if (this.statuses.length > 0) selectedStatus = this.statuses;
    if (this.client) this.clientId = this.client.id;
    else this.clientId = -1;
    this.commonService.showProcessingIcon();
    var url =
      'mainservice/finance/recruitment/invoice?type=BOTH&clientId=' +
      this.clientId +
      '&pageNum=' +
      this.pageNum +
      '&pageSize=15' +
      '&status=' +
      selectedStatus;
    url = url + '&searchText=' + this.clientSearch;
    this.block = true;
    this.commonService.get(url).subscribe((data: any) => {
      this.block = false;
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.paginationMessage = data['message'];
        var newBatch = data['dataArray'];
        this.outstandingBalance = data['dataObject'];
        this.invoices = this.invoices.concat(newBatch);
      }
      if (this.invoices.length === 0 && this.pageNum > 1) {
        this.pageNum = this.pageNum - 1;
      }
    });
  }
  
  getDaysBetween(toDate: any, fromDate: any) {
    return Math.ceil(
      (toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)
    );
  }

  // downloading the pdf invoice
  hidePrintDiv = false;
  downloadAsPDF(content: any, count: any) {
    this.hidePrintDiv = false;
    //        this.generarPDF();
    var date = Math.random() * 100;
    let DATA: any = document.getElementById('printDiv');
    this.commonService.showProcessingIcon();
    html2canvas(DATA, { allowTaint: true }).then((canvas: any) => {
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
        PDF.save('retainer-invoice-' + this.client + '.pdf');
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

  // conversing the rate and rounding off
  getInUsdWithConversionRate(
    inr: any,
    conversionRate: any,
    invoiceInDollar: any
  ) {
    if (!inr) return inr;
    if (invoiceInDollar == 'yes')
      return Math.round(inr / conversionRate) + ' USD';
    else return Math.round(inr) + ' INR';
  }

  //saving the invoice send receive status
  selectedInvoice: any = {};
  statuses: any = [];
  saveInvoiceStatus(invoice: any): void {
    if (invoice.status == 'RAISED_CREDIT_NOTE' && !invoice.remarks) {
      this.selectedInvoice = invoice;
      this.remarksWindow.show();
      return;
    }
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/finance/recruitment/saveInvoiceStatus', invoice)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] == 200) {
          this.commonService.showSuccessMessage(
            'Success',
            'Successfully Updated Status'
          );
          this.remarksWindow.hide();
        }
        if (data['result'] !== 200) {
          this.commonService.showErrorMessage(
            'Error',
            "Couldn't update the status. Please try again later."
          );
        }
      });
  }

  // From here to last() method are used for pagination on scroll
  pageNum = 1;
  pageSize = 12;
  paginationMessage = '';
  next(): void {
    if (this.paginationMessage.length > 0) {
      var temp = this.paginationMessage.split(' of ');
      if (parseInt(temp[1]) <= this.pageNum) return;
    }
    this.pageNum = this.pageNum + 1;
    this.loadInvoices();
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
  // till here is use for pagination

  block = false;
  creationMonth = '';
  scrollPosition = 0;
  scrollY = 0;

  //taking the mouse location and loading data on it
  scrollListener(event: any): void {
    if (this.block) return;
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 1000
    ) {
      // you're at the bottom of the page
      if (this.scrollPosition != window.innerHeight + window.scrollY) {
        this.block = true;
        this.scrollPosition = window.innerHeight + window.scrollY;
        this.next();
      }
    }
    this.scrollY = window.scrollY;
  }

  //for destroying the mouse event scrollListener
  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollListener);
    window.onscroll = (ev) => {};
  }

  // filter change is called when the data in the
  filterChanged(): void {
    setTimeout(() => {
      this.invoices = [];
      this.pageNum = 1;
      this.loadInvoices();
    }, 1000);
  }
  clientHandle: any;
  clients = [];
  clientSearch = '';
  // on client search
  onClientSearch(item: any) {
    this.clientSearch = item.term;
    this.loadClients();
  }

  // when client is already loaded locally then this method made it local search
  clientLocalSearch(term: string, item: any) {
    return item.name.toString().toUpperCase().indexOf(term.toUpperCase()) > -1;
  }

  // loading clients according to search input
  loadClients(): void {
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
    this.clientHandle = this.clientHandle = this.commonService
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
  endingDate: any = '';
  startingDate: any = '';

  // for getting current month
  total: any = 0;
  getMonth(activeFrom: string): any {
    try {
      var currentMonth = parseInt(this.endingDate.split('-')[1]);
      var activeFromParts = activeFrom.split('-');
      var activeFromMonth = parseInt(activeFromParts[1]);
      var monthDiff = 0;
      if (parseInt(activeFromParts[2]) >= 16) {
        monthDiff = currentMonth - activeFromMonth;
        if (monthDiff < 0)
          //2-12
          monthDiff = 12 + monthDiff;
      } else {
        monthDiff = currentMonth - activeFromMonth + 1;
        if (monthDiff < 0)
          //2-12
          monthDiff = 12 + monthDiff;
      }
      return monthDiff;
    } catch (e) {
      return 0;
    }
  }
  toggleClientView(): void {
    this.toggleClientWiseView = !this.toggleClientWiseView;
    if (this.toggleClientWiseView) {
      this.loadClientReport();
    } else {
      this.filterChanged();
    }
  }
  loadClientReport(): void {
    this.invoices = [];
    this.pageNum = 1;
    var url = 'mainservice/finance/recruitment/outstandingInvoicesByClient';
    this.commonService.get(url).subscribe((data: any) => {
      this.commonService.hideProcessingIcon();
      if (data['result'] === 200) {
        this.paginationMessage = data['message'];
        this.invoices = data['dataArray'];
        this.outstandingBalance = data['dataObject'];
      }
      if (this.invoices.length === 0 && this.pageNum > 1) {
        this.pageNum = this.pageNum - 1;
      }
    });
  }
}
