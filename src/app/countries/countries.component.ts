import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilKeyChanged';


@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit {
  private results = [];
  private term = new FormControl()


  constructor(private http: HttpClient){}

  ngOnInit() {

    this.term.valueChanges
    // .debounceTime(400)
    // .distinctUntilKeyChanged()
    .subscribe(searchTerm => {

      this.http.get(`https://restcountries.eu/rest/v2/name/${searchTerm}`).subscribe((data: any) =>{
        //debugger;
        console.time('requet-length')
        this.results = data;
        console.timeEnd('requet-length')

      })
    })
  }

}
