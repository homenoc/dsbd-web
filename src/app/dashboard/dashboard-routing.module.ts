import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NoticeComponent} from "./notice/notice.component";
import {BaseComponent} from "./base/base.component";
import {DashboardComponent} from "./dashboard.component";
import {AgreementComponent} from "./registration/agreement/agreement.component";
import {QuestionComponent} from "./registration/question/question.component";
import {Contract1Component} from "./registration/contract1/contract1.component";
import {Contract2Component} from "./registration/contract2/contract2.component";


const routes: Routes = [{
  path: 'dashboard',
  component: DashboardComponent,
  children: [
    {path: '', redirectTo: 'notice', pathMatch: 'full'},
    {path: 'notice', component: NoticeComponent},
    {path: 'base', component: BaseComponent},
    {path: 'registration/agreement', component: AgreementComponent},
    {path: 'registration/question', component: QuestionComponent},
    {path: 'registration/contract1', component: Contract1Component},
    {path: 'registration/contract2', component: Contract2Component},

  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
