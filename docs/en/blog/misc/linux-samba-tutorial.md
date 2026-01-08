---
title: Linux Samba Service Configuration Tutorial
tags:
  - Linux
  - Samba
createTime: 2026/01/06 11:47:22
permalink: /en/blog/clwpd6fo/
---



## Installing Samba

```
apt update
apt install samba
```

## Configuring Samba

The Samba configuration file is typically located at `/etc/samba/smb.conf`. You can use a text editor (such as `nano` or `vim`) to edit this file and add shared directories.

<!-- more -->

Remember to back up the file before making changes.

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

* `comment`: Description of the shared directory.
* `path`: Path to the shared directory.
* `valid users`: Users allowed to access this shared directory.
* `read only`: Set to `no` to allow write access.
* `browsable`: Set to `yes` to make the shared directory visible on the network.
* `create mask` and `directory mask`: Set permissions for files and directories.

## Creating a Samba User

Samba uses its own user database for authentication. You need to create a user for Samba and set a password.

```

adduser user

sudo smbpasswd -a user
```

You will be prompted to enter and confirm the password.

## Starting and Enabling the Samba Service

After configuration, you need to start the Samba service and set it to start automatically on system boot.

### On Debian/Ubuntu:

```
sudo systemctl start smbd
sudo systemctl enable smbd
sudo systemctl start nmbd
sudo systemctl enable nmbd
```

### On CentOS/RHEL:

```
sudo systemctl start smb
sudo systemctl enable smb
sudo systemctl start nmb
sudo systemctl enable nmb
```

## Firewall Configuration

If your system has a firewall enabled (such as `ufw` or `firewalld`), you need to allow the Samba service through the firewall.

#### On Debian/Ubuntu (using `ufw`):

```
sudo ufw allow samba
```

#### On CentOS/RHEL (using `firewalld`):

```
sudo firewall-cmd --permanent --add-service=samba
sudo firewall-cmd --reload
```

## Testing the Samba Configuration

You can use the `testparm` command to check for syntax errors in the Samba configuration file.

```
testparm
```

If there are no errors, the Samba service should be successfully configured and running.

## Accessing the Shared Directory

On Windows, you can access the Samba share by entering `\\<server IP address>` in File Explorer. On Linux, you can use the `smbclient` or `mount` command to access the shared directory.

```
# Using smbclient
apt install smbclient
smbclient //<server IP address>/shared -U user
# List shared directories
smbclient -L //<server IP address> -U user
# Download a file
smbclient //<server IP address>/shared -U user -c 'get <remote file> <local file>'
# Upload a file
smbclient //<server IP address>/shared -U user -c 'put <local file> <remote file>'

# Using mount
sudo mount -t cifs //<server IP address>/shared /mnt/shared -o username=user,password=yourpassword
```

If you encounter any issues, you can check the Samba log files (usually located in `/var/log/samba/`) for more information.

‍