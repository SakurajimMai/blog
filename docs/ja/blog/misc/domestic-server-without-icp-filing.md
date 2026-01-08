---
title: ICP登録なしで国内サーバーを使用する方法 - SNI（HTTPS）バイパス方法
tags:
  - GFW
  - ファイアウォール
password: ixacg@sakurajiamai
cover: https://s2.ixacg.com/2025/04/10/1744271510.avif
createTime: 2026/01/06 11:47:22
permalink: /ja/blog/kaxmaz3u/
excerpt: 簡単に言えば、ドメインのポート443がブロックされ、SSLがWebサイトのコンテンツにアクセスできません。詳しく言えば、TLSはネットワーク通信のセキュリティ基盤（HTTPS）です。TLSが提供する認証暗号化により、ユーザーは通信相手を確認でき、通信情報が仲介者に見られたり改ざんされたりしないことを保証します。
---

### SNI とは

簡単に言えば、ドメインのポート 443 がブロックされ、SSL が Web サイトのコンテンツにアクセスできません。詳しく言えば、TLS はネットワーク通信のセキュリティ基盤（HTTPS）です。TLS が提供する認証暗号化により、ユーザーは通信相手を確認でき、通信情報が仲介者に見られたり改ざんされたりしないことを保証します。TLS はユーザー通信の*内容*を隠すことができますが、通信の*対象*を常に隠すことはできません。たとえば、TLS ハンドシェイクは Server Name Indication（SNI）と呼ばれる拡張機能を持つことができ、クライアントがサーバーにアクセスしたい Web サイトのドメインを伝えるのに役立ちます。中国を含む検閲当局は、この拡張機能を使用してユーザーが特定の Web サイトにアクセスするのを検査およびブロックしています。

<!-- more -->

![図1-1](https://s2.ixacg.com/2025/04/10/1744271510.avif)

### 解決方法

現在のところ、これをバイパスする良い方法はありません。最良の方法は、ドメインを登録して国内サーバーを使用することです。モバイルウォールをバイパスする方法を参照し、ICP 登録なしで国内で登録し、301 リダイレクトを行い、**コンテンツを国内に置かないでください。**

#### ポート 443 の先取り

```python
import socket
import threading
import time


def pipe(sock_in, sock_out):
    try:
        while True:
            b = sock_in.recv(65536)
            if not b:
                break
            sock_out.sendall(b)
    except socket.error:
        pass
    finally:
        time.sleep(1)
        sock_in.close()
        sock_out.close()


def connecting(cli_sock, _):
    cli_sock.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, 65535)
    httpd_sock = socket.socket()
    try:
        httpd_sock.connect(('127.0.0.1', 444))
    except socket.error:
        cli_sock.close()
        return
    httpd_sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
    threading.Thread(target=pipe, args=(cli_sock, httpd_sock)).start()
    pipe(httpd_sock, cli_sock)


def main():
    serv_sock = socket.socket()
    serv_sock.bind(('0.0.0.0', 443))
    serv_sock.listen(50)
    serv_sock.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, 1)
    serv_sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
    while True:
        threading.Thread(target=connecting, args=serv_sock.accept()).start()


if __name__ == '__main__':
    main()
```

上記のコードを**mianbeian.py**として保存します。これはポート 443 をポート 444 にリダイレクトします。

次に、宝塔パネルで nginx のデフォルトポート 443 を変更する必要があります。Nginx のデフォルトポートを変更する場合は、/www/server/panel/vhost/nginx 下の phpfpm_status.conf と 0.default.conf、および Web サイト設定のリスニングポートも変更する必要があります。
変更後は Nginx サービスを再起動することを忘れないでください。その後、ポート 444 でリバースプロキシを設定します。

#### ポート 80 の先取り

```python
import socket
import struct
import threading
import time


def main():
    serv_sock = socket.socket()
    serv_sock.bind(('0.0.0.0', 80))
    serv_sock.listen(50)

    # TCPウィンドウサイズを1に設定
    serv_sock.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, 1)

    # 待たずに、接続をすぐに閉じる
    serv_sock.setsockopt(socket.SOL_SOCKET, socket.SO_LINGER, struct.pack('ii', 1, 0))

    # Nagleアルゴリズムを無効にし、データをすぐに送信
    serv_sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)

    while True:
        cli_sock, _ = serv_sock.accept()

        try:
            cli_sock.sendall(b'''HTTP/1.1 302 Moved Temporarily\r\n'''
                b'''Content-Type: text/html\r\n'''
                b'''Content-Length: 0\r\n'''
                b'''Connection: close\r\n'''
                b'''Location: http://www.baidu.com/\r\n\r\n''')
        except Exception:  # クライアントが早期に接続を閉じた場合の例外を防ぐ
            pass

        def wait_second():
            time.sleep(1)  # データが送信されたことを確認するために1秒待機
            cli_sock.close()

        threading.Thread(target=wait_second).start()


if __name__ == '__main__':
    main()
```

このプログラムを tcp.py として保存します。実行後、ドメインのポート 80 は Baidu にリダイレクトされます。

### 参考文献

[中国による暗号化 SNI（ESNI）のブロックの暴露と回避](https://gfw.report/blog/gfw_esni_blocking/zh/)

[301 海外リダイレクト原理の分析と偽ウォール攻撃・恐喝を緩和するさまざまな技術手段](https://github.com/lehui99/articles/blob/main/301%E6%B5%B7%E5%A4%96%E8%B7%B3%E8%BD%AC%E5%8E%9F%E7%90%86%E8%A7%A3%E6%9E%90%E5%85%BC%E8%B0%88%E7%BC%93%E8%A7%A3%E5%81%87%E5%A2%99%E4%BC%AA%E5%A2%99%E6%94%BB%E5%87%BB%E5%8B%92%E7%B4%A2%E7%9A%84%E5%A4%9A%E7%A7%8D%E6%8A%80%E6%9C%AF%E6%89%8B%E6%AE%B5%EF%BC%88%E4%B8%80%EF%BC%89.md)
