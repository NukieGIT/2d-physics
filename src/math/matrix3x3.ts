import { Vector2 } from "./vector2";

// TODO: the setters kinda break skewing and stuff like that
export class Matrix3x3 {
    private _m11: number;
    private _m12: number;
    private _m13: number;

    private _m21: number;
    private _m22: number;
    private _m23: number;

    private _m31: number;
    private _m32: number;
    private _m33: number;

    public get m11(): number {
        return this._m11;
    }
    public set m11(value: number) {
        this._m11 = value;
    }

    public get m12(): number {
        return this._m12;
    }
    public set m12(value: number) {
        this._m12 = value;
    }

    public get m13(): number {
        return this._m13;
    }
    public set m13(value: number) {
        this._m13 = value;
    }

    public get m21(): number {
        return this._m21;
    }
    public set m21(value: number) {
        this._m21 = value;
    }

    public get m22(): number {
        return this._m22;
    }
    public set m22(value: number) {
        this._m22 = value;
    }

    public get m23(): number {
        return this._m23;
    }
    public set m23(value: number) {
        this._m23 = value;
    }

    public get m31(): number {
        return this._m31;
    }
    public set m31(value: number) {
        this._m31 = value;
    }

    public get m32(): number {
        return this._m32;
    }
    public set m32(value: number) {
        this._m32 = value;
    }

    public get m33(): number {
        return this._m33;
    }
    public set m33(value: number) {
        this._m33 = value;
    }

    public get determinant(): number {
        return this._m11 * (this._m22 * this._m33 - this._m23 * this._m32)
            - this._m12 * (this._m21 * this._m33 - this._m23 * this._m31)
            + this._m13 * (this._m21 * this._m32 - this._m22 * this._m31);
    }

    public get rotation(): number {
        return Math.atan2(this._m12, this._m11);
    }
    public setRotation(theta: number) {
        const scale = this.scale;

        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        this._m11 = cos * scale.x;
        this._m12 = sin * scale.x;
        this._m21 = -sin * scale.y;
        this._m22 = cos * scale.y;
    }

    public get scale(): Vector2 {
        return new Vector2(Math.sqrt(this._m11 * this._m11 + this._m12 * this._m12), Math.sqrt(this._m21 * this._m21 + this._m22 * this._m22));
    }
    public setScale(value: Vector2) {
        const currentScale = this.scale;
        if (currentScale.x !== 0 && currentScale.y !== 0) {
            this._m11 *= value.x / currentScale.x;
            this._m12 *= value.x / currentScale.x;
            this._m21 *= value.y / currentScale.y;
            this._m22 *= value.y / currentScale.y;
        }
    }

    public get translation(): Vector2 {
        return new Vector2(this._m13, this._m23);
    }
    public set translation(value: Vector2) {
        this._m13 = value.x;
        this._m23 = value.y;
    }

    public get skew(): Vector2 {
        return new Vector2(Math.atan2(this._m12, this._m11), Math.atan2(this._m21, this._m22));
    }
    public setSkew(value: Vector2) {
        const currentSkew = this.skew;
        if (currentSkew.x !== 0 && currentSkew.y !== 0) {
            this._m12 *= value.x / currentSkew.x;
            this._m21 *= value.y / currentSkew.y;
        }
    }

    public isIdentity(): boolean {
        return this._m11 === 1 && this._m12 === 0 && this._m13 === 0 &&
            this._m21 === 0 && this._m22 === 1 && this._m23 === 0 &&
            this._m31 === 0 && this._m32 === 0 && this._m33 === 1;
    }

