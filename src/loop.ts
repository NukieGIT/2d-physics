export interface IRendererTick {
    tick(): void;
}

export interface IPhysicsEngineTick {
    tick(): void;
}

export abstract class LoopHook {
	// @ts-ignore
	public update(dt: number): void { }
    // @ts-ignore
	public fixedUpdate(fdt: number): void { }
}

export class MainLoop {
	private _lastTime = 0
    private _lastFixedTime = 0
	private static readonly _fixedTimeStep = 1 / 50
	private _fixedLoopAccumulator = 0

    private _physicsEngineTick: IPhysicsEngineTick | null = null
    private _rendererTick: IRendererTick | null = null
	private _updateObjects: LoopHook[] = []

	/**
	 * 
	 * @returns The index of the object in the update loop
	 */
	public addUpdateHook(obj: LoopHook) {
		const length = this._updateObjects.length - 1
		this._updateObjects.push(obj)
		return length
	}

	public removeUpdateHook(obj: LoopHook) {
		const index = this._updateObjects.indexOf(obj)
		if (index !== -1) {
			this._updateObjects.splice(index, 1)
		}
	}

	public removeUpdateHookByIndex(index: number) {
		if (index >= 0 && index < this._updateObjects.length) {
			this._updateObjects.splice(index, 1)
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
		this._lastTime = performance.now()
        this._lastFixedTime = this._lastTime
		requestAnimationFrame(this.loop.bind(this))
	}

	private loop(timestamp: number) {
		// delta time in seconds
		const deltaTime = (timestamp - this._lastTime) / 1000
		this._lastTime = timestamp

		this.update(deltaTime)

		this._fixedLoopAccumulator += deltaTime
		if (this._fixedLoopAccumulator >= MainLoop._fixedTimeStep) {
			this._fixedLoopAccumulator = 0
            const fixedDeltaTime = (timestamp - this._lastFixedTime) / 1000
            this._lastFixedTime = timestamp
			this.fixedUpdate(fixedDeltaTime)
		}

		requestAnimationFrame(this.loop.bind(this))
	}

	private update(dt: number) {
        for (const obj of this._updateObjects) {
            obj.update(dt)
		}
        this._rendererTick?.tick()
	}

	private fixedUpdate(fdt: number) {
		for (const obj of this._updateObjects) {
			obj.fixedUpdate(fdt)
		}
        this._physicsEngineTick?.tick()
	}
}
