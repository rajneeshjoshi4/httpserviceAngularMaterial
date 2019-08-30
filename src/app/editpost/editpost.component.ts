import { Post } from './../models/post';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  post: any;

  editMode = false;
  posts: any = [];
  statusList: any = [];
  statusValSelected: number;

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
      'CrId': new FormControl(), //id is auto generated
      'ProjectId': new FormControl(2003),
      'ChangeDescription': new FormControl('', [Validators.required, Validators.maxLength(256)]),
      'RaisedBy': new FormControl('', [Validators.required]),
      'RaisedOn': new FormControl('', [Validators.required]),
      'EffortHours': new FormControl('', [Validators.required,
      Validators.pattern("^[0-9]*$"),
      Validators.maxLength(3)]),
      'Total': new FormControl('', [Validators.required,
      Validators.pattern("^[0-9]*$"),
      Validators.maxLength(3),]),
      'ApprovalStatus': new FormControl('', [Validators.required]),
      'Documents': new FormControl(''),
      'SharedWithCustomerOn': new FormControl('', [Validators.required]),
      'Comments': new FormControl('')

    })

    this.editPostForm.get('CrId').setValue(0);
    this.editPostForm.get('ProjectId').disable();


    if (this.editMode == true) {
      this.service.getPost(this.id).subscribe(responseData => {
        this.post = responseData.Content.Result;
        //console.log(this.post);

        this.statusValSelected = this.post.ApprovalStatus;
        //console.log(this.statusValSelected);

        this.editPostForm.setValue({
          'CrId': this.post.CrId,
          'ProjectId': this.post.ProjectId,
          'ChangeDescription': this.post.ChangeDescription,
          'RaisedBy': this.post.RaisedBy,
          'RaisedOn': this.post.RaisedOn,
          'EffortHours': this.post.EffortHours,
          'Total': this.post.Total,
          'ApprovalStatus': this.post.ApprovalStatus,
          'Documents': this.post.Documents,
          'SharedWithCustomerOn': this.post.SharedWithCustomerOn,
          'Comments': this.post.Comments
        });
      })
    }

    this.service.getApprovedStatus().subscribe(responseData => {
      this.statusList = responseData.Content.Result;
      console.log(this.statusList)
    })
  }

  onSubmit() {
    console.log(this.editPostForm);
    let post: any = {
      CrId: this.editPostForm.value.CrId,
      ProjectId: this.post.ProjectId || 2003,
      ChangeDescription: this.editPostForm.value.ChangeDescription,
      RaisedBy: this.editPostForm.value.RaisedBy,
      RaisedOn: this.editPostForm.value.RaisedOn,
      EffortHours: this.editPostForm.value.EffortHours,
      Total: this.editPostForm.value.Total,
      ApprovalStatus: this.editPostForm.value.ApprovalStatus,
      SharedWithCustomerOn: this.editPostForm.value.SharedWithCustomerOn,
      Comments: this.editPostForm.value.Comments
    }

    if (this.editMode) {
      this.updatePost(post.CrId, post)
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

  hasError(controlName: string, errorName: string) {
    return this.editPostForm.controls[controlName].hasError(errorName);
  }

}
