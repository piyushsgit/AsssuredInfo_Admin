import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { ProfileComponent } from './Components/ProfileComponents/profile/profile.component';
import { AboutComponent } from './Components/ProfileComponents/about/about.component';
import { PostsComponent } from './Components/ProfileComponents/posts/posts.component';
import { NewpostsComponent } from './newposts/newposts.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'Register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'about', component: AboutComponent },
  { path: 'posts', component: PostsComponent },
  {
    path: 'home',
    loadChildren: () => import('./home/home-routing.module').then((m) => m.HomeRoutingModule)
  },
  {path:'newpost',component:NewpostsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
