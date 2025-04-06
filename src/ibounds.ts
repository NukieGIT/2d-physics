import { Vector2 } from "./math/vector2";

export interface IBounds {
    get center(): Vector2;
    get extents(): Vector2;
    get min(): Vector2;
    get max(): Vector2;
    get size(): Vector2;
}

export class Bounds implements IBounds {
    private _center: Vector2;
    private _extents: Vector2;
    private _min: Vector2;
    private _max: Vector2;
    private _size: Vector2;

    constructor(center: Vector2, size: Vector2) {
        this._center = center;
        this._size = size;
        this._extents = size.multiply(0.5);
        this._min = center.subtract(this._extents);
        this._max = center.add(this._extents);
    }

    get center(): Vector2 {
        return this._center;
    }
    get extents(): Vector2 {
        return this._extents;
    }
    get min(): Vector2 {
        return this._min;
    }
    get max(): Vector2 {
        return this._max;
    }
    get size(): Vector2 {
        return this._size;
    }
}
