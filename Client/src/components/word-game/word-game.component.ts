import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-word-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './word-game.component.html',
  styleUrls: ['./word-game.component.css'],
})
export class WordGameComponent {
  message = '';
  games: any[] = [];

  constructor(private gameService: GameService, private router: Router) {}

  async ngOnInit() {
    await this.loadGames();
  }

  async loadGames() {
    try {
      this.games = await this.gameService.getAllGames();
    } catch (error) {
      console.error('Error fetching games:', error);
      this.message = 'Failed to load game history';
    }
  }

  getWonGames(): number {
    return this.games.filter((game) => game.status === 'Won').length;
  }

  getLostGames(): number {
    return this.games.filter((game) => game.status === 'Lost').length;
  }

  getWinRate(): string {
    const wonGames = this.getWonGames();
    const finishedGames = this.games.filter(
      (game) => game.status !== 'Unfinished'
    ).length;
    if (finishedGames === 0) return '0';
    return ((wonGames / finishedGames) * 100).toFixed(1);
  }

  async startNewGame() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.message = 'Please log in first.';
      return;
    }

    try {
      const game = await this.gameService.createGame();
      if (game) {
        console.log('Game created successfully:', game);

        await this.router.navigate(['/game', game.id]);
      } else {
        this.message = 'Failed to create a new game. Please try again.';
      }
    } catch (error) {
      console.error('Error occurred while starting a new game:', error);
      this.message = 'Failed to start a new game. Please try again.';
    }
  }

  async navigateToGame(gameId: number) {
    try {
      await this.router.navigate(['/game', gameId]);
    } catch (error) {
      console.error('Error navigating to game:', error);
      this.message = 'Failed to load game';
    }
  }

  viewHistory() {
    this.router.navigate(['/history']);
  }
}
