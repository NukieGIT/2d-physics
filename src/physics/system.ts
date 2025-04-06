import { IPhysicsEngineTick } from "../loop";
import { Collider } from "./collision-detection/colliders/collider";
import { CollisionDetector } from "./collision-detection/narrow-phase/collision-detector";

// TODO: make it use this grid like system for checking collisions quadtrees also there's this spatial hashing or overall the so called spatial partitioning
export class System implements IPhysicsEngineTick {
    private colliders: Collider[] = [];

    addCollider(collider: Collider) {
        this.colliders.push(collider);
    }

    removeCollider(collider: Collider) {
        const index = this.colliders.indexOf(collider);
        if (index !== -1) {
            this.colliders.splice(index, 1);
        }
    }

    tick() {
        for (let i = 0; i < this.colliders.length; i++) {
            for (let j = i + 1; j < this.colliders.length; j++) {
                if (CollisionDetector.test(this.colliders[i], this.colliders[j])) {
                    console.log(
                        `Collision detected between ${this.colliders[i].constructor.name} and ${this.colliders[j].constructor.name}`,
                        this.colliders[i],
                        this.colliders[j]
                    );
                }
            }
        }
    }
}