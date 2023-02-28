#!/bin/bash

set -e
# rm -rf ./dist
# mkdir ./dist
tsc
cp ./package.json ./dist/package.json
cp ./ecosystem.config.js ./dist/ecosystem.config.js
# mkdir ./dist/prisma
cp ./prisma/schema.prisma ./dist/prisma/schema.prisma