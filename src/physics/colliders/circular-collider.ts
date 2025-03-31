import { Vector } from "../../vector";
import { ICollider } from "./icollider";

export class CircularCollider implements ICollider {
    private _centerPosition: Vector;
    private _radius: number;

    public get position(): Vector {
        return this._centerPosition;
    }
    public set position(value: Vector) {
        this._centerPosition = value;
    }

    public get radius(): number {
        return this._radius;
    }
    public set radius(value: number) {
        this._radius = value;
    }

    get area(): number {
        return Math.PI * this.radius * this.radius;
    }
    get perimeter(): number {
        return 2 * Math.PI * this.radius;
    }

    constructor(centerPosition: Vector, radius: number) {
        this._centerPosition = centerPosition;
        this._radius = radius;
    }
}
