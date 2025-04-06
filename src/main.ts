import './style.css'

import { LoopHook, MainLoop } from './loop'
import { FullScreenRenderer, IDrawable } from './renderer'
import { System } from './physics/system'
import { CanvasObject } from './canvas-object'
import { Vector2 } from './math/vector2'
import { Vector3 } from './math/vector3'


const canvas = document.querySelector<HTMLCanvasElement>("#canvas")
if (canvas === null) {
    throw new Error("Canvas not found")
}


const mainLoop = new MainLoop()
const renderer = new FullScreenRenderer(canvas)
const physicsSystem = new System()


const mousePosInCanvas = {
    x: 0,
    y: 0,
}
window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect()
    mousePosInCanvas.x = e.clientX - rect.left
    mousePosInCanvas.y = e.clientY - rect.top
})

class TestMetricsObject extends LoopHook implements IDrawable {
    private lastFps: number[] = []
    private accumulator: number = 0
    private avgFps: number = 0
    private dt: number = 0
    private fdt: number = 0

    private _layer: number = 0

    public get layer(): number {
        return this._layer
    }

    public set layer(value: number) {
        this._layer = value
    }
    
    public update(dt: number): void {
        this.lastFps.push(1 / dt || 0)
        this.accumulator += dt
        
        if (this.accumulator >= 1 && this.lastFps.length > 0) {
            this.accumulator = 0
            this.avgFps = this.lastFps.reduce((a, b) => a + b, 0) / this.lastFps.length
            this.lastFps = []
        }
        this.dt = dt
    }

    public fixedUpdate(fdt: number): void {
        this.fdt = fdt
    }
    
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "white"
        ctx.font = "20px Arial"
        ctx.fillText(`Mouse: (${mousePosInCanvas.x}, ${mousePosInCanvas.y})`, 10, 20)
        ctx.fillText(`Delta Time: ${this.dt}`, 10, 40)
        ctx.fillText(`Fixed Delta Time: ${this.fdt}`, 10, 60)
        ctx.fillText(`FPS: ${(1 / this.dt).toFixed(2)} (avg: ${this.avgFps.toFixed(2)})`, 10, 80)
        ctx.fillText(`Canvas Size: ${renderer.width} x ${renderer.height}`, 10, 100)
    }
}

class TestObject extends CanvasObject {
    public width: number = 100
    public height: number = 100

    private get mouseCenterOffset(): Vector2 {
        return new Vector2(this.width / 2, this.height / 2)
    }

    public constructor() {
        super()
        this.transform.position = Vector2.one.multiply(0)
    }

    public update(dt: number): void {
        // this.transform.position = new Vector2(mousePosInCanvas.x, mousePosInCanvas.y)
        //     .subtract(this.mouseCenterOffset)
    }
}
class TestObjectDrawer implements IDrawable {
    private _object: TestObject

    private _layer: number = 1

    public get layer(): number {
        return this._layer
    }

    public set layer(value: number) {
        this._layer = value
    }

    constructor(object: TestObject) {
        this._object = object
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const lbv2 = this._object.transform.matrix.translation
        const rbv2 = this._object.transform.matrix.translation.add(new Vector2(this._object.width, 0))
        const rtv2 = this._object.transform.matrix.translation.add(new Vector2(this._object.width, this._object.height))
        const ltv2 = this._object.transform.matrix.translation.add(new Vector2(0, this._object.height))

        const lb = this._object.transform.matrix.transformVector(new Vector3(lbv2.x, lbv2.y, 1))
        const rb = this._object.transform.matrix.transformVector(new Vector3(rbv2.x, rbv2.y, 1))
        const rt = this._object.transform.matrix.transformVector(new Vector3(rtv2.x, rtv2.y, 1))
        const lt = this._object.transform.matrix.transformVector(new Vector3(ltv2.x, ltv2.y, 1))

        ctx.fillStyle = "gray"
        ctx.beginPath()

        ctx.moveTo(lb.x, lb.y)
        ctx.lineTo(rb.x, rb.y)
        ctx.lineTo(rt.x, rt.y)
        ctx.lineTo(lt.x, lt.y)

        ctx.closePath()
        ctx.fill()
        ctx.fillStyle = "white"
        
        this._object.transform.matrix.toString().split("\n").forEach((line, i) => {
            ctx.fillText(line, lb.x, lb.y + 20 * (i + 1))
        })
    }
}

renderer.init()


mainLoop.rendererTick = renderer
mainLoop.physicsEngineTick = physicsSystem

const testMetricsObject = new TestMetricsObject()
renderer.addDrawable(testMetricsObject)
mainLoop.addUpdateHook(testMetricsObject)

const testObject = new TestObject()
const testObjectDrawer = new TestObjectDrawer(testObject)
renderer.addDrawable(testObjectDrawer)
mainLoop.addUpdateHook(testObject)

mainLoop.start()

window.addEventListener("wheel", e => {
    const delta = Math.sign(e.deltaY)
    if (e.altKey) {
        testObject.transform.matrix.rotateBy(delta * Math.PI / 180)
        return
    }
    const scale = Math.pow(2, delta)
    testObject.transform.scale = testObject.transform.scale.multiply(scale)
})