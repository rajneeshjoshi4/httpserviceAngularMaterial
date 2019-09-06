import { PostsComponent } from './posts/posts.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditpostComponent } from 'src/app/editpost/editpost.component';
import { CountriesComponent } from 'src/app/countries/countries.component';

const routes: Routes = [
  { path: '', component: PostsComponent },
  // { path: 'addPost', component: AddpostComponent },
  { path: 'addPost', component: EditpostComponent },
  { path: 'editPost/:id', component: EditpostComponent },
  { path: 'countries', component: CountriesComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
