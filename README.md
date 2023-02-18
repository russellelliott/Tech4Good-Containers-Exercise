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

## Plan
1. Display the given data first
2. figure out how to get from database