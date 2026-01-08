---
title: LinuxでSambaサービスを設定するチュートリアル
tags:
  - Linux
  - Samba
createTime: 2026/01/06 11:47:22
permalink: /ja/blog/clwpd6fo/
---



## Sambaのインストール

```
apt update
apt install samba
```

## Sambaの設定

Sambaの設定ファイルは通常 `/etc/samba/smb.conf`​ にあります。テキストエディタ（`nano`​ や `vim`​ など）を使用してこのファイルを編集できます。共有ファイルを追加します。

<!-- more -->

変更前にファイルをバックアップすることを忘れないでください。

```
cp /etc/samba/smb.conf /etc/samba/smb.conf.bak
```

```
[shared]
   comment = Shared Folder
   path = /home/user/shared
   valid users = user
   read only = no
   browsable = yes
   create mask = 0777
   directory mask = 0777
```

* `comment`: 共有ディレクトリの説明。
* `path`: 共有ディレクトリのパス。
* `valid users`: この共有ディレクトリへのアクセスを許可するユーザー。
* `read only`: `no`​ に設定すると書き込みが許可されます。
* `browsable`: `yes`​ に設定すると、この共有ディレクトリがネットワーク上で表示されます。
* `create mask`​ と `directory mask`: ファイルとディレクトリの権限を設定します。

## Sambaユーザーの作成

Sambaは独自のユーザーデータベースを使用して認証を行います。Samba用のユーザーを作成し、パスワードを設定する必要があります。

```

adduser user

sudo smbpasswd -a user
```

システムからパスワードの入力と確認が求められます。

## Sambaサービスの起動と有効化

設定が完了したら、Sambaサービスを起動し、システム起動時に自動的に開始されるように設定する必要があります。

### Debian/Ubuntuの場合：

```
sudo systemctl start smbd
sudo systemctl enable smbd
sudo systemctl start nmbd
sudo systemctl enable nmbd
```

### CentOS/RHELの場合：

```
sudo systemctl start smb
sudo systemctl enable smb
sudo systemctl start nmb
sudo systemctl enable nmb
```

## ファイアウォールの設定

システムでファイアウォール（`ufw`​ や `firewalld`​ など）が有効になっている場合は、Sambaサービスがファイアウォールを通過できるように許可する必要があります。

#### Debian/Ubuntuの場合（`ufw`​ を使用）：

```
sudo ufw allow samba
```

#### CentOS/RHELの場合（`firewalld`​ を使用）：

```
sudo firewall-cmd --permanent --add-service=samba
sudo firewall-cmd --reload
```

## Samba設定のテスト

`testparm`​ コマンドを使用して、Samba設定ファイルに構文エラーがないか確認できます。

```
testparm
```

エラーがなければ、Sambaサービスは正常に設定され、実行されているはずです。

## 共有ディレクトリへのアクセス

Windowsでは、ファイルエクスプローラーに `\\<サーバーIPアドレス>`​ と入力してSamba共有ディレクトリにアクセスできます。Linuxでは、`smbclient`​ または `mount`​ コマンドを使用して共有ディレクトリにアクセスできます。

```
# smbclientを使用
apt install smbclient
smbclient //<サーバーIPアドレス>/shared -U user
# 共有ディレクトリを一覧表示
smbclient -L //<サーバーIPアドレス> -U user
# ファイルをダウンロード
smbclient //<サーバーIPアドレス>/shared -U user -c 'get <リモートファイル> <ローカルファイル>'
# ファイルをアップロード
smbclient //<サーバーIPアドレス>/shared -U user -c 'put <ローカルファイル> <リモートファイル>'

# mountを使用
sudo mount -t cifs //<サーバーIPアドレス>/shared /mnt/shared -o username=user,password=yourpassword
```

問題が発生した場合は、Sambaのログファイル（通常 `/var/log/samba/`​ にあります）を確認して詳細な情報を取得できます。

‍