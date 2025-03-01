import { Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { RegistrationComponent } from '../components/registration/registration.component';
import { LoginComponent } from '../components/login/login.component';
import { LogoutComponent } from '../components/logout/logout.component';
import { WordGameComponent } from '../components/word-game/word-game.component';
import { PageNotFoundComponent } from '../components/page-not-found/page-not-found.component';
import { StartGameComponent } from '../components/start-game/start-game.component';
import { GameViewComponent } from '../components/game-view/game-view.component';
import { GameComponent } from '../components/game/game.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'word-game', component: WordGameComponent },

  { path: 'start-game', component: StartGameComponent },
  { path: 'game/:gameId', component: GameComponent },
  { path: 'game-view', component: GameViewComponent },
  { path: '**', component: PageNotFoundComponent },
];
