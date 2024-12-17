import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { PieworksCommonService } from '../../../common/pieworkscommon.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-right-side-dash',
  templateUrl: './right-side-dash.component.html',
  styleUrls: ['./right-side-dash.component.scss'],
})
export class RightSideDashComponent {
  clientAnchorView: any;
  newTask: boolean = false;
  constructor(public commonService: PieworksCommonService) {
    // this.clientAnchorView = localStorage.getItem('dashView')
    // this.renderer.listen('document', 'click', (event: Event) => this.handleDocumentClick(event));
    this.loadFeed();
    this.loadTask();
    this.loadCommunityMembers();
  }

  @ViewChild('addCM') addCm: any;
  feeds: any;
  reversedFeeds: any;
  loadFeed(): void {
    this.commonService
      .get(
        'mainservice/framework/feeds?communityId=' +
          localStorage.getItem('communityId') +
          '&userId=-1&type=bulletin'
      )
      .subscribe((data: any) => {
        this.feeds = data['dataArray'];
        this.reversedFeeds = this.feeds.slice().reverse();
      });
  }

  task: any = {};
  saveTask(): void {
    if (this.selectedTask) {
      this.task = this.selectedTask;
    }
    this.task.createdBy = this.commonService.user;
    
    var url = 'mainservice/framework/todoList/save';

    if (this.task.taskDescription == null || this.task.taskDescription == ' ') {
      this.commonService.showErrorMessage('Empty Task', 'Not allowed');
    } else {
      this.commonService.post(url, this.task).subscribe((data: any) => {
        if (data['result'] == 200) {
          this.task.taskTitle = '';
          this.task.taskDescription = '';
          this.newTask = false;
          this.commonService.showSuccessMessage('Saved', 'Task is saved.');
          this.selectedTask = data['dataObject'];
          // 
          let userIdsString = this.userAssigned.map((user:any) => user.id).join(',');
          
          this.assigningCM(this.userAssigned, this.selectedTask);
          this.loadTask();

          // Notification 
          this.commonService.sendNotification(
            userIdsString,
            this.commonService.user.name +
              ' has added you in a Task '+'"'+ this.selectedTask.taskTitle+'"',
            '/home',
            'COMMUNITY MEMBER',
            1,
            0
          );
        } else
          this.commonService.showErrorMessage(
            'Error',
            "Couldn't save the task."
          );
        this.commonService.hideProcessingIcon();
      });
    }
  }

  // deleting the task
  deleteTask(): void {
    var url = 'mainservice/framework/todoList/deleteTask';
    this.commonService.post(url, this.selectedTask).subscribe((data: any) => {
      if (data['result'] == 200) {
        this.task.taskTitle = '';
        this.task.taskDescription = '';
        this.commonService.showSuccessMessage('Removed', 'Task is Removed.');

        this.loadTask();
      } else
        this.commonService.showErrorMessage(
          'Error',
          "Couldn't Remove the task."
        );
      this.selectedTask = undefined;
      this.commonService.hideProcessingIcon();
    });
  }

  assignedTask: any;
  loadTask(): void {
    var url =
      'mainservice/framework/todoList/show?createdById=' +
      this.commonService.user.id;
    this.commonService.get(url).subscribe((data: any) => {
      this.assignedTask = data['dataArray'];
      console.log(this.assignedTask);
    });
  }

  // on clicking on check box
  onCompletingTask(): void {
    Swal.fire({
      title: 'Completed the task',
      text: 'Are you sure you completed the task',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        // function that call completed task
        this.deleteTask();
      }
    });
  }

  selectedTask: any;
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

  userAssigned: any;
  getTodoUserListId(userId: any): any {
    for (var i = 0; i < this.selectedTask.users.length; i++) {
      if (this.selectedTask.users[i].userId.id == userId)
        return this.selectedTask.users[i].id;
    }
    return undefined;
  }
  assigningCM(users: any, todoListId: any): void {
    let arg = [];
    if (!users) {
      return;
    }
    for (var i = 0; i < users.length; i++) {
      let obj: any = { userId: users[i], todoListId: todoListId.id };
      let temp: any = this.getTodoUserListId(users[i].id);
      if (temp != undefined) obj.id = temp;
      arg.push(obj);
    }

    var url = '/mainservice/framework/todoList/tagTodoUsers';
    this.commonService.post(url, arg).subscribe((data: any) => {
      if (data['result'] == 200) {
        this.commonService.showSuccessMessage(
          'Assigned',
          'Assigned tasked to community member.'
        );
        this.selectedTask = undefined;
        this.loadTask();
        this.addCm.hide();
      } else
        this.commonService.showErrorMessage(
          'Error',
          "Couldn't Assigned the task."
        );
      this.commonService.hideProcessingIcon();
    });
  }

  showAddCm(): void {
    if (!this.selectedTask) {
      this.task.users = [];
      this.selectedTask = this.task;
    }
    this.userAssigned = [];
    for (var i = 0; i < this.selectedTask.users.length; i++) {
      if (this.selectedTask.users[i].userId.id == this.commonService.user.id)
        continue;
      this.userAssigned.push(this.selectedTask.users[i].userId);
    }
    //      for(var i=0;i<this.members.length;i++)
    //      {
    //          this.userAssigned.push(this.members[i]);
    //      }
    this.addCm.show();
  }

  memberSearch: any = '';
  onMemberSearch(item: any) {
    this.memberSearch = item.term;
    this.loadCommunityMembers();
  }

  // when client is already loaded locally then this method made it local search
  memberLocalSearch(term: string, item: any) {
    return item.name.toString().toUpperCase().indexOf(term.toUpperCase()) > -1;
  }
}
