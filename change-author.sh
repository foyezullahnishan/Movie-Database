#!/bin/bash

git filter-branch --env-filter '
export GIT_AUTHOR_NAME="foyezullahnishan"
export GIT_AUTHOR_EMAIL="foyeznishan@gmail.com"
export GIT_COMMITTER_NAME="foyezullahnishan"
export GIT_COMMITTER_EMAIL="foyeznishan@gmail.com"
' --tag-name-filter cat -- --all 