import { Vector } from "../../vector";
import { ICollider } from "./icollider";

export class RectangularCollider implements ICollider {
    private _width: number;
    private _height: number;
    private _position: Vector;
    // rotation in radians
    private _rotation: number;

    public get position(): Vector {
        return this._position;
    }
    public set position(value: Vector) {
        this._position = value;
    }

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

    public get rotation(): number {
        return this._rotation;
    }
    public set rotation(value: number) {
        this._rotation = value;
    }

    get area() {
        return this.width * this.height;
    }
    get perimeter() {
        return 2 * (this.width + this.height);
    }

    constructor(width: number, height: number, position: Vector, rotation: number = 0) {
        this._width = width;
        this._height = height;
        this._position = position;
        this._rotation = rotation;
    }

    get BoundingBox() {
        return {
            x: this.position.x,
            y: this.position.y,
            width: this.width,
            height: this.height,
        };
    }
}