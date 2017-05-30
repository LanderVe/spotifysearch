import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class SpotifySearchService {
  private API_PATH = 'https://api.spotify.com/v1/search';
  private LOGIN_PAGE = 'https://accounts.spotify.com/authorize?client_id=8aa495d9c8c24042b11fa8a561330200&redirect_uri=http:%2F%2Flocalhost:3002&response_type=token';
  private token: string;

  constructor(private http: Http) {
    //check if auth token in url
    if (window.location.hash.match(/#access_token/i)) {
      this.token = window.location.hash.split('=')[1];
    }
    //if not redirect
    else {
      window.location.href = this.LOGIN_PAGE;
    }
  }

  search(query: string, type: string): Observable<string[]> {
    let params = new URLSearchParams();
    params.set('type', type);
    params.set('q', query);

    let headers = new Headers({ 'Authorization': `Bearer ${this.token}` });

    return this.http.get(this.API_PATH, { search: params, headers: headers })
      .map(res => this.mapToNames(res.json(), type) || [])
      .catch(this.handleError);
  }

  private mapToNames(response: any, type: string): string[] {
    let collection = <any[]>response[type + 's'].items;
    return collection.map(item => item.name);
  }

  private handleError(error: Response): Observable<any> {
    return Observable.throw('Server error');
  }

}