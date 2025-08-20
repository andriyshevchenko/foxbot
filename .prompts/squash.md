# ANALYZE STEP

Instructions:

1. **Pre-flight checks**:
   - Verify working directory is clean: `git status --porcelain`
   - Verify required scripts exist: `if (Test-Path .prompts/analyze_wip_commits.py) { Write-Host "An8. **Final verification fails**:
   - Commit doesn't contain expected changes
   - Solution: Check `git show --stat` to verify all changes are included

2. **PowerShell backup block fails**:r found" } else { Write-Error "Missing analyzer script" }`
   - Verify monitor script exists: `if (Test-Path .prompts/monitor_git_commit.py) { Write-Host "Monitor found" } else { Write-Error "Missing monitor script" }`

3. Run the WIP commits analyzer script:
   Command: `python .prompts/analyze_wip_commits.py`
   The script outputs the count of consecutive 'WIP awaiting rebase' commits.
   **Note the count value from the output for use in SQUASH step.**

4. **Verify count accuracy**:
   - Manually verify: `git log --oneline -<count>` (replace <count> with analyzer output)
   - Ensure the commits shown match expectation
   - If count seems wrong, stop and investigate

5. **Verify git repository state**:
   - Confirm you're in correct repository: `git remote -v`
   - Verify current branch: `git branch --show-current`

# ANALYZE CHANGES STEP

Instructions:

1. **Analyze the changes without modifying git history**:
   - Get combined diff of all WIP commits: `git diff HEAD~<count>` (replace <count> with analyzer output)
   - Get file summary: `git diff --name-status HEAD~<count>`
   - Get statistics: `git diff --stat HEAD~<count>`

2. **Categorize changes by type**:
   Analyze the changes and group them into logical categories:
   - **Directory/file reorganization**: moves, renames, deletions
   - **Documentation updates**: \*.md files, comments, README changes
   - **New feature additions**: new functionality files, API additions
   - **Configuration changes**: config files, settings, package.json
   - **Script/tooling additions**: automation, build scripts, test files
   - **Bug fixes**: corrections, patches, error handling
   - **Refactoring**: code improvements without feature changes
   - **Dependencies**: package updates, library additions

3. **Generate change summary**:
   Create a detailed analysis report including:
   - Total files changed, additions, deletions
   - Major directories affected
   - Key files modified
   - Predominant change type(s)

# SQUASH AND COMMIT STEP

Instructions:

1. **Create backup branch** (execute each block separately):

   **Block 1 - Setup variables:**

   ```powershell
   $currentBranch = git branch --show-current
   Write-Host "Current branch: $currentBranch"
   $backupBranch = "backup-squash-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
   ```

   **Block 2 - Check for existing branch:**

   ```powershell
   $existingBranch = git branch --list $backupBranch
   if ($existingBranch) {
       $backupBranch = "backup-squash-$(Get-Date -Format 'yyyyMMdd-HHmmss-fff')"
       Write-Host "Branch existed, using: $backupBranch"
   }
   ```

   **Block 3 - Create backup branch:**

   ```powershell
   git checkout -b $backupBranch
   if ($LASTEXITCODE -ne 0) {
       Write-Error "Failed to create backup branch. Aborting."
       exit 1
   }
   Write-Host "Created backup branch: $backupBranch"
   ```

   **Block 4 - Return to original branch:**

   ```powershell
   git checkout $currentBranch
   Write-Host "Switched back to: $currentBranch"
   ```

2. **Reset to before the WIP commits (stages all changes)**:
   Command: `git reset --soft HEAD~<count>` (replace <count> with analyzer output)
   Verify reset worked: `git log --oneline -3` (should show commits before WIP commits)

3. **Generate meaningful commit message**:
   Based on the change analysis, create a commit message following conventional commit format:

   **Format guidelines**:
   - Use format: `<type>(<scope>): <description>`
   - **Types**: feat, fix, docs, style, refactor, test, chore, build, ci, perf
   - **Scope**: optional, indicates area of change (api, ui, core, etc.)
   - **Description**: clear, concise summary of what was done

   **Examples based on change analysis**:
   - If mostly new features: `feat(core): add new action builders and playwright integration`
   - If mostly refactoring: `refactor: reorganize codebase structure and improve modularity`
   - If mostly documentation: `docs: update README and add comprehensive API documentation`
   - If mixed changes: `feat: enhance framework with new actions and improved documentation`
   - If configuration heavy: `chore: update project configuration and build setup`
   - If bug fixes dominate: `fix: resolve multiple issues in action handling and validation`

4. **Create single meaningful commit**:
   Command: `python .prompts/monitor_git_commit.py "<generated_commit_message>"`
   **If this fails, run:** `git status` to check state, then use `git commit -m "<generated_commit_message>"` as fallback
   **Verify commit succeeded:** `git log --oneline -1` (should show your generated message)

