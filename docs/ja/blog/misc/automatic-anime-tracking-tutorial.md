---
title: ワンステップで完結する全自動アニメ追跡チュートリアル
tags:
  - Linux
  - MoviePilot
  - Emby
  - qbittorrent
  - Docker
cover: https://s2.ixacg.com/2025/04/10/1744271581.avif
createTime: 2026/01/06 11:47:22
permalink: /ja/blog/58nj2qii/
---



動画配信プラットフォームの様々な広告に直面し、自分でプラットフォームを構築してドラマやアニメを見ることを選択しました。これにより、自動追跡、高画質、全プラットフォームでの再生、友人との共有が可能になります。

<!-- more -->

## 準備

* Nasまたは自分のサーバー
* ANI-RSS
* QB
* EMBY
* MP
* Autofilm(オプション)

## qbittorrent

まずダウンローダーを構築し、docker-compose.ymlファイルを作成します。内容は以下の通りです。

```dockerfile
version: "2"
services:
  qbittorrent:
    image: linuxserver/qbittorrent
    container_name: qbittorrent
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Shanghai # あなたのタイムゾーン
      - UMASK_SET=022
      - WEBUI_PORT=49850 # ここをあなたが使用したいWEB管理画面のポートに変更してください
    volumes:
      - ./config:/config # 絶対パスは自分のconfigフォルダに変更してください
      - /data/downloads:/downloads # 絶対パスは自分のdownloadsフォルダに変更してください
    ports:
      # 使用するマッピングダウンロードポートと内部ダウンロードポート。デフォルトのままでもよく、インストール完了後、管理画面で他のポートに変更できます。
      - 49849:49849
      - 49849:49849/udp
      # ここでWEB UIのターゲットポートと内部ポートは必ず同じにしてください。問題1を参照
      - 49850:49850
    restart: unless-stopped

```

## ANI-RSS

主にQBと連携して、アニメの自動ダウンロード、リネーム、自動追跡、購読、蜜柑RSSアニメのダウンロードを実現します。

