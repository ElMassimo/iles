#!/bin/bash

# check if doc files changes for netlify
# needed because we cannot use && in netlify.toml

git diff --quiet 'HEAD^' HEAD ./playground/the-vue-point/ && ! git diff 'HEAD^' HEAD ./pnpm-lock.yaml | grep --quiet vite && git diff --quiet 'HEAD^' HEAD netlify.toml
