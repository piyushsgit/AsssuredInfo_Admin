import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AuthGuard } from '../Components/Guard/auth.guard';

const routes: Routes = [

 {path:'homepage',component:HomepageComponent ,canActivate: [AuthGuard]}


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
