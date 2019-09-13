export class Position {
    public readonly x: number;
    public readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
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

    static of(position: {x: number, y: number}): Position {
        return new Position(position.x, position.y);
    }
}