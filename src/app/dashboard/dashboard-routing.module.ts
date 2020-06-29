import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NoticeComponent} from "./notice/notice.component";
import {DashboardComponent} from "./dashboard.component";
import {AgreementComponent} from "./registration/agreement/agreement.component";
import {QuestionComponent} from "./registration/question/question.component";
import {Contract1Component} from "./registration/contract1/contract1.component";
import {Contract2Component} from "./registration/contract2/contract2.component";
import {DataComponent} from "./data/data.component";
import {RegistrationComponent} from "./registration/registration.component";


const routes: Routes = [{
  path: 'dashboard',
  component: DashboardComponent,
  children: [
    {path: '', redirectTo: 'notice', pathMatch: 'full'},
    {path: 'notice', component: NoticeComponent},
    {path: 'data', component: DataComponent},
    {path: 'registration/agreement', component: AgreementComponent},
    {path: 'registration/question', component: QuestionComponent},
    {path: 'registration/contract1', component: Contract1Component},
    {path: 'registration/contract2', component: Contract2Component},
    {path: 'registration', component: RegistrationComponent},

  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
