import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class SpotifySearchService {
  private API_PATH = 'https://api.spotify.com/v1/search';

  constructor(private http: Http) { }

  search(query: string, type: string): Observable<string[]> {
    var params = new URLSearchParams();
    params.set('type', type);
    params.set('q', query);

    return this.http.get(this.API_PATH, { search: params })
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
