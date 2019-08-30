import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { PostsComponent } from './posts/posts.component';
import { PostService } from './services/post.service';
import { EditpostComponent } from './editpost/editpost.component';
import { MatFileUploadModule } from 'mat-file-upload';
import { HeaderComponent } from './core/header/header.component';
import { ListingComponent } from './component/listing/listing.component';
import { TrimPipe } from './pipes/trim.pipe';


@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    EditpostComponent,
    HeaderComponent,
    ListingComponent,
    TrimPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFileUploadModule,

    // Flex-layout
    FlexLayoutModule

  ],
  providers: [PostService],
  bootstrap: [AppComponent]
})
export class AppModule { }
