import { Vector2 } from "../../../math/vector2";
import { CircularCollider } from "../colliders/circular-collider";
import { Collider } from "../colliders/collider";
import { RectangularCollider } from "../colliders/rectangular-collider";

export class CollisionDetector {
    static test(a: Collider, b: Collider): boolean {
        if (a instanceof RectangularCollider && b instanceof RectangularCollider) {
            return this.testAABB(a, b);
        } else if (a instanceof CircularCollider && b instanceof CircularCollider) {
            return this.testCircle(a, b);
        } else if (a instanceof RectangularCollider && b instanceof CircularCollider) {
            return this.testAABBCircle(a, b);
        } else if (a instanceof CircularCollider && b instanceof RectangularCollider) {
            return this.testAABBCircle(b, a);
        }

        console.warn(`Collision detection not implemented for these types of colliders (${a.constructor.name} and ${b.constructor.name}), ignoring...`);
        return false;
    }

    static testAABB(a: RectangularCollider, b: RectangularCollider): boolean {
        return !(
            a.globalTransform.position.x + a.width < b.globalTransform.position.x ||
            a.globalTransform.position.x > b.globalTransform.position.x + b.width ||
            a.globalTransform.position.y + a.height < b.globalTransform.position.y ||
            a.globalTransform.position.y > b.globalTransform.position.y + b.height
        );
    }
    static testCircle(a: CircularCollider, b: CircularCollider): boolean {
        const distanceSquared = Vector2.distanceSquared(a.globalTransform.position, b.globalTransform.position);
        const radiusSum = a.radius + b.radius;
        return distanceSquared < radiusSum * radiusSum;
    }

    static testAABBCircle(a: RectangularCollider, b: CircularCollider): boolean {
        const closestX = Math.max(a.globalTransform.position.x, Math.min(b.globalTransform.position.x, a.globalTransform.position.x + a.width));
        const closestY = Math.max(a.globalTransform.position.y, Math.min(b.globalTransform.position.y, a.globalTransform.position.y + a.height));

        const distanceSquared = Vector2.distanceSquared(new Vector2(closestX, closestY), b.globalTransform.position);
        return distanceSquared < b.radius * b.radius;
    }
}