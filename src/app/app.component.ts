import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.modules';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = '';
  private errorSub: Subscription | undefined;

  constructor(private http: HttpClient, private postService: PostsService) {}
  ngOnInit(): void {
    // load posts

    this.errorSub = this.postService.error.subscribe(errorMessage => {
      this.error = errorMessage;
    })

    this.isFetching = true;
    this.postService.fetchPosts().subscribe((posts) => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.error = error.message;
    });
  }
  onCreatePost(postData: Post) {
    this.postService.createAndStorePost(postData.title, postData.content);
  }
  onFetchPosts() {
    this.isFetching = true;
    this.postService.fetchPosts().subscribe((posts) => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.error = error.message;
      console.log(error);
    });
  }
  onClearPosts() {
    this.loadedPosts = [];
    this.postService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    });
  }

  OnHandleError() {
    this.error = '';
  }

  ngOnDestroy(): void {
    this.errorSub?.unsubscribe();
  }
}
