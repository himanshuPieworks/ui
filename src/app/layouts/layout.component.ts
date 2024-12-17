import { Component } from '@angular/core';
import { LAYOUT_HORIZONTAL, LAYOUT_TWOCOLUMN, LAYOUT_VERTICAL } from './layout.model';
import { EventService } from '../core/services/event.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  // layout related config
  layoutType!: string;
  showMain: any;

  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.layoutType = LAYOUT_HORIZONTAL;

    // listen to event and change the layout, theme, etc
    this.eventService.subscribe('changeLayout', (layout) => {
      this.layoutType = layout;
    });
  }
  /**
  * Check if the vertical layout is requested
  */
  isVerticalLayoutRequested() {
    return this.layoutType === LAYOUT_VERTICAL;
  }

  /**
   * Check if the horizontal layout is requested
   */
  isHorizontalLayoutRequested() {
    return this.layoutType === LAYOUT_HORIZONTAL;
  }

  /**
   * Check if the horizontal layout is requested
   */
  isTwoColumnLayoutRequested() {
    return this.layoutType === LAYOUT_TWOCOLUMN;
  }
}
