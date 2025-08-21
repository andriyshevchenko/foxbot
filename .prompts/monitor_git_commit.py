#!/usr/bin/env python3
"""
Git Commit Monitor
Monitors git commit output and waits for commit completion with file change summary.
Use this when AI doesn't properly wait for git commit to finish.

Usage: python commit_wip.py [commit_message]
"""

import subprocess
import sys
import time

def monitor_git_commit(commit_message="WIP: awaiting rebase"):
    """
    Monitor git commit output and wait for commit completion.
    This ensures proper waiting for git commit that AI assistants often fail to do.
    """
    print(f"🔍 Monitoring git commit: '{commit_message}'")
    print("⏳ Waiting for git commit to complete...")
    print("📊 Looking for file change summary...")
    print("─" * 50)
    
    # Start the commit process
    process = subprocess.Popen(
        ["git", "commit", "-m", commit_message],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
        universal_newlines=True
    )
    
    completion_message_found = False
    
    # Monitor output line by line
    while True:
        output = process.stdout.readline()
        if output == '' and process.poll() is not None:
            break
        if output:
            print(output.strip())
            # Check for git commit summary messages (file changes, insertions, deletions)
            if ("files changed" in output or "file changed" in output or 
                "insertions(+)" in output or "deletions(-)" in output or
                "create mode" in output or "delete mode" in output):
                completion_message_found = True
                print("⏳ Waiting...")
                time.sleep(1)
                print("✅ File change summary detected")
                print("🚀 Safe to proceed to next steps")
        else:
            # Small delay to prevent excessive CPU usage
            print("⏳ Waiting...")
            time.sleep(5)
    
    # Wait for process to complete
    process.wait()
    
    if process.returncode == 0:
        if completion_message_found:
            print("\n✅ Commit completed - file change summary detected")
        else:
            print("\n⚠️ Commit completed but file change summary not detected")
            print("   This might mean no files were changed")
        return True
    else:
        print("\n❌ Commit failed")
        return False

def main():
    """Main execution - monitor git commit completion."""
    # Get commit message from command line argument or use default
    commit_message = sys.argv[1] if len(sys.argv) > 1 else "WIP: awaiting rebase"
    
    success = monitor_git_commit(commit_message)
    
    if success:
        print("\n🎉 GIT COMMIT COMPLETED!")
        print("✨ Commit has finished executing.")
        print("✨ You can now safely proceed with your next steps.")
    else:
        print("\n💥 Git commit monitoring detected an error.")
        print("🔍 Check the output above for commit failures.")
        sys.exit(1)

if __name__ == "__main__":
    main()
