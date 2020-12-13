import { appendFile, readFile, writeFile } from 'fs'
import { basename, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { finished, fsOptions, sequentiallyExecute } from './helpers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const outputPath = resolve(__dirname, '4_1_output.txt')
const inputPathA = resolve(__dirname, '4_1_input_a.txt')
const inputPathB = resolve(__dirname, '4_1_input_b.txt')

/** Appends data to the destination file */
function writeContentsToOutputFile (dest, data, cb) {
  console.log(`Appending contents to ${basename(dest)}`)

  appendFile(dest, data, fsOptions, (err) => {
    if (err) return cb(err)
    cb()
  })
}

/** Reads data from an input file and writes it to the destination file */
function processInputFile (dest, file, cb) {
  console.log(`Processing ${basename(file)}`)

  readFile(file, fsOptions, (err, data) => {
    if (err) return cb(err)
    writeContentsToOutputFile(dest, data, cb)
  })
}

/** Concatenates an array of files into the destination file */
function concatFiles (err, dest, cb, ...files) {
  if (err) return cb(err)
  console.log(`Concatenating [${files.map(file => basename(file))}]`)

  function iteratorCallback (file, iterate) {
    processInputFile(dest, file, iterate)
  }

  sequentiallyExecute(files, iteratorCallback, cb, 'Concatenation successful!')
}

/** Cleans the output file before executing the provided callback */
function cleanOutput (err, cb) {
  if (err) return cb(err)
  console.log('Cleaning the output file')
  writeFile(outputPath, '', cb)
}

cleanOutput(null, (err) => {
  concatFiles(
    err,
    outputPath,
    finished,
    inputPathA,
    inputPathB
  )
})
