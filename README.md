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

## Plan
1. Display the given data first
2. figure out how to get from database


## Resources

Loop over object properties
https://stackoverflow.com/questions/45819123/how-to-loop-over-object-properties-with-ngfor-in-angular