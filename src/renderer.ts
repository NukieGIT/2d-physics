// TODO: panning and zooming (most likely)
// TODO: text rendering order "layers"

import { IRendererTick } from "./loop"

export class Renderer implements IRendererTick {
    private canvas: HTMLCanvasElement
    private _ctx?: CanvasRenderingContext2D | undefined

    private _width: number = 0
    private _height: number = 0

    protected _drawables: IDrawable[] = []
    private _areDrawablesDirty: boolean = true

    public get width(): number {
        return this._width
    }
    public get height(): number {
        return this._height
    }
    public set width(value: number) {
        this._width = value
        this.canvas.width = value
    }
    public set height(value: number) {
        this._height = value
        this.canvas.height = value
    }

    public addDrawable(drawable: IDrawable): number {
        const idx = this._drawables.length - 1
        this._drawables.push(drawable)
        this.makeDrawablesDirty()
        return idx
    }

    public removeDrawable(drawable: IDrawable): void {
        const index = this._drawables.indexOf(drawable)
        if (index !== -1) {
            this._drawables.splice(index, 1)
            this.makeDrawablesDirty()
        }
    }

    public removeDrawableByIndex(index: number): void {
        if (index >= 0 && index < this._drawables.length) {
            this._drawables.splice(index, 1)
            this.makeDrawablesDirty()
        }
    }

    private makeDrawablesDirty() {
        this._areDrawablesDirty = true
    }

    protected get canvasElement(): HTMLCanvasElement {
        return this.canvas
    }
    
    protected get ctx(): CanvasRenderingContext2D {
        if (this._ctx === undefined) {
            throw new Error("Context not initialized")
        }
        return this._ctx
    }

    public constructor(canvas: HTMLCanvasElement, width: number, height: number) {
        this.canvas = canvas
        this.width = width
        this.height = height
    }

    public tick(): void {
        this.clear()
        if (this._areDrawablesDirty) {
            this._drawables.sort((a, b) => b.layer - a.layer)
            this._areDrawablesDirty = false
        }

        for (const drawable of this._drawables) {
            drawable.draw(this.ctx)
        }
    }

    public init() {
        const ctx = this.canvas.getContext("2d")
        if (ctx === null) {
            throw new Error("2d context not found")
        }
        this._ctx = ctx
    }

    protected clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
}

export class FullScreenRenderer extends Renderer {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, FullScreenRenderer.documentWidth, FullScreenRenderer.documentHeight)
    }

    private static get documentWidth() {
        return document.documentElement.clientWidth
    }

    private static get documentHeight() {
        return document.documentElement.clientHeight
    }

    public init() {
        super.init()
        this.resize()
        window.addEventListener("resize", () => this.resize())
    }

    private resize() {
        this.width = FullScreenRenderer.documentWidth
        this.height = FullScreenRenderer.documentHeight
    }
}

export interface IDrawable {
    get layer(): number
    set layer(value: number)
    draw(ctx: CanvasRenderingContext2D): void
}