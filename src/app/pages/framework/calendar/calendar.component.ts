import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  Validators,
  UntypedFormGroup,
} from '@angular/forms';

// Sweet Alert
import Swal from 'sweetalert2';

// Calendar option
import {
  CalendarOptions,
  EventApi,
  EventClickArg,
  EventInput,
  DateRangeInput,
  Calendar,
} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { defaultevent, events, createEventId } from './data';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PieworksCommonService } from 'src/app/common/pieworkscommon.service';
import { JSONParser } from '@amcharts/amcharts5';
import { FullCalendarComponent } from '@fullcalendar/angular';

// Define EventSourceFuncArg type
interface EventSourceFuncArg {
  startStr: string;
  endStr: string;
  // Add any other properties needed
}
interface CustomEventInput extends EventInput {
  displayIcon?: string;
  displayColor?: string;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  // calendar
  calendarEvents!: EventInput[];
  editEvent: any;
  newEventDate: any;
  formEditData!: UntypedFormGroup;
  submitted = false;
  formData!: UntypedFormGroup;
  @ViewChild(FullCalendarComponent) calendarComponent!: FullCalendarComponent;
  upcomingEvents: any;

  @ViewChild('eventModal', { static: false }) eventModal?: ModalDirective;

  @ViewChild('addCM') addCm: any;
  @ViewChild('eventDetails') eventDetails: any;

  breadCrumbItems!: Array<{}>;
  calendarOptions: CalendarOptions = {};
  constructor(
    private formBuilder: UntypedFormBuilder,
    public commonService: PieworksCommonService
  ) {
    this.breadCrumbItems = [
      { label: 'Manage', link: '/recr/manage', active: false },
      { label: 'Calendar', active: true },
    ];

    this.loadClub();
    this.loadCalendarOptions();
  }

  ngOnInit(): void {
    // Calender Event Data

    this.calendarEvents = events;
    this.upcomingEvents = defaultevent;
  }

  truncateString(inputString: string, maxLength: number): string {
    if (!inputString) return inputString;
    if (inputString.length <= maxLength) {
      return inputString;
    } else {
      return inputString.substring(0, maxLength) + '...';
    }
  }

  clubIconMapping: { [key: string]: string } = {
    'Gyaan Club': 'bi bi-mortarboard',
    'Tech Club': 'bi bi-globe2',
    'Fit Club': 'ri-run-line',
    'Music Club': 'bi bi-music-note-beamed',
    'Book Club': 'bi bi-book-half',
    Theatre: 'bi bi-film',
    'Art Club': 'bi bi-brush-fill',
    // Add more clubs and their corresponding icons here
  };

  clubColorMapping: { [key: string]: string } = {
    'Gyaan Club': '#1A9882',
    'Tech Club': '#B02E3A',
    'Fit Club': '#BA4D1B',
    'Music Club': '#2086BF',
    'Book Club': '#263CBF',
    Theatre: '#662E9B',
    'Art Club': '#BB960B',
  };

  pastEventColor = '#191401';

  /***
   * Calender Set
   */
  // this.calendarOptions = {
  //   plugins: [dayGridPlugin, listPlugin, interactionPlugin, timeGridPlugin],
  //   headerToolbar: {
  //     right: 'dayGridMonth,dayGridWeek,dayGridDay,listWeek',
  //     center: 'title',
  //     left: 'prev,next today',
  //   },
  //   initialView: 'dayGridMonth',
  //   themeSystem: 'bootstrap',
  //   weekends: true,
  //   editable: true,
  //   selectable: true,
  //   selectMirror: true,
  //   dayMaxEvents: true,
  //   select: this.openModal.bind(this),
  //   eventClick: this.handleEventClick.bind(this),
  //   eventsSet: this.handleEvents.bind(this),
  //   events: this.LoadEvents.bind(this),
  // };

