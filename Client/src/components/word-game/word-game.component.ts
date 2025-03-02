import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-word-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './word-game.component.html',
  styleUrls: ['./word-game.component.css'],
})
export class WordGameComponent {
  message = '';

  constructor(private gameService: GameService, private router: Router) {}

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

  viewHistory() {
    this.router.navigate(['/history']);
  }
}
