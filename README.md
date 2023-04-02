# Tech4Good-Containers-Exercise

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/longtermgoals-setup-z4ayec)

[Onboarding Exercise](https://docs.google.com/document/d/1x-7JrtLswwFnXD_ggjxILC8rLLksC5IL6D9qCLLMxgo/edit#)

[Documentation Sheet](https://docs.google.com/spreadsheets/d/127ckUnuKAWPYyK6D7W4JT7aJpRG2uEZgf7zfhjXwLmU/edit#gid=0)

## Data Stuff
`widget.component.ts` is used to reference the component structure to be used in `widget.component.html`

Observe this line from the quarter goals component example
`import { QuarterData } from '../+state/page.model';`
This imports the `QuarterData` type from a page model in the state folder. For this component, it's imported from a different location, but the same syntax is used
In the example, page actions, effects, etc reference load data and such
`core/store/long-term-goal`

The page appears to get the data from this code in `page.component.ts`
```
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
```
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
Like this: https://causeway.soe.ucsc.edu/#/reference/-container-selectors/1?od=4

## More Notes
I’m trying to get a singular piece of data for my Long Term Goals component, like this basic quarter goals example  
[https://stackblitz.com/edit/container-selectors-redux-intro-leda3y?file=src%2Fapp%2Fmain%2Fpage%2Fpage.component.ts,src%2Fapp%2Fmain%2Fpage%2Fwidget%2Fwidget.component.ts](https://stackblitz.com/edit/container-selectors-redux-intro-leda3y?file=src%2Fapp%2Fmain%2Fpage%2Fpage.component.ts,src%2Fapp%2Fmain%2Fpage%2Fwidget%2Fwidget.component.ts)widget.component.ts: remove the hardcoded data, replaced with  `@Input() longTermGoal: LongTermGoal;`  
page.component.html; app-widget referenced like this:  `<app-widget [longTermGoal]="longTermGoal$ | async"></app-widget>`  
page.component.ts (most substantial modifications)
Added several imports  
```
import { LongTermGoal } from '../../core/store/long-term-goal/long-term-goal.model';

import { EntitySelectorService } from '../../core/store/app.selectors';

import { StreamLongTermGoal } from '../../core/store/long-term-goal/long-term-goal.actions';
```

Added this line to get the stream of the long term goal  
`longTermGoal$: Observable<LongTermGoal> = this.slRx.selectLongTermGoal('ltg', this.containerId);`If I define it as getting a Quarter Goal like this:  
`longTermGoal$: Observable<QuarterGoal> = this.slRx.selectQuarterGoal('qg1', this.containerId);`I get an error saying: “Type ‘QuarterGoal’ is missing the following properties from type ‘LongTermGoal’: oneYear, fiveYear”. It seems the value is actually being read? Or at least the type is.Added slRx to the constructor  
`private slRx: EntitySelectorService,`Added load data dispatch  
`this.store.dispatch(new StreamLongTermGoal([['__id', '==', 'ltg']], {}, this.containerId));`However, nothing displays on the component. There aren’t any errors, either. I don’t understand what I’m missing, considering I’ve included the Redux action and Redux selector for the component. How do I know if these are operating successfully?Here’s my current Long Term Goals Component:  [https://stackblitz.com/edit/longtermgoals-setup-z4ayec](https://stackblitz.com/edit/longtermgoals-setup-z4ayec)

[Container Selectors Redux Intro (forked) - StackBlitz](https://stackblitz.com/edit/container-selectors-redux-intro-leda3y?file=src%2Fapp%2Fmain%2Fpage%2Fpage.component.ts,src%2Fapp%2Fmain%2Fpage%2Fwidget%2Fwidget.component.ts)

A angular-cli project based on @angular/animations, @angular/compiler, @angular/core, @angular/common, @angular/platform-browser-dynamic, @angular/forms, @angular/platform-browser, rxjs, tslib, zone.js and @angular/router. (498 kB)

[https://stackblitz.com/edit/container-selectors-redux-intro-leda3y?file=src%2Fapp%2Fmain%2Fpage%2Fpage.component.ts,src%2Fapp%2Fmain%2Fpage%2Fwidget%2Fwidget.component.ts](https://stackblitz.com/edit/container-selectors-redux-intro-leda3y?file=src%2Fapp%2Fmain%2Fpage%2Fpage.component.ts,src%2Fapp%2Fmain%2Fpage%2Fwidget%2Fwidget.component.ts "Container Selectors Redux Intro (forked) - StackBlitz")



[Long Term Goals Setup (Containers) - StackBlitz](https://stackblitz.com/edit/longtermgoals-setup-z4ayec)

[https://stackblitz.com/edit/longtermgoals-setup-z4ayec](https://stackblitz.com/edit/longtermgoals-setup-z4ayec "Long Term Goals Setup (Containers) - StackBlitz")

The types don't match so it's preventing the app from `building.longTermGoal$: Observable<QuarterGoal> = this.slRx.selectQuarterGoal('qg1', this.containerId);` In the line above you assign the `longTermGoal$` property to an observable of type quarter goal. You also use the entity selector service to select the quarter goals, but the widget should expect a `longTermGoal`. We want to select the `longTermGoal` entities instead.

Also, you should specify the dispatch of the `StreamLongTermGoal` in the `LoadData` action in the page.effects file in `+state` (and not in the component file) like the example of QuarterGoals

## Resources

Loop over object properties
https://stackoverflow.com/questions/45819123/how-to-loop-over-object-properties-with-ngfor-in-angular

Example of Container
https://stackblitz.com/edit/container-selectors-redux-intro-leda3y?file=README.md

