// @flow

import commander from 'commander'


async function diff(packageName: string) {
  console.log(packageName)
}

export function run(programm: typeof commander) {
  programm
    .command('diff <package>')
    .alias('df')
    .action(diff)
}
