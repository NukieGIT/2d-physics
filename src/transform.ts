import { CanvasObject } from "./canvas-object";
import { Component } from "./component";
import { Matrix32 } from "./math/matrix32";
import { Vector2 } from "./math/vector2";

export class Transform extends Component {
    private _matrix: Matrix32;

    constructor(parent: CanvasObject, position: Vector2, rotation: number = 0, scale: Vector2 = Vector2.one) {
        super(parent)
        this._matrix = Matrix32.fromEuclideanTransform(position, rotation, scale);
    }

    get matrix(): Matrix32 {
        return this._matrix;
    }

    get position(): Vector2 {
        return new Vector2(this._matrix.tx, this._matrix.ty);
    }
    set position(value: Vector2) {
        this._matrix.translation = value;
    }

    get rotation(): number {
        return this._matrix.rotation;
    }
    set rotation(value: number) {
        this._matrix.setRotation(value);
    }

    get scale(): Vector2 {
        return this._matrix.scale;
    }
    set scale(value: Vector2) {
        this._matrix.setScale(value);
    }
}