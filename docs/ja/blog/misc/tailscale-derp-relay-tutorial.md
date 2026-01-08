---
title: 自建免备案防偷 Tailscale 国内中继（DERP）チュートリアル
tags:
  - Tailscale
  - 内網穿透
  - ローカルエリアネットワーク
excerpt: Tailscale は Wireguard をベースとした、様々なネットワークツールを備えた P2P ネットワーキングツールです。その P2P 特性のおかげで、Tailscale は内網穿透も可能であり、NAT の制限を打破して別のホストに直接到達できます。
cover: https://s2.ixacg.com/2025/04/10/1744273338.avif
createTime: 2026/01/06 11:47:22
permalink: /ja/blog/nz2wgpyh/
---

![Tailscale 公式プロモーションバックグラウンド](https://s2.ixacg.com/2025/04/10/1744273338.avif)

## Tailscale と DERP の概要

### Tailscale とは？

Tailscale は Wireguard をベースとした、様々なネットワークツールを備えた P2P ネットワーキングツールです。その P2P 特性のおかげで、Tailscale は内網穿透も可能であり、NAT の制限を打破して別のホストに直接到達できます。

<!-- more -->

### DERP とは？

`DERP` は Tailscale が独自に開発した中継サービスです。ネットワーク環境が貫通しにくい場合（キャンパスネットワーク、モバイル大内網、4G、5G など）、すべてのトラフィックは DERP を経由して宛先アドレスに転送されます。

デフォルトでは、Tailscale 公式は大陸を囲む公式 DERP サービスを提供していますが、中国大陸のネットワーク接続性などの問題により、公式は大陸の DERP ノードを提供していません。大陸での接続成功率を確保するために、私たちは「穴あけ」を支援するために独自の DERP サービスを構築する必要があります。

## Docker と Docker compose のインストール

```bash
bash <(curl -Ls https://docker.denlu.top/docker.sh)
```

##  DERP ノードサービスへの Tailscale クライアントのデプロイ（重要）

###  原理

ドメイン名を使用してデプロイしないため、ドメイン名の `--verify-clients` パラメータを使用してクライアント認証を行うことができず、簡単にスキャンされて他人に利用され、貴重な国内トラフィックを無料で使用されてしまう可能性があります。認証がない場合、DERP はデフォルトで転送が必要なすべてのトラフィックを転送し、検証などの操作を行いません。

### 簡単なインストールチュートリアル

> 公式チュートリアル：[ Tailscale Docs](https://tailscale.com/kb/1347/installation)

1. まずワンクリックスクリプトでデプロイ：`curl -fsSL https://tailscale.com/install.sh | sh`
2. ログイン操作を行う：`tailscale login`
3. この時、コンソールにログイン URL が表示されるので、ブラウザでこの URL にアクセスし、操作手順に従ってインストールを完了します。

## Docker イメージ

```dockerfile
services:
  derper:
    image: ghcr.io/yangchuansheng/ip_derper:latest
    container_name: derper
    restart: always
    ports:
      - "12345:12345" # ここの12345は、ご自身で希望する10000以上の高位ポートに変更してください
      - "3478:3478/udp" # 3478 はstunポートです。競合がなければ変更しないでください
    volumes:
      - /var/run/tailscale/tailscaled.sock:/var/run/tailscale/tailscaled.sock # ローカルの tailscale クライアント認証接続をマッピングし、不正利用を検証するために使用
    environment:
      - DERP_ADDR=:12345 # ここは上記と同期して変更する必要があります
      - DERP_CERTS=/app/certs
      - DERP_VERIFY_CLIENTS=true # クライアント認証を有効化。これは不正利用防止の最も重要なパラメータです

```

`docker-compose.yml` という名前の新しいファイルを作成します。

このフォルダ内で、`docker compose up -d` を実行すると、この docker を起動できます。

サーバーが国内にある場合は、ghcr のリンクを置き換えることができます。例えば南京大学のもの（3行目の image を置き換え）

```dockerfile
services:
  derper:
    image: ghcr.nju.edu.cn/yangchuansheng/ip_derper:latest
```

## tailscale ACL 設定を変更してサードパーティ DERP を有効化

1.  ACL 編集ページにアクセス：[Tailscale](https://login.tailscale.com/admin/acls/file)
2.  新しい設定ファイルを追加

```bash
	"derpMap": {
		"OmitDefaultRegions": false, // true に設定できます。これにより公式 derper ノードが配布されません。テストまたは実際の使用で考慮できます
		"Regions": {
			"900": {
				"RegionID":   900, // tailscale 900-999 はカスタム derper 用に予約されています
				"RegionCode": "abc1",
				"RegionName": "abcc1",// これらは任意の名前を付けてください
				"Nodes": [
					{
						"Name":             "fff",
						"RegionID":         900,
						"IPv4":             "1.1.1.1", // あなたのVPS パブリックIPアドレス
						"DERPPort":         12345, //上記の 12345 あなたがカスタマイズしたポート
						"InsecureForTests": true, // 自己署名証明書のため、クライアントは検証を行いません
					},
				],
			},
			"901": {
				"RegionID":   901, // 新しい derp を追加するときは変更を忘れずに
				"RegionCode": "abc2",
				"RegionName": "abcc2",
				"Nodes": [
					{
						"Name":             "kkk",
						"RegionID":         902,
						"IPv4":             "8.8.8.8", // あなたのVPS パブリックIPアドレス
						"DERPPort":         4000, //上記の 12345 あなたがカスタマイズしたポート
						"InsecureForTests": true, // 自己署名証明書のため、クライアントは検証を行いません
					},
				],
			},
		},
	},
```

## 成功したかどうかのテスト

### ネットワーク接続テストを使用

1.  tailscale を使用しているクライアントを見つける
2.  ターミナルに入る
3.  `tailscale netcheck` と入力
4.  以下のような応答があるか確認する

![TS ネットワーク状況監視](https://s2.ixacg.com/2025/04/10/1744272827.avif)

### ping を使用して接続性をテスト

1.  tailscale を使用しているクライアントを見つける
2.  ターミナルに入る
3.  `tailscale ping あなたの別のホストアドレス` と入力
4.  接続されているか確認する (例: `via DER (xxx)` が表示されれば成功)