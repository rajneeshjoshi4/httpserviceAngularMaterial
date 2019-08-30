import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../services/post.service';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  //@ViewChild('form', { static: true }) inputPostForm: NgForm;
  posts: any;
  statusList: any = [];
  filterValue: string;




  constructor(private service: PostService,
    private router: Router,
    private route: ActivatedRoute) {
    this.posts = [];
  }

  getAllPosts() {
    this.service.getPostsList()
      .subscribe(response => {
        this.posts = response;
        //console.log(this.posts);
      })

  }

  // deletePost(post) {
  //   //console.log(post);
  //   if (confirm('Are you sure?')) {
  //     this.service.deletePost(post.id)
  //       .subscribe(response => {
  //         this.getAllPosts();
  //       })
  //   }
  // }

  nvaigateToAdd() {
    this.router.navigate(['addPost'], { relativeTo: this.route });
  }

  trackPost(index, post) {
    return post ? post.id : undefined;
  }

  statusfilter(value?) {
    if (value) {
      this.filterValue = value;
    }
    else {
      this.filterValue = '';
    }
  }

  ngOnInit() {
    this.getAllPosts();

    this.service.getApprovedStatus().subscribe(responseData => {
      this.statusList = responseData.Content.Result;
      console.log(this.statusList)
    })

  }
}
