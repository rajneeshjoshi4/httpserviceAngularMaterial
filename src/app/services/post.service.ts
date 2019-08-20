import { Post } from './../models/post';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private dataUrl: string = 'http://localhost:3000/posts';
  private compunnalapi: string = 'http://inspirecrqa.compunnel.com/api/';

  constructor(private http: HttpClient) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      //console.error('An error occurred:', error.error.message);
      errorMessage = `An Error occurred: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      // console.error(
      //   `Backend returned code ${error.status}, ` +
      //   `body was: ${error.error}`);
      errorMessage = `Backend returned code ${error.status} , Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // return an observable with a user-facing error message
    window.alert(errorMessage);
    return throwError(errorMessage
    //  'Something bad happened; please try again later.'
    );
  };




  getApprovedStatus() {
    return this.http.get(this.compunnalapi + 'GetApprovedStatus');
  }

  // Get all Posts data
  getPostsList(): Observable<Post> {
    return this.http
      .get<Post>(this.dataUrl)
      .pipe(
      retry(2),
      catchError(this.handleError)
      )
  }

  // Get single post data by ID
  getPost(id): Observable<Post> {
    return this.http
      .get<Post>(this.dataUrl + '/' + id)
      .pipe(
      retry(2),
      catchError(this.handleError)
      )
  }


  // Create a new post
  createPost(post): Observable<Post> {
    return this.http
      .post<Post>(this.dataUrl, JSON.stringify(post), this.httpOptions)
      .pipe(
      retry(2),
      catchError(this.handleError)
      )
  }


  // Update post by id
  updatePost(id, post): Observable<Post> {
    return this.http
      .put<Post>(this.dataUrl + '/' + id, JSON.stringify(post), this.httpOptions)
      .pipe(
      retry(2),
      catchError(this.handleError)
      )
  }


  // Delete post by id
  deletePost(id) {
    return this.http
      .delete<Post>(this.dataUrl + '/' + id, this.httpOptions)
      .pipe(
      retry(2),
      catchError(this.handleError)
      )
  }

}
