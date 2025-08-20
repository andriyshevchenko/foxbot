# Git WIP Commit Monitor

## 1. Stage all changes

`git add -A`

## 2. Commit with monitoring

`python .prompts/monitor_git_commit.py "WIP: awaiting rebase"`

**Note**: The Python script waits for git commit to complete and show file change summary before finishing.
