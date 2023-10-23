import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { ProfileComponent } from './Components/ProfileComponents/profile/profile.component';
import { AboutComponent } from './Components/ProfileComponents/about/about.component';
import { PostsComponent } from './Components/ProfileComponents/posts/posts.component';
import { NewpostsComponent } from './newposts/newposts.component';
import { AuthGuard } from './Components/Guard/auth.guard';
import { NewpollComponent } from './newpoll/newpoll.component';
import { NationalnewsComponent } from './nationalnews/nationalnews.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'Register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'about', component: AboutComponent , canActivate: [AuthGuard]},
  { path: 'posts', component: PostsComponent , canActivate: [AuthGuard]},
  {
    path: 'home',
    loadChildren: () => import('./home/home-routing.module').then((m) => m.HomeRoutingModule)
  },
  {path:'newpost',component:NewpostsComponent },
  {path:'newpoll',component:NewpollComponent },
  {path:'nationalnews',component:NationalnewsComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
