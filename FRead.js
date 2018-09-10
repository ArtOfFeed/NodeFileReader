const fs = require('fs')
const path = require('path')
const glob = require('glob')

if (process.argv.length < 3) {
  console.error('err:', 'third argument(pattern) is required')
  process.exit(1)
}

// const pattern = process.argv[2] // '**/*.txt'
const dirPath = process.argv[3] || process.cwd()
const pattern = '**/*.txt'
console.log('pattern:', pattern)

const filesName = 'files.json'
const resultName = 'result.json'

const options = {
  cwd: dirPath,
  ignore: '**/node_modules/**'
}

find(pattern, options)
  .then(function (files) {
    console.log('files:', files)

    fs.writeFileSync(filesName, JSON.stringify(files, 0, 1))

    const promises = files.map(function (file) {
      const filePath = path.join(dirPath, file).replace(/\\/g, "/")
      return readFile(filePath, {}).then(function (content) {
        return {
          filePath: filePath,
          content: content.toString(),
        }
      })
    })

    return Promise.all(promises).then(function (data) {
      const t = data.reduce(function (acc, item) {
        if (!Array.isArray(acc[item.filePath])) {
          acc[item.filePath] = []
        }
        const array = item.content.split(/\r?\n/).filter(item => item)
        acc[item.filePath] = acc[item.filePath].concat(array)

        return acc
      }, {})

      console.log('contents:', t)

      fs.writeFileSync(resultName, JSON.stringify(t, 0, 1))
    })
  })
  .catch(function (err) {
    console.error('err:', err)
  })

/**
 * @param {String} pattern
 * @param {Object} [options]
 * @returns {Promise<*>}
 */
function find(pattern, options) {
  return new Promise(function (resolve, reject) {
    glob(pattern, options, function (err, files) {
      if (err) {
        return reject(err)
      }
      resolve(files)
    })
  })
}

/**
 * @param {String} path
 * @param {Object} [options]
 * @returns {Promise<*>}
 */
function readFile(path, options) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, options, function (err, data) {
      if (err) {
        return reject(err)
      }
      resolve(data)
    })
  })
}
