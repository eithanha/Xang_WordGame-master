import { Injectable } from '@angular/core';
import { Game } from '../app/models/game.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private apiUrl = 'http://localhost:5000/api/games';

  constructor() {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    return {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    };
  }

  async getAllGames(): Promise<Game[]> {
    try {
      const response = await fetch(this.apiUrl, {
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

      return await response.json();
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

      const wordList = await this.fetchWordList();
      if (!wordList) throw new Error('Word list not available');

      const words = wordList.med;
      const targetWord = words[Math.floor(Math.random() * words.length)];

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ target: targetWord }),
      });

      console.log('Game creation response:', response);

      if (!response.ok) {
        console.error('Failed to create game', response);
        throw new Error('Failed to create game');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating game:', error);
      return null;
    }
  }

  async makeGuess(gameId: number, guess: string): Promise<Game> {
    try {
      const response = await fetch(`${this.apiUrl}/${gameId}/guesses`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ guess }),
      });

      if (!response.ok) {
        throw new Error('Failed to make a guess');
      }

      return await response.json();
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
    } catch (error) {
      console.error('Error deleting game:', error);
      throw error;
    }
  }

  async fetchWordList(): Promise<any> {
    try {
      const response = await fetch(
        'http://localhost:5000/assets/wordlist.json'
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching word list:', errorText);
        throw new Error('Failed to fetch word list');
      }

      const data = await response.json();
      console.log('Word list fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching word list:', error);
      return null;
    }
  }
}
