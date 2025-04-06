import { Vector2 } from "./vector2";
import { Vector3 } from "./vector3";

export class Matrix32 {
    private _a: number;
    private _b: number;
    private _c: number;
    private _d: number;
    private _tx: number;
    private _ty: number;

    public get a(): number {
        return this._a;
    }
    public set a(value: number) {
        this._a = value;
    }

    public get b(): number {
        return this._b;
    }
    public set b(value: number) {
        this._b = value;
    }

    public get c(): number {
        return this._c;
    }
    public set c(value: number) {
        this._c = value;
    }

    public get d(): number {
        return this._d;
    }
    public set d(value: number) {
        this._d = value;
    }

    public get tx(): number {
        return this._tx;
    }
    public set tx(value: number) {
        this._tx = value;
    }

    public get ty(): number {
        return this._ty;
    }
    public set ty(value: number) {
        this._ty = value;
    }

    public get rotation(): number {
        return Math.atan2(this._b, this._a);
    }
    public setRotation(theta: number) {
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);
        this._a = cos;
        this._b = sin;
        this._c = -sin;
        this._d = cos;
    }

    public get scale(): Vector2 {
        return new Vector2(Math.sqrt(this._a * this._a + this._b * this._b), Math.sqrt(this._c * this._c + this._d * this._d));
    }
    public setScale(value: Vector2) {
        const currentScale = this.scale;
        if (currentScale.x !== 0 && currentScale.y !== 0) {
            this._a *= value.x / currentScale.x;
            this._b *= value.x / currentScale.x;
            this._c *= value.y / currentScale.y;
            this._d *= value.y / currentScale.y;
        }
    }

    public get translation(): Vector2 {
        return new Vector2(this._tx, this._ty);
    }
    public set translation(value: Vector2) {
        this._tx = value.x;
        this._ty = value.y;
    }

    public get skew(): Vector2 {
        return new Vector2(Math.atan2(this._b, this._a), Math.atan2(this._c, this._d));
    }
    public setSkew(value: Vector2) {
        const currentSkew = this.skew;
        if (currentSkew.x !== 0 && currentSkew.y !== 0) {
            this._b *= value.x / currentSkew.x;
            this._c *= value.y / currentSkew.y;
        }
    }

    public isIdentity(): boolean {
        return this._a === 1 && this._b === 0 && this._c === 0 && this._d === 1 && this._tx === 0 && this._ty === 0;
    }

    public static identity(): Matrix32 {
        return new Matrix32(1, 0, 0, 1, 0, 0);
    }
    
    constructor(a: number, b: number, c: number, d: number, tx: number, ty: number) {
        this._a = a;
        this._b = b;
        this._c = c;
        this._d = d;
        this._tx = tx;
        this._ty = ty;
    }

    public static fromEuclideanTransform(position: Vector2, rotation: number = 0, scale: Vector2 = Vector2.one): Matrix32 {
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        return new Matrix32(
            scale.x * cos,
            scale.x * sin,
            -scale.y * sin,
            scale.y * cos,
            position.x,
            position.y
        );
    }

    public multiplyBy(m: Matrix32): Matrix32 {
        this._a = this._a * m._a + this._b * m._c
        this._b = this._a * m._b + this._b * m._d
        this._c = this._c * m._a + this._d * m._c
        this._d = this._c * m._b + this._d * m._d
        this._tx = this._tx * m._a + this._ty * m._c + m._tx
        this._ty = this._tx * m._b + this._ty * m._d + m._ty

        return this;
    }

    public transformVector(v: Vector3): Vector2 {
        return new Vector2(
            this._a * v.x + this._b * v.y + this._tx,
            this._c * v.x + this._d * v.y + this._ty
        );
    }

    public translate(v: Vector2): Matrix32 {
        this._tx += v.x;
        this._ty += v.y;

        return this;
    }

    public scaleBy(v: Vector2): Matrix32 {
        this._a *= v.x;
        this._b *= v.x;
        this._c *= v.y;
        this._d *= v.y;

        return this;
    }

    public rotateBy(theta: number): Matrix32 {
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);
        
        this._a = this._a * cos + this._b * sin;
        this._b = -this._a * sin + this._b * cos;
        this._c = this._c * cos + this._d * sin;
        this._d = -this._c * sin + this._d * cos;

        return this;
    }
    
    public skewBy(v: Vector2): Matrix32 {
        this._b *= v.x;
        this._c *= v.y;

        return this;
    }

    // TODO: check how this works lmao
    public inverted(): Matrix32 {
        const det = this._a * this._d - this._b * this._c;
        if (det === 0) {
            throw new Error("Matrix is not invertible.");
        }
        return new Matrix32(
            this._d / det,
            -this._b / det,
            -this._c / det,
            this._a / det,
            (this._c * this._ty - this._d * this._tx) / det,
            (this._b * this._tx - this._a * this._ty) / det
        );
    }

    public toString(): string {
        return `Matrix32\n[${this._a}, ${this._b}, ${this._tx}]\n[${this._c}, ${this._d}, ${this._ty}]`;
    }

}