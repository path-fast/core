#!/usr/bin/env bash
set -euo pipefail

# Check if a package version already exists on npm.
#
# Usage:
#   npm-version-exists.sh                         # name + version from package.json
#   npm-version-exists.sh <version>               # name from package.json
#   npm-version-exists.sh <package-name> <version>
#
# Writes to GITHUB_OUTPUT:
#   pkg_name, pkg_version, exists (true|false)

if [[ -z "${GITHUB_OUTPUT:-}" ]]; then
  echo "GITHUB_OUTPUT is not set" >&2
  exit 1
fi

resolve_pkg_name() {
  node -p "require('./package.json').name"
}

resolve_pkg_version() {
  node -p "require('./package.json').version"
}

case $# in
  0)
    PKG_NAME="$(resolve_pkg_name)"
    PKG_VERSION="$(resolve_pkg_version)"
    ;;
  1)
    PKG_NAME="$(resolve_pkg_name)"
    PKG_VERSION="$1"
    ;;
  2)
    PKG_NAME="$1"
    PKG_VERSION="$2"
    ;;
  *)
    echo "Usage: npm-version-exists.sh [<version>] or npm-version-exists.sh <package-name> <version>" >&2
    exit 1
    ;;
esac

{
  echo "pkg_name=$PKG_NAME"
  echo "pkg_version=$PKG_VERSION"
} >> "$GITHUB_OUTPUT"

if npm view "$PKG_NAME@$PKG_VERSION" version > /dev/null 2>&1; then
  echo "Version $PKG_VERSION already exists on npm."
  echo "exists=true" >> "$GITHUB_OUTPUT"
else
  echo "Version $PKG_VERSION does not exist on npm."
  echo "exists=false" >> "$GITHUB_OUTPUT"
fi
