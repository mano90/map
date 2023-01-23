import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Echelon } from '../Classes/Echelon';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private messageSource = new BehaviorSubject<Echelon>(new Echelon('', ''));
  private isCollapsed = new BehaviorSubject<boolean>(false);

  private isStatistique = new BehaviorSubject<boolean>(false);
  currentIsStatistique = this.isStatistique.asObservable();
  currentCollapse = this.isCollapsed.asObservable();
  currentMessage = this.messageSource.asObservable();
  constructor() {}

  changeMessage(echelon: Echelon) {
    this.messageSource.next(echelon);
  }

  changeCollapsed(params: boolean) {
    this.isCollapsed.next(params);
  }

  changeCurrentIsStatistique(params: boolean) {
    this.isStatistique.next(params);
  }
}
