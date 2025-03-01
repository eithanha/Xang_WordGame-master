import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-word-game',
  imports: [CommonModule],
  templateUrl: './word-game.component.html',
  styleUrls: ['./word-game.component.css'],
})
export class WordGameComponent {
  guessesRemaining = 8;
  displayedWord = '_ _ _ _ _ _ _ _';
  currentGuess = '';
  existingGameId: number | null = null;
  game: any = null;

  constructor(private router: Router) {}

  async startNewGame() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. Please log in first.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const game = await response.json();
        this.game = game; // Store the game object after creation
        console.log('Game created successfully:', this.game);

        // Update game details
        this.existingGameId = game.id;
        this.displayedWord = game.view;
        this.guessesRemaining = game.remainingGuesses;

        // Navigate to the start-game page
        this.router.navigate(['/start-game']);
      } else {
        const errorDetails = await response.text();
        console.error('Error Creating Game:', errorDetails);
        throw new Error('Failed to create a new game');
      }
    } catch (error) {
      console.error('Error occurred while starting a new game:', error);
    }
  }
}
