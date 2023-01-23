import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  animations: [
    trigger('slidein', [
      transition(':enter', [
        // when ngif has true
        style({ transform: 'translateX(-100%)' }),
        animate(250, style({ transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        // when ngIf has false
        animate(250, style({ transform: 'translateX(-100%)' })),
      ]),
    ]),
  ],
})
export class ViewComponent implements OnInit {
  collapedSideBar: boolean = true;
  constructor() {}

  ngOnInit(): void {}

  receiveCollapsed($event: any) {
    this.collapedSideBar = $event;
  }
}
