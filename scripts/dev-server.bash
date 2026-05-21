#!/bin/bash

# https://kkgithub.com/google/styleguide/blob/gh-pages/shellguide.md
node --watch server/app.js $@ || node server/app.js $@
