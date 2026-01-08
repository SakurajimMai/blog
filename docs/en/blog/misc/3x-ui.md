---
title: VPN Setup Guide for Beginners (3x-ui)
tags:
  - Proxy
cover: https://s2.ixacg.com/2025/07/23/1753280778.avif
createTime: 2026/01/06 11:47:22
permalink: /en/blog/49cc4ztm/
---

# VPN Setup Guide for Beginners (3x-ui)

## Purchasing a Server

Get an overseas server.

For servers from providers like Alibaba Cloud or Tencent Cloud, you'll need to disable the firewall.

<!-- more -->

## Connecting to the Server

Use an SSH tool to connect, such as [Termius](https://termius.com/index.html).

Configure the IP address, username, and password you obtained, then connect to the server as shown in the image.

## Installing 3x-ui

Enter the following command in the terminal:

```bash
bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)
```

Enter: y

You will get the following information:

![3-2](https://s2.ixacg.com/2025/07/23/1753278389.avif)

Next, open your browser, enter the URL shown in the red box, log in, and configure your password.

## Configuring 3X-UI

![4-1](https://s2.ixacg.com/2025/07/23/1753278631.avif)

![4-2](https://s2.ixacg.com/2025/07/23/1753278772.avif)

![4-3](https://s2.ixacg.com/2025/07/23/1753278872.avif)

## Importing to Client

Now you just need to import what you just created into a client. We recommend [v2rayNG](https://github.com/2dust/v2rayNG).

![5-1](https://s2.ixacg.com/2025/07/23/1753279012.avif)
