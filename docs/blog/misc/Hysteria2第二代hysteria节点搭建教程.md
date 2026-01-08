---
title: Hysteria2|第二代hysteria节点搭建教程
tags:
  - 代理
  - hysteria
cover: https://s2.ixacg.com/2025/04/21/1745202982.avif
createTime: 2026/01/06 11:47:22
permalink: /blog/86pork6g/
excerpt: Hysteria2 是一个功能丰富的，专为恶劣网络环境进行优化的网络工具（双边加速），比如卫星网络、拥挤的公共 Wi-Fi、在中国连接国外服务器等。 基于修改版的 QUIC 协议
---
#  Hysteria2|第二代hysteria节点搭建教程

![image](https://s2.ixacg.com/2025/04/21/1745202405.avif)

## 一·简介

> Hysteria2 是一个功能丰富的，专为恶劣网络环境进行优化的网络工具（双边加速），比如卫星网络、拥挤的公共 Wi-Fi、在**中国连接国外服务器**等。 基于修改版的 QUIC 协议。

它很好的解决了在搭建富强魔法服务器时最大的痛点——**线路拉跨**。

1. CT直连落地JP NTT机房+cloudflare warp,无任何优化163线路，20-23点晚高峰测试speedtest。

2. 无对钟国大陆线路优化，洛杉矶shockhosting机房，1c128m ovznat 4k@p60：

   ![image](https://s2.ixacg.com/2025/04/21/1745202500.avif)

## 二.优点



<details open="" style="box-sizing: border-box; display: block; margin-top: 0px; margin-bottom: 16px;"><summary style="box-sizing: border-box; display: list-item; cursor: pointer;"><b style="box-sizing: border-box; font-weight: 600;">点我展开查看完整功能列表</b></summary><ul dir="auto" style="box-sizing: border-box; padding-left: 2em; margin-top: 0px; margin-bottom: 16px;"><li style="box-sizing: border-box;">支持hysteria2提供的三种masquerade伪装模式，并提供高度自定义伪装内容</li><li style="box-sizing: border-box; margin-top: 0.25em;">提供四种证书导入方式：<ul dir="auto" style="box-sizing: border-box; padding-left: 2em; margin-top: 0px; margin-bottom: 0px;"><li style="box-sizing: border-box;">ACME HTTP挑战</li><li style="box-sizing: border-box; margin-top: 0.25em;">ACME DNS</li><li style="box-sizing: border-box; margin-top: 0.25em;">自签任意域名证书</li><li style="box-sizing: border-box; margin-top: 0.25em;">本地证书</li></ul></li><li style="box-sizing: border-box; margin-top: 0.25em;">支持在ssh终端查看hysteria2 server统计信息：<ul dir="auto" style="box-sizing: border-box; padding-left: 2em; margin-top: 0px; margin-bottom: 0px;"><li style="box-sizing: border-box;">用户流量统计</li><li style="box-sizing: border-box; margin-top: 0.25em;">在线设备数量</li><li style="box-sizing: border-box; margin-top: 0.25em;">当前活跃的连接等信息</li></ul></li><li style="box-sizing: border-box; margin-top: 0.25em;">提供仅通过ACL实现的分流域名规则，以及屏蔽相应域名的请求</li><li style="box-sizing: border-box; margin-top: 0.25em;">支持当前市面上所有主流的操作系统与架构：<ul dir="auto" style="box-sizing: border-box; padding-left: 2em; margin-top: 0px; margin-bottom: 0px;"><li style="box-sizing: border-box;">操作系统：Arch、Alpine、RHEL、Centos、AlamaLinux、Debian、Ubuntu、Rocky Linux等</li><li style="box-sizing: border-box; margin-top: 0.25em;">架构：x86_64、i386|i686、aarch64|arm64、armv7、s390x、ppc64le</li></ul></li><li style="box-sizing: border-box; margin-top: 0.25em;">支持对hy2分享链接生成二维码输出到终端，减少繁琐的复制粘贴过程</li><li style="box-sizing: border-box; margin-top: 0.25em;">支持生成hysteria2 original client配置文件，保留最全的客户端参数</li><li style="box-sizing: border-box; margin-top: 0.25em;">使用高优先级启动hysteria2进程，保持速度优先</li><li style="box-sizing: border-box; margin-top: 0.25em;">端口跳跃与hysteria2的守护进程使用自启脚本管理，提供更强的拓展性与兼容性</li><li style="box-sizing: border-box; margin-top: 0.25em;">保留提供hysteria v1的安装脚本，供用户选择</li><li style="box-sizing: border-box; margin-top: 0.25em;">计算BDP（带宽延迟积）来调整quic参数，适应多种多样的需求场景</li><li style="box-sizing: border-box; margin-top: 0.25em;">支持添加socks5出站，包括自动添加warp出站功能</li><li style="box-sizing: border-box; margin-top: 0.25em;">更新及时，hysteria2更新后24h内完成适配</li></ul></details>

## 三·使用

### 拉取安装


```bash
su - root #switch to root user.
bash <(curl -fsSL https://git.io/hysteria.sh)
```

### 配置过程



首次安装后: `hihy`命令调出菜单,如更新了hihy脚本，请执行选项 `9`获得最新的配置

支持通过数字序号直接调取相应功能，例如`hihy 5` 将会重启hysteria2


```
-------------------------------------------
|**********      Hi Hysteria       **********|
|**********    Author: emptysuns   **********|
|**********     Version: 1.0.1     **********|
 -------------------------------------------
Tips: hihy  命令再次运行本脚本.
............................................. 
############################### 
..................... 
1)  安装 hysteria2 
2)  卸载 
..................... 
3)  启动 
4)  暂停 
5)  重新启动 
6)  运行状态 
..................... 
7)  更新Core 
8)  查看当前配置 
9)  重新配置 
10) 切换ipv4/ipv6优先级 
11) 更新hihy 
12) 域名分流/ACL管理 
13) 查看hysteria2统计信息 
14) 查看实时日志 
15) 添加socks5 outbound[支持自动配置warp] 
############################### 
0) 退出 
............................................. 
请选择:
```



![hihy](https://s2.ixacg.com/2025/04/21/1745202982.avif)



参考：

- https://github.com/emptysuns/Hi_Hysteria
- https://v2.hysteria.network/zh/
