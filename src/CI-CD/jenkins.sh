#!/bin/bash

WORKSPACE=$1

pwd
ls
whoami

cd src
cp $HOME/.env .
if [ $? -ne 0 ]
then
  echo "Copying failed"
  exit 1
fi
npm install --suppress-package-metadata-warnings
if [ $? -ne 0 ]
then
  echo "npm install failed"
  exit 1
fi
npm test test/watermark.js
if [ $? -ne 0 ]
then
  echo "npm test failed"
fi
npm test test/export.js
if [ $? -ne 0 ]
then
  echo "npm test failed"
fi
npm test test/category.js
if [ $? -ne 0 ]
then
  echo "npm test failed"
fi