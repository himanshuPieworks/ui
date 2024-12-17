import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
})
export class CourseDetailsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    public commonService: PieworksCommonService,
    private sanitizer: DomSanitizer
  ) {}

  // bread crum items
  breadCrumbItems!: Array<{}>;
  courseId: any;
  type: any = ['PPT', 'PDF', 'YouTube','Spotify'];
  selectedCourseMaterial: any ={};
  @ViewChild('addAssignment') addAssignment: any;

  menuOptions: any = ['Edit','Delete'];
  selectedCourse: any;
  courseStatus: any = ['Active', 'InActive'];
  menuAction: any;
  handleMenu(option: any): void {
    this.menuAction = option;
    switch (option) {
      case 'Edit':
        this.addAssignment.show();
        break;
      case 'Delete':
        Swal.fire({
          title: 'Confirmation required',
          text: "Are you sure you don't want remove " + this.selectedCourseMaterial?.materialTitle + ' ?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'rgb(3, 142, 220)',
          cancelButtonColor: 'rgb(243, 78, 78)',
          confirmButtonText: 'Yes',
        }).then((result:any) => {
          if (result.value) {
            this.removeCourseMaterial();
          }
        });
        break;
    }
  }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('courseId');

    this.breadCrumbItems = [
      { label: 'Home', link: '/', active: false },
      { label: 'Manage', link: '/recr/manage', active: false },
      { label: 'Course', link: '/recr/course', active: false },
      { label: 'Course-Details', active: true },
    ];

    this.getCourseById();
    this.getCourseMaterialById();
  }

  duration: any = ['01-02','03-05', '05-10', '10-20', '20-30', '30-60'];
  courseMaterial: any = {};
  saveCourseMaterial(): void {
    this.courseMaterial.course = this.course;

    if (this.courseMaterial.materialType == 'YouTube') {
      this.courseMaterial.materialLink = this.getEmbedUrlYouTube(
        this.courseMaterial.materialLink
      );
    }
    if (this.courseMaterial.materialType == 'PDF') {
      this.courseMaterial.materialLink = this.getEmbedUrlPdf(
        this.courseMaterial.materialLink
      );
    }

    if (this.courseMaterial.materialType == 'PPT') {
      this.courseMaterial.materialLink = this.getEmbedUrlSlide(
        this.courseMaterial.materialLink
      );
    }
    if (this.courseMaterial.materialType == 'Spotify') {
      this.courseMaterial.materialLink = this.getEmbedUrlSpotify(
        this.courseMaterial.materialLink
      );
    }
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/framework/courseMaterial/save', this.courseMaterial)
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          this.commonService.showSuccessMessage('Course', 'Course Saved !');
          this.courseMaterial = {};
          this.getCourseById();
          this.getCourseMaterialById();
          //  this.showCourses();
        }
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
          console.log(this.course);
        }
      });
  }

  courseMaterialById: any;
  getCourseMaterialById(): void {
    this.courseMaterial.course = this.course;
    this.commonService.showProcessingIcon();
    this.commonService
      .get('mainservice/framework/courseMaterial/by-course/' + this.courseId)
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          this.courseMaterialById = data['dataObject'];
          console.log(this.courseMaterialById);
          //  this.showCourses();
        }
      });
  }

  removeCourseMaterial():void{
    this.commonService.showProcessingIcon();
    this.commonService.post('mainservice/framework/courseMaterial/removeCourseMaterial/'+ this.selectedCourseMaterial.id,this.selectedCourseMaterial)
    .subscribe((data:any) => {
      if(data['result'] === 200)
      {
        this.commonService.showSuccessMessage("Deleted","Course Material Deleted Successfully");
        this.getCourseMaterialById();
      }
    })
  }

  updateCourseMaterial():any{
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/framework/courseMaterial/save', this.selectedCourseMaterial)
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          this.saveAssignment();
          this.addAssignment.hide()
          this.commonService.showSuccessMessage('Updated', 'Course Material !');
          
        }
      })
  }

  // multiple course_material List saving and deleting
  assignmentArray: any[] = [];
  addCourseMaterialAssignment(): void {
    if (!this.assignment) return;
    if (Object.keys(this.assignment).length === 0) return;

    this.assignmentArray.push({ ...this.assignment });

    this.assignment = {};
  }
  removeCourseMaterialAssignment(obj: any) {
    for (var i = 0; i < this.assignmentArray.length; i++) {
      if (obj === this.assignmentArray[i]) {
        this.assignmentArray.splice(i, 1);
        break;
      }
    }
  }

  assignment: any = {};
  saveAssignment(): void {

    if(this.assignmentArray.length == 0)
    {
      return;
    }
    for (var i = 0; i < this.assignmentArray.length; i++) {

      this.assignmentArray[i].courseMaterial = this.selectedCourseMaterial;
    }
    this.commonService.showProcessingIcon();
    this.commonService
      .post('mainservice/framework/assignment/save', this.assignmentArray)
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          this.commonService.showSuccessMessage(
            'Assignment ',
            'Assignment Saved !'
          );
          
          this.addAssignment.hide();

          //  this.showCourses();
        }
      });
  }

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
