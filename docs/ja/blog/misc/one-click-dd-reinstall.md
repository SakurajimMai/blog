---
title: ワンクリックDDシステムネットワーク再インストール
tags:
  - Linux
cover: https://s2.ixacg.com/2025/04/10/1744271725.avif
createTime: 2026/01/06 11:47:22
permalink: /ja/blog/arz5jvx4/
excerpt: AutoReinstallスクリプト
---

## AutoReinstallスクリプト

```bash
wget --no-check-certificate -O AutoReinstall.sh https://git.io/AutoReinstall.sh && bash AutoReinstall.sh
 
#国内可用版
bash <(wget --no-check-certificate -qO- https://cdn.jsdelivr.net/gh/hiCasper/Shell@master/AutoReinstall.sh)
```

<!-- more -->

### 再インストール後のディスク拡張

パーティションツールを使用：`fdisk` または `parted` ツールを使用して `/dev/vda1` パーティションを削除し、再作成して、ディスク全体の容量を使用します。DOSパーティションテーブルを使用するディスクの場合、以下は `fdisk` を使用した例です：

- `sudo fdisk /dev/vda` を実行して `fdisk` ツールを起動します。
- `p` を入力して現在のパーティションテーブルを表示し、`/dev/vda1` のパーティション番号を確認します。
- `d` を入力してパーティションを削除し、`/dev/vda1` パーティションを選択します。
- `n` を入力して新しいパーティションを作成し、プライマリパーティションを選択、パーティション番号は1、デフォルトの開始セクターを使用し、最後のセクターはデフォルトを選択して残りのすべての容量を使用します。
- `t` を入力してパーティションタイプを変更し、`83`（Linux）を選択します。
- `a` を入力してパーティションを起動可能にします（`/dev/vda1` が起動パーティションの場合）。
- `w` を入力して変更を書き込み、`fdisk` を終了します。

**重要**：これらの操作は `/dev/vda1` パーティション上のすべてのデータを削除します。必ずバックアップを取ってください。

提供されたディスク情報によると、`/dev/vda` の総容量は約42.9 GBですが、`/dev/vda1` パーティションはセクター2048から3145727まで、約1.5 GBの容量しか使用していません。`/dev/vda1` を拡張して残りのディスク容量を使用するには、いくつかの手順を実行する必要があります。これらの操作はリスクが高いため、操作前にすべての重要なデータをバックアップしてください。

#### ステップ 1: `/dev/vda1` パーティションの削除と再作成

1. **データのバックアップ**：変更を行う前に、`/dev/vda1` 上のすべてのデータをバックアップしてください。

2. **パーティションツールの使用**：`fdisk` または `parted` ツールを使用して `/dev/vda1` パーティションを削除し、再作成して、ディスク全体の容量を使用します。DOSパーティションテーブルを使用するディスクの場合、以下は `fdisk` を使用した例です：

   - `sudo fdisk /dev/vda` を実行して `fdisk` ツールを起動します。
   - `p` を入力して現在のパーティションテーブルを表示し、`/dev/vda1` のパーティション番号を確認します。
   - `d` を入力してパーティションを削除し、`/dev/vda1` パーティションを選択します。
   - `n` を入力して新しいパーティションを作成し、プライマリパーティションを選択、パーティション番号は1、デフォルトの開始セクターを使用し、最後のセクターはデフォルトを選択して残りのすべての容量を使用します。
   - `t` を入力してパーティションタイプを変更し、`83`（Linux）を選択します。
   - `a` を入力してパーティションを起動可能にします（`/dev/vda1` が起動パーティションの場合）。
   - `w` を入力して変更を書き込み、`fdisk` を終了します。

   **重要**：これらの操作は `/dev/vda1` パーティション上のすべてのデータを削除します。必ずバックアップを取ってください。

#### ステップ 2: ファイルシステムの拡張

パーティションを再作成し、システムを再起動した後（必要な場合）、新しいパーティションサイズを使用するようにファイルシステムを拡張する必要があります。

- ファイルシステムが ext4 の場合、`resize2fs` を使用します：`sudo resize2fs /dev/vda1`

- ファイルシステムが XFS の場合、`xfs_growfs` を使用します：`sudo xfs_growfs /dev/vda1`

#### ステップ 3: 検証

`df -h` または `lsblk` を使用して、`/dev/vda1` パーティションのサイズが予想通りに拡張されたことを確認します。

### 再インストールをサポートするシステム

- Ubuntu 18.04/16.04
- Debian 9/10
- CentOS 6
- CentOS 7 （DD方式）(パスワード Pwd@CentOS)
- カスタムDDイメージ

```bash
# Windows 7 32ビット 中国語（Windows Thin PC）:
https://image.moeclub.org/GoogleDrive/1srhylymTjYS-Ky8uLw4R6LCWfAo1F3s7
https://moeclub.org/onedrive/IMAGE/Windows/win7emb_x86.tar.gz
 
# Windows 8.1 SP1 64ビット 中国語（Embedded）:
https://image.moeclub.org/GoogleDrive/1cqVl2wSGx92UTdhOxU9pW3wJgmvZMT_J
https://moeclub.org/onedrive/IMAGE/Windows/win8.1emb_x64.tar.gz
 
# Windows 10 ltsc 64ビット 中国語:
https://image.moeclub.org/GoogleDrive/1OVA3t-ZI2arkM4E4gKvofcBN9aoVdneh
https://moeclub.org/onedrive/IMAGE/Windows/win10ltsc_x64.tar.gz
デフォルトユーザー名：Administrator
 
デフォルトパスワード：Vicer
```

### 特徴 / 最適化

- IPアドレス、ゲートウェイ、サブネットマスクの自動取得
- ネットワーク環境の自動判断、国内/国外ミラーの選択による速度問題の解決
- ワンクリック化で複雑なコマンド不要
- 萌咖スクリプトでのインストールエラーの原因となる問題の解決
- CentOS 7 イメージはLVMを廃止し、ext4に回帰して不安定要素を削減

### 注意

- 再インストール後のシステムパスワードはすべてスクリプト内で提供されています。**インストール後はできるだけ早くパスワードを変更してください**、**デフォルトパスワードはインストール時にスクリプトが提供しますので、注意して確認してください**。Linuxシステムではキーログインの有効化を推奨します。
- OpenVZ / LXC アーキテクチャのシステムには適用できません