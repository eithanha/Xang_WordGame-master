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
  guessesRemaining = 8;
  displayedWord = '_ _ _ _ _ _ _ _';
  currentGuess = '';
  existingGameId: number | null = null;
  game: any;

  constructor(private gameService: GameService, private router: Router) {}

  async makeGuess() {
    if (!this.existingGameId) {
      console.error('No game in progress. Start a new game first.');
      return;
    }

    if (this.currentGuess) {
      try {
        console.log('User guessed:', this.currentGuess);
        const game = await this.gameService.makeGuess(
          this.existingGameId,
          this.currentGuess
        );
        console.log('Updated Game:', game);

        if (game && game.view && game.remainingGuesses !== undefined) {
          this.displayedWord = game.view;
          this.guessesRemaining = game.remainingGuesses;
        } else {
          throw new Error('Invalid game response');
        }
      } catch (error) {
        console.error('Error Making Guess:', error);
        alert('Error making guess. Please try again.');
      }
      this.currentGuess = '';
    }
  }
}
