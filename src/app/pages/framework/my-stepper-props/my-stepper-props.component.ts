import { CdkStepper } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CandidateDipstickComponent } from '../candidate-dipstick/candidate-dipstick.component';

@Component({
  selector: 'app-my-stepper-props',
  templateUrl: './my-stepper-props.component.html',
  styleUrls: ['./my-stepper-props.component.scss'],
  providers: [{ provide: CdkStepper, useExisting: MyStepperPropsComponent }]
})
export class MyStepperPropsComponent  extends CdkStepper implements OnInit {

  ngOnInit() {
    console.log(this.steps)
    this.steps
  }

  
  
  printSteps() {
    return this.steps.map(step => {
      return {
        completed: step.completed,
        hasError: step.hasError,
        editable: step.editable,
        label: step.label,
        interacted: step.interacted
      }
    })
  }

  printSelected() {
    return {
      completed: this.selected?.completed ?? false,
      hasError: this.selected?.hasError ?? false,
      editable: this.selected?.editable ?? false,
      label: this.selected?.label ?? '',
      interacted: this.selected?.interacted ?? false
    };
  }

}
