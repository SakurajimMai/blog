---
title: モバイルキャリアウォールによるドメインブロックの回避
tags:
  - GFW
  - ファイアウォール
password: ixacg@sakurajiamai
excerpt: 一部の海外サーバーは特定の国への固定ルートを使用しています。例えば香港は南中国電信経由、ロシアは北京聯通経由。中国移動のブロードバンドユーザーがこれらの海外サイトにアクセスすると、中国移動が電信と聯通に支払う決済費用が増加するため、移動はアクセスを直接ブロックすることを選択します。つまり、ドメインをブロックしてアクセス不能にします。
cover: https://s2.ixacg.com/2025/04/10/1744271379.avif
createTime: 2026/01/06 11:47:22
permalink: /ja/blog/ld1zbnjo/
---

### モバイルウォールとは

ほとんどのグレー/ブラックマーケット Web サイトのドメインは、GFW にまだブロックされていない（電信とネットコムでアクセス可能）が、すでにモバイル回線でブロックされている状況がよく見られます。

一部の海外サーバーは特定の国への固定ルートを使用しています。例えば香港は南中国電信経由、ロシアは北京聯通経由。中国移動のブロードバンドユーザーがこれらの海外サイトにアクセスすると、中国移動が電信と聯通に支払う決済費用が増加するため、移動はアクセスを直接ブロックすることを選択します。つまり、ドメインをブロックしてアクセス不能にします。

2022 年 5 月頃、一部の地域のキャリアノードが接続できなくなりました。

### ドメインがキャリアにブロックされているか検出する方法

推奨ツール：

https://www.boce.com Web サイト速度テスト（HTTP 速度テスト）

https://zijian.aliyun.com/detect/http Web サイト速度テスト（HTTP 速度テスト）

https://www.17ce.com/ **ダウンロード異常**と**\***は Web サイトに正常にアクセスできないことを意味します。

https://aicesu.com/ boce に類似

https://www.dnspod.cn/tech/ ポート 80 と 443 のチェック

http://www.jucha.com/safe/ **WeChat、QQ ブロック**を検出可能、ウォール/汚染の検出は boce ほど正確で詳細ではありません。

![図3-1](https://s2.ixacg.com/2025/04/10/1744271454.avif)

**国内ノードでドメインをテストし、[移動]回線を選択し、全国のほとんどの地域でステータス 000 または失敗が返される場合、そのドメインはモバイルネットワークによってブロックされ、データを返すことができないことを示します。**

### モバイルウォールの理由と動機：

中国移動のブロードバンドを使用して電信または聯通ネットワーク上の Web サイトにアクセスすると、クロスネットワークトラフィックが生成され、中国移動は中国電信と中国聯通に支払いをします。歴史的な理由により、電信または聯通（ネットコム）ネットワーク上に多くのサーバーがあり、移動が電信と聯通に支払う料金は受け取る料金よりもはるかに多いです。

したがって、移動は独自に DNS をハイジャックし（強度は地域によって異なる場合があります）、できるだけ移動ネットワーク内のサーバーを返そうとします。人気の HTTP コンテンツについては、移動の自己構築キャッシュサーバーにハイジャックします。海外サイトについては、クロスネットワークが一般的なため、QoS 制限が適用されます。違法サイトについては、アクセスが直接ブロックされます。

要するに、中国移動はネットワーク間決済を減らすため、人気コンテンツを自社のミラーサーバーにハイジャックし、ブラックリストメカニズムを確立しています。ブラックリストにあるものは QoS 制限、断続的なブロック、または完全なブロックを受けます。

### 中国移動にブロックされたドメインを救う方法

#### 4 バイト分割

```
#!/usr/bin/env python3

import os
import signal
from scapy.all import *
from netfilterqueue import NetfilterQueue
import argparse

window_size = 4

def modify_window(pkt):
    try:
        ip = IP(pkt.get_payload())
        if ip.haslayer(TCP) and ip[TCP].flags == "SA":
            ip[TCP].window = window_size
            del ip[IP].chksum
            del ip[TCP].chksum
            pkt.set_payload(bytes(ip))
        elif ip.haslayer(TCP) and ip[TCP].flags == "FA":
            ip[TCP].window = window_size
            del ip[IP].chksum
            del ip[TCP].chksum
            pkt.set_payload(bytes(ip))
        elif ip.haslayer(TCP) and ip[TCP].flags == "PA":
            ip[TCP].window = window_size
            del ip[IP].chksum
            del ip[TCP].chksum
            pkt.set_payload(bytes(ip))
        elif ip.haslayer(TCP) and ip[TCP].flags == "A":
            ip[TCP].window = window_size
            del ip[IP].chksum
            del ip[TCP].chksum
            pkt.set_payload(bytes(ip))
    except:
        pass

    pkt.accept()

def parsearg():
    parser = argparse.ArgumentParser(description='Description of your program')

    parser.add_argument('-q', '--queue', type=int, help='iptables Queue Num')
    parser.add_argument('-w', '--window_size', type=int, help='Tcp Window Size')

    args = parser.parse_args()

    if args.queue is None or args.window_size is None:
        exit(1)

    window_size = args.window_size

    return args.queue

def main():
    queue_num = parsearg()
    nfqueue = NetfilterQueue()
    nfqueue.bind(queue_num, modify_window)

    try:
        print("Starting netfilter_queue process...")
        nfqueue.run()
    except KeyboardInterrupt:
        pass

if name == "main":
    #sys.stdout = os.fdopen(sys.stdout.fileno(), 'w', 0)
    signal.signal(signal.SIGINT, lambda signal, frame: sys.exit(0))
    main()

```

> 上記のコードを geneva.py として保存し、以下のコマンドを実行して依存関係をインストール

```
yum install -y python3 python3-devel gcc gcc-c++ git libnetfilter* libffi-devel
pip3 install --upgrade pip
python3 -m pip install --upgrade pip
pip3 install scapy netfilterqueue
```

---

> プログラムを実行
> nohup ./python3 geneva.py -q 100 -w 4 &
> iptables -I OUTPUT -p tcp -m multiport --sports 80,443 --tcp-flags SYN,RST,ACK,FIN,PSH SYN,ACK -j NFQUEUE --queue-num 100

#### 301 リダイレクト方法

> [ICP 登録なしで国内サーバーを使用 - SNI（HTTPS）バイパス方法](/posts/1b2b1e4b.html)

### 参考文献

[中国による暗号化 SNI（ESNI）のブロックの暴露と回避](https://gfw.report/blog/gfw_esni_blocking/zh/)

[Go でジュネーブルールを実装](https://github.com/Sakurajiamai/gogo1)

[C でジュネーブルールを実装](https://github.com/Sakurajiamai/gogo2)
