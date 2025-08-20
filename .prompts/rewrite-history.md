# ANALYZE STEP

Instructions:

1. **Pre-flight checks**:
   - Verify working directory is clean: `git status --porcelain`
   - Verify required scripts exist: `if (Test-Path .prompts/analyze_wip_c7. **Monitor script fails during breakdown**:
   - Script fails while creating logical commits
   - Solution: Use fallback `git commit -m "<message>"` and continue with remaining groups

2. **Final verification fails**:
   - Some files remain uncommitted after breakdown
   - Solution: Use `git add .` and `git commit -m "chore: remaining changes"` for any missed files

3. **Line ending warnings**:) { Write-Host "Analyzer found" } else { Write-Error "Missing analyzer script" }`
   - Verify monitor script exists: `if (Test-Path .prompts/monitor_git_commit.py) { Write-Host "Monitor found" } else { Write-Error "Missing monitor script" }`

4. Run the WIP commits analyzer script:
   Command: `python .prompts/analyze_wip_commits.py`
   The script outputs the count of consecutive 'WIP awaiting rebase' commits.
   **Note the count value from the output for use in SQUASH step.**

5. **Verify count accuracy**:
   - Manually verify: `git log --oneline -<count>` (replace <count> with analyzer output)
   - Ensure the commits shown match expectation
   - If count seems wrong, stop and investigate

6. **Verify git repository state**:
   - Confirm you're in correct repository: `git remote -v`
   - Verify current branch: `git branch --show-current`

# SQUASH AND BREAKDOWN STEP

Instructions:

