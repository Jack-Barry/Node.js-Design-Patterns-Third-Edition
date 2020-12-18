async function myPromiseAll (promises) {
  console.log(`Start seconds: ${new Date().getSeconds()}`)

  const outputs = []
  for (const promise of promises) {
    outputs.push(await promise)
  }

  console.log(outputs)
  console.log(`End seconds: ${new Date().getSeconds()}`)
}

function printAndResolve (seconds) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(seconds)
      resolve(seconds)
    }, seconds * 1000)
  })
}

/**
 * Expect it to print 1, 2, 3, 4 as each promise resolves,
 *   then [3, 1, 2, 4] once all promises have resolved.
 *
 * Difference between start and end seconds should be 4
 */
myPromiseAll([
  printAndResolve(3),
  printAndResolve(1),
  printAndResolve(2),
  printAndResolve(4)
])
