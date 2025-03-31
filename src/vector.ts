import { lerp } from "./utils.ts";

export class Vector {
	constructor(public x: number, public y: number) { }

	static zero(): Vector {
		return new Vector(0, 0)
	}

	static one(): Vector {
		return new Vector(1, 1)
	}

	static fromAngle(angle: number): Vector {
		return new Vector(Math.cos(angle), Math.sin(angle))
	}

	static distance(a: Vector, b: Vector): number {
		return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
	}

    static distanceSquared(a: Vector, b: Vector): number {
        return (a.x - b.x) ** 2 + (a.y - b.y) ** 2
    }

	// TODO: check how this works lmao
	static angleBetween(a: Vector, b: Vector): number {
		const dot = a.dot(b)
		const lengthA = a.length()
		const lengthB = b.length()
		if (lengthA === 0 || lengthB === 0) {
			return 0
		}
		return Math.acos(dot / (lengthA * lengthB))
	}

	// TODO: check how this works lmao
	static rotate(vector: Vector, angle: number): Vector {
		const cos = Math.cos(angle)
		const sin = Math.sin(angle)
		return new Vector(vector.x * cos - vector.y * sin, vector.x * sin + vector.y * cos)
	}

	static lerp(a: Vector, b: Vector, t: number): Vector {
		return new Vector(lerp(a.x, b.x, t), lerp(a.y, b.y, t))
	}

	add(vector: Vector): Vector {
		return new Vector(this.x + vector.x, this.y + vector.y)
	}

	subtract(vector: Vector): Vector {
		return new Vector(this.x - vector.x, this.y - vector.y)
	}

	multiply(scalar: number): Vector {
		return new Vector(this.x * scalar, this.y * scalar)
	}

	divide(scalar: number): Vector {
		return new Vector(this.x / scalar, this.y / scalar)
	}

	length(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y)
	}

	normalize(): Vector {
		const length = this.length()
		if (length === 0) {
			return Vector.zero()
		}
		return this.divide(length)
	}

	dot(vector: Vector): number {
		return this.x * vector.x + this.y * vector.y
	}

	angle(): number {
		return Math.atan2(this.y, this.x)
	}

}