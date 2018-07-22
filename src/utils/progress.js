// @flow

// $FlowFixMe (library not have typings)
import nodeStatus from 'node-status'


export const progress = {
  start() {
    nodeStatus.start({
      interval: 150,
      pattern: '{spinner.dots} Search dependent packages',
    })
  },

  stop() {
    nodeStatus.stop()
  },
}
