import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Input,
} from '@angular/core';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../core/store/app.reducer';
import * as fromAuth from '../../core/store/auth/auth.reducer';
import { PageAnimations } from './page.animations';
import { FirebaseService } from '../../core/firebase/firebase.service';
import {
  tap,
  filter,
  withLatestFrom,
  take,
  takeUntil,
  map,
  subscribeOn,
} from 'rxjs/operators';
import {
  distinctUntilChanged,
  interval,
  Observable,
  Subject,
  BehaviorSubject,
  combineLatest,
} from 'rxjs';
import { User } from '../../core/store/user/user.model';
import { PageSelectors } from './+state/page.selectors';
import { LoadData, Cleanup } from './+state/page.actions';
import { RouterNavigate } from '../../core/store/app.actions';
import { UpdateUser } from '../../core/store/user/user.actions';

import { LongTermGoal } from '../../core/store/long-term-goal/long-term-goal.model';

import { EntitySelectorService } from '../../core/store/app.selectors';

import { StreamLongTermGoal } from '../../core/store/long-term-goal/long-term-goal.actions';

import { QuarterGoal } from '../../core/store/quarter-goal/quarter-goal.model';
import {
  StreamQuarterGoal,
  UpdateQuarterGoal,
} from '../../core/store/quarter-goal/quarter-goal.actions';

//dialogs
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';

//command for updating the goals
import { UpdateLongTermGoal } from '../../core/store/long-term-goal/long-term-goal.actions';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: PageAnimations,
})
export class PageComponent implements OnInit {
  // --------------- ROUTE PARAMS & CURRENT USER ---------

  // --------------- LOCAL AND GLOBAL STATE --------------

  // --------------- DB ENTITY DATA ----------------------

  /** Container id for selectors and loading. */
  containerId: string = this.db.createId();

  dialogRef: MatDialogRef<any>;

  openEditModal$: Subject<void> = new Subject();

  /** Get stream of the first quarter goal from Redux Store */
  longTermGoal$: Observable<LongTermGoal> = this.slRx.selectLongTermGoal(
    'ltg',
    this.containerId
  );

  longTermData: LongTermGoal = {
    __id: '',
    __userId: '',
    oneYear: '',
    fiveYear: '',
  };

  //stream to save the goals
  saveGoals$: Subject<LongTermGoal> = new Subject();

  // --------------- DATA BINDING ------------------------

  // --------------- EVENT BINDING -----------------------

  // --------------- HELPER FUNCTIONS AND OTHER ----------

  /** Unsubscribe observable for subscriptions. */
  unsubscribe$: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private selectors: PageSelectors,
    private store: Store<fromStore.State>,
    private db: FirebaseService,
    private slRx: EntitySelectorService //public dialog: MatDialog
  ) {}

  ngOnInit() {
    // --------------- EVENT HANDLING ----------------------

    // --------------- LOAD DATA ---------------------------
    // Load the quarter goal with id 'qg1'
    this.store.dispatch(
      new StreamLongTermGoal([['__id', '==', 'ltg']], {}, this.containerId)
    );

    this.longTermData.__id = 'ltg'; //this.data.longTermData.__id;
    this.longTermData.__userId = ''; //this.data.longTermData.__userId;
    this.longTermData.oneYear = 'eat a large crate of bananas'; //this.data.longTermData.oneYear;
    this.longTermData.fiveYear = 'acquire something cool'; //this.data.longTermData.fiveYear;

    this.store.dispatch(
      new UpdateLongTermGoal('ltg', this.longTermData, this.containerId)
    );

    this.openEditModal$
      .pipe(withLatestFrom(this.longTermGoal$), takeUntil(this.unsubscribe$))
      .subscribe(([_, longTermData]) => {
        /*this.dialog.open(ModalComponent, {
          data: {
            longTermData: longTermData,
            updateGoals: (ltg: LongTermGoal) => this.saveGoals$.next(ltg),
          },
        });*/
      });

    /*this.openEditModal$
      .pipe(withLatestFrom(this.longTermGoal$), takeUntil(this.unsubscribe$))
      .subscribe(([_, longTermData]) => {
        this.dialog.open(ModalComponent, {
          data: {
            longTermData: longTermData,
            updateGoals: (ltg: LongTermGoal) => this.saveGoals$.next(ltg),
          },
        });
      });

    this.saveGoals$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((longTermGoal) => {
        this.store.dispatch(
          new UpdateLongTermGoal('ltg', longTermGoal, this.containerId)
        );
      });*/
  }

  ngOnDestroy() {
    // Unsubscribe subscriptions.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    // Unsubscribe from firebase connection from load and free up memoized selector values.
    this.store.dispatch(new Cleanup(this.containerId));
    this.selectors.cleanup(this.containerId);
  }
}
