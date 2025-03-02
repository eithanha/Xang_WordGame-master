import { Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { RegistrationComponent } from '../components/registration/registration.component';
import { LoginComponent } from '../components/login/login.component';
import { LogoutComponent } from '../components/logout/logout.component';
import { WordGameComponent } from '../components/word-game/word-game.component';
import { PageNotFoundComponent } from '../components/page-not-found/page-not-found.component';
import { ActiveGameComponent } from '../components/active-game/active-game.component';
import { GameHistoryComponent } from '../components/game-history/game-history.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'word-game', component: WordGameComponent },
  { path: 'game/:id', component: ActiveGameComponent },
  { path: 'history', component: GameHistoryComponent },
  { path: '**', component: PageNotFoundComponent },
];
