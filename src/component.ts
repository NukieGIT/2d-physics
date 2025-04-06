import { CanvasObject } from "./canvas-object";

export abstract class Component {
    private _parent: CanvasObject;
    private _active: boolean = true;

    public get parent(): CanvasObject {
        return this._parent;
    }
    public set parent(value: CanvasObject) {
        this._parent = value;
    }

    public get active(): boolean {
        return this._active;
    }
    public set active(value: boolean) {
        this._active = value;
    }

    constructor(parent: CanvasObject) {
        this._parent = parent;
    }

}