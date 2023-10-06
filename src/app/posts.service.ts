import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.modules';
import { map } from 'rxjs/operators';
import {Subject, throwError, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    this.http
      .post<{ name: string }>(
        'https://ng-complete-guide-bb201-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json',
        postData
      )
      .subscribe((responseData) => {
        console.log(responseData);
      }, error => {
        this.error.next(error.message);
      });
  }

  fetchPosts() {
    return this.http
      .get<{ [key: string]: Post }>(
        'https://ng-complete-guide-bb201-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json'
      )
      .pipe(
        map((responseData) => {
          const postsArray = [];
          for (const key in responseData)
            if (responseData.hasOwnProperty(key)) {
              // spread operator
              postsArray.push({ ...responseData[key], id: key });
            }
          return postsArray;
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

  deletePosts(){
    return this.http.delete('https://ng-complete-guide-bb201-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json')
  }
}
