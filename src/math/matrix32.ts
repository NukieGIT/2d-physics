import { Vector2 } from "./vector2";
import { Vector3 } from "./vector3";

// TODO: the setters kinda break skewing and stuff like that
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
        const scale = this.scale;

        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        this._a = cos * scale.x;
        this._b = sin * scale.x;
        this._c = -sin * scale.y;
        this._d = cos * scale.y;
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
        const a = this._a;
        const b = this._b;
        const c = this._c;
        const d = this._d;
        const tx = this._tx;
        const ty = this._ty;

        this._a = a * m._a + b * m._c;
        this._b = a * m._b + b * m._d;
        this._c = c * m._a + d * m._c;
        this._d = c * m._b + d * m._d;
        this._tx = a * m._tx + b * m._ty + tx;
        this._ty = c * m._tx + d * m._ty + ty;

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
        this._d *= v.y;

        return this;
    }

    public rotateByAbout(theta: number, origin: Vector2) : Matrix32 {
        this.translate(origin.multiply(-1))        
        this.rotateBy(theta)
        this.translate(origin)

        return this;
    }

    public rotateBy(theta: number): Matrix32 {
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        const a = this._a;
        const b = this._b;
        const c = this._c;
        const d = this._d;

        this._a = a * cos + b * sin;
        this._b = -a * sin + b * cos;
        this._c = c * cos + d * sin;
        this._d = -c * sin + d * cos;

        return this;
    }

    public skewBy(v: Vector2): Matrix32 {
        const tanX = Math.tan(v.x);
        const tanY = Math.tan(v.y);

        const a = this._a;
        const b = this._b;
        const c = this._c;
        const d = this._d;
    
        this._a = a + c * tanY;
        this._b = b + d * tanY;
        this._c = c + a * tanX;
        this._d = d + b * tanX;

        return this;
    }

    // TODO: check how this works lmao
    public inverted(): Matrix32 {
        const det = this._a * this._d - this._b * this._c;
        if (Math.abs(det) < Number.EPSILON) {
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

    public equals(m: Matrix32): boolean {
        return this._a === m._a && this._b === m._b && this._c === m._c && this._d === m._d && this._tx === m._tx && this._ty === m._ty;
    }
}