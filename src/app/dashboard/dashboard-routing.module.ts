import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NoticeComponent} from './notice/notice.component';
import {DashboardComponent} from './dashboard.component';
import {InitComponent} from './registration/init/init.component';
import {InfoComponent} from './info/info.component';
import {RegistrationComponent} from './registration/registration.component';
import {SettingComponent} from './setting/setting.component';
import {AuthGuard} from '../guard/auth.guard';
import {NetworkComponent} from './registration/network/network.component';
import {ConnectionComponent} from './registration/connection/connection.component';
import {SupportComponent} from './support/support.component';
import {ChatComponent} from './support/chat/chat.component';


const routes: Routes = [{
  path: 'dashboard',
  component: DashboardComponent,
  children: [
    {path: '', redirectTo: 'notice', pathMatch: 'full'},
    {path: 'notice', component: NoticeComponent},
    {path: 'support', component: SupportComponent},
    {path: 'support/:id', component: ChatComponent},
    {path: 'info', component: InfoComponent},
    {path: 'setting', component: SettingComponent},
    {path: 'registration/init', component: InitComponent},
    {path: 'registration/network', component: NetworkComponent},
    {path: 'registration/connection', component: ConnectionComponent},
    {path: 'registration', component: RegistrationComponent},
  ],
  canActivate: [AuthGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
