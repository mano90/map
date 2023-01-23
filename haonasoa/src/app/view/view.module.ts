import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ContenuComponent } from '../contenu/contenu.component';
import { ViewComponent } from './view.component';
import { ViewRoutingModule } from './view-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ViewComponent, SidebarComponent, ContenuComponent],
  imports: [CommonModule, ViewRoutingModule, FormsModule],
})
export class ViewModule {}