1. **Create backup branch** (execute each block separately):

   **Block 1 - Setup variables:**

   ```powershell
   $currentBranch = git branch --show-current
   Write-Host "Current branch: $currentBranch"
   $backupBranch = "backup-rewrite-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
   ```

   **Block 2 - Check for existing branch:**

   ```powershell
   $existingBranch = git branch --list $backupBranch
   if ($existingBranch) {
       $backupBranch = "backup-rewrite-$(Get-Date -Format 'yyyyMMdd-HHmmss-fff')"
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

3. **Create a single commit with all the changes**:
   Command: `python .prompts/monitor_git_commit.py "WIP: squashed"`
   **If this fails, run:** `git status` to check state, then use `git commit -m "WIP: squashed"` as fallback
   **Verify squash commit succeeded:** `git log --oneline -1` (should show "WIP: squashed")

4. **Prepare for breakdown**:

   ```powershell
   $currentBranch = git branch --show-current
   Write-Host "Current branch: $currentBranch"
   $backupBranch = "backup-squash-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

   # Check if backup branch already exists
   $existingBranch = git branch --list $backupBranch
   if ($existingBranch) {
       $backupBranch = "backup-squash-$(Get-Date -Format 'yyyyMMdd-HHmmss-fff')"
       Write-Host "Branch existed, using: $backupBranch"
   }

   git checkout -b $backupBranch
   if ($LASTEXITCODE -ne 0) {
       Write-Error "Failed to create backup branch. Aborting."
       exit 1
   }
   Write-Host "Created backup branch: $backupBranch"

   git checkout $currentBranch
   Write-Host "Switched back to: $currentBranch"
   git reset HEAD~1
   Write-Host "Ready for breakdown - all changes are now unstaged (hard reset removed the squashed commit)"
   ```

5. **Prepare for breakdown**:
   Command: `git reset HEAD~1`
   Write-Host "Ready for breakdown - all changes are now unstaged (hard reset removed the squashed commit)"

6. **Break down changes into logical commits**:
   - Verify current state: `git status` (should show unstaged changes, no staged changes)
   - Use `git diff --name-status` to see all unstaged changes
   - Analyze changes by logical groupings:
     - **Directory/file reorganization**: moves, renames, deletions
     - **Documentation updates**: \*.md files, comments, README changes
     - **New feature additions**: new functionality files, API additions
     - **Configuration changes**: config files, settings, package.json
     - **Script/tooling additions**: automation, build scripts, test files
     - **Bug fixes**: corrections, patches, error handling
     - **Refactoring**: code improvements without feature changes
     - **Dependencies**: package updates, library additions
   - Stage and commit each logical group:
     - Use `git add <specific-files>` for precise staging
     - Verify staged files: `git status --porcelain --cached`
     - Run `python .prompts/monitor_git_commit.py "<commit_message>"` for each commit
     - **If monitor script fails:** Use fallback `git commit -m "<commit_message>"`
     - Follow conventional commit format examples:
       - `refactor: reorganize files from old-dir to new-dir`
       - `docs: update documentation for feature X`
       - `feat(scope): add new functionality Y`
       - `chore: add automation scripts for workflow Z`

7. **Final verification**:
   - Verify all changes committed: `git status` (should be clean)
   - Count logical commits created during breakdown (note this number)
   - Review commit history: `git log --oneline -<number_noted_above>`
   - If any files remain uncommitted, stage and commit them now

8. **Optional cleanup** (recommended after confirming everything works):
   - Delete backup branch when confident in results
   - Keep backup branch if you want to test commits first
   - **Commands**: See Variable Reference below

9. **Recovery instructions** (if something goes wrong):
   - **Recover to backup state**: Use when you want to go back to the squashed commit
   - **Restart from backup**: Use when you want to try the breakdown again
   - **Abort entirely**: Use to discard all changes and return to original state
   - **Commands**: See Variable Reference below

### Variable Reference (for Steps 7 & 8):

- **If PowerShell variables available:** Use `$currentBranch` and `$backupBranch`
- **If variables lost:** Find backup with `git branch --list backup-rewrite-*`

**Cleanup commands (Step 7):**

- With variables: `git branch -D $backupBranch`
- Without variables: `git branch --list backup-rewrite-*` then `git branch -D <branch-name>`

**Recovery commands (Step 8):**

- **Recover to backup state:**
  - With variables: `git checkout $backupBranch`
  - Without variables: `git checkout <backup-branch-name>`
- **Restart from backup:**
  - With variables: `git checkout $currentBranch; git reset --hard $backupBranch`
  - Without variables: `git checkout master; git reset --hard <backup-branch-name>`
- **Abort entirely:** `git checkout <main-branch>; git reset --hard origin/<main-branch>`

NOTES:

- Never perform git reset unless explicitly asked to do so by the user.
- This workflow breaks down large commits into multiple logical commits for better history.
- The backup mechanism ensures safe recovery if needed.
- This workflow is optimized for Windows PowerShell environments.
- **IMPORTANT**: Execute PowerShell blocks separately to avoid truncation and duplicate commands.

## TROUBLESHOOTING

### Common Issues and Solutions:

1. **Pre-flight check failures**:
   - Working directory not clean or scripts missing
   - Solution: Clean working directory with `git stash` or `git reset --hard`, ensure scripts exist

2. **Count verification fails**:
   - Analyzer count doesn't match actual git log
   - Solution: Manually inspect commits, verify WIP pattern, re-run analyzer

3. **Reset verification fails**:
   - Wrong commits shown after reset
   - Solution: Check count again, use `git reset --hard HEAD@{1}` to undo reset, then retry with correct count

4. **Squash commit verification fails**:
   - `git log --oneline -1` doesn't show "WIP: squashed"
   - Solution: Check `git status`, if changes are staged run `git commit -m "WIP: squashed"` manually

5. **PowerShell backup block fails**:
   - Branch creation or checkout errors
   - Solution: The script includes error handling and will abort safely, check error message and resolve manually

6. **PowerShell block truncation**:
   - Large PowerShell blocks get cut off or execute duplicate commands
   - Solution: Execute each numbered block separately, verify variables persist between blocks

7. **Monitor script fails during breakdown**:
   - Script fails while creating logical commits
   - Solution: Use fallback `git commit -m "<message>"` and continue with remaining groups

8. **Final verification fails**:
   - Some files remain uncommitted after breakdown
   - Solution: Use `git add .` and `git commit -m "chore: remaining changes"` for any missed files

9. **Line ending warnings**:
   - Windows may show CRLF/LF conversion warnings
   - These are normal and don't affect the squash process

### Best Practices:

- Run pre-flight checks to catch issues early
- Stage files in logical groups rather than using `git add .`
- Verify each commit with meaningful messages before proceeding
- Keep recovery instructions handy in case of failures
- Consider keeping backup branches until you're confident in the results
- Use conventional commit format for better project history
