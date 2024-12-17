import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss'],
})
export class LearnComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  constructor(
    public commonService: PieworksCommonService,
    private router: Router
  ) {
    this.breadCrumbItems = [
      { label: 'Home', link: '/', active: false },
      { label: 'Learn', active: true },
    ];
  }
  menuOptions: any = ['Details'];
  ngOnInit(): void {
    this.loadMyMembership();
    this.getCourseInProgress();
    this.getCourseCompleted();
    this.getRecommendedCourses();
    this.getOverdueCourse();
  }

  selectedCourse: any = {};
  menuAction: any;
  handleMenu(option: any): void {
    this.menuAction = option;
    switch (option) {
      case 'Details':
        this.getCourseMaterialByCourseId();
        break;
    }
  }

  courseEnrollmentConfirmation(): void {
    Swal.fire({
      title: 'Confirmation required',
      text:
        'Are you sure you want to Enroll in ' +
        this.selectedCourse.title +
        ' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        this.saveCourseEnrollment();
      }
    });
  }

  myCourseEnrollment: any = {};
  saveCourseEnrollment() {
    this.myCourseEnrollment.course = this.selectedCourse;
    this.myCourseEnrollment.user = this.user;
    this.myCourseEnrollment.progress = 0;
    this.myCourseEnrollment.status = 'Enrolled';
    var url = 'mainservice/framework/courseEnrollment/save/';
    this.commonService.showProcessingIcon();
    this.commonService
      .post(url, this.myCourseEnrollment)
      .subscribe((data: any) => {
        if (data['result'] == 200) {
          this.commonService.showSuccessMessage(
            'Enrolled',
            'Successfully Enrolled'
          );
          this.getCourseInProgress();
          this.getOverdueCourse();
          this.getRecommendedCourses();
          this.router.navigate(['recr/my-course/' + this.selectedCourse.id]);
        }
      });
  }

  myCourseInProgress: any = {};
  saveCourseInProgress() {
    this.myCourseInProgress.course = this.selectedCourse;
    this.myCourseInProgress.user = this.user;
    this.myCourseInProgress.progress = 1;
    this.myCourseInProgress.status = 'Ongoing';
    var url = 'mainservice/framework/courseEnrollment/save/';
    this.commonService.showProcessingIcon();
    this.commonService
      .post(url, this.myCourseInProgress)
      .subscribe((data: any) => {
        if (data['result'] == 200) {
          this.commonService.showSuccessMessage(
            'Enrolled',
            'Successfully Enrolled'
          );
        }
      });
  }

  myCourseCompletion: any = {};
  saveCourseCompleted() {
    this.myCourseCompletion.course = this.selectedCourse;
    this.myCourseCompletion.user = this.user;
    this.myCourseCompletion.progress = 100;
    this.myCourseCompletion.status = 'Completed';
    var url = 'mainservice/framework/courseEnrollment/save/';
    this.commonService.showProcessingIcon();
    this.commonService
      .post(url, this.myCourseCompletion)
      .subscribe((data: any) => {
        if (data['result'] == 200) {
          this.commonService.showSuccessMessage(
            'Enrolled',
            'Successfully Enrolled'
          );
        }
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

  overdueCourse: any;
  getOverdueCourse(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get(
        'mainservice/framework/course/getOverdueCourses/' +
          this.commonService.user.id
      )
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          this.overdueCourse = data['dataObject'];
          console.log(this.overdueCourse);
        }
      });
  }

  courseInProgress: any;
  getCourseInProgress(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get(
        'mainservice/framework/courseEnrollment/coursesInProgress/' +
          this.commonService.user.id
      )
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          this.courseInProgress = data['dataArray'];
          console.log(this.courseInProgress);
        }
      });
  }

  coursesCompleted: any;
  getCourseCompleted(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get(
        'mainservice/framework/courseEnrollment/coursesCompleted/' +
          this.commonService.user.id
      )
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          this.coursesCompleted = data['dataArray'];
          console.log(this.coursesCompleted);
        }
      });
  }

  recommendedCourses: any;
  getRecommendedCourses(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get(
        'mainservice/framework/course/recommendedCourses/' +
          this.commonService.user.id
      )
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          this.recommendedCourses = data['dataObject'];
          console.log(this.recommendedCourses);
        }
      });
  }

  @ViewChild('courseDetails') courseDetails: any;
  doubleClickCounter = 0;
  clickedOnCourse(req: any): void {
    this.doubleClickCounter++;
    if (this.doubleClickCounter >= 2) this.doubleClicked(req);
    setTimeout(() => {
      this.doubleClickCounter = 0;
    }, 300);
  }
  doubleClicked(course: any): void {
    this.getCourseMaterialByCourseId();
  }

  clickedOnCourseBtn(course: any): void {
    this.router.navigate(['recr/my-course/' + course.id]);
  }

  doubleClickCounterToGetIn = 0;
  clickedOnCourseToGetIn(req: any): void {
    this.doubleClickCounterToGetIn++;
    if (this.doubleClickCounterToGetIn >= 2) this.doubleClickedToGetIn(req);
    setTimeout(() => {
      this.doubleClickCounterToGetIn = 0;
    }, 300);
  }
  doubleClickedToGetIn(course: any): void {
    this.router.navigate(['recr/my-course/' + course.id]);
  }

  courseMaterialByCourseId: any;
  getCourseMaterialByCourseId(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get(
        'mainservice/framework/courseMaterial/by-course/' +
          this.selectedCourse.id
      )
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          this.courseMaterialByCourseId = data['dataObject'];
          this.courseDetails.show();
          console.log(this.courseMaterialByCourseId);
        }
      });
  }
}
