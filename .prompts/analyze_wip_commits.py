#!/usr/bin/env python3
"""
WIP Commits Analyzer
Analyzes git history to count consecutive 'WIP awaiting rebase' commits from HEAD.
Use this to determine how many commits need to be rebased.

Usage: python analyze_wip_commits.py
"""

import subprocess
import sys
import json

def get_git_log_output():
    """
    Get git log output with commit hash, message, and origin tracking.
    Returns list of commits from HEAD in reverse chronological order.
    """
    try:
        # Get commit info: hash, subject, and whether it exists on origin
        cmd = [
            "git", "log", 
            "--pretty=format:%H|%s", 
            "--no-merges"
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        commits = []
        
        for line in result.stdout.strip().split('\n'):
            if '|' in line:
                hash_part, message = line.split('|', 1)
                commits.append({
                    'hash': hash_part.strip(),
                    'message': message.strip()
                })
        
        return commits
    except subprocess.CalledProcessError as e:
        print(f"❌ Error getting git log: {e}")
        return []

def check_commit_exists_on_origin(commit_hash):
    """
    Check if a commit exists on the origin remote.
    Returns True if commit exists on origin, False if it's local only.
    """
    try:
        # Check if commit exists on origin/master or origin/main
        for branch in ['origin/master', 'origin/main']:
            cmd = ["git", "merge-base", "--is-ancestor", commit_hash, branch]
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode == 0:
                return True
        
        # Also check if commit exists on any origin branch
        cmd = ["git", "branch", "-r", "--contains", commit_hash]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.stdout.strip():
            return True
            
        return False
    except subprocess.CalledProcessError:
        return False

def analyze_wip_commits():
    """
    Analyze git history to count consecutive 'WIP awaiting rebase' commits from HEAD.
    Implements the ANALYZE step logic from rebase.md.
    """
    print("🔍 Analyzing WIP commits from HEAD...")
    print("📊 Checking commit history for 'WIP awaiting rebase' messages...")
    print("─" * 60)
    
    commits = get_git_log_output()
    if not commits:
        print("❌ Failed to get git log output")
        return 0
    
    count = 0
    
    print(f"📋 Found {len(commits)} total commits to analyze")
    print("\n🔍 Examining commits in reverse chronological order:")
    
    for i, commit in enumerate(commits):
        commit_hash = commit['hash']
        commit_message = commit['message']
        
        print(f"\n📌 Commit {i+1}: {commit_hash[:8]} - {commit_message}")
        
        # Check if commit exists only locally
        exists_on_origin = check_commit_exists_on_origin(commit_hash)
        
        if exists_on_origin:
            print(f"   🌐 Exists on origin - stopping analysis")
            break
        else:
            print(f"   🏠 Local only commit")
            
            # Check if message is 'WIP: awaiting rebase'
            if commit_message == 'WIP: awaiting rebase':
                count += 1
                print(f"   ✅ WIP commit found - count: {count}")
            else:
                print(f"   ❌ Not a WIP commit - stopping analysis")
                break
    
    print("\n" + "─" * 60)
    print(f"🎯 Analysis complete!")
    print(f"📊 Found {count} consecutive 'WIP awaiting rebase' commits from HEAD")
    
    if count > 0:
        print(f"🚀 Ready for rebase: git rebase -i HEAD~{count}")
    else:
        print("✨ No WIP commits found - no rebase needed")
    
    return count

def main():
    """Main execution - analyze WIP commits and return count."""
    try:
        count = analyze_wip_commits()
        
        # Output the count for use by other scripts
        print(f"\n🔢 WIP_COMMIT_COUNT={count}")
        
        # Exit with the count as exit code (limited to 255)
        exit_code = min(count, 255)
        sys.exit(exit_code)
        
    except Exception as e:
        print(f"💥 Error during analysis: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
