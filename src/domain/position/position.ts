export class Position {
    public readonly x: number;
    public readonly y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public isAdjacentOf(otherPosition: Position) {
        return otherPosition.getAdjacent().some((adjacentPosition) => adjacentPosition.sameOf(this));
    }

    public getAdjacent() {
        return [
            Position.of({x: this.x - 1, y: this.y - 1}),
            Position.of({x: this.x, y: this.y -1}),
            Position.of({x: this.x + 1, y: this.y - 1}),
            Position.of({x: this.x - 1, y: this.y}),
            Position.of({x: this.x + 1, y: this.y}),
            Position.of({x: this.x - 1, y: this.y + 1}),
            Position.of({x: this.x, y: this.y + 1}),
            Position.of({x: this.x + 1, y: this.y + 1}),
        ];
    }

    public sameOf(otherPosition: Position) {
        return this.x === otherPosition.x && this.y === otherPosition.y
    }

    static of(position: {x: number, y: number}): Position {
        return new Position(position.x, position.y);
    }
}