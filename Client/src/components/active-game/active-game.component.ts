import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-active-game',
  imports: [CommonModule, FormsModule],
  templateUrl: './active-game.component.html',
  styleUrl: './active-game.component.css',
})
export class ActiveGameComponent implements OnInit {
  game: any = null;
  displayedWord = '';
  currentGuess = '';
  wordGuess = '';
  guessesRemaining = 8;
  message = '';

  constructor(
    private gameService: GameService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    try {
      const gameId = this.route.snapshot.paramMap.get('id');
      if (!gameId) {
        this.message = 'No game ID provided';
        return;
      }

      const game = await this.gameService.getGameById(parseInt(gameId));
      if (!game) {
        this.message = 'Game not found';
        return;
      }

      this.game = game;
      this.displayedWord = game.view;
      this.guessesRemaining = game.remainingGuesses;
    } catch (error) {
      console.error('Error loading game:', error);
      this.message = 'Failed to load game';
      setTimeout(() => this.goBack(), 3000);
    }
  }

  async makeGuess() {
    if (!this.currentGuess || !this.game) {
      return;
    }

    try {
      const updatedGame = await this.gameService.makeGuess(
        this.game.id,
        this.currentGuess.toLowerCase()
      );

      this.updateGameState(updatedGame);
      this.currentGuess = '';
    } catch (error: any) {
      this.handleGuessError(error);
    }
  }

  async makeWordGuess() {
    if (
      !this.wordGuess ||
      !this.game ||
      this.wordGuess.length !== this.game.target.length
    ) {
      return;
    }

    try {
      const updatedGame = await this.gameService.makeGuess(
        this.game.id,
        this.wordGuess.toLowerCase()
      );

      this.updateGameState(updatedGame);
      this.wordGuess = '';
    } catch (error: any) {
      this.handleGuessError(error);
    }
  }

  private updateGameState(updatedGame: any) {
    this.game = updatedGame;
    this.displayedWord = updatedGame.view;
    this.guessesRemaining = updatedGame.remainingGuesses;

    if (updatedGame.status === 'Won') {
      this.message = 'Congratulations! You won!';
    } else if (updatedGame.status === 'Lost') {
      this.message = `Game Over! The word was "${updatedGame.target}"`;
    }
  }

  private handleGuessError(error: any) {
    console.error('Error making guess:', error);
    if (error.message?.includes('already guessed')) {
      this.message = 'You already guessed that letter! Try a different one.';
    } else if (error.message?.includes('letters long')) {
      this.message = error.message;
    } else {
      this.message = error.message || 'Failed to make guess. Please try again.';
    }
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  async startNewGame(): Promise<void> {
    try {
      const newGame = await this.gameService.createGame();
      if (newGame && newGame.id) {
        await this.router.navigate(['/game', newGame.id]);
        this.game = newGame;
        this.displayedWord = newGame.view;
        this.guessesRemaining = newGame.remainingGuesses;
        this.currentGuess = '';
        this.wordGuess = '';
        this.message = '';
      } else {
        this.message = 'Failed to create new game';
      }
    } catch (error) {
      console.error('Error starting new game:', error);
      this.message = 'Failed to create new game';
    }
  }

  goBack() {
    this.router.navigate(['/history']);
  }
}
