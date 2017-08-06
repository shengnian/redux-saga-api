#!/usr/bin/env node

var copy = require('recursive-copy')

copy('src', 'lib', {
  overwrite: true,
  filter: '*.js',
  rename: path => (`${path}.flow`)
}).then((results) => {
  results.forEach((result) => {
    console.error(`${result.src} -> ${result.dest}`)
  })
  process.exit(0)
}).catch((err) => {
  console.error(err)
  process.exit(1)
})
