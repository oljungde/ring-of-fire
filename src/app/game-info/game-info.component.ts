import { Component, Input, OnInit, OnChanges, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerAmountService } from '../player-amount.service';
import { GameEndsService } from '../game-ends.service';
import { Game } from 'src/models/game';
import { Firestore, collection, getFirestore, doc, setDoc } from '@angular/fire/firestore';


@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss']
})
export class GameInfoComponent implements OnInit, OnChanges {
  cardAction = [
    { title: 'Waterfall', description: 'Everyone has to start drinking at the same time. As soon as player 1 stops drinking, player 2 may stop drinking. Player 3 may stop as soon as player 2 stops drinking, and so on.' },
    { title: 'You', description: 'You decide who drinks' },
    { title: 'Me', description: 'Congrats! Drink a shot!' },
    { title: 'Category', description: 'Come up with a category (e.g. Colors). Each player must enumerate one item from the category.' },
    { title: 'Bust a jive', description: 'Player 1 makes a dance move. Player 2 repeats the dance move and adds a second one. ' },
    { title: 'Chicks', description: 'All girls drink.' },
    { title: 'Heaven', description: 'Put your hands up! The last player drinks!' },
    { title: 'Mate', description: 'Pick a mate. Your mate must always drink when you drink and the other way around.' },
    { title: 'Thumbmaster', description: 'When you put your thumb on the table everyone must follow and whomever is last must drink. You are the thumb master till someone else picks a five.' },
    { title: 'Men', description: 'All men drink.' },
    { title: 'Quizmaster', description: 'Go around in a circle and you have to keep asking questions to each other. Doesn’t matter what the question is, as long as its a question. Whoever messes up and does not say a question, drinks.' },
    { title: 'Never have i ever...', description: 'Say something you nnever did. Everyone who did it has to drink.' },
    { title: 'Rule', description: 'Make a rule. Everyone needs to drink when he breaks the rule.' },
  ];
  title = '';
  description = '';
  @Input() card: string;
  amountPlayer: number;
  isGameOver: boolean = false;
  currentPlayers: Array<string> = [];
  currentPlayerImages: Array<string> = [];
  firestore: Firestore = inject(Firestore);
  gamesCollection = collection(this.firestore, 'games');
  gameId: string = '';
  db = getFirestore();
  
  
  constructor(private gameendsService: GameEndsService, private playeramountService: PlayerAmountService, private router: Router ) { }

  
  /**
   * Subscribe to services to get the amount of players, the current players and the current player images, and the game ends status.
   */
  ngOnInit(): void {    
    this.playeramountService.amountPlayer.subscribe((numberPlayers) => {
      this.amountPlayer = numberPlayers;
    });
    this.gameendsService.gameEnd.subscribe((gameEnds: boolean) => {
      this.isGameOver = gameEnds;
    });
    this.gameendsService.currentPlayers.subscribe((players: Array<string>) => {
      this.currentPlayers = players;
    });
    this.gameendsService.currentPlayerImages.subscribe((playerImages) => {
      this.currentPlayerImages = playerImages;      
    });
  }

  
  /**
   * Get the title and description of the card that is drawn.
   */
  ngOnChanges(): void {
    if (this.card) {
      let cardNumber = +this.card.split('_')[1];
      this.title = this.cardAction[cardNumber - 1].title;
      this.description = this.cardAction[cardNumber - 1].description;
    }    
  }


  /**
   * restart the game
   * @param currentPlayers are the current players in the game.
   */
  async restartGame(currentPlayers: Array<string>) {
    this.gameId = this.router.url.split('/')[2];
    let newGame = new Game();
    newGame.players = this.currentPlayers;
    newGame.playerImages = this.currentPlayerImages;
    console.log(newGame);
    const docRef = doc(this.db, "games", this.gameId);
    const gameData = newGame.toJson();
    setDoc(docRef, gameData).then(() => {
      console.log("Document successfully written!", newGame);
    });
  }
}