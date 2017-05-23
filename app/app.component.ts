import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";

import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/combineLatest';


import { SpotifySearchService } from "./spotify.service";

@Component({
  selector: 'my-app',
  template: `
  <h1>Spotify Search</h1>
  <form [formGroup]="form" novalidate>

    <label>
      <span>Term</span>
      <input type="text" formControlName="term">
    </label>

    <label>
      <span>Type</span>
      <select formControlName="type">
        <option *ngFor="let type of types" [value]="type">{{type}}</option>
    </select>
    </label>

  </form>
  <section>
    <p class="warning">{{error}}</p>
    <p *ngFor="let result of results">{{result}}</p>
  </section>
  `,
  styles: [`.warning{color:red;}`]
})
export class AppComponent implements OnInit {
  types = ['track', 'album', 'artist'];
  form: FormGroup;
  results: string[] = [];
  error: string | null;

  term$: Observable<string>;
  type$: Observable<string>;

  constructor(private fb: FormBuilder, private spotifySearchService: SpotifySearchService) {
    this.form = fb.group({
      term: [''],
      type: [this.types[0]]
    });

    this.term$ = this.form.controls.term.valueChanges;
    this.type$ = this.form.controls.type.valueChanges;
  }

  ngOnInit(): void {
    //ex 1
    //this.term$.subscribe(term => console.log(term));

    //ex 2
    // this.term$
    //   .filter(term => term && term.length > 2)
    //   .debounceTime(300)
    //   .distinctUntilChanged()
    //   .subscribe(term => console.log(term));

    //ex 3
    // this.term$
    //   .filter(term => term && term.length > 2)
    //   .debounceTime(300)
    //   .distinctUntilChanged()
    //   .subscribe(term => 
    //     this.spotifySearchService.search(term, this.form.controls.type.value)
    //     .subscribe(results => this.results = results)
    //   );

    //ex 4
    // this.term$
    //   .switchMap(term => this.spotifySearchService.search(term, this.form.controls.type.value))
    //   .subscribe(results => this.results = results);

    //ex 5
    // this.term$
    //   .filter(term => term && term.length > 2)
    //   .debounceTime(300)
    //   .distinctUntilChanged()
    //   .do(term => this.error = null)
    //   .switchMap(term =>
    //     this.spotifySearchService.search(term, this.form.controls.type.value)
    //       .catch(err => {
    //         this.error = err;
    //         return Observable.of([]);
    //       })
    //   )
    //   .subscribe(results => this.results = results);

    //ex6
    let debouncedTerm$ = this.term$
      .filter(term => term && term.length > 2)
      .debounceTime(300)
      .distinctUntilChanged();

    let startedType$ = this.type$.startWith(this.form.controls.type.value);

    Observable.combineLatest(debouncedTerm$, startedType$)
      .do(arr => this.error = null)
      .switchMap(([term, type]) =>
        this.spotifySearchService.search(term, type)
          .catch(err => {
            this.error = err;
            return Observable.of([]);
          })
      )
      .subscribe(results => this.results = results);
  }

}
