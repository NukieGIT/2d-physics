import './style.css'

import { MainLoop, LoopHook } from './loop'
import { FullScreenRenderer } from './renderer'
import { Vector } from './vector'
import { RectangularCollider } from './physics/colliders/rectangular-collider'
import { System } from './physics/system'
import { CircularCollider } from './physics/colliders/circular-collider'
import { clamp } from './utils'

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

class TestObject extends LoopHook {
    private lastFps: number[] = []
    private accumulator: number = 0
    private avgFps: number = 0
    private ctx: CanvasRenderingContext2D

    constructor() {
        super()
        this.ctx = renderer.ctx
    }

    public update(dt: number): void {
        this.lastFps.push(1 / dt)
        this.accumulator += dt

        if (this.accumulator >= 1 && this.lastFps.length > 0) {
            this.accumulator = 0
            this.avgFps = this.lastFps.reduce((a, b) => a + b, 0) / this.lastFps.length
            this.lastFps = []
        }

        this.ctx.fillStyle = "white"
        this.ctx.font = "20px Arial"
        this.ctx.fillText(`Mouse: (${mousePosInCanvas.x}, ${mousePosInCanvas.y})`, 10, 20)
        this.ctx.fillText(`Delta Time: ${dt.toFixed(4)}`, 10, 50)
        this.ctx.fillText(`FPS: ${(1 / dt).toFixed(2)} (avg: ${this.avgFps.toFixed(2)})`, 10, 80)
        this.ctx.fillText(`Canvas Size: ${renderer.width} x ${renderer.height}`, 10, 110)
    }
}

class TestRect extends LoopHook {
    width: number
    height: number
    position: Vector
    
    rectangularCollider: RectangularCollider

    constructor(width: number, height: number, position: Vector) {
        super()
        this.width = width
        this.height = height
        this.position = position

        this.rectangularCollider = new RectangularCollider(width, height, position)
    }

    public update(dt: number): void {
        const ctx = renderer.ctx
        ctx.fillStyle = "red"
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class TestCircle extends LoopHook {
    radius: number
    position: Vector

    circularCollider: CircularCollider

    constructor(radius: number, position: Vector) {
        super()
        this.radius = radius
        this.position = position

        this.circularCollider = new CircularCollider(position, radius)
    }

    public update(dt: number): void {
        this.position.x = mousePosInCanvas.x
        this.position.y = mousePosInCanvas.y

        // TODO: use the transform like thing the way unity does it to make it all more universal pls
        // and to avoid this and just pass the other class as reference
        this.circularCollider.position = this.position
        this.circularCollider.radius = this.radius

        const ctx = renderer.ctx
        ctx.fillStyle = "blue"
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
    }
}

window.addEventListener("wheel", (e) => {
    e.preventDefault()
    e.stopPropagation()
    // change radius of the circle based on scroll delta
    const delta = e.deltaY
    const newRadius = clamp(testCircle.radius - delta / 20, 10, 200)
    testCircle.radius = newRadius
    testCircle.circularCollider.radius = testCircle.radius
})


renderer.init()

const testObject = new TestObject()
const testRect = new TestRect(100, 100, new Vector(400, 100))
const testCircle = new TestCircle(50, new Vector(0, 0))

mainLoop.rendererTick = renderer
mainLoop.physicsEngineTick = physicsSystem

mainLoop.addUpdateHook(testRect)
mainLoop.addUpdateHook(testObject)
mainLoop.addUpdateHook(testCircle)

physicsSystem.addCollider(testRect.rectangularCollider)
physicsSystem.addCollider(testCircle.circularCollider)

mainLoop.start()