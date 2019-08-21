import { Post } from './../models/post';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { CustomFilePickerAdapter } from './../custom-file-picker.adapter';

@Component({
  selector: 'app-editpost',
  templateUrl: './editpost.component.html',
  styleUrls: ['./editpost.component.scss']
})
export class EditpostComponent implements OnInit {
  confermationStr: string = "New post has been added.";

  isAdded: boolean = false;
  id: number;
  post: Post;

  editMode = false;
  posts: any = [];

  editPostForm: FormGroup;

  adapter = new CustomFilePickerAdapter(this.http);



  constructor(private service: PostService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient) {
    this.post = new Post();
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params["id"];
    //console.log(this.id);
    this.editMode = this.id != null;

    this.editPostForm = new FormGroup({
      'crno': new FormControl(''),
      'desc': new FormControl(''),
      'raisedby': new FormControl(''),
      'raisedon': new FormControl(''),
      'effort': new FormControl(''),
      'total': new FormControl(''),
      'status': new FormControl(''),
      'attachment': new FormControl(''),
      'raisedwithclient': new FormControl('')
    })


    if (this.editMode == true) {
      this.service.getPost(this.id).subscribe(responseData => {
        this.post = responseData;
        console.log(this.post);

        this.editPostForm.setValue({
          'crno': this.post.crno,
          'desc': this.post.desc,
          'raisedby': this.post.raisedby,
          'raisedon': this.post.raisedon,
          'effort': this.post.effort,
          'total': this.post.total,
          'status': this.post.status,
          'attachment': this.post.attachment,
          'raisedwithclient': this.post.raisedwithclient

        })

      })
    }
  }

  onSubmit() {
    console.log(this.editPostForm);
    let post: Post = {
      id: this.id,
      crno: this.editPostForm.value.crno,
      desc: this.editPostForm.value.desc,
      raisedby: this.editPostForm.value.raisedby,
      raisedon: this.editPostForm.value.raisedon,
      effort: this.editPostForm.value.effort,
      total: this.editPostForm.value.total,
      status: this.editPostForm.value.status,
      attachment: this.editPostForm.value.attachment,
      raisedwithclient: this.editPostForm.value.raisedwithclient
    }

    if (this.editMode) {
      this.updatePost(post.id, post)
    }
    else {
      this.createPost(post)

    }
    this.editPostForm.reset();

  }

  updatePost(postId, post) {
    this.service.updatePost(postId, post)
      .subscribe(response => {
        this.router.navigate(['/']);
      })
  }

  createPost(post) {
    this.service.createPost(post)
      .subscribe(response => {
        console.log(response);
        this.isAdded = true;
        setTimeout(() => { this.isAdded = false; }, 3000);
      })
  }

}
