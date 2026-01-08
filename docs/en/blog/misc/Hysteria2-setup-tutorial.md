---
title: Hysteria2 | Second-Generation Hysteria Node Setup Tutorial
tags:
  - Proxy
  - hysteria
cover: https://s2.ixacg.com/2025/04/21/1745202982.avif
createTime: 2026/01/06 11:47:22
permalink: /en/blog/86pork6g/
excerpt: Hysteria2 is a feature-rich network tool optimized for poor network conditions (bilateral acceleration), such as satellite networks, congested public Wi-Fi, connecting to foreign servers from China, etc. It is based on a modified QUIC protocol.
---
# Hysteria2 | Second-Generation Hysteria Node Setup Tutorial

![image](https://s2.ixacg.com/2025/04/21/1745202405.avif)

## 1. Introduction

> Hysteria2 is a feature-rich network tool optimized for poor network conditions (bilateral acceleration), such as satellite networks, congested public Wi-Fi, connecting to foreign servers from **China**, etc. It is based on a modified QUIC protocol.

It effectively addresses the biggest pain point when setting up proxy servers—**poor network routes**.

1. CT direct connection to JP NTT data center + Cloudflare Warp, no optimization for 163 routes, Speedtest during peak evening hours (20:00-23:00).

2. No optimization for routes to Mainland China, Los Angeles Shockhosting data center, 1c128m OVZ NAT, 4k@p60:

   ![image](https://s2.ixacg.com/2025/04/21/1745202500.avif)

## 2. Advantages

<details open style="box-sizing: border-box; display: block; margin-top: 0px; margin-bottom: 16px;"><summary style="box-sizing: border-box; display: list-item; cursor: pointer;"><b style="box-sizing: border-box; font-weight: 600;">Click to expand and view the complete feature list</b></summary><ul dir="auto" style="box-sizing: border-box; padding-left: 2em; margin-top: 0px; margin-bottom: 16px;"><li style="box-sizing: border-box;">Supports three masquerade modes provided by Hysteria2 and offers highly customizable masquerade content.</li><li style="box-sizing: border-box; margin-top: 0.25em;">Provides four certificate import methods:<ul dir="auto" style="box-sizing: border-box; padding-left: 2em; margin-top: 0px; margin-bottom: 0px;"><li style="box-sizing: border-box;">ACME HTTP Challenge</li><li style="box-sizing: border-box; margin-top: 0.25em;">ACME DNS</li><li style="box-sizing: border-box; margin-top: 0.25em;">Self-signed certificate for any domain</li><li style="box-sizing: border-box; margin-top: 0.25em;">Local certificate</li></ul></li><li style="box-sizing: border-box; margin-top: 0.25em;">Supports viewing Hysteria2 server statistics in the SSH terminal:<ul dir="auto" style="box-sizing: border-box; padding-left: 2em; margin-top: 0px; margin-bottom: 0px;"><li style="box-sizing: border-box;">User traffic statistics</li><li style="box-sizing: border-box; margin-top: 0.25em;">Number of online devices</li><li style="box-sizing: border-box; margin-top: 0.25em;">Current active connections and other information</li></ul></li><li style="box-sizing: border-box; margin-top: 0.25em;">Provides domain-based traffic splitting rules implemented solely through ACL, as well as blocking requests for specific domains.</li><li style="box-sizing: border-box; margin-top: 0.25em;">Supports all mainstream operating systems and architectures currently available:<ul dir="auto" style="box-sizing: border-box; padding-left: 2em; margin-top: 0px; margin-bottom: 0px;"><li style="box-sizing: border-box;">Operating Systems: Arch, Alpine, RHEL, CentOS, AlmaLinux, Debian, Ubuntu, Rocky Linux, etc.</li><li style="box-sizing: border-box; margin-top: 0.25em;">Architectures: x86_64, i386|i686, aarch64|arm64, armv7, s390x, ppc64le</li></ul></li><li style="box-sizing: border-box; margin-top: 0.25em;">Supports generating QR codes for Hysteria2 share links and outputting them to the terminal, reducing tedious copy-paste processes.</li><li style="box-sizing: border-box; margin-top: 0.25em;">Supports generating Hysteria2 original client configuration files, preserving the most comprehensive client parameters.</li><li style="box-sizing: border-box; margin-top: 0.25em;">Starts the Hysteria2 process with high priority to maintain speed priority.</li><li style="box-sizing: border-box; margin-top: 0.25em;">Port hopping and Hysteria2 daemon processes are managed using auto-start scripts, providing greater extensibility and compatibility.</li><li style="box-sizing: border-box; margin-top: 0.25em;">Retains the installation script for Hysteria v1 for user selection.</li><li style="box-sizing: border-box; margin-top: 0.25em;">Calculates BDP (Bandwidth-Delay Product) to adjust QUIC parameters, adapting to various usage scenarios.</li><li style="box-sizing: border-box; margin-top: 0.25em;">Supports adding SOCKS5 outbound, including automatic Warp outbound configuration.</li><li style="box-sizing: border-box; margin-top: 0.25em;">Timely updates, with adaptation completed within 24 hours after Hysteria2 updates.</li></ul></details>

## 3. Usage

### Pull and Install

```bash
su - root #switch to root user.
bash <(curl -fsSL https://git.io/hysteria.sh)
```

### Configuration Process

After the first installation: Use the `hihy` command to bring up the menu. If the hihy script has been updated, please execute option `9` to get the latest configuration.

Supports directly calling corresponding functions via numeric serial numbers, e.g., `hihy 5` will restart Hysteria2.

```
-------------------------------------------
|**********      Hi Hysteria       **********|
|**********    Author: emptysuns   **********|
|**********     Version: 1.0.1     **********|
 -------------------------------------------
Tips: hihy  command to run this script again.
.............................................
###############################
.....................
1)  Install hysteria2
2)  Uninstall
.....................
3)  Start
4)  Pause
5)  Restart
6)  Status
.....................
7)  Update Core
8)  View Current Configuration
9)  Reconfigure
10) Switch IPv4/IPv6 Priority
11) Update hihy
12) Domain Traffic Splitting/ACL Management
13) View Hysteria2 Statistics
14) View Real-time Logs
15) Add SOCKS5 Outbound [Supports automatic Warp configuration]
###############################
0)  Exit
.............................................
Please select:
```

![hihy](https://s2.ixacg.com/2025/04/21/1745202982.avif)

References:

- https://github.com/emptysuns/Hi_Hysteria
- https://v2.hysteria.network/zh/