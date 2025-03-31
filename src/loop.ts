export interface IRendererTick {
    tick(): void;
}

export interface IPhysicsEngineTick {
    tick(): void;
}

export abstract class LoopHook {
	// @ts-ignore
	public update(dt: number): void { }
	public fixedUpdate(): void { }
}

export class MainLoop {
	private lastTime = 0
	private static readonly fixedTimeStep = 1 / 50
	private fixedLoopAccumulator = 0

    private _physicsEngineTick: IPhysicsEngineTick | null = null
    private _rendererTick: IRendererTick | null = null
	private updateObjects: LoopHook[] = []

	/**
	 * 
	 * @param obj - The object to be added to the update loop
	 * @returns The index of the object in the update loop
	 */
	public addUpdateHook(obj: LoopHook) {
		const length = this.updateObjects.length
		this.updateObjects.push(obj)
		return length
	}

	public removeUpdateHook(obj: LoopHook) {
		const index = this.updateObjects.indexOf(obj)
		if (index !== -1) {
			this.updateObjects.splice(index, 1)
		}
	}

	public removeUpdateHookByIndex(index: number) {
		if (index >= 0 && index < this.updateObjects.length) {
			this.updateObjects.splice(index, 1)
		}
	}

    public set rendererTick(ticker: IRendererTick) {
        this._rendererTick = ticker
    }

    public get rendererTick(): IRendererTick | null {
        return this._rendererTick
    }

    public set physicsEngineTick(ticker: IPhysicsEngineTick) {
        this._physicsEngineTick = ticker
    }

    public get physicsEngineTick(): IPhysicsEngineTick | null {
        return this._physicsEngineTick
    }

	public start() {
		this.lastTime = performance.now()
		requestAnimationFrame(this.loop.bind(this))
	}

	private loop() {
		const currentTime = performance.now()
		// delta time in seconds
		const deltaTime = (currentTime - this.lastTime) / 1000
		this.lastTime = currentTime

		this.update(deltaTime)

		this.fixedLoopAccumulator += deltaTime
		if (this.fixedLoopAccumulator >= MainLoop.fixedTimeStep) {
			this.fixedLoopAccumulator = 0
			this.fixedUpdate()
		}

		requestAnimationFrame(this.loop.bind(this))
	}

	private update(dt: number) {
        this._rendererTick?.tick()
		for (const obj of this.updateObjects) {
			obj.update(dt)
		}
	}

	private fixedUpdate() {
		for (const obj of this.updateObjects) {
			obj.fixedUpdate()
		}
        this._physicsEngineTick?.tick()
	}
}
