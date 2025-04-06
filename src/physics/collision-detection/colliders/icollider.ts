import { CanvasObject } from "../../../canvas-object";
import { Component } from "../../../component";
import { IBounds } from "../../../ibounds";
import { Vector2 } from "../../../math/vector2";

export abstract class Collider extends Component {
    private _offset: Vector2;

    get offset(): Vector2 {
        return this._offset;
    }
    set offset(value: Vector2) {
        this._offset = value;
    }

    abstract get area(): number;
    abstract get perimeter(): number;
    abstract get bounds(): IBounds;

    constructor(parent: CanvasObject, offset: Vector2) {
        super(parent);
        this._offset = offset;
    }
}

