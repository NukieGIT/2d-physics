import { CanvasObject } from "../../../canvas-object";
import { IBounds } from "../../../ibounds";
import { Vector2 } from "../../../math/vector2";
import { Collider } from "./collider";

export class RectangularCollider extends Collider {
    private _width: number;
    private _height: number;

    public get width(): number {
        return this._width;
    }
    public set width(value: number) {
        this._width = value;

    }
    public get height(): number {
        return this._height;
    }
    public set height(value: number) {
        this._height = value;
    }

    get area() {
        return this.width * this.height;
    }
    get perimeter() {
        return 2 * (this.width + this.height);
    }

    get bounds(): IBounds {
        throw new Error("Method not implemented.");
    }

    constructor(width: number, height: number, parent: CanvasObject, offset: Vector2 = Vector2.zero) {
        if (width <= 0 || height <= 0) {
            // TODO: Use a custom error class
            throw new Error("Width and height must be greater than zero.");
        }
        super(parent, offset);
        this._width = width;
        this._height = height;
    }
}