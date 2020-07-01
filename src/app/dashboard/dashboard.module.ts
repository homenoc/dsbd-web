import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {NoticeComponent} from './notice/notice.component';
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
import {DataComponent} from './data/data.component';
import {RegistrationComponent} from './registration/registration.component';
import {MatTableModule} from "@angular/material/table";
import {CdkColumnDef, CdkTableModule} from "@angular/cdk/table";
import {MatSortModule} from "@angular/material/sort";
import {MatGridListModule} from "@angular/material/grid-list";
import { SettingComponent } from './setting/setting.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatExpansionModule} from "@angular/material/expansion";


@NgModule({
  declarations: [
    DashboardComponent,
    NoticeComponent,
    AgreementComponent,
    QuestionComponent,
    Contract1Component,
    Contract2Component,
    DataComponent,
    RegistrationComponent,
    SettingComponent
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
    MatCheckboxModule,
    CdkTableModule,
    MatTableModule,
    MatSortModule,
    MatGridListModule,
    MatTabsModule,
    MatExpansionModule,
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
    CdkTableModule,
    MatListModule,
    MatTableModule,
    CdkColumnDef
  ],
  providers: [CdkColumnDef]
})
export class DashboardModule {
}
