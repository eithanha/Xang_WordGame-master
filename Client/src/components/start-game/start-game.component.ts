import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-start-game',
  imports: [CommonModule, FormsModule],
  templateUrl: './start-game.component.html',
  styleUrl: './start-game.component.css',
})
export class StartGameComponent {
  constructor(private gameService: GameService, private router: Router) {}

  guessesRemaining = 8;
  displayedWord = '_ _ _ _ _ _ _ _';
  currentGuess = '';

  async startNewGame() {
    try {
      const game = await this.gameService.createGame();
      if (!game || !game.id) {
        throw new Error('New Game is null or missing ID');
      }

      console.log('New Game Created: ', game);
      this.router.navigate([`/word-game/${game.id}`]);
    } catch (error) {
      console.error('Error Creating Game: ', error);
    }
  }

  async makeGuess() {
    if (this.currentGuess) {
      try {
        console.log('User guessed:', this.currentGuess);
        const game = await this.gameService.createGame();

        console.log('New Game Created: ', game);
        console.log('New Game Data: ', game);
        if (!game || !game.id) {
          throw new Error('New Game is null or missing ID');
        }
        this.router.navigate([`/word-game/${game.id}`]);
      } catch (error) {
        console.error('Error Creating Game: ', error);
      }
      this.currentGuess = '';
    }
  }
}
