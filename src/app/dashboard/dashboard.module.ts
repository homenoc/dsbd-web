import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {NoticeComponent} from './notice/notice.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {InitComponent} from './registration/init/init.component';
import {InfoComponent} from './info/info.component';
import {RegistrationComponent} from './registration/registration.component';
import {MatTableModule} from '@angular/material/table';
import {CdkColumnDef, CdkTableModule} from '@angular/cdk/table';
import {MatSortModule} from '@angular/material/sort';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {ServiceComponent} from './registration/service/service.component';
import {ConnectionComponent} from './registration/connection/connection.component';
import {MatSelectModule} from '@angular/material/select';
import {SupportComponent} from './support/support.component';
import {ChatComponent} from './support/chat/chat.component';
import {BugComponent} from './bug/bug.component';
import {ProcedureComponent} from './procedure/procedure.component';
import {GroupComponent} from './procedure/group/group.component';
import {UserAddComponent} from './procedure/user-add/user-add.component';
import {UserComponent} from './procedure/user/user.component';
import {UserDetailComponent} from './procedure/user-detail/user-detail.component';
import {MemberComponent} from './member/member.component';
import {PaymentComponent} from './member/payment/payment.component';


@NgModule({
  declarations: [
    DashboardComponent,
    NoticeComponent,
    InitComponent,
    InfoComponent,
    RegistrationComponent,
    ServiceComponent,
    ConnectionComponent,
    SupportComponent,
    ChatComponent,
    BugComponent,
    ProcedureComponent,
    GroupComponent,
    UserAddComponent,
    UserComponent,
    UserDetailComponent,
    MemberComponent,
    PaymentComponent,
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
    MatSelectModule,
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
  entryComponents: [],
  providers: [CdkColumnDef]
})
export class DashboardModule {
}
