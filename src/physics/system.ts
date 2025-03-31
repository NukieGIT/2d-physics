import { IPhysicsEngineTick } from "../loop";
import { ICollider } from "./colliders/icollider";
import { CollisionDetector } from "./collision-detector";

// TODO: make it use this grid like system for checking collisions quadtrees also there's this spatial hashing or overall the so called spatial partitioning
export class System implements IPhysicsEngineTick {
    private colliders: ICollider[] = [];

    addCollider(collider: ICollider) {
        this.colliders.push(collider);
    }

    removeCollider(collider: ICollider) {
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