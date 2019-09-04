import { Post } from './../models/post';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { noWhitespaceValidator } from 'src/app/validators/no-whitespace.validator'


import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
const moment = _rollupMoment || _moment;


// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-editpost',
  templateUrl: './editpost.component.html',
  styleUrls: ['./editpost.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
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


  /* date validatioin */
  todayDate = new Date();
  minDate = moment(this.todayDate).subtract(1, 'month').toDate();
  maxDate = moment(this.todayDate).add(1, 'month').toDate();

  // Prevent Saturday and Sunday from being selected.
  myFilter = (d: Date): boolean => {
    const day = moment(d).day();
    return day !== 0 && day !== 6;
  }



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
      'ChangeDescription': new FormControl('', [Validators.required, Validators.maxLength(256), noWhitespaceValidator]),
      'RaisedBy': new FormControl('', [Validators.required]),
      'RaisedOn': new FormControl(moment(), [Validators.required]),
      'EffortHours': new FormControl('', [
        Validators.required,
        Validators.min(0)
        //Validators.pattern("^[0-9]*$"),
      ]),
      'Total': new FormControl('', [Validators.required,
      Validators.required,
      Validators.min(0),
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

        this.editPostForm.get('RaisedOn').clearValidators()
        this.editPostForm.get('RaisedOn').setValidators([Validators.required]);
       // this.editPostForm.get('RaisedOn').updateValueAndValidity();
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
