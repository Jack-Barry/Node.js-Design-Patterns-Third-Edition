import { EventEmitter } from 'events'

function tick (emitter, number, tickCount, done) {
  setTimeout(() => {
    const currentTime = Date.now()
    const invalidTime = currentTime % 5 === 0 ? new Error(`Invalid tick time: ${currentTime}`) : null
    if (invalidTime) {
      // We allow ticking to continue by not returning here
      //   Only if the time was invalid on the final iteration will the error
      //   propagate to the done callback
      emitter.emit('error', invalidTime)
    }

    if (number <= 0) {
      return done(invalidTime, tickCount)
    }

    tickCount++
    emitter.emit('tick', tickCount)
    tick(emitter, number - 50, tickCount, done)
  }, 50)
}

function ticker (number, callback) {
  const emitter = new EventEmitter()

  tick(emitter, number, 0, callback)

  return emitter
}

const cliTickCount = process.argv[2]

if (cliTickCount > 9999) {
  console.error("Please keep your ms under 10000 otherwise you'll be sitting here a while")
  process.exit(1)
}

ticker(cliTickCount, (err, tickCount) => {
  if (err) {
    console.error(`Error from callback: ${err.message}`)
  }
  console.log(`Finished with ${tickCount} ticks`)
})
  .on('error', (err) => { console.log(`Error from event: ${err.message}`) })
  .on('tick', (tickCount) => console.log(`Tick ${tickCount}`))
