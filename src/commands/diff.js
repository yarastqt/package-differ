// @flow

import commander from 'commander'
import semver from 'semver'
import fastGlob from 'fast-glob'

import { readJson } from 'utils/json'
import { stripDependencyRanges } from 'utils/string'
import { progress } from 'utils/progress'


type DependentPackages = {
  package: {
    name: string,
    version: string,
  },
  packages: {
    name: string,
    path: string,
    type: string,
    version: string,
  }[],
}

function getDependencyType(dependencyName: string, deps: any) {
  return Object.keys(deps).reduce((type, key) => {
    if (deps[key] !== undefined && deps[key][dependencyName] !== undefined) {
      return key
    }
    return type
  }, '')
}

function getDependentPackages(entries: string[], packageName: string): DependentPackages {
  return entries.reduce((acc, packagePath) => {
    const { name, version, ...rest }: Package = readJson(packagePath)

    if (name === packageName) {
      return {
        ...acc,
        package: { name, version },
      }
    }

    const deps = { prod: rest.dependencies, dev: rest.devDependencies, peer: rest.peerDependencies }
    const flattenDeps = Object.keys(deps).reduce((accDeps, key) => ({ ...accDeps, ...deps[key] }), {})
    const hasPackageInDependencies = Object.keys(flattenDeps)
      .some((dependencyName) => dependencyName === packageName)

    if (hasPackageInDependencies) {
      const type = getDependencyType(packageName, deps)

      return {
        ...acc,
        packages: [
          ...acc.packages,
          { name, type, path: packagePath, version: flattenDeps[packageName] },
        ],
      }
    }

    return acc
  }, { package: { name: '', version: '' }, packages: [] })
}

function getDiffDependentPackages(dependent: DependentPackages) {
  return dependent.packages.reduce((acc, { type, version, name, path }) => {
    const dependencyVersion = stripDependencyRanges(version)
    const isValidSemVer = semver.valid(dependencyVersion)
    const semVerDifference = semver.compare(dependencyVersion, dependent.package.version)

    if (isValidSemVer !== null && (semVerDifference === 1 || semVerDifference === -1)) {
      return [...acc, { type, name, version, path }]
    }

    return acc
  }, [])
}

async function diff(packageName: string) {
  progress.start()

  const entries = await fastGlob(['**/package.json', '!**/node_modules/**/package.json'])
  const dependent = getDependentPackages(entries, packageName)
  const packageDependencies = getDiffDependentPackages(dependent)

  progress.stop()

  if (packageDependencies.length > 0) {
    const result = packageDependencies
      .map(({ type, name, version }) => `* ${name}: ${version} [${type}]`)
      .join('\n')

    console.log(`Package: ${dependent.package.name}`)
    console.log(`Version: ${dependent.package.version}`)
    console.log('Not actual in:')
    console.log(result)
  }
  else if (dependent.package.name === '') {
    console.log(`Package ${packageName} not found in project`)
  }
  else {
    console.log(`Package ${packageName} is not used anywhere`)
  }
}

export function run(programm: typeof commander) {
  programm
    .command('diff <package>')
    .alias('df')
    .action(diff)
}
