/** Basic options for fs operations */
export const fsOptions = { encoding: 'utf-8' }

/**
 * Generic implementation of the sequential execution pattern
 *
 * Note that the `iteratorCallback` should accept as arguments:
 *   * The item of the array being processed
 *   * A second argument `iterate` which is called by the `iteratorCallback` to
 *       signal that the iteration is complete
 */
export function sequentiallyExecute (
  collection,
  iteratorCallback,
  finalCallback,
  successMessage = 'Operation successful!'
) {
  function iterate (index) {
    if (index === collection.length) return finalCallback(null, successMessage)

    iteratorCallback(collection[index], (err) => {
      if (err) return finalCallback(err)
      iterate(index + 1)
    })
  }

  iterate(0)
}

/** Provides output to the console to verify a task has completed */
export function finished (err, successMessage = 'Operation complete!') {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(successMessage)
}
