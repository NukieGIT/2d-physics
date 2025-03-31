import { Vector } from "../../vector";

export interface ICollider {
    get area(): number;
    get perimeter(): number;
    get position(): Vector;
    set position(value: Vector);
}