5. **Final verification**:
   - Verify commit contains all expected changes: `git show --stat`
   - Confirm commit message is appropriate: `git log --oneline -1`
   - Check working directory is clean: `git status`

6. **Optional cleanup** (recommended after confirming everything works):
   - Delete backup branch when confident in results
   - Keep backup branch if you want to test the commit first
   - **Commands**: See Variable Reference below

7. **Recovery instructions** (if something goes wrong):
   - **Recover to backup state**: Use when you want to go back to original WIP commits
   - **Restart from backup**: Use when you want to try the analysis again
   - **Abort entirely**: Use to discard all changes and return to original state
   - **Commands**: See Variable Reference below

### Variable Reference (for Steps 6 & 7):

- **If PowerShell variables available:** Use `$currentBranch` and `$backupBranch`
- **If variables lost:** Find backup with `git branch --list backup-squash-*`

**Cleanup commands (Step 6):**

- With variables: `git branch -D $backupBranch`
- Without variables: `git branch --list backup-squash-*` then `git branch -D <branch-name>`

**Recovery commands (Step 7):**

- **Recover to backup state:**
  - With variables: `git checkout $backupBranch`
  - Without variables: `git checkout <backup-branch-name>`
- **Restart from backup:**
  - With variables: `git checkout $currentBranch; git reset --hard $backupBranch`
  - Without variables: `git checkout master; git reset --hard <backup-branch-name>`
- **Abort entirely:** `git checkout <main-branch>; git reset --hard origin/<main-branch>`

## COMMIT MESSAGE GENERATION GUIDELINES

### Change Analysis to Commit Type Mapping:

1. **Predominantly new files/features** → `feat`
2. **Mostly file moves/renames** → `refactor`
3. **Documentation heavy** → `docs`
4. **Config/build files** → `chore`
5. **Test files** → `test`
6. **Bug fixes/corrections** → `fix`
7. **Performance improvements** → `perf`
8. **Code style/formatting** → `style`

### Scope Selection:

- **core**: foundational framework changes
- **actions**: action-related functionality
- **builders**: builder pattern implementations
- **playwright**: playwright integration
- **api**: public API changes
- **config**: configuration changes
- **deps**: dependency updates

### Description Guidelines:

- Start with lowercase verb (add, update, fix, remove, etc.)
- Be specific but concise
- Focus on what was accomplished, not how
- Avoid redundant words like "changes" or "updates"

### Multi-category Changes:

When changes span multiple categories, prioritize:

1. New features over refactoring
2. Bug fixes over style changes
3. Core functionality over documentation
4. Use broader scope or omit scope if changes are widespread

NOTES:

- Never perform git reset unless explicitly asked to do so by the user.
- This workflow preserves the single-commit approach while ensuring meaningful commit messages.
- The backup mechanism ensures safe recovery if needed.
- Analysis is thorough but commits remain consolidated.
- **IMPORTANT**: Execute PowerShell blocks separately to avoid truncation and duplicate commands.

## TROUBLESHOOTING

### Common Issues and Solutions:

1. **Pre-flight check failures**:
   - Working directory not clean or scripts missing
   - Solution: Clean working directory with `git stash` or `git reset --hard`, ensure scripts exist

2. **Count verification fails**:
   - Analyzer count doesn't match actual git log
   - Solution: Manually inspect commits, verify WIP pattern, re-run analyzer

3. **Change analysis unclear**:
   - Difficult to categorize mixed changes
   - Solution: Focus on the most significant changes, use broader commit types like `feat` or `refactor`

4. **Reset verification fails**:
   - Wrong commits shown after reset
   - Solution: Check count again, use `git reset --hard HEAD@{1}` to undo reset, then retry with correct count

5. **Commit message generation issues**:
   - Uncertainty about appropriate type/scope
   - Solution: Default to broader types (`feat`, `chore`) and omit scope if unsure

6. **Monitor script fails during commit**:
   - Script fails while creating the commit
   - Solution: Use fallback `git commit -m "<message>"` with the generated message

7. **PowerShell block truncation**:
   - Large PowerShell blocks get cut off or execute duplicate commands
   - Solution: Execute each numbered block separately, verify variables persist between blocks

8. **Final verification fails**:
   - Commit doesn't contain expected changes
   - Solution: Check `git show --stat` to verify all changes are included

9. **PowerShell backup block fails**:
   - Branch creation or checkout errors
   - Solution: The script includes error handling and will abort safely, check error message and resolve manually

### Best Practices:

- Run pre-flight checks to catch issues early
- Spend time on thorough change analysis for better commit messages
- Use `git diff --stat` and `git diff --name-status` to understand scope
- When in doubt, err on the side of broader, more general commit types
- Test the generated commit message for clarity before finalizing
- Keep backup branches until you're confident in the results
- Consider the audience who will read the commit message in the future
- Use conventional commit format for better project history
