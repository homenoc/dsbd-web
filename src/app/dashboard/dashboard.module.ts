import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {NoticeComponent} from './notice/notice.component';
import {BaseComponent} from './base/base.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatChipsModule} from "@angular/material/chips";
import {MatRadioModule} from "@angular/material/radio";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {AgreementComponent} from './registration/agreement/agreement.component';
import {QuestionComponent} from './registration/question/question.component';
import {Contract1Component} from './registration/contract1/contract1.component';
import {Contract2Component} from './registration/contract2/contract2.component';


@NgModule({
  declarations: [
    DashboardComponent,
    NoticeComponent,
    BaseComponent,
    AgreementComponent,
    QuestionComponent,
    Contract1Component,
    Contract2Component
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatCardModule,
    MatSidenavModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatProgressBarModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatInputModule,
    FormsModule,
    MatListModule,
    MatRadioModule,
    MatDatepickerModule,
    MatCheckboxModule
  ],
  exports: [
    MatCardModule,
    MatSidenavModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatProgressBarModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatInputModule,
    FormsModule,
  ]
})
export class DashboardModule {
}
