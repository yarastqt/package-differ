// @flow

import { resolve } from 'path'
import { readdirSync } from 'fs'
import commander from 'commander'
// $FlowFixMe (ignore next line because of import from JSON not typed)
import { version } from '../package'


readdirSync(resolve(__dirname, 'commands'))
  .forEach((fileName) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    require(resolve(__dirname, 'commands', fileName))(commander)
  })

commander
  .version(version, '-v, --version')
  .parse(process.argv)
