#!/usr/bin/env bash
set -e

readonly SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
cd $SCRIPT_DIR/..
pnpm glob 'src/**/*.{ts,tsx}'
