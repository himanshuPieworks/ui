import { Component,Input } from '@angular/core';
import { PieworksCommonService } from '../../common/pieworkscommon.service';

@Component({
  selector: 'app-twostep',
  templateUrl: './twostep.component.html',
  styleUrls: ['./twostep.component.scss']
})
  
// Two step component
export class TwostepComponent {
   constructor(private commonService: PieworksCommonService){
       setTimeout(()=>{this.generateOtp()},1000);
   }
  // set the currenr year
  year: number = new Date().getFullYear();
  @Input("parentObj") parentObj:any;//should have otpIdentifier, otpPurpose,emailVerifiedCb - mandatory fields.
  otp:any={};message="";
  seconds=0;timerHandle:any;
  moveToNext(id:any):void
  {
    
      id=id+1;      
      document.getElementById("digit"+id+"-input")?.focus();

  }
  
//  moveToNext(event:any) {
//      let next = event.target.nextElementSibling;
//      alert(next);
//      if (next) {
//        next.focus();
//      } else {
//        event.target.blur();
//      }
//  }
  generateOtp():void
  {
    if(!this.parentObj?.otpIdentifier)
    {
        // alert("identifier not found");
        return;
    }
    this.seconds=60;
    let otp = {"identifier":this.parentObj.otpIdentifier};
    this.commonService.post("mainservice/framework2/open/sendOtp?purpose="+this.parentObj.otpPurpose,otp).subscribe((data:any) => 
    {
        if(data["result"]==200)
        {
            if(this.timerHandle)
                clearInterval(this.timerHandle);
            this.timerHandle = setInterval(()=>
            {
                this.seconds=this.seconds-1;
                if(this.seconds<=0)
                    clearInterval(this.timerHandle);
            },1000);
        }
    })
  }
  matchOtp():void
  {
    let otp = {"identifier":this.parentObj.otpIdentifier,"otpValue":this.otp.digit1+""+this.otp.digit2+""+this.otp.digit3+""+this.otp.digit4};
    this.commonService.post("mainservice/framework2/open/matchOtp",otp).subscribe((data:any) => 
    {
        if(data["result"]==200 && data["message"]=="true")
        {
            this.parentObj.emailVerifiedCb(otp.otpValue);
        }
        else
        {
            this.otp = {};
            this.message = data["message"];
        }
    })
  }
}