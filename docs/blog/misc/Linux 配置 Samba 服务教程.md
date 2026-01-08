---
title: Linux 配置 Samba 服务教程
tags:
  - Linux
  - Samba
createTime: 2026/01/06 11:47:22
permalink: /blog/clwpd6fo/
---



## 安装samba

```
apt update
apt install samba
```

## 配置 Samba

Samba 的配置文件通常位于 `/etc/samba/smb.conf`​。你可以使用文本编辑器（如 `nano`​ 或 `vim`​）来编辑这个文件。添加共享文件。

<!-- more -->

修改前记得备份文件

```
cp /etc/samba/smb.conf /etc/samba/smb.conf.bak
```

```
[shared]
   comment = Shared Folder
   path = /home/user/shared
   valid users = user
   read only = no
   browsable = yes
   create mask = 0777
   directory mask = 0777
```

* `comment`: 共享目录的描述。
* `path`: 共享目录的路径。
* `valid users`: 允许访问该共享目录的用户。
* `read only`: 设置为 `no`​ 表示允许写入。
* `browsable`: 设置为 `yes`​ 表示该共享目录在网络中可见。
* `create mask`​ 和 `directory mask`: 设置文件和目录的权限。

## 创建 Samba 用户

Samba 使用自己的用户数据库进行身份验证。你需要为 Samba 创建一个用户，并设置密码。

```

adduser user

sudo smbpasswd -a user
```

系统会提示你输入并确认密码。

## 启动并启用 Samba 服务

在配置完成后，你需要启动 Samba 服务，并设置它在系统启动时自动启动。

### 在 Debian/Ubuntu 上：

```
sudo systemctl start smbd
sudo systemctl enable smbd
sudo systemctl start nmbd
sudo systemctl enable nmbd
```

### 在 CentOS/RHEL 上：

```
sudo systemctl start smb
sudo systemctl enable smb
sudo systemctl start nmb
sudo systemctl enable nmb
```

## 防火墙配置

如果你的系统启用了防火墙（如 `ufw`​ 或 `firewalld`​），你需要允许 Samba 服务通过防火墙。

#### 在 Debian/Ubuntu 上（使用 `ufw`​）：

```
sudo ufw allow samba
```

#### 在 CentOS/RHEL 上（使用 `firewalld`​）：

```
sudo firewall-cmd --permanent --add-service=samba
sudo firewall-cmd --reload
```

## 测试 Samba 配置

你可以使用 `testparm`​ 命令来检查 Samba 配置文件是否有语法错误。

```
testparm
```

如果没有错误，Samba 服务应该已经成功配置并运行。

## 访问共享目录

在 Windows 上，你可以通过在文件资源管理器中输入 `\\<服务器IP地址>`​ 来访问 Samba 共享目录。在 Linux 上，你可以使用 `smbclient`​ 或 `mount`​ 命令来访问共享目录。

```
# 使用smbclient
apt install smbclient
smbclient //<服务器IP地址>/shared -U user
# 列出共享目录
smbclient -L //<服务器IP地址> -U user
# 下载文件
smbclient //<服务器IP地址>/shared -U user -c 'get <远程文件> <本地文件>'
# 上传文件
smbclient //<服务器IP地址>/shared -U user -c 'put <本地文件> <远程文件>'

# 使用mount
sudo mount -t cifs //<服务器IP地址>/shared /mnt/shared -o username=user,password=yourpassword
```

如果你遇到任何问题，可以查看 Samba 的日志文件（通常位于 `/var/log/samba/`​）以获取更多信息。

‍
