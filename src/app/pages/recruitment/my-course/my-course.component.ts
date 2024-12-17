import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-course',
  templateUrl: './my-course.component.html',
  styleUrls: ['./my-course.component.scss'],
})
export class MyCourseComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  constructor(
    public commonService: PieworksCommonService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.breadCrumbItems = [
      { label: 'Home', link: '/', active: false },
      { label: 'Learn', link: '/recr/learn', active: false },
      { label: 'My Course', active: true },
    ];
  }
  courseId: any;
  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('courseId');
    this.getCourseMaterialByCourseId();
    // this.loadCourseProgress();
    this.loadMyMembership();
    this.getMyCourse();
    // this.getCourseById();
  }
  section: any = 1;
  courseMaterialByCourseId: any;
  getCourseMaterialByCourseId(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get('mainservice/framework/courseMaterial/by-course/' + this.courseId)
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          this.courseMaterialByCourseId = data['dataObject'];
          console.log(this.courseMaterialByCourseId);
          // this.getCourseMaterialById(this.courseMaterialByCourseId.id);
          //  this.showCourses();
        }
      });
  }

  checkCourseStatus(): void {
    this.allMaterialDone = false;
    if (this.myCourseMaterials.length == 0) {
      return;
    }
    for (var i = 0; i < this.myCourseMaterials.length; i++) {
      if (this.myCourseMaterials[i].status != 'Completed') {
        return;
      }
    }
    this.allMaterialDone = true;
  }

  courseMaterialById: any = {};
  selectMaterialId: any;
  materialDurationInMinutes: any;
  getCourseMaterialById(courseMaterial: any): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get('mainservice/framework/courseMaterial/show/' + courseMaterial)
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          this.courseMaterialById = data['dataObject'];

          console.log(this.courseMaterialById);

          this.materialDurationInMinutes = this.extractFirstPartAsInteger(
            this.courseMaterialById.materialDuration
          );
          this.loadCourseProgress();
          this.checkCourseStatus();
          console.log(this.materialDurationInMinutes);
        }
      });
  }

  // this method is use to get the first minute of course material.
  extractFirstPartAsInteger(inputString: any) {
    if (typeof inputString !== 'string' || inputString.trim() === '') {
      return null;
    }

    const parts = inputString.split('-');

    const firstPartAsInteger = parseInt(parts[0], 10);

    return firstPartAsInteger;
  }

  timer: any;
  disableBtn = true;
  isButtonDisabled = true;
  isBtnNot: boolean = true;
  progress = 0;
  disableButtonForTime() {
    setTimeout(() => {
      this.isButtonDisabled = true;

      const disableTimeInMilliseconds =
        this.materialDurationInMinutes * 60 * 1000;

      this.timer = this.materialDurationInMinutes;

      this.timer = this.timer * 60;
      const timerInterval = setInterval(() => {
        this.timer--;

        if (this.timer <= 0) {
          this.isButtonDisabled = false;
          this.isBtnNot = false;
          clearInterval(timerInterval);
        }
      }, 1000);

      setTimeout(() => {
        this.isButtonDisabled = false;
        clearInterval(timerInterval);
      }, disableTimeInMilliseconds);
    }, 300);
  }

  resetTimer() {
    this.timer = this.materialDurationInMinutes;
  }

  allMaterialDone: any = false;

  myProgress: any = {};
  myCourseMaterials: any = [];
  materialCompleted = false;
  saveCourseProgress(status: any): void {
    setTimeout(() => {
      // for (let i = 0; i < this.myCourseMaterials.length; i++) {
      //   if (
      //     this.myCourseMaterials[i].courseMaterial == this.courseMaterialById
      //   ) {
      //     this.myProgress = this.myCourseMaterials[i];
      //     break;
      //   }
      // }

      this.myProgress.courseMaterial = this.courseMaterialById;
      this.myProgress.progress = this.progress;
      this.myProgress.status = status;
      this.myProgress.myCourse = this.myCourse;
      var url = 'mainservice/framework/myCourseMaterial/save/';
      this.commonService.showProcessingIcon();
      this.commonService.post(url, this.myProgress).subscribe((data: any) => {
        if (data['result'] == 200) {
          {
            if (status == 'Completed')
            {
              this.commonService.showSuccessMessage(
                'Course Material',
                'Successfully completed the course material'
              );
            this.getCourseMaterialById(this.section);
            }
          }
          this.checkCourseStatus();
        }
      });
    }, 200);
  }

  // loading the course progress
  courseMaterialStatus: any;
  loadCourseProgress(): void {
    var url =
      'mainservice/framework/myCourseMaterial/show?courseMaterialId=' +
      this.section +
      '&myCourseId=' +
      this.myCourse.id;
    this.commonService.get(url).subscribe((data: any) => {
      
      if (data['result'] == 200) {
        this.myCourseMaterials = data['dataObject'];
        console.log(this.myCourseMaterials);

        if (
          this.myCourseMaterials == null ||
          this.myCourseMaterials == undefined
        )
          this.courseMaterialStatus = 'OnGoing';
        else this.courseMaterialStatus = this.myCourseMaterials.status;
        if (
          this.courseMaterialStatus === 'OnGoing' ||
          this.courseMaterialStatus === undefined
        ) {
          this.saveCourseProgress('OnGoing');
        }
      }
      this.checkCourseStatus();
    });
  }

  // this for getting the user info.
  user: any;
  loadMyMembership(): void {
    this.commonService
      .get(
        'mainservice/framework/members/' +
          localStorage.getItem('communityId') +
          '?acceptanceByAceValues=0,1,2,3,4,5,6,7,8,9,10&acceptanceByAceMakerValues=0,1,2,3,4,5,6,7,8,9,10&userId=' +
          this.commonService.user.id +
          '&roleInCommunity=0,1'
      )
      .subscribe((data: any) => {
        var temp = data['dataArray'];

        this.user = temp[0].user;
      });
  }

  // course completion
  courseCompletedConfirmation(): void {
    Swal.fire({
      title: 'Confirmation required',
      text: 'Are you sure you want to Mark the course as finished  ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        this.saveCourseCompleted();
      }
    });
  }

  // for course completion
  saveCourseCompleted() {
    this.myCourse.progress = 100;
    this.myCourse.status = 'Completed';
    this.myCourse.feedback = 'Good';
    var url = 'mainservice/framework/courseEnrollment/save';
    this.commonService.showProcessingIcon();
    this.commonService.post(url, this.myCourse).subscribe((data: any) => {
      if (data['result'] == 200) {
        this.commonService.showSuccessMessage(
          'Completed',
          'Successfully Completed'
        );
        this.commonService.navigateTo('/recr/learn', undefined);
        this.checkCourseStatus();
      }
    });
  }

  myCourse: any = {};
  getMyCourse(): void {
    var url =
      'mainservice/framework/courseEnrollment/myCourseByCourseId?courseId=' +
      this.courseId +
      '&userId=' +
      this.commonService.user.id;
    this.commonService.get(url).subscribe((data: any) => {
      this.myCourse = data['dataObject'];

      console.log(this.myCourse);
    });
  }

  course: any;
  getCourseById(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get('mainservice/framework/course/show/' + this.courseId)
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          this.course = data['dataObject'];
          console.log('this is course' + this.course);
          console.log(this.user);
        }
      });
  }
}