  loadCalendarOptions() {
    this.calendarOptions = {
      plugins: [dayGridPlugin, listPlugin, interactionPlugin, timeGridPlugin],
      headerToolbar: {
        right: 'dayGridMonth,dayGridWeek,dayGridDay,listWeek',
        center: 'title',
        left: 'prev,next today',
      },
      initialView: 'dayGridMonth',
      themeSystem: 'bootstrap',
      weekends: true,
      editable: false,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,

      select: this.openModal.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventsSet: this.handleEvents.bind(this),
      events: this.LoadEvents.bind(this),

      eventContent: (arg) => {
        let arrayOfDomNodes = [];

        let titleEvent = document.createElement('div');
        titleEvent.innerHTML = this.truncateString(arg.event.title, 19);
        titleEvent.className = 'text-center  text-white';

        arrayOfDomNodes.push(titleEvent);

        if (arg.event.extendedProps['displayIcon']) {
          let icon = document.createElement('span');
          icon.className = `${arg.event.extendedProps['displayIcon']} fs-xl text-white`; // Assuming you are using Font Awesome
          icon.style.marginLeft = '5px'; // Optional: Add some space between title and icon
          arrayOfDomNodes.push(icon);
        }

        return { domNodes: arrayOfDomNodes };
      },
      eventDidMount: (arg) => {
        if (arg.event.extendedProps['displayColor']) {
          arg.el.style.backgroundColor =
            arg.event.extendedProps['displayColor'];
        }
      },
    };
  }

  currentDate = new Date(); // Get the current date
  currentEvents: EventApi[] = [];

  // async LoadEvents(args: EventSourceFuncArg): Promise<EventInput[]> {
  //   return new Promise<EventInput[]>((resolve) => {
  //     this.commonService
  //       .get(
  //         'mainservice/framework/event/showByDateRange?startDate=' +
  //           args.startStr +
  //           '&endDate=' +
  //           args.endStr +
  //           '&userId=' +
  //           this.commonService.user.id +
  //           '&getMembers=false'
  //       )
  //       .subscribe(
  //         (data: any) => {
  //           console.log(data['dataArray']);

  //           const events: EventInput[] = [];
  //           data['dataArray'].forEach((val: any) => {
  //             events.push({
  //               id: val.id,
  //               title: val.title,
  //               date: val.date,
  //               location: val.location,

  //               className:
  //                 new Date(val.date) < this.currentDate
  //                   ? 'bg-dark-subtle'
  //                   : val.iamAttending
  //                   ? 'bg-success-subtle'
  //                   : val?.createdBy?.id === this.commonService.user.id
  //                   ? 'bg-warning-subtle'
  //                   : 'bg-primary-subtle',

  //               description: val.description,
  //               club: val.club,
  //               endDuration: val.endDuration,
  //               startDuration: val.startDuration,
  //               createdBy: val.createdBy,
  //               link: val.link,
  //               iamAttending: val.iamAttending,
  //               eventStartEditable: false,
  //               displayIcon: val.club === 'Tech Club', // Add this line
  //             });
  //           });
  //           resolve(events);
  //         },
  //         (error: any) => console.error(error)
  //       );
  //   });
  // }

  async LoadEvents(args: EventSourceFuncArg): Promise<CustomEventInput[]> {
    return new Promise<CustomEventInput[]>((resolve) => {
      this.commonService
        .get(
          'mainservice/framework/event/showByDateRange?startDate=' +
            args.startStr +
            '&endDate=' +
            args.endStr +
            '&userId=' +
            this.commonService.user.id +
            '&getMembers=false'
        )
        .subscribe(
          (data: any) => {
            console.log(data['dataArray']);

            const events: CustomEventInput[] = [];
            data['dataArray'].forEach((val: any) => {
              const isPastEvent = new Date(val.date) < this.currentDate;
              const backgroundColor = isPastEvent
                ? this.pastEventColor
                : this.clubColorMapping[val.club];
              events.push({
                id: val.id,
                title: val.title,
                date: val.date,
                location: val.location,

                description: val.description,
                club: val.club,
                endDuration: val.endDuration,
                startDuration: val.startDuration,
                createdBy: val.createdBy,
                link: val.link,
                iamAttending: val.iamAttending,
                eventStartEditable: false,
                displayIcon: this.clubIconMapping[val.club],
                displayColor: backgroundColor, // Add this line
              });
            });
            resolve(events);
          },
          (error: any) => console.error(error)
        );
    });
  }

