import { EventEmitter } from 'events'

function tick (emitter, number, tickCount, finished) {
  setTimeout(() => {
    tickCount++
    emitter.emit('tick')

    if (number <= 0) {
      return finished(tickCount)
    }

    tick(emitter, number - 50, tickCount, finished)
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

ticker(cliTickCount, (tickCount) => console.log(`Finished with ${tickCount} ticks`))
  .on('tick', () => console.log('Tick'))
