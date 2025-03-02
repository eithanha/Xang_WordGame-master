import { Injectable } from '@angular/core';
import { Game } from '../app/models/game.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private apiUrl = 'http://localhost:5000/api/games';
  private currentGame: Game | null = null;

  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    };
  }

  getCurrentGame(): Game | null {
    return this.currentGame;
  }

  async getAllGames(): Promise<Game[]> {
    try {
      const response = await fetch(`${this.apiUrl}/get-all`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      return await response.json();
    } catch (err) {
      console.error('Error fetching games:', err);
      throw err;
    }
  }

  async getGameById(gameId: number): Promise<Game> {
    try {
      const response = await fetch(`${this.apiUrl}/${gameId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch game with ID ${gameId}`);
      }

      const game = await response.json();
      this.currentGame = game;
      return game;
    } catch (error) {
      console.error('Error fetching game:', error);
      throw error;
    }
  }

  async createGame(): Promise<Game | null> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('User is not authenticated');
        throw new Error('User is not authenticated');
      }

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to create game');
      }

      const game = await response.json();
      this.currentGame = game;
      return game;
    } catch (error) {
      console.error('Error creating game:', error);
      return null;
    }
  }

  async makeGuess(gameId: number, guess: string): Promise<Game> {
    try {
      if (!this.currentGame) {
        throw new Error('No game in progress. Start a new game first.');
      }

      console.log(`Making guess for game ${gameId}: "${guess}"`);
      const endpoint = `${this.apiUrl}/${gameId}/guess`;
      console.log('Endpoint:', endpoint);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(guess),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (errorText.includes('already guessed')) {
          throw new Error('Letter already guessed');
        }
        throw new Error(errorText || 'Failed to make guess');
      }

      const updatedGame = await response.json();
      this.currentGame = updatedGame;
      return updatedGame;
    } catch (error) {
      console.error('Error making guess:', error);
      throw error;
    }
  }

  async deleteGame(gameId: number): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/${gameId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete game');
      }
      this.currentGame = null;
    } catch (error) {
      console.error('Error deleting game:', error);
      throw error;
    }
  }

  async getMyGames(): Promise<Game[]> {
    try {
      const response = await fetch(`${this.apiUrl}/my-games`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching my games:', error);
      throw error;
    }
  }
}
