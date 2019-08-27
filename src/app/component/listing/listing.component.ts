import { Post } from './../../models/post';
import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})

export class ListingComponent implements OnInit, OnChanges {
  @Input() filterValue: string;
  dataSource: any = [];
  displayedColumns: string[] = ['select', 'crno', 'desc', 'raisedby', 'raisedon', 'effort', 'total', 'status', 'attachment', 'action'];
  selection;
  loading: boolean = true;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private service: PostService,
    private router: Router,
    private route: ActivatedRoute) {
    this.selection = new SelectionModel<any>(true, []);

  }

  ngOnInit() {
    this.getAllPosts();

  }
  ngOnChanges() {
    console.log(`ngOnChanges - data is ${this.filterValue}`);
    //this.getAllPosts();
    
  }

  getAllPosts() {
    this.service.getPostsList()
      .subscribe(response => {
        this.dataSource = new MatTableDataSource<any>(response.Content.Result);
        this.dataSource.paginator = this.paginator;
        this.loading = false;
        console.log(this.filterValue);

        //console.log(response);
        //console.log(response.Content.Result);
      })

  }

  deletePost(CrId) {
    //console.log(post);
    if (confirm('Are you sure want to delete the record?')) {
      this.service.deletePost(CrId)
        .subscribe(response => {
          if (response.Success == true) {
            //show success message
            this.getAllPosts();
          }
          else {
            // show error message
          }
        })
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = (this.dataSource.data != null) ? this.dataSource.data.length : 0;
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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


}
