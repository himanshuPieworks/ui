import {
  Component,
  ViewChild,
  TemplateRef,
  HostListener,
  ElementRef,
  Input,
} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PieworksCommonService } from '../../../common/pieworkscommon.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-middle-side-dash',
  templateUrl: './middle-side-dash.component.html',
  styleUrls: ['./middle-side-dash.component.scss'],
})
export class MiddleSideDashComponent {
  constructor(
    private modalService: BsModalService,
    public commonService: PieworksCommonService,
    private el: ElementRef
  ) {
    this.postId = this.commonService.getParameterFromUrl('postId');

    if(!this.postId) this.postId = -1;
    //        if(this.commonService.user.confirmedUser)
    //            setTimeout(()=>{this.next()},1000);
    //        else
    {
      this.commonService.loadMyMembership((obj: any) => {
        this.commonService.user.confirmedUser = obj.acceptanceByAceMaker;
        this.next();
      });
    }
    //this.next();
    window.onscroll = (ev) => {
      this.scrollListener(ev);
    };
    this.loadCommunityMembers();
  }
  endDate: any = new Date();
  showMore:boolean = false;
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

    this.userImg = this.commonService.getPicUrl(
      this.commonService.user.profilepic
    );
  }
  userImg: any;
  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollListener);
    window.onscroll = (ev) => {};
  }
  scrollY = 0;
  block: any = false;
  clickComment = false;
  scrollPosition = 0;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  modalRef?: BsModalRef;
  paginationMessage: any = '';
  @ViewChild('postWindow') postWindow: any;
  startingDate: any;
  postId = -1;
  showOption3 = false;
  showOption4 = false;

  showNextOption() {
    if (!this.showOption3) {
      this.showOption3 = true;
    } else if (!this.showOption4) {
      this.showOption4 = true;
    }
  }

  showLessOptions() {
    this.post.answer3 = undefined;
    this.post.answer4 = undefined;

    this.showOption4 = false;
    this.showOption3 = false;
  }

  loadPosts(filterChanged: any): void {
    this.commonService
      .get(
        'mainservice/framework2/forward?api=frameworkservice/socialPost/posts?confirmedUser=' +
          this.commonService.user.confirmedUser +
          ',pageNum=' +
          this.pageNum +
          ',pageSize=' +
          this.pageSize +
          ',createdById=' +
          this.commonService.user.id +
          ',toUserId=' +
          this.commonService.user.id +
          ',postId=' +
          this.postId 
      )
      .subscribe((data: any) => {
        if (filterChanged) this.posts = [];
        if (data['result'] == 200) {
          this.block = false;
          var newBatch = data['dataArray'];
          this.paginationMessage = data['message'];
          for (var i = 0; i < newBatch.length; i++) {
            if (newBatch[i].postType == 'generic')
              this.commonService.autoResizeTextArea('post' + newBatch[i].id);
            for (var j = newBatch[i].responses.length - 1; j >= 0; j--) {
              if (newBatch[i].responses[j].type == 'comment') {
                newBatch[i].latestResp = newBatch[i].responses[j];
                break;
              }
            }
            if (newBatch[i].postType == 'poll') {
              for (var j = 0; j < newBatch[i].responses.length; j++) {
                if (
                  newBatch[i].responses[j].user.id == this.commonService.user.id
                ) {
                  newBatch[i].temp2 = newBatch[i].responses[j].comment;
                }
              }
            }
          }

          this.posts = this.posts.concat(newBatch);
          this.startingDate = this.commonService.getJsDateObject(
            this.posts.createdOn
          );
          console.log(this.posts);
          if (this.posts.length === 0 && this.pageNum > 1) {
            this.pageNum = this.pageNum - 1;
          }
        }
      });
  }
  postMessage(): void {
    const formData: FormData = new FormData();

    if (this.post.message) {
      this.post.message = this.post.message.split('http').join(' http');
      var tokens = this.post.message.split(' ');
      for (var i = 0; i < tokens.length; i++) {
        if (tokens[i].indexOf('youtube') > -1) {
          this.post.message = this.post.message.split(tokens[i]).join('');
          this.post.video = this.commonService.getEmbedUrlYouTube(tokens[i]);
        }
        //                else if (tokens[i].indexOf("http")>-1)
        //                {
        //                    this.post.message = this.post.message.split(tokens[i]).join("<a href='"+tokens[i]+"' target='new'>link</a>");
        //                }
      }
      formData.append('message', this.post.message);
    }
    if (this.post.image) formData.append('existingImgPath', this.post.image);
    if (this.post.video) formData.append('video', this.post.video);
    if (this.post.id) formData.append('id', this.post.id);
    if (this.file)
      formData.append(
        'image',
        this.file,
        this.file ? this.file.name : undefined
      );
    formData.append('createdById', this.commonService.user.id);
    formData.append('toUserId', '-1');
    if (!this.post.postType) this.post.postType = 'generic';
    formData.append('postType', this.post.postType);

    if (this.post.postType == 'poll') {
      formData.append('answer1', this.post.answer1);
      formData.append('answer2', this.post.answer2);
      formData.append('answer3', this.post.answer3);
      formData.append('answer4', this.post.answer4);
    }

    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: localStorage.getItem('accesstoken') + '',
    });
    let options = { headers: headers };
    this.commonService.showProcessingIcon();
    this.commonService
      .post2('mainservice/framework/socialPost/savePost', formData, options)
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.modalRef?.hide();
          this.pageNum = 1;
          this.loadPosts(true);
          this.post = {};
        } else {
          this.commonService.showErrorMessage(
            'Error',
            'Sorry. Please try again later.'
          );
          //this.errormessage = data["message"];
        }
      });
  }
  posts: any = [];
  getembedUrl(url: string): any {
    return url.split('watch?v=').join('embed/');
  }
  showPostWindow(template: TemplateRef<any>): void {
    if (this.commonService.user.confirmedUser == 1)
      this.modalRef = this.modalService.show(template, this.config);
  }
  post: any = {};
  action: any = '';
  file: any;
  imageURL: any;
  onFileSelecet(event: any) {
    if (event.addedFiles.length == 0) {
      return;
    }
    this.file = event.addedFiles[0];
    if (this.file.size > 10485760 * 1) {
      //10 x 1 MB limit
      var errormessage =
        'File size too big. Please choose a file less than 10 MB.';
      this.commonService.showErrorMessage('Error', errormessage);
      this.file = undefined;
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      if (this.file.name.indexOf('.pdf') != -1)
        this.imageURL = 'assets/images/verification-img.png';
      setTimeout(() => {
        // this.profile.push(this.imageURL)
      }, 100);
    };
    reader.readAsDataURL(this.file);
    //--------------------------------------------
  }
  onRemove() {
    this.file = undefined;
  }
  confirmDelete(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.value) {
        this.commonService
          .post('mainservice/framework/socialPost/deletePost', this.post)
          .subscribe((data: any) => {
            this.pageNum = 1;
            this.loadPosts(true);
            Swal.fire({
              title: 'Deleted!',
              text: 'Your post has been deleted.',
              confirmButtonColor: 'rgb(3, 142, 220)',
              icon: 'success',
            });
          });
      }
    });
  }
  response: any = {};
  selectedResponseId: any;
  selectPostCreatedBy: any;
  editComment(index: any): void {
    const temp = (this.posts[index].latestResp.comment + '').split(' ');
    let tempName = '';
    let nameDet = false;
    console.log(temp);
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].indexOf('href="#">') != -1) {
        tempName = temp[i].split('href="#">').join('');
        nameDet = true;
        continue;
      }
      if (temp[i].indexOf('</a>') != -1) {
        tempName = tempName + ' ' + temp[i].split('</a>').join('');
        nameDet = false;
        this.tempTagArray.push(tempName);
        console.log(this.tempTagArray);
        tempName = '';
        continue;
      }
      if (!nameDet) {
        continue;
      }
      if (tempName == '') {
        tempName += temp[i];
      } else {
        tempName = tempName + ' ' + temp[i];
      }
    }
    console.log(tempName);

    this.posts[index].latestResp.comment = (
      this.posts[index].latestResp.comment + ''
    )
      .split('<a href="#">')
      .join('');
    this.posts[index].latestResp.comment = (
      this.posts[index].latestResp.comment + ''
    )
      .split('</a>')
      .join('');

    this.posts[index].temp2 = this.posts[index].latestResp.comment;
    console.log(this.posts[index].latestResp.comment);
  }
  savePostResponse(post: any, responsetype: any, postIndex: any): void {
    this.response.socialPostId = post.id;
    this.response.type = responsetype;
    if (post.temp2) post.temp = post.temp2;
    this.response.comment = post.temp;
    for (let i = 0; i < this.tempTagArray.length; i++) {
      this.response.comment = (this.response.comment + '')
        .split(this.tempTagArray[i])
        .join('<a href="#">' + this.tempTagArray[i] + '</a>');
    }
    this.response.id = this.selectedResponseId;
    this.response.user = this.commonService.user;
    if (this.commonService.user.confirmedUser == 1) {
      this.commonService
        .post('mainservice/framework/socialPost/response', this.response)
        .subscribe((data: any) => {
          if (data['result'] === 200) {
            this.posts[postIndex] = data['dataObject'];

            //
            const taggedUserId = this.tempTagUserId.join(',');
            this.commonService.sendNotification(
              taggedUserId,
              this.commonService.user.name + ' has tagged you on post. ',
              '/home?postId='+this.posts[postIndex].id,
              'COMMUNITY MEMBER',
              1,
              0
            );

            this.tempTagArray = [];
            this.tempTagUserId = [];
            // console.log(this.selectPostCreatedBy)
            // alert(this.selectPostCreatedBy)
            // // Notification
            // this.clickComment = false;
            // this notification will not go to the creator of post
            if (this.posts[postIndex].postType != 'poll' && this.commonService.user.id != this.selectPostCreatedBy.id) {
              this.commonService.sendNotification(
                this.selectPostCreatedBy.id,
                this.commonService.user.name + ' has commented on your post. ',
                '/home?postId='+this.posts[postIndex].id,
                'COMMUNITY MEMBER',
                1,
                0
              );
            }

            for (
              var j = this.posts[postIndex].responses.length - 1;
              j >= 0;
              j--
            ) {
              if (this.posts[postIndex].responses[j].type == 'comment') {
                this.posts[postIndex].latestResp =
                  this.posts[postIndex].responses[j];
                break;
              }
            }
            if (this.posts[postIndex].postType == 'poll') {
              for (var j = 0; j < this.posts[postIndex].responses.length; j++) {
                if (
                  this.posts[postIndex].responses[j].user.id ==
                  this.commonService.user.id
                ) {
                  this.posts[postIndex].temp2 =
                    this.posts[postIndex].responses[j].comment;
                }
              }
            }
            this.response = {};
            this.selectedResponseId = undefined;
          }
        });
    }
  }
  focusOnCommentBox(i: any): void {
    // document.getElementById('commentInput' + i)?.focus();
  }
  pageNum = 0;
  pageSize = 10;
  next(): void {
    if (this.paginationMessage.length > 0) {
      var temp = this.paginationMessage.split(' of ');
      if (parseInt(temp[1]) <= this.pageNum) return;
    }
    this.pageNum = this.pageNum + 1;
    this.loadPosts(false);
  }
  previous(): void {
    if (this.pageNum == 1) return;
    this.pageNum = this.pageNum - 1;
    this.loadPosts(false);
  }
  first(): void {
    this.pageNum = 1;
    this.loadPosts(false);
  }
  last(): void {
    var temp = this.paginationMessage.split(' of ');
    this.pageNum = parseInt(temp[1]);
    this.loadPosts(false);
  }

  showMentions: boolean = false;
  memberSearch: any;
  members: any;
  users: any;
  loadCommunityMembers(): void {
    this.commonService.showProcessingIcon();
    var acceptanceByAceValues = '1';
    var acceptanceByAceMakerValues = '1';
    this.commonService
      .get(
        'mainservice/framework/members2/' +
          localStorage.getItem('communityId') +
          '?acceptanceByAceValues=' +
          acceptanceByAceValues +
          '&searchText=' +
          this.memberSearch +
          '&acceptanceByAceMakerValues=' +
          acceptanceByAceMakerValues +
          '&userId=-1' +
          '&pageNum=1' +
          '&pageSize=10&approvedOnMonth=&jobFamily='
      )
      .subscribe((data: any) => {
        this.commonService.hideProcessingIcon();
        if (data['result'] === 200) {
          this.members = data['dataArray'];
          this.users = [];
          for (var i = 0; i < this.members.length; i++) {
            this.users.push(this.members[i].user);
          }
        }
      });
  }

  parentText: any;
  selectedIndex = 0;
  onInput(event: any, index: any, inputType: any) {
    setTimeout(() => {
      const text = event.key;
      this.selectedIndex = index;
      // if (event.key != '@') return;

      let lastAt = -1;
      if (inputType == 'new') {
        lastAt = this.posts[index].temp.lastIndexOf('@');
      } else {
        lastAt = this.posts[index].temp2.lastIndexOf('@');
      }

      if (lastAt !== -1) {
        let query = '';
        if (inputType == 'new') {
          query = this.posts[index].temp.substring(lastAt + 1).toLowerCase();
        } else {
          query = this.posts[index].temp2.substring(lastAt + 1).toLowerCase();
        }

        this.memberSearch = query;

        this.loadCommunityMembers();

        this.showMentions = this.users.length > 0;

        const names: string[] = this.users.map((user: any) => user.name);
      } else {
        this.showMentions = false;
      }
    }, 200);
  }
  tempTagArray: any = [];
  tempTagUserId: any = [];

  selectUser(username: string, index: any, id: any, inputType: any) {
    // const text = this.el.nativeElement.value;
    let lastAt = -1;
    if (inputType == 'new') {
      lastAt = this.posts[index].temp.lastIndexOf('@');
    } else {
      lastAt = this.posts[index].temp2.lastIndexOf('@');
    }
    let newText = '';
    if (inputType == 'new') {
      newText =
        this.posts[index].temp.substring(0, lastAt + 1) + username + ' ';
    } else {
      newText =
        this.posts[index].temp2.substring(0, lastAt + 1) + username + ' ';
    }

    this.tempTagUserId.push(id);
    this.tempTagArray.push(username);

    if (inputType == 'new') {
      this.posts[index].temp = newText;
    } else {
      this.posts[index].temp2 = newText;
    }

    this.showMentions = false;
  }
}
