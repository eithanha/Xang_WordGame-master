import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game',
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  gameId: number | null = null;
  game: any = null;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.gameId = +this.route.snapshot.paramMap.get('gameId')!;
    if (this.gameId) {
      this.loadGame(this.gameId);
    }
  }

  async loadGame(gameId: number) {
    try {
      const game = await this.gameService.getGameById(gameId);
      this.game = game;
    } catch (error) {
      console.error('Error loading game:', error);
    }
  }
}