  /**
   * Event add modal
   */
  openModal(events?: any) {
    console.log(events);
    this.event = {};
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modaltitle.innerHTML = 'Add Event';

    var modalbtn = document.querySelector('#btn-save-event') as HTMLAreaElement;
    modalbtn.innerHTML = 'Add Event';

    document.getElementById('btn-delete-event')?.classList.add('d-none');

    (document.querySelector('.event-details') as HTMLElement).style.display =
      'none';
    (document.querySelector('.event-form') as HTMLElement).style.display =
      'block';

    this.event.date = events.start;

    if (this.commonService.rbac['create-events']) {
      // if(this.currentDate)
      this.eventModal?.show();
    }

    this.submitted = false;
    this.newEventDate = events;
  }
  selectedEvent: any;
  /**
   * Event click modal show
   */
  handleEventClick(clickInfo: EventClickArg) {
    this.editEvent = clickInfo.event;

    console.log(this.editEvent);

    this.event.id = this.editEvent.id;
    this.event.title = this.editEvent.title;
    this.event.location = this.editEvent.extendedProps['location'];
    this.event.startDuration = this.editEvent.extendedProps['startDuration'];
    this.event.link = this.editEvent.extendedProps['link'];
    // alert( this.commonService.getFormatedDate(this.editEvent.start, 'yyyy-MM-dd') +
    // 'T' +
    //  this.editEvent.extendedProps['endDuration']);
    this.event.endDuration = new Date(
      this.commonService.getFormatedDate(this.editEvent.start, 'yyyy-MM-dd') +
        'T' +
        this.editEvent.extendedProps['endDuration']
    );

    this.event.startDuration = new Date(
      this.commonService.getFormatedDate(this.editEvent.start, 'yyyy-MM-dd') +
        'T' +
        this.event.startDuration
    );

    // var editStartTime = document.getElementById(
    //   'editStartTime'
    // ) as HTMLAreaElement;
    // editStartTime.innerHTML = this.editEvent.extendedProps['startDuration'];
    // var editEndTime = document.getElementById('editEndTime') as HTMLAreaElement;
    // editEndTime.innerHTML = this.editEvent.extendedProps['endDuration'];

    this.event.description = this.editEvent.extendedProps['description'];
    this.event.club = this.editEvent.extendedProps['club'];
    this.event.date = this.editEvent.start;

    this.event.createdBy = this.editEvent.extendedProps['createdBy'];

    this.selectedEvent = this.event;

    this.joinEvent.userId = this.commonService.user;

    this.joinEvent.eventId = this.event;

    (document.querySelector('.event-details') as HTMLElement).style.display =
      'block';
    (document.querySelector('.event-form') as HTMLElement).style.display =
      'none';

    // document.getElementById('btn-delete-event')?.classList.remove('d-none');

    // var editbtn = document.querySelector('#edit-event-btn') as HTMLAreaElement;
    // editbtn.innerHTML = 'edit';

    // (document.getElementById('btn-save-event') as HTMLElement).setAttribute(
    //   'hidden',
    //   'true'
    // );

    var modaltitle = document.querySelector('.event-title') as HTMLAreaElement;
    modaltitle.innerHTML = this.editEvent.title;

    var startdate = document.getElementById(
      'event-start-date-tag'
    ) as HTMLAreaElement;
    // startdate.innerHTML = this.commonService
    //   .getFormatedDate(new Date(this.editEvent.start), 'dd-mm-yyyy')
    //   .split(' ')[0];
    startdate.innerHTML = this.commonService.formatDate(this.editEvent.start);

    var startTime = document.getElementById(
      'event-timepicker1-tag'
    ) as HTMLAreaElement;
    startTime.innerHTML = this.commonService.convertToAmPm(
      this.editEvent.extendedProps['startDuration']
    );
    var endTime = document.getElementById(
      'event-timepicker2-tag'
    ) as HTMLAreaElement;
    endTime.innerHTML = this.commonService.convertToAmPm(
      this.editEvent.extendedProps['endDuration']
    );

    var location = document.getElementById(
      'event-location-tag'
    ) as HTMLAreaElement;
    location.innerHTML = this.commonService.urlify(
      this.editEvent.extendedProps['location'],
      'blue'
    );

    var description = document.getElementById(
      'event-description-tag'
    ) as HTMLAreaElement;
    description.innerHTML = this.commonService.urlify(
      this.editEvent.extendedProps['description'],
      'blue'
    );

    var club = document.getElementById('event-club-tag') as HTMLAreaElement;
    club.innerHTML = this.editEvent.extendedProps['club'];

    // var link = document.getElementById('event-club-tag') as HTMLAreaElement;
    // club.innerHTML = this.editEvent.extendedProps['club'];

    this.eventDetails?.show();

    if (this.editEvent.extendedProps['iamAttending'] == true) {
      this.selectedOption = 'Yes';
    } else {
      this.selectedOption = 'No';
    }
  }

