#!/usr/bin/env bash
set -euo pipefail

# Set a dev pre-release version in package.json for npm publish.
#
# Usage:
#   npm-set-dev-version.sh <run-number>
#
# Example:
#   npm-set-dev-version.sh 42   # 2.0.0 -> 2.0.0-dev.42
#
# Writes to GITHUB_OUTPUT: pkg_name, dev_version

if [[ -z "${GITHUB_OUTPUT:-}" ]]; then
  echo "GITHUB_OUTPUT is not set" >&2
  exit 1
fi

if [[ $# -ne 1 ]]; then
  echo "Usage: npm-set-dev-version.sh <run-number>" >&2
  exit 1
fi

RUN_NUMBER="$1"
PKG_NAME="$(jq -r '.name' package.json)"
BASE="$(jq -r '.version' package.json | sed 's/-.*//')"
DEV_VERSION="${BASE}-dev.${RUN_NUMBER}"

{
  echo "pkg_name=$PKG_NAME"
  echo "dev_version=$DEV_VERSION"
} >> "$GITHUB_OUTPUT"

npm version "$DEV_VERSION" --no-git-tag-version
node .github/scripts/prepare-dist-package.mjs
echo "Set dev version to $DEV_VERSION"
