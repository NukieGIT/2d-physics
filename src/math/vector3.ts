import { lerp } from "../utils.ts";

// TODO: finish this class
export class Vector3 {
    private _x: number
    private _y: number
    private _z: number

    constructor(x: number, y: number, z: number) {
        this._x = x
        this._y = y
        this._z = z
    }

    get x(): number {
        return this._x
    }

    set x(value: number) {
        this._x = value
    }

    get y(): number {
        return this._y
    }

    set y(value: number) {
        this._y = value
    }

    get z(): number {
        return this._z
    }

    set z(value: number) {
        this._z = value
    }

    static get zero(): Vector3 {
        return new Vector3(0, 0, 0)
    }

    static get one(): Vector3 {
        return new Vector3(1, 1, 1)
    }

    get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }

    get normalized(): Vector3 {
        const length = this.length
        if (length === 0) {
            return Vector3.zero
        }
        return this.divide(length)
    }

    // static fromAngle(angle: number): Vector2 {
    //     return new Vector2(Math.cos(angle), Math.sin(angle))
    // }

    static distance(a: Vector3, b: Vector3): number {
        return Math.sqrt(this.distanceSquared(a, b))
    }

    static distanceSquared(a: Vector3, b: Vector3): number {
        return (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2
    }

    // TODO: check how this works lmao
    // static angleBetween(a: Vector2, b: Vector2): number {
    //     const dot = a.dot(b)
    //     const lengthA = a.length
    //     const lengthB = b.length
    //     if (lengthA === 0 || lengthB === 0) {
    //         return 0
    //     }
    //     return Math.acos(dot / (lengthA * lengthB))
    // }

    // TODO: check how this works lmao
    // static rotate(vector: Vector2, angle: number): Vector2 {
    //     const cos = Math.cos(angle)
    //     const sin = Math.sin(angle)
    //     return new Vector2(vector.x * cos - vector.y * sin, vector.x * sin + vector.y * cos)
    // }

    static lerp(a: Vector3, b: Vector3, t: number): Vector3 {
        return new Vector3(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t))
    }

    add(vector: Vector3): Vector3 {
        return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z)
    }

    subtract(vector: Vector3): Vector3 {
        return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z)
    }

    multiply(scalar: number): Vector3 {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar)
    }

    divide(scalar: number): Vector3 {
        return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar)
    }

    dot(vector: Vector3): number {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z
    }
}