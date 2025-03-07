import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  isLoggedIn: boolean = false;
  username: string | null = null;
  message: string = '';

  constructor(
    private authService: AuthService,
    private gameService: GameService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.authStatus$.subscribe((status) => {
      console.log('Is Logged in: ', status);
      this.isLoggedIn = status;
      this.username = this.authService.getUsername();
    });
  }

  async startNewGame() {
    try {
      const newGame = await this.gameService.createGame();
      if (newGame && newGame.id) {
        await this.router.navigate(['/game', newGame.id]);
      } else {
        this.message = 'Failed to create new game';
      }
    } catch (error) {
      console.error('Error starting new game:', error);
      this.message = 'Failed to create new game';
    }
  }

  logout() {
    this.authService.logout();
  }
}
