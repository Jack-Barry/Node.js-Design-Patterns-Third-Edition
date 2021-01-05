
async function asyncMap (iterable, callback, concurrency) {
  const queue = []
  let running = 0

  function runTask (task) {
    return new Promise((resolve, reject) => {
      queue.push(() => {
        return task().then(resolve, reject)
      })
      process.nextTick(next)
    })
  }

  function next () {
    while (running < concurrency && queue.length) {
      const task = queue.shift()
      task().finally(() => {
        running--
        next()
      })
      running++
    }
  }

  // Don't know if it's "allowed" to use Promise.all here for this exercise but
  //   it gets the job done and a version of it was already implemented in
  //   exercise 5.1
  return await Promise.all(iterable.map(item => runTask(() => callback(item))))
}

// Function waits a given amount of seconds before resolving with an object of
//   details about the function call
function waitAndResolve (seconds) {
  return new Promise(resolve => {
    const initialSeconds = new Date().getSeconds()
    setTimeout(() => {
      resolve({ initialSeconds, seconds, finalSeconds: initialSeconds + seconds })
    }, seconds * 1000)
  })
}

async function demo () {
  const startTime = new Date().getSeconds()
  // Given concurrency of 2:
  //   Expect the first two promises to start without delay
  //   The third element should start after 2 seconds
  //   The fourth should start after 3 seconds
  //   The final item starts after a total of 6 seconds
  const mapped = await asyncMap([
    3,
    2,
    4,
    5,
    1
  ],
  async (item) => {
    const output = await waitAndResolve(item)
    return output
  },
  2)

  console.log(`Took ${new Date().getSeconds() - startTime} seconds to complete mapping`)
  console.log({ mapped })
}

demo()
