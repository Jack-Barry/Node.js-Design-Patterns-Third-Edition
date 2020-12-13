import { readdir, stat } from 'fs'
import { resolve } from 'path'
import { nextTick } from 'process'
import { finished, fsOptions } from './helpers.js'

const __dirname = resolve()

/** Interprets stats for the path */
function interpretStats (
  err,
  path,
  stats,
  perEntityCb,
  finalCb
) {
  if (err) return finalCb(err)

  if (!stats.isDirectory()) {
    return perEntityCb(null, path)
  }

  listContentsOfDir(path, perEntityCb)
}

/** Determines if the path is a directory, lists contents if needed */
function getDataForPath (
  path,
  perEntityCb,
  finalCb
) {
  if (path.includes('node_modules')) {
    return nextTick(finalCb)
  }

  stat(path, (err, stats) => {
    interpretStats(err, path, stats, perEntityCb, finalCb)
  })
}

/** Iterates over each path to log its data or iterate over its contents */
function iterateOverPaths (basePath, paths, finalCb) {
  function iterate (index) {
    const nextIndex = index + 1
    if (index === paths.length) {
      return finalCb(null, `Done listing files in ${basePath}`)
    }

    getDataForPath(
      resolve(basePath, paths[index]),
      (err, data) => {
        if (err) return finalCb(err)
        console.log(data)
        iterate(nextIndex)
      },
      finalCb
    )
  }

  iterate(0)
}

/** Recursively lists the contents of a directory */
function listContentsOfDir (dir, finalCb) {
  const basePath = resolve(dir)

  readdir(basePath, fsOptions, (err, nestedPaths) => {
    if (err) return finalCb(err)
    iterateOverPaths(basePath, nestedPaths, finalCb)
  })
}

listContentsOfDir(__dirname, finished)
