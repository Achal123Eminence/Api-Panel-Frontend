import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login').then((m) => m.Login),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home').then((m) => m.Home),
  },
  {
    path: 'betfair',
    loadComponent: () =>
      import('./components/betfair-all-match-cricket/betfair-all-match-cricket')
        .then((m) => m.BetfairAllMatchCricket),
  },
  {
    path: 'events/:sportId/:competitionId',
    loadComponent: () =>
      import('./components/events/events').then((m) => m.Events),
  },
  {
    path: 'markets/:sportId/:eventId',
    loadComponent: () =>
      import('./components/markets/markets').then((m) => m.Markets),
  },
  {
    path: 'add-competition',
    loadComponent: () =>
      import('./components/add-competition/add-competition').then((m) => m.AddCompetition),
  },
  {
    path: 'add-match',
    loadComponent: () =>
      import('./components/add-match/add-match').then((m) => m.AddMatch),
  },
  {
    path: 'default-settings',
    loadComponent: () =>
      import('./components/default-settings/default-settings').then((m) => m.DefaultSettings),
  },
  {
    path: 'currency',
    loadComponent: () =>
      import('./components/currency/currency').then((m) => m.Currency),
  },
  {
    path: 'competition-setting',
    loadComponent: () =>
      import('./components/limit-settings/limit-settings').then((m) => m.LimitSettings),
  },
  {
    path: 'mType',
    loadComponent: () =>
      import('./components/m-type/m-type').then((m) => m.MType),
  },
  {
    path: 'running-match/:id',
    loadComponent: () =>
      import('./components/runner-matches/runner-matches').then((m) => m.RunnerMatches),
  },
  {
    path: 'running-match-market/:sportId/:eventId',
    loadComponent: () =>
      import('./components/running-match-market/running-match-market').then((m) => m.RunningMatchMarket),
  },
  {
    path: 'add-diamondSky/:id',
    loadComponent: () =>
      import('./components/add-diamond-sky-cricket/add-diamond-sky-cricket').then((m) => m.AddDiamondSkyCricket),
  },
];