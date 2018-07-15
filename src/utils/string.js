// @flow

/**
 * Remove all dependency ranges.
 *
 * @param value dependency string
 */
export function stripDependencyRanges(value: string) {
  return value.replace(/>|<|=|\^|~/g, '')
}
