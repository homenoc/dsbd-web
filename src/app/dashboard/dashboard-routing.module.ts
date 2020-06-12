import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NoticeComponent} from "./notice/notice.component";
import {BaseComponent} from "./base/base.component";
import {DashboardComponent} from "./dashboard.component";


const routes: Routes = [{
  path: 'dashboard',
  component: DashboardComponent,
  children: [
    {path: '', redirectTo: 'notice', pathMatch: 'full'},
    {path: 'notice', component: NoticeComponent},
    {path: 'base', component: BaseComponent},
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
