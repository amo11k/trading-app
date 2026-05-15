export class RateLimiter {
  private queue: string[]
  private intervalMs: number
  private processor: (item: string) => Promise<void>
  private timer: ReturnType<typeof setInterval> | null
  private _running: boolean
  private _processed: number
  private _totalEnqueued: number

  constructor(intervalMs: number, processor: (item: string) => Promise<void>) {
    this.queue = []
    this.intervalMs = intervalMs
    this.processor = processor
    this.timer = null
    this._running = false
    this._processed = 0
    this._totalEnqueued = 0
  }

  enqueue(items: string[]): void {
    for (const item of items) {
      if (!this.queue.includes(item)) {
        this.queue.push(item)
        this._totalEnqueued++
      }
    }
  }

  private async tick(): Promise<void> {
    if (!this._running || this.queue.length === 0) {
      if (this.queue.length === 0 && this._running) {
        this.pause()
      }
      return
    }

    const item = this.queue.shift()!
    this._processed++

    try {
      await this.processor(item)
    } catch {
      // re-enqueue on failure for retry
      this.queue.push(item)
    }
  }

  start(): void {
    if (this._running) return
    this._running = true
    this.timer = setInterval(() => this.tick(), this.intervalMs)
    this.tick()
  }

  pause(): void {
    this._running = false
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  fill(items: string[]): void {
    this.queue = [...items]
    this._processed = 0
    this._totalEnqueued = items.length
  }

  get running(): boolean {
    return this._running
  }

  get processed(): number {
    return this._processed
  }

  get total(): number {
    return this._totalEnqueued
  }

  get remaining(): number {
    return this.queue.length
  }

  destroy(): void {
    this.pause()
    this.queue = []
    this._processed = 0
    this._totalEnqueued = 0
  }
}
