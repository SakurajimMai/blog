---
title: Bypassing Mobile ISP Blocking of Domain Names
tags:
  - GFW
  - Firewall
password: ixacg@sakurajiamai
excerpt: Some overseas servers in certain countries use fixed routes, for example, Hong Kong routes via Southern Telecom, and Russia routes via Beijing Unicom. If China Mobile broadband users access these overseas websites, it increases China Mobile's settlement fees to Telecom and Unicom. Therefore, China Mobile may choose to directly block access, i.e., block the domain name, making it inaccessible.
cover: https://s2.ixacg.com/2025/04/10/1744271379.avif
createTime: 2026/01/06 11:47:22
permalink: /en/blog/ld1zbnjo/
---

### What is Mobile ISP Blocking?

Most grey-hat and black-hat websites often experience situations where the domain name is not yet blocked by the GFW (accessible via Telecom and Unicom) but is already blocked on mobile networks.

Some overseas servers in certain countries use fixed routes, for example, Hong Kong routes via Southern Telecom, and Russia routes via Beijing Unicom. If China Mobile broadband users access these overseas websites, it increases China Mobile's settlement fees to Telecom and Unicom. Therefore, China Mobile may choose to directly block access, i.e., block the domain name, making it inaccessible.

Around May 2022, there were cases of certain regional operator nodes becoming inaccessible.

### How to Detect if a Domain is Blocked by an ISP?

Recommended tools:

https://www.boce.com  Website Speed Test (HTTP Speed Test)

https://zijian.aliyun.com/detect/http  Website Speed Test (HTTP Speed Test)

https://www.17ce.com/   If there is **Download Exception** or *****, it indicates the website cannot be accessed normally.

https://aicesu.com/  Similar to boce

https://www.dnspod.cn/tech/  Port 80 and 443 checks

http://www.jucha.com/safe/  Can detect **WeChat and QQ blocking**; less accurate and detailed than boce for detecting domain blocking or pollution.

![Figure 3-1](https://s2.ixacg.com/2025/04/10/1744271454.avif)

**Use domestic nodes to detect the domain, select the [Mobile] line. If most regions across the country return status 000 or failure, it indicates the domain is blocked by the mobile network and cannot return data.**

### Reasons and Motivations for Mobile ISP Blocking:

When you use China Mobile's broadband network to access websites hosted on Telecom or Unicom networks, cross-network traffic is generated, and China Mobile must pay fees to China Telecom and China Unicom. Due to historical reasons, there are many servers built on Telecom or Unicom (Netcom) networks. The fees China Mobile pays to Telecom and Unicom far exceed the revenue it receives.

Therefore, China Mobile may hijack DNS (the intensity may vary by region) to return servers located within its own network as much as possible. For popular HTTP content, it may hijack traffic to its own cache servers. For overseas websites, which mostly involve cross-network traffic, QoS throttling is applied. For illegal websites, access is directly blocked.

In short, to reduce inter-network settlement costs, China Mobile hijacks popular content to its own mirror servers and establishes a blacklist mechanism. Sites on the blacklist are subject to QoS throttling, intermittent blocking, or complete blocking.

### How to Rescue a Domain Blocked by China Mobile?

#### Four-Byte Segmentation

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

> Save the above code as geneva.py, then execute the following commands to install dependencies.

```
yum install -y python3 python3-devel gcc gcc-c++ git libnetfilter* libffi-devel
pip3 install --upgrade pip
python3 -m pip install --upgrade pip
pip3 install scapy netfilterqueue
```

---

> Run the program
> nohup ./python3 geneva.py -q 100 -w 4 &
> iptables -I OUTPUT -p tcp -m multiport --sports 80,443 --tcp-flags SYN,RST,ACK,FIN,PSH SYN,ACK -j NFQUEUE --queue-num 100

#### 301 Redirect Method

> [Usage of Domestic Servers Without Filing - Bypassing SNI (HTTPS) Method](/posts/1b2b1e4b.html)

### References

[Revealing and Bypassing China's Blocking of Encrypted SNI (ESNI)](https://gfw.report/blog/gfw_esni_blocking/zh/)

[Implementing Geneva Rules Using Go](https://github.com/Sakurajiamai/gogo1)

[Implementing Geneva Rules Using C](https://github.com/Sakurajiamai/gogo2)