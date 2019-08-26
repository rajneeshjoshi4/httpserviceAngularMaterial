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
  getPostsList(): Observable<any> {
    return this.http
      .get<any>(this.compunnalapi + "ChangeRequest/ProjectId/2003")
      .pipe(
      retry(2),
      catchError(this.handleError)
      )
  }

  // Get single post data by ID
  getPost(id): Observable<any> {
    return this.http
      .get<any>(this.compunnalapi + 'ChangeRequest/' + id)
      .pipe(
      retry(2),
      catchError(this.handleError)
      )
  }


  // Create a new post
  createPost(post): Observable<any> {
    const formData = new FormData();
    formData.set("json", JSON.stringify(post));
    return this.http
      .post<any>(this.compunnalapi + 'ChangeRequest/', formData)
      .pipe(
      retry(2),
      catchError(this.handleError)
      )
  }


  // Update post by id
  updatePost(id, post): Observable<any> {
    const formData = new FormData();
    formData.set("json", JSON.stringify(post));
    return this.http
      .put<any>(this.compunnalapi + 'ChangeRequest/' + id,
      formData
      )
      .pipe(
      retry(2),
      catchError(this.handleError)
      )
  }


 // Delete post by id
 deletePost(id):Observable<any>{
  return this.http
    .delete<any>(this.compunnalapi + 'ChangeRequest/' + id, this.httpOptions)
    .pipe(catchError(this.handleError))
}
}
