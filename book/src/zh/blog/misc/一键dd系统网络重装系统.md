---
title: 一键dd系统网络重装系统
tags:
  - Linux
category:
  - 教程
date: 2024-12-09 00:00:00
article: true
---

## AutoReinstall脚本

```bash
wget --no-check-certificate -O AutoReinstall.sh https://git.io/AutoReinstall.sh && bash AutoReinstall.sh
 
#国内可用版
bash <(wget --no-check-certificate -qO- https://cdn.jsdelivr.net/gh/hiCasper/Shell@master/AutoReinstall.sh)
```

### 重装后磁盘扩容

使用分区工具：使用 `fdisk` 或 `parted` 工具来删除并重新创建 `/dev/vda1` 分区，以使用整个磁盘空间。对于使用 DOS 分区表的磁盘，以下是使用 `fdisk` 的一个示例步骤：

- 运行 `sudo fdisk /dev/vda` 来启动 `fdisk` 工具。
- 输入 `p` 来显示当前分区表，确认 `/dev/vda1` 的分区编号。
- 输入 `d` 来删除一个分区，然后选择 `/dev/vda1` 分区。
- 输入 `n` 来创建一个新分区，选择主分区，分区号为 1，然后使用默认的起始扇区，最后扇区选择默认以使用所有剩余空间。
- 输入 `t` 来更改分区类型，然后选择 `83`（Linux）。
- 输入 `a` 来使分区可启动，如果 `/dev/vda1` 是启动分区。
- 输入 `w` 来写入更改并退出 `fdisk`。

**重要**：这些操作会删除 `/dev/vda1` 分区上的所有数据。请确保你已经备份。


根据你提供的磁盘信息，`/dev/vda` 的总大小为约 42.9 GB，但 `/dev/vda1` 分区只占用了大约 1.5 GB 的空间，从扇区 2048 开始到扇区 3145727 结束。要将 `/dev/vda1` 扩展以使用剩余的磁盘空间，你需要执行几个步骤。请注意，这些操作涉及高风险，务必在操作前备份所有重要数据。

#### 步骤 1: 删除并重新创建 `/dev/vda1` 分区

1. **备份数据**：在进行任何修改之前，确保备份 `/dev/vda1` 上的所有数据。

2. **使用分区工具**：使用 `fdisk` 或 `parted` 工具来删除并重新创建 `/dev/vda1` 分区，以使用整个磁盘空间。对于使用 DOS 分区表的磁盘，以下是使用 `fdisk` 的一个示例步骤：

   - 运行 `sudo fdisk /dev/vda` 来启动 `fdisk` 工具。
   - 输入 `p` 来显示当前分区表，确认 `/dev/vda1` 的分区编号。
   - 输入 `d` 来删除一个分区，然后选择 `/dev/vda1` 分区。
   - 输入 `n` 来创建一个新分区，选择主分区，分区号为 1，然后使用默认的起始扇区，最后扇区选择默认以使用所有剩余空间。
   - 输入 `t` 来更改分区类型，然后选择 `83`（Linux）。
   - 输入 `a` 来使分区可启动，如果 `/dev/vda1` 是启动分区。
   - 输入 `w` 来写入更改并退出 `fdisk`。

   **重要**：这些操作会删除 `/dev/vda1` 分区上的所有数据。请确保你已经备份。

#### 步骤 2: 扩展文件系统

在重新创建分区并重启系统后（如果需要），你需要扩展文件系统以使用新的分区大小。

- 如果文件系统是 ext4使用 `resize2fs`,`sudo resize2fs /dev/vda1`


- 如果文件系统是 XFS，`xfs_growfs`,`sudo xfs_growfs /dev/vda1`


#### 步骤 3: 验证

使用 `df -h` 或 `lsblk` 来验证 `/dev/vda1` 分区的大小已经按预期扩展。

### 支持重装的系统

- Ubuntu 18.04/16.04
- Debian 9/10
- CentOS 6
- CentOS 7 （DD方式）(密码Pwd@CentOS)
- 自定义DD镜像

```bash
# Windows 7 32位中文（Windows Thin PC）:
https://image.moeclub.org/GoogleDrive/1srhylymTjYS-Ky8uLw4R6LCWfAo1F3s7
https://moeclub.org/onedrive/IMAGE/Windows/win7emb_x86.tar.gz
 
# Windows 8.1 SP1 64位中文（Embedded）:
https://image.moeclub.org/GoogleDrive/1cqVl2wSGx92UTdhOxU9pW3wJgmvZMT_J
https://moeclub.org/onedrive/IMAGE/Windows/win8.1emb_x64.tar.gz
 
# Windows 10 ltsc 64位中文:
https://image.moeclub.org/GoogleDrive/1OVA3t-ZI2arkM4E4gKvofcBN9aoVdneh
https://moeclub.org/onedrive/IMAGE/Windows/win10ltsc_x64.tar.gz
默认用户名：Administrator
 
默认密码：Vicer
```

### 特性 / 优化

- 自动获取IP地址、网关、子网掩码
- 自动判断网络环境，选择国内/外镜像，解决速度慢的问题
- 懒人一键化，无需复杂的命令
- 解决萌咖脚本中一些导致安装错误的问题
- CentOS 7 镜像抛弃LVM，回归ext4，减少不稳定因素

### 注意

- 重装后系统密码均在脚本中有提供，**安装后请尽快修改密码**，**默认密码安装时脚本提供，注意留意。**，Linux系统建议启用密钥登陆。
- OpenVZ / LXC 架构系统不适用
