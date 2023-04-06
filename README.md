# Tech4Good-Containers-Exercise

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/longtermgoals-setup-z4ayec)

[Onboarding Exercise](https://docs.google.com/document/d/1x-7JrtLswwFnXD_ggjxILC8rLLksC5IL6D9qCLLMxgo/edit#)

[Documentation Sheet](https://docs.google.com/spreadsheets/d/127ckUnuKAWPYyK6D7W4JT7aJpRG2uEZgf7zfhjXwLmU/edit#gid=0)

## Data Stuff

`widget.component.ts` is used to reference the component structure to be used in `widget.component.html`

Observe this line from the quarter goals component example `import { QuarterData } from '../+state/page.model';` This imports the `QuarterData` type from a page model in the state folder. For this component, it's imported from a different location, but the same syntax is used In the example, page actions, effects, etc reference load data and such `core/store/long-term-goal`

The page appears to get the data from this code in `page.component.ts`

```typescript
/** Raw time in milliseconds from 1970/01/01 00:00:00:000 **/
currentDateTime$: Observable<number> = interval(1000).pipe(
  map(() => Date.now()),
);

/** Current quarter needed to select the right quarter from DB. */
currentQuarterStartTime$: Observable<number> = this.currentDateTime$.pipe(
  map((now) => this.dateToQuarterStartTime(now)),
  distinctUntilChanged(),
);

/** Get the quarter data. */
quarterData$: Observable<QuarterData> = this.selectors.selectQuarterData(
  this.currentQuarterStartTime$,
  this.currentUser$,
  this.containerId,
);

```

The container id is given in the this component's `page.component.ts` already, so that is used to get the data.

Also, the data must be loaded after setup

```typescript
combineLatest(this.currentQuarterStartTime$, this.currentUser$).pipe(
  takeUntil(this.unsubscribe$),
).subscribe(([quarterStartTime, currentUser]) => {
  this.store.dispatch(
    new LoadData({
      quarterStartTime,
      currentUser,
    }, this.containerId)
  );
});

```

Like this: [https://causeway.soe.ucsc.edu/#/reference/-container-selectors/1?od=4](https://causeway.soe.ucsc.edu/#/reference/-container-selectors/1?od=4)

## Setting the Goals

I’m trying to get a singular piece of data for my Long Term Goals component, like this basic quarter goals example  
[https://stackblitz.com/edit/container-selectors-redux-intro-leda3y?file=src%2Fapp%2Fmain%2Fpage%2Fpage.component.ts,src%2Fapp%2Fmain%2Fpage%2Fwidget%2Fwidget.component.ts](https://stackblitz.com/edit/container-selectors-redux-intro-leda3y?file=src%2Fapp%2Fmain%2Fpage%2Fpage.component.ts,src%2Fapp%2Fmain%2Fpage%2Fwidget%2Fwidget.component.ts)widget.component.ts: remove the hardcoded data, replaced with `@Input() longTermGoal: LongTermGoal;`  
page.component.html; app-widget referenced like this: `<app-widget [longTermGoal]="longTermGoal$ | async"></app-widget>`  
page.component.ts (most substantial modifications)
Added several imports

```typescript
import { LongTermGoal } from '../../core/store/long-term-goal/long-term-goal.model';

import { EntitySelectorService } from '../../core/store/app.selectors';

import { StreamLongTermGoal } from '../../core/store/long-term-goal/long-term-goal.actions';
```

Added this line to get the stream of the long term goal  
`longTermGoal$: Observable<LongTermGoal> = this.slRx.selectLongTermGoal('ltg', this.containerId);`If I define it as getting a Quarter Goal like this:  
`longTermGoal$: Observable<QuarterGoal> = this.slRx.selectQuarterGoal('qg1', this.containerId);`I get an error saying: “Type ‘QuarterGoal’ is missing the following properties from type ‘LongTermGoal’: oneYear, fiveYear”. It seems the value is actually being read? Or at least the type is.Added slRx to the constructor  
`private slRx: EntitySelectorService,`Added load data dispatch  
`this.store.dispatch(new StreamLongTermGoal([['__id', '==', 'ltg']], {}, this.containerId));`However, nothing displays on the component. There aren’t any errors, either. I don’t understand what I’m missing, considering I’ve included the Redux action and Redux selector for the component. How do I know if these are operating successfully?Here’s my current Long Term Goals Component: [https://stackblitz.com/edit/longtermgoals-setup-z4ayec](https://stackblitz.com/edit/longtermgoals-setup-z4ayec)

[Container Selectors Redux Intro (forked) - StackBlitz](https://stackblitz.com/edit/container-selectors-redux-intro-leda3y?file=src%2Fapp%2Fmain%2Fpage%2Fpage.component.ts,src%2Fapp%2Fmain%2Fpage%2Fwidget%2Fwidget.component.ts)

A angular-cli project based on @angular/animations, @angular/compiler, @angular/core, @angular/common, @angular/platform-browser-dynamic, @angular/forms, @angular/platform-browser, rxjs, tslib, zone.js and @angular/router. (498 kB)

[https://stackblitz.com/edit/container-selectors-redux-intro-leda3y?file=src%2Fapp%2Fmain%2Fpage%2Fpage.component.ts,src%2Fapp%2Fmain%2Fpage%2Fwidget%2Fwidget.component.ts](https://stackblitz.com/edit/container-selectors-redux-intro-leda3y?file=src%2Fapp%2Fmain%2Fpage%2Fpage.component.ts,src%2Fapp%2Fmain%2Fpage%2Fwidget%2Fwidget.component.ts 'Container Selectors Redux Intro (forked) - StackBlitz')

[Long Term Goals Setup (Containers) - StackBlitz](https://stackblitz.com/edit/longtermgoals-setup-z4ayec)

[https://stackblitz.com/edit/longtermgoals-setup-z4ayec](https://stackblitz.com/edit/longtermgoals-setup-z4ayec 'Long Term Goals Setup (Containers) - StackBlitz')

The types don't match so it's preventing the app from `building.longTermGoal$: Observable<QuarterGoal> = this.slRx.selectQuarterGoal('qg1', this.containerId);` In the line above you assign the `longTermGoal$` property to an observable of type quarter goal. You also use the entity selector service to select the quarter goals, but the widget should expect a `longTermGoal`. We want to select the `longTermGoal` entities instead.

Also, you should specify the dispatch of the `StreamLongTermGoal` in the `LoadData` action in the page.effects file in `+state` (and not in the component file) like the example of QuarterGoals

### Resources

Loop over object properties [https://stackoverflow.com/questions/45819123/how-to-loop-over-object-properties-with-ngfor-in-angular](https://stackoverflow.com/questions/45819123/how-to-loop-over-object-properties-with-ngfor-in-angular)

Example of Container [https://stackblitz.com/edit/container-selectors-redux-intro-leda3y?file=README.md](https://stackblitz.com/edit/container-selectors-redux-intro-leda3y?file=README.md)

## Updating the Goals

I'm trying to add the ability to update my goals on the onboarding, but it’s doing that thing again where nothing appears on the screen.

here’s what i’ve done so far:
added `(click)="this.editGoals.emit()" to widget.component.html`
added `(editGoals)="this.openEditModal$.next()" to page.component.html`
`saveGoals$: Subject<LongTermGoal> = new Subject();` for stream to save the goals
`openEditModal$: Subject<void> = new Subject();` for opening the edit modal

added `import { LongTermGoal } from '../../../core/store/long-term-goal/long-term-goal.model';` to modal.component.ts

my stackblitz: https://stackblitz.com/edit/longtermgoals-setup-z4ayec?file=README.md,src%2Fapp%2Fmain%2Fpage%2Fwidget%2Fwidget.component.ts,src%2Fapp%2Fmain%2Fpage%2Fpage.component.html,src%2Fapp%2Fmain%2Fpage%2Fwidget%2Fwidget.component.html,src%2Fapp%2Fmain%2Fpage%2Fpage.component.ts

i do get an error in the console:

```
ERROR
Error: Uncaught (in promise): NullInjectorError: R3InjectorError(AppModule)[MatDialog -> MatDialog -> MatDialog]:
NullInjectorError: No provider for MatDialog!
NullInjectorError: R3InjectorError(AppModule)[MatDialog -> MatDialog -> MatDialog]:
NullInjectorError: No provider for MatDialog!
at NullInjector.get (https://longtermgoals-setup-z4ayec.stackblitz.io/turbo_modules/@angular/core@13.3.11/fesm2015/core.mjs:11172:27)
at R3Injector.get (https://longtermgoals-setup-z4ayec.stackblitz.io/turbo_modules/@angular/core@13.3.11/fesm2015/core.mjs:11339:33)
at R3Injector.get (https://longtermgoals-setup-z4ayec.stackblitz.io/turbo_modules/@angular/core@13.3.11/fesm2015/core.mjs:11339:33)
at R3Injector.get (https://longtermgoals-setup-z4ayec.stackblitz.io/turbo_modules/@angular/core@13.3.11/fesm2015/core.mjs:11339:33)
at NgModuleRef.get (https://longtermgoals-setup-z4ayec.stackblitz.io/turbo_modules/@angular/core@13.3.11/fesm2015/core.mjs:21961:33)
at Object.get (https://longtermgoals-setup-z4ayec.stackblitz.io/turbo_modules/@angular/core@13.3.11/fesm2015/core.mjs:21635:35)
at lookupTokenUsingModuleInjector (https://longtermgoals-setup-z4ayec.stackblitz.io/turbo_modules/@angular/core@13.3.11/fesm2015/core.mjs:3373:39)
at getOrCreateInjectable (https://longtermgoals-setup-z4ayec.stackblitz.io/turbo_modules/@angular/core@13.3.11/fesm2015/core.mjs:3485:12)
at Object.ɵɵdirectiveInject (https://longtermgoals-setup-z4ayec.stackblitz.io/turbo_modules/@angular/core@13.3.11/fesm2015/core.mjs:14450:12)
at NodeInjectorFactory.PageComponent_Factory [as factory] (https://longtermgoals-setup-z4ayec.stackblitz.io/~/src/app/main/page/page.component.ts:85:296)
```

the issue seems to be in this part of the code, as the error goes away when i comment it out

in the constructor:
`public dialog: MatDialog`

in the ngInit

```typescript
	this.openEditModal$
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
      });
```

this is how you change the data

in the constructor:

```typescript
longTermData: LongTermGoal = {
    __id: '',
    __userId: '',
    oneYear: '',
    fiveYear: '',
  };
```

in the ngInit, or some area around there:

```typescript
this.longTermData.__id = 'ltg'; //this.data.longTermData.__id;
this.longTermData.__userId = ''; //this.data.longTermData.__userId;
this.longTermData.oneYear = 'eat a large crate of bananas';//this.data.longTermData.oneYear;
this.longTermData.fiveYear = 'acquire something cool'; //this.data.longTermData.fiveYear;

this.store.dispatch(
	new  UpdateLongTermGoal('ltg', this.longTermData, this.containerId)
);
```

### Resources

Yash's long-term goal onboarding exercise; showed us during previous meeting as a means of onboarding to show how the stack worked and how to utilize the store to read and update data
https://stackblitz.com/edit/longtermgoals-setup-amdy16?file=README.md
