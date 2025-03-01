export class Game {
  id: number;
  name: string;
  userId: string;
  status: string;
  target: string;
  guesses: string[];
  view: string;
  remainingGuesses: number;

  constructor(
    id: number,
    name: string,
    userId: string,
    status: string,
    target: string,
    guesses: string[],
    view: string,
    remainingGuesses: number
  ) {
    this.id = id;
    this.name = name;
    this.userId = userId;
    this.status = status;
    this.target = target;
    this.guesses = guesses;
    this.view = view;
    this.remainingGuesses = remainingGuesses;
  }
}
