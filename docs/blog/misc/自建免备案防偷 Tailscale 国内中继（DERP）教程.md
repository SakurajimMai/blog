---
title: 自建免备案防偷 Tailscale 国内中继（DERP）教程
tags:
  - Tailscale
  - 内网穿透
  - 局域网
excerpt: Tailscale 是一个基于 Wireguard 的带有多种网络工具的 P2P 组网工具。得益于其 P2P 的特性，Tailscale 还可以进行内网穿透，打破 NAT 的限制直达另一台主机。
cover: https://s2.ixacg.com/2025/04/10/1744273338.avif
createTime: 2026/01/06 11:47:22
permalink: /blog/nz2wgpyh/
---

![Tailscale 官方宣传背景](https://s2.ixacg.com/2025/04/10/1744273338.avif)

## Tailscale 与 DERP 简介

### Tailscale 是什么？

Tailscale 是一个基于 Wireguard 的带有多种网络工具的 P2P 组网工具。得益于其 P2P 的特性，Tailscale 还可以进行内网穿透，打破 NAT 的限制直达另一台主机。

<!-- more -->

### DERP 是什么？

`DERP` 是一个 Tailscale 自行开发的中继服务。当所处网络环境难以穿透（如校园网、移动大内网、4G、5G 等）时，所有流量都会经由 DERP 中转至目标地址。

在默认情况下，Tailscale 官方已经提供了环大陆的官方 DERP 服务，但是由于中国大陆的网络连通性等问题，官方并未提供大陆的 DERP 节点。为了确保大陆的打通成功率，我们需要自建一个 DERP 服务，来帮助我们 “打洞”。

## 安装 Docker 与 Docker compose

```bash
bash <(curl -Ls https://docker.denlu.top/docker.sh)
```

##  DERP 节点服务中部署 Tailscale 客户端（重要）

###  原理

由于我们不使用域名进行部署，我们无法使用域名的 `--verify-clients` 参数进行客户端验证，很容易被别人随便扫扫就扫走，他们就可以使用我们的宝贵国内流量进行一个白嫖。DERP 在无验证的情况下，会默认转发走所有需要转发的流量而不用校验等操作。

### 简单安装教程

> 官方教程：[ Tailscale Docs](https://tailscale.com/kb/1347/installation)

1. 先使用一键脚本部署：`curl -fsSL https://tailscale.com/install.sh | sh`
2. 进行登录操作：`tailscale login`
3. 此时控制台就会弹出登录 URL，用你的浏览器访问这个 URL 按操作指引就可以完成安装。

## Docker 镜像

```dockerfile
services:
  derper:
    image: ghcr.io/yangchuansheng/ip_derper:latest
    container_name: derper
    restart: always
    ports:
      - "12345:12345" # 这里的12345请改成你自己想要的10000以上的高位端口
      - "3478:3478/udp" # 3478 为stun端口，如果不冲突请勿修改
    volumes:
      - /var/run/tailscale/tailscaled.sock:/var/run/tailscale/tailscaled.sock # 映射本地 tailscale 客户端验证连接，用来验证是否被偷
    environment:
      - DERP_ADDR=:12345 # 此处需要与上面的同步修改
      - DERP_CERTS=/app/certs
      - DERP_VERIFY_CLIENTS=true # 启动客户端验证，这是防偷的最重要的参数

```

新建一个文件，命名为：`docker-compose.yml`

在该文件夹内，`docker compose up -d` 即可启动该 docker

对于服务器在国内的情况，可以将 ghcr 的链接替换一下，比如南大的（替换第三行的 image）

```dockerfile
services:
  derper:
    image: ghcr.nju.edu.cn/yangchuansheng/ip_derper:latest
```

## 修改 tailscale ACL 配置启用第三方 DERP

1. 进入 ACL 编辑页面：[Tailscale](https://login.tailscale.com/admin/acls/file)
2. 加入新配置文件

```bash
	"derpMap": {
		"OmitDefaultRegions": false, // 可以设置为 true，这样不会下发官方的 derper 节点，测试或者实际使用都可以考虑打开
		"Regions": {
			"900": {
				"RegionID":   900, // tailscale 900-999 是保留给自定义 derper 的
				"RegionCode": "abc1",
				"RegionName": "abcc1",// 这俩随便命名
				"Nodes": [
					{
						"Name":             "fff",
						"RegionID":         900,
						"IPv4":             "1.1.1.1", // 你的VPS 公网IP地址
						"DERPPort":         12345, //上面 12345 你自定义的端口
						"InsecureForTests": true, // 因为是自签名证书，所以客户端不做校验
					},
				],
			},
			"901": {
				"RegionID":   901, // 加入新 derp 的时候记得修改
				"RegionCode": "abc2",
				"RegionName": "abcc2",
				"Nodes": [
					{
						"Name":             "kkk",
						"RegionID":         902,
						"IPv4":             "8.8.8.8", // 你的VPS 公网IP地址
						"DERPPort":         4000, //上面 12345 你自定义的端口
						"InsecureForTests": true, // 因为是自签名证书，所以客户端不做校验
					},
				],
			},
		},
	},
```

## 测试是否成功

### 使用网络连接测试

1. 找到一个在用 tailscale 的客户端
2. 进入终端
3. 输入 `tailscale netcheck`
4. 检验是否有下图回应

![TS 网络状况监测](https://s2.ixacg.com/2025/04/10/1744272827.avif)

### 使用 ping 测试连通性

1. 找到一个在用 tailscale 的客户端
2. 进入终端
3. 输入 `tailscale ping 你的另一个主机地址`
4. 检验是否联通 (例如出现 `via DER (xxx)`) 即为成功
