import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collection, doc, setDoc, getFirestore, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PlayerAmountService } from '../player-amount.service';
import { GameEndsService } from '../game-ends.service';



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


  async getGameData(params: any) {
    this.gameId = params['id'];
    let docRef = doc(this.gamesCollection, this.gameId);
    let game$ = docData(docRef);
    game$.subscribe((game: any) => {
      this.game.players = game.players;
      this.game.currentPlayer = game.currentPlayer;
      this.game.playedCards = game.playedCards;
      this.game.stack = game.stack;
      this.game.pickCardAnimation = game.pickCardAnimation;
      this.game.currentCard = game.currentCard;
      this.game.gameOver = game.gameOver;
      this.playeramountService.triggerPlayerSubject(this.game.players.length);
      this.gameendsService.triggerGameEndSubject(this.game.gameOver);
      this.gameendsService.triggerCurrentPlayersSubject(this.game.players);
    });   
  }

  
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
      if (this.game.stack.length < 1) {
        setTimeout(() => {
          this.game.gameOver = true;
          this.updateGame();
        }, 3500);
      }
    } 
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length >= 3) {
        this.game.players.push(name);
        this.gameendsService.triggerCurrentPlayersSubject(this.game.players);
        this.updateGame();
      }
    });
  }


  updateGame() { 
    const docRef = doc(this.db, "games", this.gameId);
    const gameData = this.game.toJson();
    setDoc(docRef, gameData).then(() => {
      console.log("Document successfully written!", this.game);
    });
  }
}