---
title: Using Domestic Servers Without ICP Filing - SNI (HTTPS) Bypass Methods
tags:
  - GFW
  - Firewall
password: ixacg@sakurajiamai
cover: https://s2.ixacg.com/2025/04/10/1744271510.avif
createTime: 2026/01/06 11:47:22
permalink: /en/blog/kaxmaz3u/
excerpt: Simply put, port 443 of the domain is blocked, and SSL cannot access website content. In more detail, TLS is the security foundation of network communication (HTTPS). TLS provides authenticated encryption that allows users to confirm who they are communicating with and ensures that communication information cannot be seen or tampered with by intermediaries.
---

### What is SNI

Simply put, port 443 of the domain is blocked, and SSL cannot access website content. In more detail, TLS is the security foundation of network communication (HTTPS). TLS provides authenticated encryption that allows users to confirm who they are communicating with and ensures that communication information cannot be seen or tampered with by intermediaries. Although TLS can hide the _content_ of user communications, it cannot always hide the _target_ of communication. For example, TLS handshakes can carry an extension called Server Name Indication (SNI), which helps the client tell the server which website domain it wants to access. Censors, including those in China, use this extension to inspect and block users from accessing specific websites.

<!-- more -->

![Figure 1-1](https://s2.ixacg.com/2025/04/10/1744271510.avif)

### Solutions

Currently, there is no good way to bypass it. The best method is to file the domain and use domestic servers. You can refer to methods for bypassing mobile walls, filing domestically without ICP, then 301 redirect, **remember not to put content domestically.**

#### Port 443 Preemption

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

Save the above code as **mianbeian.py**, which redirects port 443 to port 444.

Next, BaoTa Panel needs to modify nginx's default port 443. If you want to modify Nginx's default port, you also need to modify phpfpm_status.conf and 0.default.conf under /www/server/panel/vhost/nginx, as well as the listening port of your website configuration.
Remember to restart Nginx service after modification. Then set up reverse proxy on port 444.

#### Port 80 Preemption

```python
import socket
import struct
import threading
import time


def main():
    serv_sock = socket.socket()
    serv_sock.bind(('0.0.0.0', 80))
    serv_sock.listen(50)

    # Set TCP window size to 1
    serv_sock.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, 1)

    # Don't wait, close connection immediately
    serv_sock.setsockopt(socket.SOL_SOCKET, socket.SO_LINGER, struct.pack('ii', 1, 0))

    # Disable Nagle algorithm, send data immediately
    serv_sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)

    while True:
        cli_sock, _ = serv_sock.accept()

        try:
            cli_sock.sendall(b'''HTTP/1.1 302 Moved Temporarily\r\n'''
                b'''Content-Type: text/html\r\n'''
                b'''Content-Length: 0\r\n'''
                b'''Connection: close\r\n'''
                b'''Location: http://www.baidu.com/\r\n\r\n''')
        except Exception:  # Prevent exception if client closes connection early
            pass

        def wait_second():
            time.sleep(1)  # Wait 1 second to ensure data is sent
            cli_sock.close()

        threading.Thread(target=wait_second).start()


if __name__ == '__main__':
    main()
```

Save this program as tcp.py. After running, port 80 of the domain will redirect to Baidu.

### References

[Revealing and Circumventing China's Blocking of Encrypted SNI (ESNI)](https://gfw.report/blog/gfw_esni_blocking/zh/)

[Analysis of 301 Overseas Redirect Principles and Various Technical Means to Mitigate Fake Wall Attacks and Extortion](https://github.com/lehui99/articles/blob/main/301%E6%B5%B7%E5%A4%96%E8%B7%B3%E8%BD%AC%E5%8E%9F%E7%90%86%E8%A7%A3%E6%9E%90%E5%85%BC%E8%B0%88%E7%BC%93%E8%A7%A3%E5%81%87%E5%A2%99%E4%BC%AA%E5%A2%99%E6%94%BB%E5%87%BB%E5%8B%92%E7%B4%A2%E7%9A%84%E5%A4%9A%E7%A7%8D%E6%8A%80%E6%9C%AF%E6%89%8B%E6%AE%B5%EF%BC%88%E4%B8%80%EF%BC%89.md)
