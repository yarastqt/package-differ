// @flow

import commander from 'commander'
import semver from 'semver'
import fastGlob from 'fast-glob'

import { readJson } from 'utils/json'
import { stripDependencyRanges } from 'utils/string'


type DependentPackages = {
  package: {
    name: string,
    version: string,
  },
  packages: {
    name: string,
    path: string,
    version: string,
  }[],
}

function getDependentPackages(entries: string[], packageName: string): DependentPackages {
  return entries.reduce((acc, packagePath) => {
    const { name, version, dependencies = {} }: Package = readJson(packagePath)

    if (name === packageName) {
      return {
        ...acc,
        package: { name, version },
      }
    }

    const hasPackageInDependencies = Object.keys(dependencies)
      .some((dependencyName) => dependencyName === packageName)

    if (hasPackageInDependencies) {
      return {
        ...acc,
        packages: [
          ...acc.packages,
          { name, path: packagePath, version: dependencies[packageName] },
        ],
      }
    }

    return acc
  }, { package: { name: '', version: '' }, packages: [] })
}

function getDiffDependentPackages(dependent: DependentPackages) {
  return dependent.packages.reduce((acc, { version, name, path }) => {
    const dependencyVersion = stripDependencyRanges(version)
    const isValidSemVer = semver.valid(dependencyVersion)
    const semVerDifference = semver.compare(dependencyVersion, dependent.package.version)

    if (isValidSemVer !== null && semVerDifference === -1) {
      return [...acc, { name, version, path }]
    }

    return acc
  }, [])
}

async function diff(packageName: string) {
  const entries = await fastGlob(['**/package.json', '!**/node_modules/**/package.json'])
  const dependent = getDependentPackages(entries, packageName)
  const packageDependencies = getDiffDependentPackages(dependent)

  if (packageDependencies.length > 0) {
    const result = packageDependencies
      .map(({ name, version }) => `* ${name}: ${version}`)
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
