import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddSubComponent } from './add-sub/add-sub.component';
import { ProfileComponent } from './profile/profile.component';
import { FaqComponent } from './faq/faq.component';
import { InfoComponent } from './info/info.component';
import { AgreementComponent } from './agreement/agreement.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'My Budget Planner - Home' },
  { path: 'add', component: AddSubComponent },
  { path: 'profile', component: ProfileComponent, title: 'My Budget Planner - Profile' },
  { path: 'faq', component: FaqComponent, title: 'My Budget Planner - FAQ' },
  { path: 'info', component: InfoComponent, title: 'My Budget Planner - Info' },
  { path: 'agreement', component: AgreementComponent, title: 'My Budget Planner - Agreement' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
