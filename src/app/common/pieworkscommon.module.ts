import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from './safe-pipe/safe-pipe';
import {UrlifyPipe} from './urlify/urlify.pipe';

@NgModule({
  declarations: [SafePipe,UrlifyPipe],
  imports: [
    CommonModule
  ],
  exports:[
      SafePipe,
      UrlifyPipe
  ]
})
export class Pieworkscommon { }
