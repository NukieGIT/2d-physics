import { CanvasObject } from "../../../canvas-object";
import { Bounds, IBounds } from "../../../ibounds";
import { Vector2 } from "../../../math/vector2";
import { Collider } from "./collider";

export class CircularCollider extends Collider {
    private _radius: number;

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

    get bounds(): IBounds {
        return new Bounds(
            new Vector2(this.parent.transform.position.x - this.radius, this.parent.transform.position.y - this.radius),
            new Vector2(this.parent.transform.position.x + this.radius, this.parent.transform.position.y + this.radius),
        );
    }

    constructor(parent: CanvasObject, radius: number, offset: Vector2 = Vector2.zero) {
        if (radius <= 0) {
            throw new Error("Radius must be greater than zero.");
        }
        super(parent, offset);
        this._radius = radius;
    }
}
