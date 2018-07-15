// @flow

import { readFileSync } from 'fs'


/**
 * Synchronously reads json file.
 *
 * @param filePath path to json file
 * @return object
 */
export function readJson<T>(filePath: string): T {
  const content = readFileSync(filePath, 'utf-8')
  const data = JSON.parse(content)

  return data
}