![ani-rssインターフェース](https://s2.ixacg.com/2025/04/10/1744271581.avif "1.1")​

docker-compose.ymlファイルを作成します。内容は以下の通りです。

```dockerfile
version: "3"
services:
  ani-rss:
    container_name: ani-rss
    volumes:
      - ./config:/config
      - /data/downloads:/downloads
    ports:
      - 7789:7789
    environment:
      - PORT=7789
      - CONFIG=/config
      - TZ=Asia/Shanghai
    restart: always
    image: wushuo894/ani-rss
```

欠点は、現時点では集約購読をサポートしておらず、単一購読のみ可能なことです。

![設定](https://s2.ixacg.com/2025/04/10/1744271620.avif "1.2")​

保存場所はqbittorrentのダウンロード場所と同じにする必要があることに注意してください。

もちろん、ダウンロードした動画をalistのサードパーティクラウドストレージにアップロードすることもできます。他のサーバーでAutofileを使用してstrmを作成し、MoviePilotでスクレイピングすることができます。

## MoviePilot

主にスクレイピングに使用します。ここでは管理を容易にするため、strmハードリンク方式を採用します。

embyのスクレイピングを使用しないのは、主にパフォーマンスと速度を向上させるためです。

MoviePilotV1とMoviePilotV2のどちらかを選択してください。

### MoviePilotV1

docker-compose.ymlファイルを作成します。内容は以下の通りです。

```dockerfile
version: "2.3"
services:
  moviepilo:
    image: jxxghp/moviepilot:latest
    container_name: moviePilot
    environment:
      - UID=1000
      - GID=1000
      - UMASK=022
      - NGINX_PORT=3000
      - PORT=3001

      #プロキシ (tmdb接続、更新などに使用)
    #   - PROXY_HOST=http://10.0.0.4:10080
    #   - MoviePilot_AUTO_UPDATE = ture
      #認証サイト情報
      - AUTH_SITE=xxxxx
      - WINTERSAKURA_UID=xxxx
      - WINTERSAKURA_PASSKEY=xxxxx

    volumes:

      # MoviePilot設定ファイルディレクトリ
      - ./moviepilot/main:/moviepilot #プログラムメインディレクトリ、必須 【各自変更】
      - ./moviepilot/config:/config #config 設定ファイル、必須 【各自変更】
      # メディアライブラリディレクトリ
      - /data/downloads:/media # このパスは上記のqbで設定したdownloadsパスと同じであることを確認してください 【各自変更】
    ports:
      - 3000:3000 # HTTP port
    restart: on-failure

```

プラグインマーケットでディレクトリ監視をダウンロードし、以下の図のように設定します。

![ディレクトリ監視設定](https://s2.ixacg.com/2025/04/10/1744271660.webp)​

### MoviePilotV2

V1と比較して、V2はすでにディレクトリ監視機能を統合しています。

docker-compose.ymlファイルを作成します。内容は以下の通りです。

```dockerfile
version: '3.3'

services:
    moviepilot:
        stdin_open: true
        tty: true
        container_name: moviepilot-v2
        hostname: moviepilot-v2
        networks:
            - moviepilot
        ports:
            - target: 13000
              published: 13000
              protocol: tcp
        volumes:
            - '/data/downloads:/media'
            - './moviepilot-v2/config:/config'
            - './moviepilot-v2/core:/moviepilot/.cache/ms-playwright'
            - './var/run/docker.sock:/var/run/docker.sock:ro'
            #- '/root/.config/rclone:/moviepilot/.config/rclone'
           # - '/alist:/alist'
            - '/data:/data'
        environment:
            - 'NGINX_PORT=13000'
            - 'PORT=13001'
            - 'PUID=0'
            - 'PGID=0'
            - 'UMASK=000'
            - 'TZ=Asia/Shanghai'
            - 'AUTH_SITE=xxxxx'
            - 'WINTERSAKURA_UID=xxxxx'
            - 'WINTERSAKURA_PASSKEY=xxxxx'
            - 'SUPERUSER=admin'
            # - 'API_TOKEN=手動設定は不要、システムが自動生成します。カスタム設定が必要な場合は、16文字以上の複雑な文字列である必要があります'
        restart: always
        image: jxxghp/moviepilot-v2:latest

networks:
  moviepilot:
    name: moviepilot
```

## EMBY

ビデオプレーヤーで、TV、Android、Apple、PCでの再生をサポートし、オンラインで動画を視聴できます。

docker-compose.ymlファイルを作成します。内容は以下の通りです。

```dockerfile
version: "2.3"
services:
    emby:
      image: amilys/embyserver:latest
      container_name: emby
      # network_mode: host
      ports:
        - 8096:8096
        - 8920:8920
        - 1900:1900/udp
        - 7359:7359/udp
      environment:
        - PUID=1000
        - PGID=1000
        - GIDLIST=0
        - TZ=Asia/Shanghai
        # - HTTP_PROXY="http://あなたのプロキシIP:ポート/"
        # - HTTPS_PROXY="http://あなたのプロキシIP:ポート/"
    #   devices:
    #     - /dev/dri:/dev/dri
      volumes:
        - ./emby:/config
        - /data/downloads:/media
        # - /alist:/alist

      restart: unless-stopped
```

メディアライブラリディレクトリを設定します。

![メディアディレクトリ](https://s2.ixacg.com/2025/04/10/1744271683.avif)​

以下の三つの項目にチェックを入れるだけでよく、他の項目はチェックする必要はありません。

![メディア設定](https://s2.ixacg.com/2025/04/10/1744271697.avif)​

## Autofilm(オプション)

別のサーバーでEMBYを設定して動画を再生する必要がある場合、別のサーバーでautofileを使用する必要があるかもしれません。これはalistと組み合わせて使用する必要があります。

docker-compose.ymlファイルを作成します。内容は以下の通りです。

```dockerfile
version: '3.8'

services:
  autofilm:
    image: akimio/autofilm
    container_name: autofilm
    volumes:
      - ./config:/config
      - /data/downloads/video:/media
      - ./logs:/logs
    restart: always
```

configフォルダに入り、config.yamlを作成します。設定は以下の通りです。

```yaml
Settings:
  DEV: False                          # 開発者モード(オプション、デフォルト False)

#alist上のファイルをstrmとしてダウンロード
Alist2StrmList:
  - id: アニメ                          # 識別ID
    cron: 54 15 * * *                  # バックグラウンド定期タスク Crontable 式
    url: xxxxx    # Alist サーバーアドレス、ドメインはwsサポートが必要
    username: xxxxx                   # Alist ユーザー名
    password: xxxxx              # Alist パスワード
    source_dir: /Anime                 # Alist サーバー上のフォルダパス
    target_dir: /media/strm             # 出力パス
    flatten_mode: False               # フラットモード、有効にすると subtitle、image、nfo は強制的にオフになります(オプション、デフォルト False)
    subtitle: False                 # 字幕ファイルをダウンロードするかどうか（オプション、デフォルト False）
    image: False                      # 画像ファイルをダウンロードするかどうか（オプション、デフォルト False）
    nfo: False                        # .nfo ファイルをダウンロードするかどうか（オプション、デフォルト False）
    raw_url: False                    # 元のアドレスを使用してAlistサーバーのダウンロードアドレスを置き換えるかどうか（オプション、デフォルト False）
    overwrite: False
    # 上書きモード、ローカルパスに同名ファイルが存在する場合、そのファイルを再生成/ダウンロードするかどうか（オプション、デフォルト False）
    other_ext:                        # カスタムダウンロード拡張子、半角カンマで区切ってください（オプション、デフォルト空）
    max_workers: 5                    # ダウンロードファイルの最大同時実行数（オプション、デフォルト 5）
    url_encode: True                  # 生成されたstrmファイル内のリンクをURLエンコードするかどうか


# 削除推奨
#Ani2AlistList:
#  - id: 新番追跡                           # 識別ID
#    cron: 33 15 * * *                     # バックグラウンド定期タスク Crontable 式
#    url: xxxxx      # Alist サーバーアドレス
#    username: xxx                       # Alist ユーザー名（管理者権限が必要）
#    password: xxxx                   # Alist パスワード
#    target_dir: /Anime            # Alist アドレスツリーストレージパス、ストレージが存在しない場合は自動的に作成されます（オプション、デフォルト/Anime）
#    rss_update: True                    # RSS購読を使用して最新のアニメを更新する、有効にすると渡されたyearとmonthは無視されます（オプション、デフォルト True）
#    year: 2024                            # アニメシーズン-年、2019-1以降に更新されたアニメのみサポート（オプション、デフォルトは現在の日付）
#    month: 10                           # アニメシーズン-月、2019-1以降に更新されたアニメのみサポート（オプション、デフォルトは現在の日付）
#    src_domain: openani.an-i.workers.dev # ANI Open プロジェクトドメイン（オプション、デフォルトは aniopen.an-i.workers.dev）
#    rss_domain: api.ani.rip               # ANI Open プロジェクト RSS 購読ドメイン（オプション、デフォルトは api.ani.rip）


```

次に、MoviePilotの手順を繰り返してスクレイピングを行います。

## 注意事項

### MoviePilotとqbittorrentのパスワードはどこにありますか？

```dockerfile
docker logs <コンテナIDまたはコンテナ名> #パスワードを確認
```

### ダウンロードディレクトリ、メディアディレクトリ

すべてのマウントディレクトリが同じ場所にあることに注意してください。

## 参考

* [ANI-RSS](https://github.com/wushuo894/ani-rss)
* [EMBY](https://hub.docker.com/r/amilys/embyserver)
* [MoviePilot Wiki](https://wiki.movie-pilot.org/zh/reorganize)
* [Autofilm](https://github.com/Akimio521/AutoFilm)

‍