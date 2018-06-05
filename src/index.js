// @flow

import { resolve } from 'path'
import { readdirSync } from 'fs'
import commander from 'commander'


readdirSync(resolve(__dirname, 'commands'))
  .forEach((fileName) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    require(resolve(__dirname, 'commands', fileName))(commander)
  })

commander
  .parse(process.argv)
