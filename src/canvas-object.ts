import { Component } from "./component";
import { LoopHook } from "./loop";
import { Transform } from "./transform";
import { Vector2 } from "./math/vector2";

export class CanvasObject extends LoopHook {
    private _parent: CanvasObject | null = null;
    private _children: CanvasObject[] = [];
    private _active: boolean = true;
    private _transform: Transform;
    
    private _components: Component[] = [];

    public get transform(): Transform {
        return this._transform
    }
    
    public get parent(): CanvasObject | null {
        return this._parent;
    }
    public set parent(value: CanvasObject | null) {
        this._parent = value;
    }

    public get children(): CanvasObject[] {
        return this._children;
    }
    public set children(value: CanvasObject[]) {
        this._children = value;
    }

    public get active(): boolean {
        return this._active;
    }
    public set active(value: boolean) {
        this._active = value;
    }

    public getComponent<T extends Component>(type: new (...args: any[]) => T): T | null {
        for (const component of this._components) {
            if (component instanceof type) {
                return component;
            }
        }
        return null;
    }

    public addComponent(component: Component): void {
        // avoid adding duplicate Transform components
        if (component instanceof Transform) return;

        component.parent = this;
        this._components.push(component);
    }

    public removeComponent(component: Component): void {
        const index = this._components.indexOf(component);
        // avoid removing the Transform component
        if (index === 0) return;

        if (index !== -1) {
            this._components.splice(index, 1);
        }
    }

    constructor() {
        super()
        this._components.push(new Transform(this, Vector2.zero))
        this._transform = this.getComponent(Transform)!;
    }
}