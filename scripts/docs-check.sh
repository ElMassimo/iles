#!/bin/bash

# check if doc files changes for netlify
# needed because we cannot use && in netlify.toml

git diff --quiet 'HEAD^' HEAD ./playground/the-vue-point/ && git diff --quiet 'HEAD^' HEAD netlify.toml