  showeditEvent() {
    if (document.querySelector('#edit-event-btn')?.innerHTML == 'cancel') {
      this.eventDetails?.hide();
    } else {
      this.eventDetails?.hide();
      this.eventModal?.show();

      (document.querySelector('.event-details') as HTMLElement).style.display =
        'none';
      (document.querySelector('.event-form') as HTMLElement).style.display =
        'block';
      (
        document.getElementById('btn-save-event') as HTMLElement
      ).removeAttribute('hidden');
      var modalbtn = document.querySelector(
        '#btn-save-event'
      ) as HTMLAreaElement;
      modalbtn.innerHTML = 'Update Event';
      // var editbtn = document.querySelector(
      //   '#edit-event-btn'
      // ) as HTMLAreaElement;
      // editbtn.innerHTML = 'cancel';
    }
  }

  selectedOption: string = '';

  onSelectChange(event: any): void {
    //this.selectedOption = event.target.value;
    setTimeout(() => {
      // alert(this.selectedOption);
      if (this.selectedOption == 'Yes') {
        this.joiningEvent();
      } else {
        this.removeMyJoining();
      }
    }, 500);
  }

  onButtonClick(): void {
    alert(`Selected option: ${this.selectedOption}`);
  }
  /**
   * For loading Clubs
   */
  clubs: any;
  loadClub(): void {
    this.commonService.showProcessingIcon();
    let url = 'mainservice/framework/clubs/show';

    this.commonService.get(url).subscribe((data: any) => {
      if (data['result'] === 200) {
        this.clubs = data['dataObject'];
        // console.log(this.clubs);
      }
    });
  }

  /**
   * Saving event
   */

  event: any = {};

