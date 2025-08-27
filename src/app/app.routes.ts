import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { BetfairAllMatchCricket } from './components/betfair-all-match-cricket/betfair-all-match-cricket';
import { BetfairAllMatchSoccer } from './components/betfair-all-match-soccer/betfair-all-match-soccer';
import { BetfairAllMatchTennis } from './components/betfair-all-match-tennis/betfair-all-match-tennis';

export const routes: Routes = [
    {path:'', redirectTo:'login', pathMatch:'full'},
    {path:'login',component:Login},
    {path:'home',component:Home},
    {path:'betfair-cricket',component:BetfairAllMatchCricket},
    {path:'betfair-soccer',component:BetfairAllMatchSoccer},
    {path:'betfair-tennis',component:BetfairAllMatchTennis}
];
