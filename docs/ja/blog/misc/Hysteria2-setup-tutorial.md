---
title: Hysteria2｜第2世代hysteriaノード構築チュートリアル
tags:
  - プロキシ
  - hysteria
cover: https://s2.ixacg.com/2025/04/21/1745202982.avif
createTime: 2026/01/06 11:47:22
permalink: /ja/blog/86pork6g/
excerpt: Hysteria2 は機能豊富で、悪条件のネットワーク環境に最適化されたネットワークツール（双方向アクセラレーション）です。例えば、衛星ネットワーク、混雑した公共Wi-Fi、中国から国外サーバーへの接続などに適しています。修正版QUICプロトコルをベースとしています。
---
#  Hysteria2｜第2世代hysteriaノード構築チュートリアル

![image](https://s2.ixacg.com/2025/04/21/1745202405.avif)

## 一、概要

> Hysteria2 は機能豊富で、悪条件のネットワーク環境に最適化されたネットワークツール（双方向アクセラレーション）です。例えば、衛星ネットワーク、混雑した公共Wi-Fi、**中国から国外サーバーへの接続**などに適しています。修正版QUICプロトコルをベースとしています。

これは、高速なプロキシサーバーを構築する際の最大の悩み——**回線の品質が悪い**という問題をうまく解決します。

1.  CT直結JP NTTデータセンター+cloudflare warp、最適化なしの163回線、20-23時ピーク時間帯のspeedtest結果。

2.  中国本土回線への最適化なし、ロサンゼルスshockhostingデータセンター、1c128m ovznat 4k@p60：

   ![image](https://s2.ixacg.com/2025/04/21/1745202500.avif)

## 二、長所



<details open="" style="box-sizing: border-box; display: block; margin-top: 0px; margin-bottom: 16px;"><summary style="box-sizing: border-box; display: list-item; cursor: pointer;"><b style="box-sizing: border-box; font-weight: 600;">クリックして完全な機能リストを表示</b></summary><ul dir="auto" style="box-sizing: border-box; padding-left: 2em; margin-top: 0px; margin-bottom: 16px;"><li style="box-sizing: border-box;">hysteria2が提供する3種類のmasquerade偽装モードをサポートし、高度にカスタマイズ可能な偽装内容を提供</li><li style="box-sizing: border-box; margin-top: 0.25em;">4種類の証明書インポート方法を提供：<ul dir="auto" style="box-sizing: border-box; padding-left: 2em; margin-top: 0px; margin-bottom: 0px;"><li style="box-sizing: border-box;">ACME HTTPチャレンジ</li><li style="box-sizing: border-box; margin-top: 0.25em;">ACME DNS</li><li style="box-sizing: border-box; margin-top: 0.25em;">自己署名任意ドメイン証明書</li><li style="box-sizing: border-box; margin-top: 0.25em;">ローカル証明書</li></ul></li><li style="box-sizing: border-box; margin-top: 0.25em;">SSH端末でhysteria2サーバー統計情報の表示をサポート：<ul dir="auto" style="box-sizing: border-box; padding-left: 2em; margin-top: 0px; margin-bottom: 0px;"><li style="box-sizing: border-box;">ユーザートラフィック統計</li><li style="box-sizing: border-box; margin-top: 0.25em;">オンラインデバイス数</li><li style="box-sizing: border-box; margin-top: 0.25em;">現在アクティブな接続などの情報</li></ul></li><li style="box-sizing: border-box; margin-top: 0.25em;">ACLのみで実現するドメイン分離ルール、および対応するドメインへのリクエストのブロックを提供</li><li style="box-sizing: border-box; margin-top: 0.25em;">現在市場にあるすべての主流OSとアーキテクチャをサポート：<ul dir="auto" style="box-sizing: border-box; padding-left: 2em; margin-top: 0px; margin-bottom: 0px;"><li style="box-sizing: border-box;">OS：Arch、Alpine、RHEL、Centos、AlamaLinux、Debian、Ubuntu、Rocky Linuxなど</li><li style="box-sizing: border-box; margin-top: 0.25em;">アーキテクチャ：x86_64、i386|i686、aarch64|arm64、armv7、s390x、ppc64le</li></ul></li><li style="box-sizing: border-box; margin-top: 0.25em;">hy2共有リンクのQRコード生成と端末への出力をサポートし、煩雑なコピー＆ペーストの手間を削減</li><li style="box-sizing: border-box; margin-top: 0.25em;">hysteria2 original client設定ファイルの生成をサポートし、最も完全なクライアントパラメータを保持</li><li style="box-sizing: border-box; margin-top: 0.25em;">高優先度でhysteria2プロセスを起動し、速度を優先</li><li style="box-sizing: border-box; margin-top: 0.25em;">ポートホッピングとhysteria2デーモンプロセスは自動起動スクリプトで管理し、より強力な拡張性と互換性を提供</li><li style="box-sizing: border-box; margin-top: 0.25em;">hysteria v1のインストールスクリプトも提供し、ユーザーが選択可能</li><li style="box-sizing: border-box; margin-top: 0.25em;">BDP（帯域幅遅延積）を計算してquicパラメータを調整し、多様なニーズシーンに対応</li><li style="box-sizing: border-box; margin-top: 0.25em;">socks5アウトバウンドの追加をサポート、warpアウトバウンドの自動設定機能を含む</li><li style="box-sizing: border-box; margin-top: 0.25em;">更新が迅速、hysteria2更新後24時間以内に適応完了</li></ul></details>

## 三、使用方法

### インストールスクリプトの取得


```bash
su - root #rootユーザーに切り替え
bash <(curl -fsSL https://git.io/hysteria.sh)
```

### 設定プロセス



初回インストール後: `hihy`コマンドでメニューを呼び出し、hihyスクリプトを更新した場合はオプション `9`を実行して最新の設定を取得してください

数字のシーケンス番号で直接対応する機能を呼び出すことをサポートします。例えば`hihy 5` はhysteria2を再起動します


```
-------------------------------------------
|**********      Hi Hysteria       **********|
|**********    Author: emptysuns   **********|
|**********     Version: 1.0.1     **********|
 -------------------------------------------
Tips: hihy  コマンドでこのスクリプトを再度実行します.
............................................. 
############################### 
..................... 
1)  hysteria2 インストール 
2)  アンインストール 
..................... 
3)  起動 
4)  停止 
5)  再起動 
6)  実行状態 
..................... 
7)  Core更新 
8)  現在の設定を表示 
9)  再設定 
10) ipv4/ipv6優先度切り替え 
11) hihy更新 
12) ドメイン分離/ACL管理 
13) hysteria2統計情報を表示 
14) リアルタイムログを表示 
15) socks5 outbound追加[warp自動設定をサポート] 
############################### 
0) 終了 
............................................. 
選択してください:
```



![hihy](https://s2.ixacg.com/2025/04/21/1745202982.avif)



参考：

- https://github.com/emptysuns/Hi_Hysteria
- https://v2.hysteria.network/zh/