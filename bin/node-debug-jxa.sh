#!/bin/bash

node $(dirname $(python -c "import os; print(os.path.realpath('$0'))"))/../index.js $1 --debug