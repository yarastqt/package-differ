declare module 'fast-glob' {
  // TODO: add declaration
  declare function glob(): any
  declare export default glob
}

declare module 'package-json' {
  // TODO: add declaration
  declare function packageJson(): any
  declare export default packageJson
}

declare module 'ora' {
  // TODO: add declaration
  declare function ora(): any
  declare export default ora
}

declare type Package = {
  name: string,
  version: string,
  dependencies?: {
    [key: string]: string,
  },
  devDependencies?: {
    [key: string]: string,
  },
  peerDependencies?: {
    [key: string]: string,
  },
}
