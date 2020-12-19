export class TaskQueue {
  constructor (concurrency) {
    this.concurrency = concurrency
    this.running = 0
    this.queue = []
  }

  runTask (task) {
    // This function still needs to return a Promise if the API is to remain
    //   the same
    return new Promise((resolve, reject) => {
      // Pretty straightforward to convert this callback to async/await
      this.queue.push(async () => {
        try {
          return resolve(task())
        } catch (err) {
          // I'm not sure if this rejection needs to have a return or not?
          return reject(err)
        }
      })
      process.nextTick(this.next.bind(this))
    })
  }

  next () {
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift()
      // This is UGLY and I hate it, but a way to convert to async/await
      ;(async () => {
        await task()
        this.running--
        this.next()
      })()
      this.running++
    }
  }
}
