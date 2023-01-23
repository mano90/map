import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StateService } from '../services/state.service';
import { NavigationEnd, Router } from '@angular/router';
import { CommuneService } from '../services/commune.service';
import { DistrictService } from '../services/district.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  isStatistique: boolean = false;
  isActive: boolean;
  pushRightClass: string;

  collapsed: boolean = true;
  data: any = '';
  contenuDistrict: any;
  contenuCommune: any;
  @Output() collapsedEvent = new EventEmitter<boolean>();

  constructor(
    public stateService: StateService,
    private communeService: CommuneService,
    private districtService: DistrictService,
    public router: Router
  ) {
    this.router.events.subscribe((val) => {
      if (
        val instanceof NavigationEnd &&
        window.innerWidth <= 992 &&
        this.isToggled()
      ) {
        this.toggleSidebar();
      }
    });
  }

  ngOnInit(): void {
    this.isActive = false;
    this.collapsed = false;
    this.stateService.currentMessage.subscribe((data) => {
      this.data = data;

      if (data.district)
        this.districtService.getItem(data.district).subscribe((res: any) => {
          this.contenuDistrict = JSON.parse(res.contenu);
        });
      else this.contenuDistrict = '';

      if (data.commune)
        this.communeService.getItem(data.commune).subscribe((res: any) => {
          this.contenuCommune = JSON.parse(res.contenu);
        });
      else this.contenuCommune = '';
    });
    this.stateService.currentCollapse.subscribe((res: boolean) => {
      this.collapsed = res;
      this.collapsedEvent.emit(res);
    });
    this.stateService.currentIsStatistique.subscribe((res: boolean) => {
      this.isStatistique = res;
    });
  }

  toggleCollapsed() {
    if (this.isStatistique === false) {
      this.collapsed = !this.collapsed;
      this.stateService.changeCollapsed(this.collapsed);
      this.collapsedEvent.emit(this.collapsed);
    }
  }

  rltAndLtr() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle('rtl');
  }

  eventCalled() {
    this.isActive = !this.isActive;
  }

  isToggled(): boolean {
    const dom: Element = document.querySelector('body')!;
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }
}
