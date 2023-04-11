import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerAmountService {
  amountPlayer = new Subject<number>();
  imagesPlayer = new Subject<Array<string>>();

  constructor() { }

  ngOnInit() { }


  triggerPlayerSubject(numberPlayers: number) {
    this.amountPlayer.next(numberPlayers);
  }

  triggerImagesSubject(imagesPlayer: Array<string>) {
    this.imagesPlayer.next(imagesPlayer);
    console.log('Images from player amount service: ', imagesPlayer);
    
  }
}
