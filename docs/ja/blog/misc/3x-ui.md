---
title: 初心者向けVPNセットアップガイド（3x-ui編）
tags:
  - プロキシ
cover: https://s2.ixacg.com/2025/07/23/1753280778.avif
createTime: 2026/01/06 11:47:22
permalink: /ja/blog/49cc4ztm/
---

# 初心者向け VPN セットアップガイド（3x-ui 編）

## サーバーの購入

海外のサーバーを取得します。

Alibaba Cloud や Tencent Cloud などのサーバーでは、ファイアウォールを無効にする必要があります。

<!-- more -->

## サーバーへの接続

[Termius](https://termius.com/index.html)などの SSH ツールを使用して接続します。

取得した IP アドレス、ユーザー名、パスワードを設定し、図のようにサーバーに接続します。

## 3x-ui のインストール

ターミナルで以下のコマンドを入力します：

```bash
bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)
```

入力：y

以下の情報が表示されます：

![3-2](https://s2.ixacg.com/2025/07/23/1753278389.avif)

次に、ブラウザを開き、赤枠内の URL を入力し、ログインしてパスワードを設定します。

## 3X-UI の設定

![4-1](https://s2.ixacg.com/2025/07/23/1753278631.avif)

![4-2](https://s2.ixacg.com/2025/07/23/1753278772.avif)

![4-3](https://s2.ixacg.com/2025/07/23/1753278872.avif)

## クライアントへのインポート

作成したものをクライアントにインポートするだけです。[v2rayNG](https://github.com/2dust/v2rayNG)をお勧めします。

![5-1](https://s2.ixacg.com/2025/07/23/1753279012.avif)
