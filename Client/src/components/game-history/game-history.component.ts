import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-history.component.html',
  styleUrls: ['./game-history.component.css'],
})
export class GameHistoryComponent implements OnInit {
  games: any[] = [];
  message = '';

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

  async continueGame(gameId: number) {
    await this.router.navigate(['/game', gameId]);
  }

  async deleteGame(gameId: number) {
    try {
      await this.gameService.deleteGame(gameId);

      this.games = this.games.filter((game) => game.id !== gameId);
      this.message = 'Game deleted successfully';

      setTimeout(() => {
        this.message = '';
      }, 3000);
    } catch (error) {
      console.error('Error deleting game:', error);
      this.message = 'Failed to delete game';
    }
  }
}
