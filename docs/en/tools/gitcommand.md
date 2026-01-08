---
title: Git Tools
createTime: 2026/01/06 14:50:45
permalink: /en/tools/gitcommand/
icon: pajamas:git
---

## Git Command Quick Reference

::pajamas:git::

::: tip

`master`: Default development branch

`origin`: Default remote repository

`Head`: Default development branch

`Head^`: The previous commit of `Head`

:::

### Create Repository / Local Repository

```shell
git clone url
    # Clone a remote repository
git init
    # Initialize a local repository
```

### Modify and Commit

```shell
git status
    # Check status
git diff
    # View changes
git add
    # Track all changed files
git add file
    # Track the specified file
git mv old new
    # Rename a file
git rm file
    # Delete a file
git rm --cached file
    # Stop tracking a file but do not delete it
git commit -m "commit message"
    # Commit all updated files
git commit --amend
    # Amend the last commit
```

### View Commit History

```shell
git log
    # View commit history
git log -p file
    # View commit history for a specific file
git blame file
    # View commit history for a specific file in list format
```

### Undo

```shell
git reset --head HEAD
    # Undo changes to all uncommitted files in the working directory
git checkout HEAD file
    # Undo changes to a specific uncommitted file
git revert commit
    # Revert a specific commit
```

#### Branches and Tags

```shell
git branch
    # Show all local branches
git checkout branch/tag
    # Switch to the specified branch or tag
git branch new-branch
    # Create a new branch
git branch -d branch
    # Delete a local branch
git tag
    # List all local tags
git tag tagname
    # Create a tag based on the latest commit
git tag -d tagname
    # Delete a tag
```

### Merge and Rebase

```shell
git merge branch
    # Merge the specified branch into the current branch
git rebase branch
    # Rebase and merge the specified branch into the current branch
```

### Remote Operations

```shell
git remote -v
    # View remote repository information
git remote show remote
    # View information for a specific remote repository
git remote add remote url
    # Add a remote repository
git fetch remote
    # Fetch code from a remote repository
git pull remote branch
    # Download code and fast-forward merge
git push remote branch
    # Upload code and fast-forward merge
git push remote :branch/tag-name
    # Delete a remote branch or tag
git push --tags
    # Upload all tags