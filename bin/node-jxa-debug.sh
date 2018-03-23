#!/bin/bash

(echo 'window = this;'; echo 'debugger;'; browserify $1; echo ';ObjC.import("stdlib");$.exit(0)') | osascript -l JavaScript