declare module 'fast-glob' {
  // TODO: add declaration
  declare function glob(): any
  declare export default glob
}

declare type Package = {
  name: string,
  version: string,
  dependencies?: {
    [key: string]: string,
  }
}
