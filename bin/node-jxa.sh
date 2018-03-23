#!/bin/bash

(echo 'window = this;'; ./node_modules/.bin/browserify $1; echo ';ObjC.import("stdlib");$.exit(0)') | osascript -l JavaScript