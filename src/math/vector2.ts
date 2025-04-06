import { lerp } from "../utils.ts";

export class Vector2 {
    private _x: number
    private _y: number

	constructor(x: number, y: number) {
        this._x = x
        this._y = y
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

	static get zero(): Vector2 {
		return new Vector2(0, 0)
	}

	static get one(): Vector2 {
		return new Vector2(1, 1)
	}

    get length(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y)
	}

    get normalized(): Vector2 {
		const length = this.length
		if (length === 0) {
			return Vector2.zero
		}
		return this.divide(length)
	}

	static fromAngle(angle: number): Vector2 {
		return new Vector2(Math.cos(angle), Math.sin(angle))
	}

	static distance(a: Vector2, b: Vector2): number {
		return Math.sqrt(Vector2.distanceSquared(a, b))
	}

    static distanceSquared(a: Vector2, b: Vector2): number {
        return (a.x - b.x) ** 2 + (a.y - b.y) ** 2
    }

	// TODO: check how this works lmao
	static angleBetween(a: Vector2, b: Vector2): number {
		const dot = a.dot(b)
		const lengthA = a.length
		const lengthB = b.length
		if (lengthA === 0 || lengthB === 0) {
			return 0
		}
		return Math.acos(dot / (lengthA * lengthB))
	}

	// TODO: check how this works lmao
	static rotate(vector: Vector2, angle: number): Vector2 {
		const cos = Math.cos(angle)
		const sin = Math.sin(angle)
		return new Vector2(vector.x * cos - vector.y * sin, vector.x * sin + vector.y * cos)
	}

	static lerp(a: Vector2, b: Vector2, t: number): Vector2 {
		return new Vector2(lerp(a.x, b.x, t), lerp(a.y, b.y, t))
	}

	add(vector: Vector2): Vector2 {
		return new Vector2(this.x + vector.x, this.y + vector.y)
	}

	subtract(vector: Vector2): Vector2 {
		return new Vector2(this.x - vector.x, this.y - vector.y)
	}

	multiply(scalar: number): Vector2 {
		return new Vector2(this.x * scalar, this.y * scalar)
	}

	divide(scalar: number): Vector2 {
		return new Vector2(this.x / scalar, this.y / scalar)
	}

	dot(vector: Vector2): number {
		return this.x * vector.x + this.y * vector.y
	}

	angle(): number {
		return Math.atan2(this.y, this.x)
	}

}