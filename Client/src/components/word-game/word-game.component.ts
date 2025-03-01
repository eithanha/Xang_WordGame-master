import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-word-game',
  imports: [CommonModule],
  templateUrl: './word-game.component.html',
  styleUrl: './word-game.component.css',
})
export class WordGameComponent {
  constructor(private gameService: GameService, private router: Router) {}

  async startNewGame() {
    try {
      const game = await this.gameService.createGame();

      if (!game) {
        console.error('Failed to create a new game.');
        return;
      }

      console.log('New Game Created:', game);
      this.router.navigate([`/word-game/${game.id}`]);
    } catch (error) {
      console.error('Error Creating Game:', error);
    }
  }
}
