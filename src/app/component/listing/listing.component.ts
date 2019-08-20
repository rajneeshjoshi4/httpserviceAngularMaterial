import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Post } from './../../models/post';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit {
  dataSource: Post[];
  displayedColumns: string[] = ['select', 'crno', 'desc', 'raisedby', 'raisedon', 'effort', 'total', 'status', 'action'];
  selection = new SelectionModel<Post>(true, []);


  constructor(private service: PostService,
    private router: Router,
    private route: ActivatedRoute) {
    this.dataSource = [];
   
  }

  ngOnInit() {
    this.getAllPosts();
  }

  getAllPosts() {
    this.service.getPostsList()
      .subscribe(response => {
        this.dataSource = new MatTableDataSource<Post>(response);
        //console.log(this.posts);
      })

  }

  deletePost(post) {
    //console.log(post);
    if (confirm('Are you sure?')) {
      this.service.deletePost(post.id)
        .subscribe(response => {
          this.getAllPosts();
        })
    }
  }
  
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected;
    const numRows = this.dataSource.data;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Post): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


}
