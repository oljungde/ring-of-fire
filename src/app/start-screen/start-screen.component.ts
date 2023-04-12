import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, addDoc, DocumentReference } from '@angular/fire/firestore';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
  

export class StartScreenComponent {
  firestore: Firestore = inject(Firestore);
  gamesCollection = collection(this.firestore, 'games');
  game: Game;


  constructor(private router: Router) { }


  /**
   * create a new game and navigate to the game page
   */
  newGame() {
    this.game = new Game();     
    let gameInfo = addDoc(this.gamesCollection, this.game.toJson()).then((docRef: DocumentReference) => {
      this.router.navigate(['/game', docRef.id]);
    });
  }
}
