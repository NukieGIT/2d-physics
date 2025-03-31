export function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(value, max))
}

export function lerp(start: number, end: number, t: number): number {
	return start + (end - start) * t
}

export function randomRange(min: number, max: number): number {
	return Math.random() * (max - min) + min
}

export function randomIntRange(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomChoice<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)]
}