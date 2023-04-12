import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../../core/store/app.reducer';
import { EntitySelectorService } from '../../../core/store/app.selectors';

import { Observable, of, combineLatest } from 'rxjs';
import {
  bufferTime,
  distinctUntilChanged,
  shareReplay,
  mergeMap,
  filter,
  switchMap,
  map,
  withLatestFrom,
} from 'rxjs/operators';
import { User } from '../../../core/store/user/user.model';

import { LongTermGoal } from './page.model';

@Injectable({
  providedIn: 'root',
})
export class PageSelectors {
  constructor(private slRx: EntitySelectorService) {}

  selectLongTermData(
    currentUser$: Observable<User>,
    cId: string
  ): Observable<LongTermGoal> {
    // return this.slRx.selectLongTermGoal<LongTermGoal>(longTermGoalsId, cId);
    return currentUser$.pipe(
      switchMap((currentUser: User) => {
        return this.slRx
          .selectLongTermGoals([['__userId', '==', currentUser.__id]], cId)
          .pipe(map((ltgArray) => ltgArray[0]));
      })
    );
  }

  /** Release memoized selectors. */
  cleanup(cId: string) {
    this.slRx.release(cId);
  }
}
