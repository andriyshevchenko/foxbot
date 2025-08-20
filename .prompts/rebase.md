# ANALYZE STEP

Instructions:

1. Run the WIP commits analyzer script:
   Command: `python .prompts/analyze_wip_commits.py`
   The script outputs the count of consecutive 'WIP awaiting rebase' commits for use in the REBASE step.

# REBASE STEP

Instructions:

1. Perform an interactive rebase of the last 'count' commits.
   Command: `git rebase -i HEAD~count`
2. Squash all selected commits into a single commit without changing a message.
   Leave the first commit line as pick. Change all other commits from pick to squash (or just s).
3. Print the diff of final commit `git show HEAD > diff_output.txt`
   Verify the diff file was created:
   - Windows: `dir diff_output.txt`
   - Unix/Mac: `ls -la diff_output.txt`

4. - Store current branch name: `$currentBranch = git branch --show-current`
   - Create backup branch with timestamp: `git checkout -b backup-rebase-$(Get-Date -Format "yyyyMMdd-HHmmss")`
   - Checkout back to original branch: `git checkout $currentBranch`
   - Uncommit the big commit `git reset --soft HEAD~1` (using --soft for safety)
   - Verify diff file exists before applying:
     - Windows: `if (Test-Path diff_output.txt) { Write-Host "Diff file found" } else { Write-Error "ERROR: diff_output.txt not found" }`
     - Unix/Mac: `test -f diff_output.txt || echo "ERROR: diff_output.txt not found"`
   - Execute `git apply --index diff_output.txt`
   - Now it's time to break down changes into commits.
     - Explore the diff_output.txt.
       Analyze the changes by file, type, and size.
       Identify logically separable units work. If there are many changes, propose modular grouping for commits.
     - Stage and commit changes for proposed units of work. Use `git add -p` (patch
       mode) to interactively stage hunks. Follow instructions in `.kiro/steering/git-commit-guidelines.md` to generate commit messages.
       After staging a logical group, run `python .prompts/monitor_git_commit.py <commit_message>`. It will perform a commit.
   - Clean up: After successful rebase, delete the backup branch: `git branch -D backup-rebase-<timestamp>`

NOTES:

- Never perform git reset unless explicitly asked to do so by the user.
- Commands are provided for both Windows PowerShell and Unix/Mac environments.
- Always verify the backup branch was created before proceeding with destructive operations.
