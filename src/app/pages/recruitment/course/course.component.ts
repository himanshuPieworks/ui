import { Component, OnInit, ViewChild } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit {
  constructor(
    public commonService: PieworksCommonService,
    private router: Router
  ) {}

  // bread crum items
  breadCrumbItems!: Array<{}>;
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home', link: '/', active: false },
      { label: 'Manage', link: '/recr/manage', active: false },
      { label: 'Course', link: '/recr/course', active: true },
    ];

    this.showCourses();
  }

  @ViewChild('addCourse') addCourse: any;
  @ViewChild('courseStatusModal') courseStatusModal: any;
  @ViewChild('courseUpdateModal') courseUpdateModal: any;

  disabledBtn: boolean = false;
  payload: any = {};
  mandatory: boolean = false;

  courseId: any;
  type: any = ['PPT', 'PDF', 'YouTube', 'Spotify'];
  menuOptions: any = ['Update Status', 'Edit'];
  selectedCourse: any = {};
  courseStatus: any = ['Active', 'InActive'];
  duration: any = ['01-02', '03-05', '05-10', '10-20', '20-30', '30-60'];
  menuAction: any;

  handleMenu(option: any): void {
    this.menuAction = option;
    switch (option) {
      case 'Update Status':
        this.courseStatusModal.show();
        break;
      case 'Edit':
        this.courseUpdateModal.show();
        break;
    }
  }

  updateCourse(): void {
    this.commonService
      .post('mainservice/framework/course/save', this.selectedCourse)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();

        if (data['result'] === 200) {
          this.commonService.showSuccessMessage(
            'Update',
            'Updated Course successfully'
          );
          this.courseStatusModal.hide();
          this.courseUpdateModal.hide();
        }
      });
  }
  saveCourse(): void {
    this.disabledBtn = true;
    this.commonService.showProcessingIcon();
    this.payload.status = 'Active';

    if (this.payload.mandatory == null) {
      this.payload.mandatory = 0;
    }

    this.commonService
      .post('mainservice/framework/course/save', this.payload)
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          this.savedCourse = data['dataObject'];
          this.saveCourseMaterial();
        }
      });
  }
  allCourses: any;
  savedCourse: any;
  showCourses(): void {
    this.commonService.showProcessingIcon();
    this.commonService
      .get('mainservice/framework/course/show')
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          this.allCourses = data['dataObject'];
        }
      });
  }
 

  doubleClickCounter = 0;
  clickedOnCourse(course: any): void {
    this.doubleClickCounter++;
    if (this.doubleClickCounter >= 2) this.doubleClicked(course);
    setTimeout(() => {
      this.doubleClickCounter = 0;
    }, 300);
  }
  doubleClicked(course: any): void {
    this.router.navigate(['recr/course-details/' + course.id]);
  }

  courseMaterial: any = {};
  saveCourseMaterial(): void {
    for (var i = 0; i < this.courseMaterialArray.length; i++) {
      this.courseMaterialArray[i].course = this.savedCourse;

      if (this.courseMaterialArray[i].materialType == 'YouTube') {
        this.courseMaterialArray[i].materialLink = this.getEmbedUrlYouTube(
          this.courseMaterialArray[i].materialLink
        );
      }
      if (this.courseMaterialArray[i].materialType == 'PDF') {
        this.courseMaterialArray[i].materialLink = this.getEmbedUrlPdf(
          this.courseMaterialArray[i].materialLink
        );
      }

      if (this.courseMaterialArray[i].materialType == 'PPT') {
        this.courseMaterialArray[i].materialLink = this.getEmbedUrlSlide(
          this.courseMaterialArray[i].materialLink
        );
      }
      if (this.courseMaterialArray[i].materialType == 'Spotify') {
        this.courseMaterialArray[i].materialLink = this.getEmbedUrlSpotify(
          this.courseMaterialArray[i].materialLink
        );
      }
    }
    this.commonService.showProcessingIcon();
    this.commonService
      .post(
        'mainservice/framework/courseMaterial/saveList',
        this.courseMaterialArray
      )
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          this.commonService.showSuccessMessage('Course', 'Course Saved !');
          this.addCourse.hide();
          this.showCourses();
          //  this.showCourses();
        }
      });
  }

  toggleMandatory() {
    this.mandatory = !this.mandatory;
  }

  // multiple course_material List saving and deleting
  courseMaterialArray: any[] = [];
  addCourseMaterial(): void {
    if (!this.courseMaterial) return;
    if (Object.keys(this.courseMaterial).length === 0) return;

    this.courseMaterialArray.push({ ...this.courseMaterial });

    this.courseMaterial = {};
  }
  removeCourseMaterial(obj: any) {
    for (var i = 0; i < this.courseMaterialArray.length; i++) {
      if (obj === this.courseMaterialArray[i]) {
        this.courseMaterialArray.splice(i, 1);
        break;
      }
    }
  }

  showAddCourse(): void {
    this.courseMaterialArray = [];
    this.payload.description = '';
    this.payload.title = '';
    this.addCourse.show();
  }

  // these are the embed link for the course_material Link
  getEmbedUrlYouTube(url: string): any {
    return url.split('watch?v=').join('embed/');
  }

  getEmbedUrlPdf(url: string): any {
    const modifiedLink = url.replace(/\/view\?usp=drive_link$/, '/preview');
    return modifiedLink;
  }

  getEmbedUrlSlide(url: string): any {
    const modifiedLink = url.replace(/\/edit\?usp=drive_link$/, '/preview');
    return modifiedLink;
  }

  getEmbedUrlSpotify(url: string): string | null {
    const regex = /\/episode\/([a-zA-Z0-9]+)\?/;
    const match = url.match(regex);
    if (match && match[1]) {
      return `https://open.spotify.com/embed/episode/${match[1]}?utm_source=generator`;
    }
    return null; // Invalid URL format
  }
}
