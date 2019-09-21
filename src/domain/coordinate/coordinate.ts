export class Coordinate {
    public readonly x: number;
    public readonly y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public isAdjacentOf(coordinate: Coordinate) {
        return coordinate.getAdjacent().some((adjacentCoordinate) => adjacentCoordinate.sameOf(this));
    }

    public getAdjacent() {
        return [
            Coordinate.of({x: this.x - 1, y: this.y - 1}),
            Coordinate.of({x: this.x, y: this.y -1}),
            Coordinate.of({x: this.x + 1, y: this.y - 1}),
            Coordinate.of({x: this.x - 1, y: this.y}),
            Coordinate.of({x: this.x + 1, y: this.y}),
            Coordinate.of({x: this.x - 1, y: this.y + 1}),
            Coordinate.of({x: this.x, y: this.y + 1}),
            Coordinate.of({x: this.x + 1, y: this.y + 1}),
        ];
    }

    public isPresent(coordinates: Coordinate[]) {
        return coordinates.some((otherCoordinate) => this.sameOf(otherCoordinate));
    }

    public sameOf(otherCoordinate: Coordinate) {
        return this.x === otherCoordinate.x && this.y === otherCoordinate.y
    }

    static of(coordinate: {x: number, y: number}): Coordinate {
        return new Coordinate(coordinate.x, coordinate.y);
    }
}