import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NoticeComponent} from './notice/notice.component';
import {DashboardComponent} from './dashboard.component';
import {InitComponent} from './registration/init/init.component';
import {QuestionComponent} from './registration/question/question.component';
import {Contract1Component} from './registration/contract1/contract1.component';
import {Contract2Component} from './registration/contract2/contract2.component';
import {DataComponent} from './data/data.component';
import {RegistrationComponent} from './registration/registration.component';
import {SettingComponent} from './setting/setting.component';
import {AuthGuard} from '../guard/auth.guard';


const routes: Routes = [{
  path: 'dashboard',
  component: DashboardComponent,
  children: [
    {path: '', redirectTo: 'notice', pathMatch: 'full'},
    {path: 'notice', component: NoticeComponent},
    {path: 'data', component: DataComponent},
    {path: 'setting', component: SettingComponent},
    {path: 'user_registration/init', component: InitComponent},
    {path: 'user_registration/question', component: QuestionComponent},
    {path: 'user_registration/contract1', component: Contract1Component},
    {path: 'user_registration/contract2', component: Contract2Component},
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
