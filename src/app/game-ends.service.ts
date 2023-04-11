import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameEndsService {
  gameEnd = new Subject<boolean>();
  currentPlayers = new Subject<Array<string>>();
  currentPlayerImages = new Subject<Array<string>>();

  
  constructor() { }

  
  ngOnInit() { }


  triggerGameEndSubject(gameEnd: boolean) { 
    this.gameEnd.next(gameEnd);
    console.log('Game ended: ', gameEnd);
  }


  triggerCurrentPlayersSubject(currentPlayers: Array<string>) {
    this.currentPlayers.next(currentPlayers);
    console.log('Current players: ', currentPlayers);
  }

  triggerCurrentPlayerImagesSubject(currentPlayerImages: Array<string>) {
    this.currentPlayerImages.next(currentPlayerImages);
    console.log('Images from service: ', currentPlayerImages);
  }
}
