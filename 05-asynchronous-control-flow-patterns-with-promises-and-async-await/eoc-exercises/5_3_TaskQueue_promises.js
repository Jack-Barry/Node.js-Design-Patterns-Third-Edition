export class TaskQueuePC {
  constructor (concurrency) {
    this.taskQueue = []
    this.consumerQueue = []

    // spawn consumers
    for (let i = 0; i < concurrency; i++) {
      this.consumer()
    }
  }

  consumer () {
    return new Promise((resolve, reject) => {
      function innerLoop () {
        this.getNextTask()
          .then((task) => {
            task()
            // Need to bind this to provide context when calling innerLoop
            innerLoop.bind(this)()
          })
          .catch((err) => {
            console.error(err)
            reject(err)
          })
      }

      // Need to bind this to provide context when calling innerLoop
      innerLoop.bind(this)()
    })
  }

  // This function does not need to be declared as async to return a Promise
  getNextTask () {
    return new Promise((resolve) => {
      if (this.taskQueue.length !== 0) {
        return resolve(this.taskQueue.shift())
      }

      this.consumerQueue.push(resolve)
    })
  }

  runTask (task) {
    return new Promise((resolve, reject) => {
      const taskWrapper = () => {
        const taskPromise = task()
        taskPromise.then(resolve, reject)
        return taskPromise
      }

      if (this.consumerQueue.length !== 0) {
        // there is a sleeping consumer available, use it to run our task
        const consumer = this.consumerQueue.shift()
        consumer(taskWrapper)
      } else {
        // all consumers are busy, enqueue the task
        this.taskQueue.push(taskWrapper)
      }
    })
  }
}
