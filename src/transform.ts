import { CanvasObject } from "./canvas-object";
import { Component } from "./component";
import { Matrix3x3 } from "./math/matrix3x3";
import { Vector2 } from "./math/vector2";

export class Transform extends Component {
    private _matrix: Matrix3x3;

    constructor(parent: CanvasObject, position: Vector2, rotation: number = 0, scale: Vector2 = Vector2.one) {
        super(parent)
        this._matrix = Matrix3x3.fromEuclidean(position, rotation, scale);
    }

    get localToWorldMatrix(): Matrix3x3 {
        return this._matrix;
    }

    get worldToLocalMatrix(): Matrix3x3 {
        return this._matrix.inverted();
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