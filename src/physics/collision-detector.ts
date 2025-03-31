import { Vector } from "../vector";
import { ICollider } from "./colliders/icollider";
import { RectangularCollider } from "./colliders/rectangular-collider";
import { CircularCollider } from "./colliders/circular-collider";

export class CollisionDetector {
    static test(a: ICollider, b: ICollider): boolean {
        if (a instanceof RectangularCollider && b instanceof RectangularCollider) {
            return this.testAABB(a, b);
        } else if (a instanceof CircularCollider && b instanceof CircularCollider) {
            return this.testCircle(a, b);
        } else if (a instanceof RectangularCollider && b instanceof CircularCollider) {
            return this.testAABBCircle(a, b);
        } else if (a instanceof CircularCollider && b instanceof RectangularCollider) {
            return this.testAABBCircle(b, a);
        }

        console.warn(`Collision detection not implemented for these types of colliders (${a.constructor.name} and ${b.constructor.name}), ignoring collision...`);
        return false;
    }

    static testAABB(a: RectangularCollider, b: RectangularCollider): boolean {
        return !(
            a.position.x + a.width < b.position.x ||
            a.position.x > b.position.x + b.width ||
            a.position.y + a.height < b.position.y ||
            a.position.y > b.position.y + b.height
        );
    }
    static testCircle(a: CircularCollider, b: CircularCollider): boolean {
        const distanceSquared = Vector.distanceSquared(a.position, b.position);
        const radiusSum = a.radius + b.radius;
        return distanceSquared < radiusSum * radiusSum;
    }

    static testAABBCircle(a: RectangularCollider, b: CircularCollider): boolean {
        const closestX = Math.max(a.position.x, Math.min(b.position.x, a.position.x + a.width));
        const closestY = Math.max(a.position.y, Math.min(b.position.y, a.position.y + a.height));

        const distanceSquared = Vector.distanceSquared(new Vector(closestX, closestY), b.position);
        return distanceSquared < b.radius * b.radius;
    }
}