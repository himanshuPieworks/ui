import { CdkStep, CdkStepper } from '@angular/cdk/stepper';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-candidate-dipstick',
  templateUrl: './candidate-dipstick.component.html',
  styleUrls: ['./candidate-dipstick.component.scss'],
})
export class CandidateDipstickComponent {
  candidate: any = {};
  discId: any;
  constructor(
    public commonService: PieworksCommonService,
    private route: ActivatedRoute
  ) {
    this.discId = this.route.snapshot.paramMap.get('discId');
  }

  name = 'Angular 5';
  @ViewChild('stepper') stepper!: CdkStepper;
  @ViewChild('step1') step1!: CdkStep;
  @ViewChild('step2') step2!: CdkStep;

  validationSection1Q1: boolean = false;
  validationSection1Q2: boolean = false;
  validationSection1Q3: boolean = false;
  validationSection2Q1: boolean = false;
  validationSection2Q2: boolean = false;
  validationSection2Q3: boolean = false;
  validationSection3Q1: boolean = false;
  validationSection3Q2: boolean = false;
  validationSection3Q3: boolean = false;
  validationSection4Q1: boolean = false;
  validationSection4Q2: boolean = false;
  validationSection5Q1: boolean = false;
  validationSection5Q2: boolean = false;
  validationSection6Q1: boolean = false;
  validationSection6Q2: boolean = false;

  validationForSection1Q1() {
    if (this.candidate.section1Q1Weightage) this.validationSection1Q1 = true;
  }
  validationForSection1Q2() {
    if (this.candidate.section1Q2Weightage) this.validationSection1Q2 = true;
  }
  validationForSection1Q3() {
    if (this.candidate.section1Q3Weightage) this.validationSection1Q3 = true;
  }

  validationForSection2Q1() {
    if (this.candidate.section2Q1Weightage) this.validationSection2Q1 = true;
  }
  validationForSection2Q2() {
    if (this.candidate.section2Q2Weightage) this.validationSection2Q2 = true;
  }
  validationForSection2Q3() {
    if (this.candidate.section2Q3Weightage) this.validationSection2Q3 = true;
  }

  validationForSection3Q1() {
    if (this.candidate.section3Q1Weightage) this.validationSection3Q1 = true;
  }
  validationForSection3Q2() {
    if (this.candidate.section3Q2Weightage) this.validationSection3Q2 = true;
  }
  validationForSection3Q3() {
    if (this.candidate.section3Q3Weightage) this.validationSection3Q3 = true;
  }

  validationForSection4Q1() {
    if (this.candidate.descAns1) this.validationSection4Q1 = true;
  }

  validationForSection4Q2() {
    if (this.candidate.descAns2) this.validationSection4Q2 = true;
  }

  validationForSection5Q1() {
    if (this.candidate.descAns3) this.validationSection5Q1 = true;
  }

  validationForSection5Q2() {
    if (this.candidate.descAns4) this.validationSection5Q2 = true;
  }

  validationForSection6Q1() {
    if (this.candidate.descAns5) this.validationSection6Q1 = true;
  }

  validationForSection6Q2() {
    if (this.candidate.descAns6) this.validationSection6Q2 = true;
  }

  submitted:any = false;

  onSubmit() {
    var url = 'mainservice/dipstick/open/save/'+ this.discId;

    this.commonService.post(url, this.candidate).subscribe((data: any) => {
      if (data['result'] == 200) {
        this.commonService.showSuccessMessage(
          'Saved',
          'Your Data has been saved !'
        );
      }else if(data['result'] == 300)
      {
        this.commonService.showSuccessMessage(
          'Sorry !',
          'Your Data is already saved !'
        );
      }
    });
  }
}
