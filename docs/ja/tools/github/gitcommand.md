---
title: Git常用コマンド早見表
createTime: 2026/01/06 14:50:45
permalink: /ja/tools/github/gitcommand/
icon: pajamas:git
---

## Git常用コマンド早見表

::pajamas:git::

::: tip

`master`: デフォルトの開発ブランチ
`origin`: デフォルトのリモートリポジトリ
`Head`: デフォルトの開発ブランチ
`Head^`: `Head` の前回のコミット

:::

### リポジトリ/ローカルリポジトリの作成

```shell
git clone url
    # リモートリポジトリをクローン
git init
    # ローカルリポジトリを初期化
```

### 変更とコミット

```shell
git status
    # ステータスを確認
git diff
    # 変更内容を確認
git add
    # 変更されたすべてのファイルを追跡
git add file
    # 指定したファイルを追跡
git mv old new
    # ファイル名の変更
git rm file
    # ファイルを削除
git rm --cached file
    # ファイルの追跡を停止（削除しない）
git commit -m "commit message"
    # 更新されたすべてのファイルをコミット
git commit --amend
    # 最後のコミットを修正
```

### コミット履歴の確認

```shell
git log
    # コミット履歴を確認
git log -p file
    # 指定ファイルのコミット履歴を確認
git blame file
    # 指定ファイルのコミット履歴をリスト形式で確認
```

### 取り消し

```shell
git reset --head HEAD
    # 作業ディレクトリ内の未コミットファイルの変更をすべて取り消し
git checkout HEAD file
    # 指定した未コミットファイルの変更を取り消し
git revert commit
    # 指定したコミットを取り消し
```

#### ブランチとタグ

```shell
git branch
    # すべてのローカルブランチを表示
git checkout branch/tag
    # 指定したブランチまたはタグに切り替え
git branch new-branch
    # 新しいブランチを作成
git branch -d branch
    # ローカルブランチを削除
git tag
    # すべてのローカルタグを一覧表示
git tag tagname
    # 最新のコミットに基づいてタグを作成
git tag -d tagname
    # タグを削除
```

### マージとリベース

```shell
git merge branch
    # 指定ブランチを現在のブランチにマージ
git rebase branch
    # 指定ブランチを現在のブランチにリベースマージ
```

### リモート操作

```shell
git remote -v
    # リモートリポジトリ情報を確認
git remote show remote
    # 指定リモートリポジトリの情報を確認
git remote add remote url
    # リモートリポジトリを追加
git fetch remote
    # リモートリポジトリからコードを取得
git pull remote branch
    # コードをダウンロードして高速マージ
git push remote branch
    # コードをアップロードして高速マージ
git push remote :branch/tag-name
    # リモートブランチまたはタグを削除
git push --tags
    # すべてのタグをアップロード