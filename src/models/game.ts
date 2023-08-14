export class Game {
    public players: string[] = [];
    public playerImages: string[] = [];
    public stack: string[] = [];
    public playedCards: string[] = [];
    public currentPlayer: number = 0;
    public pickCardAnimation = false;
    public currentCard: string = '';
    public gameOver: boolean = false;

    constructor() {
        for (let i = 1; i < 14; i++) {
            this.stack.push('ace_' + i);
            this.stack.push('clubs_' + i);
            this.stack.push('diamonds_' + i);
            this.stack.push('hearts_' + i);
        }
        this.shuffle(this.stack);
    }

    shuffle(stackArr) {
        let currentIndex = stackArr.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [stackArr[currentIndex], stackArr[randomIndex]] = [stackArr[randomIndex], stackArr[currentIndex]];
        }
        return stackArr;
    }

    public toJson() {
        return {
            players: this.players,
            playerImages: this.playerImages,
            stack: this.stack,
            playedCards: this.playedCards,
            currentPlayer: this.currentPlayer,
            pickCardAnimation: this.pickCardAnimation,
            currentCard: this.currentCard,
            gameOver: this.gameOver
        };
    }
}