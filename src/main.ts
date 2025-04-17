import './style.css'

import { LoopHook, MainLoop } from './loop'
import { FullScreenRenderer, IDrawable } from './renderer'
import { System } from './physics/system'
import { CanvasObject } from './canvas-object'
import { Vector2 } from './math/vector2'


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
    public rotationPoint: Vector2 = Vector2.zero;

    public constructor() {
        super()
        this.transform.position = Vector2.one.multiply(200)
    }
}
class TestObjectDrawer implements IDrawable {
    private _object: TestObject

    private _layer: number = 1

    private vertices: Vector2[]

    private _centerOfMass: Vector2 = Vector2.zero;

    public get layer(): number {
        return this._layer
    }

    public set layer(value: number) {
        this._layer = value
    }

    constructor(object: TestObject) {
        this._object = object
        this.vertices = [
            new Vector2(0, 0),
            new Vector2(this._object.width, 0),
            new Vector2(this._object.width, this._object.height),
            new Vector2(0, this._object.height)
        ]

        this.vertices.forEach(v => {
            this._centerOfMass = this._centerOfMass.add(new Vector2(v.x, v.y))
        })
        this._centerOfMass = this._centerOfMass.divide(this.vertices.length)

        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i] = this.vertices[i].subtract(this._centerOfMass)
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const transformedVertices = this.vertices.map(v =>
            this._object.transform.localToWorldMatrix.multiplyPoint(v)
        );

        ctx.fillStyle = "gray";
        ctx.beginPath();
        ctx.moveTo(transformedVertices[0].x, transformedVertices[0].y);

        for (let i = 1; i < transformedVertices.length; i++) {
            ctx.lineTo(transformedVertices[i].x, transformedVertices[i].y);
        }

        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "white";

        this._object.transform.localToWorldMatrix.toStringTransform().split("\n").forEach((line, i) => {
            ctx.fillText(line, transformedVertices[0].x, transformedVertices[0].y + 20 * (i + 1));
        });

        // visualization stuff
        const origin = this._object.transform.localToWorldMatrix.multiplyPoint(new Vector2(0, 0));
        const xAxis = this._object.transform.localToWorldMatrix.multiplyPoint(new Vector2(50, 0));
        const yAxis = this._object.transform.localToWorldMatrix.multiplyPoint(new Vector2(0, 50));

        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(xAxis.x, xAxis.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "lime";
        ctx.lineWidth = 2;
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(yAxis.x, yAxis.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(origin.x, origin.y, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.arc(this._object.rotationPoint.x, this._object.rotationPoint.y, 5, 0, Math.PI * 2);
        ctx.fill();
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
    if (!e.shiftKey) {
        // testObject.transform.matrix.rotateBy(delta * Math.PI / 10);
        testObject.transform.localToWorldMatrix.rotateAroundPoint(delta * Math.PI / 10, testObject.rotationPoint)
        return
    }
    const scale = Math.pow(2, delta)
    testObject.transform.localToWorldMatrix.setScale(testObject.transform.scale.multiply(scale))
})

window.addEventListener("contextmenu", e => {
    e.preventDefault();
    if (e.ctrlKey) {
        testObject.transform.localToWorldMatrix.skewBy(new Vector2(-Math.PI / 10, 0))
        return
    }
    testObject.transform.localToWorldMatrix.skewBy(new Vector2(Math.PI / 10, 0))
})

window.addEventListener("click", () => {
    testObject.rotationPoint = new Vector2(mousePosInCanvas.x, mousePosInCanvas.y)
})