  /**
   * Events bind in calander
   * @param events events
   */
  //handleEvents(events: EventApi[]) {
  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    // console.log("this.currentEvents");
  }

  /**
   * Close event modal
   */
  closeEventModal() {
    this.event = {};
    this.eventModal?.hide();
  }

  /**
   * Save the event
   */
  saveEvent() {
    if (document.querySelector('#btn-save-event')?.innerHTML == 'Add Event') {
      this.event.startDuration = new Date(this.event.startDuration)
        .toTimeString()
        .split(' ')[0];

      this.event.endDuration = new Date(this.event.endDuration)
        .toTimeString()
        .split(' ')[0];
      // console.log(this.event);

      this.commonService.showProcessingIcon();
      this.event.createdBy = this.commonService.user;
      this.commonService
        .post('mainservice/framework/event/save', this.event)
        .subscribe((data: any) => {
          if (data['result'] === 200) {
            this.commonService.showSuccessMessage('Event', 'Event Saved');
            this.selectedEvent = data['dataObject'];
            // Notification
            this.commonService.sendNotification(
              data['message'],
              this.selectedEvent.createdBy.name +
                ' has added an Event ' +
                '"' +
                this.selectedEvent.title +
                '"',
              'fw/calendar',
              'COMMUNITY MEMBER',
              1,
              0
            );

            this.loadCalendarOptions();
            this.eventModal?.hide();
          }
        });
    } else {
      this.editEventSave();
    }
  }

  /**
   * save edit event data
   */
  editEventSave() {
    console.log(this.event);

    this.event.startDuration = new Date(this.event.startDuration)
      .toTimeString()
      .split(' ')[0];

    this.event.endDuration = new Date(this.event.endDuration)
      .toTimeString()
      .split(' ')[0];
    this.commonService.showProcessingIcon();
    if (!this.event.createdBy) {
      //it is a new event
      this.event.createdBy = this.commonService.user;
      this.selectedEvent = this.event;
    }
    this.commonService
      .post('mainservice/framework/event/save', this.event)
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          this.commonService.showSuccessMessage('Event', 'Event Update');
          // Notification
          this.loadCalendarOptions();
          // this.commonService.sendNotification(
          //   data['message'],
          //   this.selectedEvent.createdBy.name +
          //     ' has updated  Event ' +
          //     '"' +
          //     this.selectedEvent.title +
          //     '"',
          //   'fw/calendar',
          //   'COMMUNITY MEMBER',
          //   1,
          //   0
          // );
          this.loadCalendarOptions();
        }
      });

    this.closeEventModal();
  }

  // Get the member of the event
  joinedMembers: any;
  getMembers(): void {
    this.commonService
      .get(
        'mainservice/framework/eventUserList/showMembers/' +
          this.selectedEvent.id
      )
      .subscribe((data: any) => {
        if (data['result'] == 200) {
          this.joinedMembers = data['dataObject'];
          // console.log(this.joinedMembers);
          // this.commonService.showSuccessMessage(
          //   'Retrived',
          //   'Users from user list'
          // );
        }
      });
  }

  /**
   * Delete event
   */

  removeEvent(): void {
    this.eventModal?.hide();
    Swal.fire({
      title: 'Confirmation required',
      text: 'Are you sure you want to delete Club ' + this.event.title + ' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        this.deleteEventData();
      }
    });
  }

  deleteEventData() {
    this.commonService.showProcessingIcon();
    this.commonService
      .post(
        'mainservice/framework/event/removeEvent/' + this.event.id,
        this.event
      )
      .subscribe((data: any) => {
        if (data['result'] === 200) {
          this.commonService.showSuccessMessage('Event', 'Event Deleted');
          this.loadCalendarOptions();
          this.closeEventModal();
        }
      });
  }

  getEventListByUser(): void {
    this.commonService
      .get(
        'mainservice/framework/eventUserList/show' + this.commonService.user.id
      )
      .subscribe((data: any) => {
        if (data['result'] == 200) {
          this.commonService.showSuccessMessage(
            'Retrived',
            'Users from user list'
          );
        }
      });
  }
  whatsappGroup(): void {
    if (this.event.link == null) {
      this.commonService.showErrorMessage('Link', 'There No Whatsapp Group');
    } else {
      window.open(this.event.link);
    }
  }

  byUserAndEvent: any;
  getEventListByEventIdAndUserId(): void {
    this.commonService
      .get(
        'mainservice/framework/eventUserList/getEventUser/' +
          this.commonService.user.id +
          '/' +
          this.selectedEvent.id
      )
      .subscribe((data: any) => {
        if (data['result'] == 200) {
          this.byUserAndEvent = data['dataObject'];

          this.removingMember();
        }
      });
  }

  joiningEvent(): void {
    this.eventDetails.hide();
    Swal.fire({
      title: 'Confirmation required',
      text: 'Are you sure you want to join ' + this.event.title + ' event ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        this.joiningMember();
      }
    });
  }

  joinEvent: any = {};
  joiningMember(): void {
    var url = 'mainservice/framework/eventUserList/save';
    this.commonService.post(url, this.joinEvent).subscribe((data: any) => {
      if (data['result'] == 200) {
        if (this.event.link != null) {
          window.open(this.event.link);
        }

        this.commonService.showSuccessMessage(
          'Success',
          'You Joined the Event :)'
        );

        this.loadCalendarOptions();
      } else {
        this.commonService.showErrorMessage(
          'Error',
          'You are not able to join :('
        );
      }
    });
  }

  removeMyJoining(): void {
    this.eventModal?.hide();
    Swal.fire({
      title: 'Confirmation required',
      text:
        'Are you sure you do not want to join ' + this.event.title + ' event ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(3, 142, 220)',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        this.removingMember();
      }
    });
  }
  removingMember(): void {
    var url =
      'mainservice/framework/eventUserList/removeEventUserList/' +
      this.commonService.user.id;
    this.commonService.post(url, this.event).subscribe((data: any) => {
      if (data['result'] == 200) {
        this.eventDetails.hide();
        this.commonService.showSuccessMessage(
          'Success',
          'Your response has been marked.'
        );
        this.loadCalendarOptions();
      } else {
        this.commonService.showErrorMessage(
          'Error',
          'You are not able to join :('
        );
      }
    });
  }
}