    public static identity(): Matrix3x3 {
        return new Matrix3x3(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }

    constructor(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number = 0, m32: number = 0, m33: number = 1) {
        this._m11 = m11;
        this._m12 = m12;
        this._m13 = m13;

        this._m21 = m21;
        this._m22 = m22;
        this._m23 = m23;

        this._m31 = m31;
        this._m32 = m32;
        this._m33 = m33;
    }

    public static fromEuclidean(position: Vector2, rotation: number = 0, scale: Vector2 = Vector2.one): Matrix3x3 {
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        return new Matrix3x3(
            scale.x * cos, scale.x * sin, position.x,
            -scale.y * sin, scale.y * cos, position.y,
            0, 0, 1
        );
    }

    public multiplyBy(m: Matrix3x3): Matrix3x3 {
        const a = this._m11 * m._m11 + this._m12 * m._m21 + this._m13 * m._m31;
        const b = this._m11 * m._m12 + this._m12 * m._m22 + this._m13 * m._m32;
        const c = this._m11 * m._m13 + this._m12 * m._m23 + this._m13 * m._m33;
        const d = this._m21 * m._m11 + this._m22 * m._m21 + this._m23 * m._m31;
        const e = this._m21 * m._m12 + this._m22 * m._m22 + this._m23 * m._m32;
        const f = this._m21 * m._m13 + this._m22 * m._m23 + this._m23 * m._m33;
        const g = this._m31 * m._m11 + this._m32 * m._m21 + this._m33 * m._m31;
        const h = this._m31 * m._m12 + this._m32 * m._m22 + this._m33 * m._m32;
        const i = this._m31 * m._m13 + this._m32 * m._m23 + this._m33 * m._m33;

        this._m11 = a;
        this._m12 = b;
        this._m13 = c;
        this._m21 = d;
        this._m22 = e;
        this._m23 = f;
        this._m31 = g;
        this._m32 = h;
        this._m33 = i;

        return this;
    }


    public multiplyPoint(v: Vector2): Vector2 {
        return new Vector2(
            this._m11 * v.x + this._m12 * v.y + this._m13,
            this._m21 * v.x + this._m22 * v.y + this._m23
        );
    }

    public multiplyVector(v: Vector2): Vector2 {
        return new Vector2(
            this._m11 * v.x + this._m12 * v.y,
            this._m21 * v.x + this._m22 * v.y
        );
    }

    public translate(v: Vector2): Matrix3x3 {
        this._m13 += v.x;
        this._m23 += v.y;

        return this;
    }

    public scaleBy(v: Vector2): Matrix3x3 {
        this._m11 *= v.x;
        this._m22 *= v.y;

        return this;
    }

    // probably can be optimized but i cannot be bothered now
    public rotateAroundPoint(theta: number, worldPoint: Vector2): Matrix3x3 {
        const localPoint = this.clone().invert().multiplyPoint(worldPoint);

        const toPoint = new Matrix3x3(1, 0, localPoint.x, 0, 1, localPoint.y);

        const fromPoint = new Matrix3x3(1, 0, -localPoint.x, 0, 1, -localPoint.y);

        return this
            .multiplyBy(toPoint)
            .rotateBy(theta)
            .multiplyBy(fromPoint);
    }

    public rotateBy(theta: number): Matrix3x3 {
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        const a = this._m11 * cos + this._m12 * -sin
        const b = this._m11 * sin + this._m12 * cos
        const d = this._m21 * cos + this._m22 * -sin
        const e = this._m21 * sin + this._m22 * cos
        const g = this._m31 * cos + this._m32 * -sin
        const h = this._m31 * sin + this._m32 * cos

        this._m11 = a;
        this._m12 = b;

        this._m21 = d;
        this._m22 = e;

        this._m31 = g;
        this._m32 = h;

        return this;
    }

    public skewBy(v: Vector2): Matrix3x3 {
        const tanX = Math.tan(v.x);
        const tanY = Math.tan(v.y);

        const a = this._m11;
        const b = this._m12;
        const c = this._m21;
        const d = this._m22;

        this._m11 = a + c * tanY;
        this._m12 = b + d * tanY;
        this._m21 = c + a * tanX;
        this._m22 = d + b * tanX;

        return this;
    }

    // https://en.wikipedia.org/wiki/Invertible_matrix#Inversion_of_3_%C3%97_3_matrices
    public invert(): Matrix3x3 {
        const det = this.determinant;
        if (det === 0) {
            throw new Error("Matrix is not invertible");
        }

        const invDet = 1 / det;

        const A = (this._m22 * this._m33 - this._m23 * this._m32) * invDet;
        const B = (this._m23 * this._m31 - this._m21 * this._m33) * invDet;
        const C = (this._m21 * this._m32 - this._m22 * this._m31) * invDet;
        const D = (this._m13 * this._m32 - this._m12 * this._m33) * invDet;
        const E = (this._m11 * this._m33 - this._m13 * this._m31) * invDet;
        const F = (this._m12 * this._m31 - this._m11 * this._m32) * invDet;
        const G = (this._m12 * this._m23 - this._m13 * this._m22) * invDet;
        const H = (this._m13 * this._m21 - this._m11 * this._m23) * invDet;
        const I = (this._m11 * this._m22 - this._m12 * this._m21) * invDet;

        this._m11 = A; this._m12 = D; this._m13 = G;
        this._m21 = B; this._m22 = E; this._m23 = H;
        this._m31 = C; this._m32 = F; this._m33 = I;

        return this;
    }

    get [Symbol.toStringTag](): string {
        return `${Matrix3x3.name}\n` +
            `[${this._m11}, ${this._m12}, ${this._m13}]\n` +
            `[${this._m21}, ${this._m22}, ${this._m23}]\n` +
            `[${this._m31}, ${this._m32}, ${this._m33}]`;
    }

    public toStringTransform(): string {
        return `${Matrix3x3.name}\n` +
            `[${this._m11}, ${this._m12}, ${this._m13}]\n` +
            `[${this._m21}, ${this._m22}, ${this._m23}]\n`;
    }

    public equals(m: Matrix3x3): boolean {
        return this._m11 === m._m11 && this._m12 === m._m12 && this._m13 === m._m13 &&
            this._m21 === m._m21 && this._m22 === m._m22 && this._m23 === m._m23 &&
            this._m31 === m._m31 && this._m32 === m._m32 && this._m33 === m._m33;
    }

    public clone(): Matrix3x3 {
        return new Matrix3x3(
            this._m11, this._m12, this._m13,
            this._m21, this._m22, this._m23,
            this._m31, this._m32, this._m33
        )
    }
}