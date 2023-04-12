import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collection, doc, setDoc, getFirestore, docData } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { PlayerAmountService } from '../player-amount.service';
import { GameEndsService } from '../game-ends.service';
import { EditPlayerComponent } from '../edit-player/edit-player.component';



@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game: Game;
  firestore: Firestore = inject(Firestore);
  gamesCollection = collection(this.firestore, 'games');
  gameId: string = '';
  db = getFirestore();
  

  constructor(private gameendsService: GameEndsService, private playeramountService: PlayerAmountService, private route: ActivatedRoute, public dialog: MatDialog) { }
  

  ngOnInit() {
    this.newGame();
    this.route.params.subscribe(params => {
      this.getGameData(params);
    });
  }


  newGame() {
    this.game = new Game();
  }


  /**
   * get the game data from the database
   * @param params is the id of the game
   */
  async getGameData(params: any) {
    this.gameId = params['id'];
    let docRef = doc(this.gamesCollection, this.gameId);
    let game$ = docData(docRef);
    game$.subscribe((game: any) => {
      this.setGameData(game);
      this.triggerServices();
    });   
  }


  /**
   * set the local game data to the data from the database
   * @param game is the game data from the database
   */
  setGameData(game: any) {
    this.game.players = game.players;
    this.game.playerImages = game.playerImages;
    this.game.currentPlayer = game.currentPlayer;
    this.game.playedCards = game.playedCards;
    this.game.stack = game.stack;
    this.game.pickCardAnimation = game.pickCardAnimation;
    this.game.currentCard = game.currentCard;
    this.game.gameOver = game.gameOver;
  }


  /**
   * trigger the services to exchange data between game component and game-info component
   */
  triggerServices() {
    this.playeramountService.triggerPlayerSubject(this.game.players.length);
    this.gameendsService.triggerGameEndSubject(this.game.gameOver);
    this.gameendsService.triggerCurrentPlayersSubject(this.game.players);
    this.gameendsService.triggerCurrentPlayerImagesSubject(this.game.playerImages);
  }

  
  /**
   * function to pick a card from the stack, change player who is currently playing and push the card to the played cards array
   */
  pickCard() {
    if (!this.game.pickCardAnimation && this.game.players.length > 1) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.updateGame();
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.updateGame();
      }, 1250);
      this.isGameOver();
    } 
  }


  /**
   * function to check if the game is over
   */
  isGameOver() {
    if (this.game.stack.length < 1) {
      setTimeout(() => {
        this.game.gameOver = true;
        this.updateGame();
      }, 3500);
    }
  }


  /**
   * function to open the dialog to add a player, check if the name is valid and push the name to the players array
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length >= 3) {
        this.game.players.push(name);
        this.game.playerImages.push('1.png');
        this.gameendsService.triggerCurrentPlayersSubject(this.game.players);
        this.updateGame();
      }
    });
  }


  /**
   * function to open the dialog to edit a player, check if the name is valid and push the name to the players array
   * or delete the player from the players array
   * @param playerId position of the player in the players array
   */
  editPlayer(playerId: number) {
    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe((change: string) => {
      if (change) {
        if (change == 'DELETE') {
          this.game.players.splice(playerId, 1);
          this.game.playerImages.splice(playerId, 1);
        } else {
          this.game.playerImages[playerId] = change;
        }
        this.updateGame();
      }
    });
  }

  /**
   * function to update the game data in the database
   */
  updateGame() { 
    const docRef = doc(this.db, "games", this.gameId);
    const gameData = this.game.toJson();
    setDoc(docRef, gameData).then(() => {
      console.log("Document successfully written!", this.game);
    });
  }
}