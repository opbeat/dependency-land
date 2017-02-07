#!/usr/bin/env bash
# Ensure all javascript files staged for commit pass standard code style
# From: http://standardjs.com/index.html#is-there-a-git-pre-commit-hook
git diff --name-only --cached --relative | grep '\.jsx\?$' | xargs standard
if [ $? -ne 0 ]; then exit 1; fi
