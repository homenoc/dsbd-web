import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NoticeComponent} from './notice/notice.component';
import {DashboardComponent} from './dashboard.component';
import {InitComponent} from './registration/init/init.component';
import {InfoComponent} from './info/info.component';
import {RegistrationComponent} from './registration/registration.component';
import {AuthGuard} from '../guard/auth.guard';
import {ServiceComponent} from './registration/service/service.component';
import {ConnectionComponent} from './registration/connection/connection.component';
import {SupportComponent} from './support/support.component';
import {ChatComponent} from './support/chat/chat.component';
import {BugComponent} from './bug/bug.component';
import {ProcedureComponent} from './procedure/procedure.component';
import {GroupComponent} from './procedure/group/group.component';
import {UserComponent} from './procedure/user/user.component';
import {UserAddComponent} from './procedure/user-add/user-add.component';
import {UserDetailComponent} from './procedure/user-detail/user-detail.component';
import {MemberComponent} from './member/member.component';
import {PaymentComponent} from './member/payment/payment.component';


const routes: Routes = [{
  path: 'dashboard',
  component: DashboardComponent,
  children: [
    {path: '', redirectTo: 'notice', pathMatch: 'full'},
    {path: 'notice', component: NoticeComponent},
    {path: 'support', component: SupportComponent},
    {path: 'support/:id', component: ChatComponent},
    {path: 'info', component: InfoComponent},
    {path: 'member', component: MemberComponent},
    {path: 'member/payment', component: PaymentComponent},
    {path: 'procedure', component: ProcedureComponent},
    {path: 'procedure/group', component: GroupComponent},
    {path: 'procedure/user', component: UserComponent},
    {path: 'procedure/user/add', component: UserAddComponent},
    {path: 'procedure/user/:id', component: UserDetailComponent},
    {path: 'registration/init', component: InitComponent},
    {path: 'registration/service', component: ServiceComponent},
    {path: 'registration/connection', component: ConnectionComponent},
    {path: 'registration', component: RegistrationComponent},
    {path: 'bug', component: BugComponent},
  ],
  canActivate: [AuthGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
