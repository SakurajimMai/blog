---
title: One-Click DD System Network Reinstallation
tags:
  - Linux
cover: https://s2.ixacg.com/2025/04/10/1744271725.avif
createTime: 2026/01/06 11:47:22
permalink: /en/blog/arz5jvx4/
excerpt: AutoReinstall Script
---

## AutoReinstall Script

```bash
wget --no-check-certificate -O AutoReinstall.sh https://git.io/AutoReinstall.sh && bash AutoReinstall.sh
 
# Version for Mainland China
bash <(wget --no-check-certificate -qO- https://cdn.jsdelivr.net/gh/hiCasper/Shell@master/AutoReinstall.sh)
```

<!-- more -->

### Disk Expansion After Reinstallation

Using Partitioning Tools: Use the `fdisk` or `parted` tools to delete and recreate the `/dev/vda1` partition to utilize the entire disk space. For disks using the DOS partition table, here is an example procedure using `fdisk`:

- Run `sudo fdisk /dev/vda` to start the `fdisk` tool.
- Type `p` to display the current partition table and confirm the partition number for `/dev/vda1`.
- Type `d` to delete a partition, then select the `/dev/vda1` partition.
- Type `n` to create a new partition, select primary partition, partition number 1, then use the default starting sector, and finally select the default ending sector to use all remaining space.
- Type `t` to change the partition type, then select `83` (Linux).
- Type `a` to make the partition bootable, if `/dev/vda1` is the boot partition.
- Type `w` to write the changes and exit `fdisk`.

**Important**: These operations will delete all data on the `/dev/vda1` partition. Please ensure you have backed up your data.

Based on the disk information you provided, `/dev/vda` has a total size of approximately 42.9 GB, but the `/dev/vda1` partition only occupies about 1.5 GB of space, starting from sector 2048 and ending at sector 3145727. To extend `/dev/vda1` to use the remaining disk space, you need to perform several steps. Please note that these operations are high-risk; be sure to back up all important data before proceeding.

#### Step 1: Delete and Recreate the `/dev/vda1` Partition

1. **Backup Data**: Before making any modifications, ensure all data on `/dev/vda1` is backed up.

2. **Use Partitioning Tools**: Use the `fdisk` or `parted` tools to delete and recreate the `/dev/vda1` partition to utilize the entire disk space. For disks using the DOS partition table, here is an example procedure using `fdisk`:

   - Run `sudo fdisk /dev/vda` to start the `fdisk` tool.
   - Type `p` to display the current partition table and confirm the partition number for `/dev/vda1`.
   - Type `d` to delete a partition, then select the `/dev/vda1` partition.
   - Type `n` to create a new partition, select primary partition, partition number 1, then use the default starting sector, and finally select the default ending sector to use all remaining space.
   - Type `t` to change the partition type, then select `83` (Linux).
   - Type `a` to make the partition bootable, if `/dev/vda1` is the boot partition.
   - Type `w` to write the changes and exit `fdisk`.

   **Important**: These operations will delete all data on the `/dev/vda1` partition. Please ensure you have backed up your data.

#### Step 2: Extend the Filesystem

After recreating the partition and restarting the system (if necessary), you need to extend the filesystem to use the new partition size.

- If the filesystem is ext4, use `resize2fs`: `sudo resize2fs /dev/vda1`

- If the filesystem is XFS, use `xfs_growfs`: `sudo xfs_growfs /dev/vda1`

#### Step 3: Verification

Use `df -h` or `lsblk` to verify that the `/dev/vda1` partition size has been extended as expected.

### Supported Systems for Reinstallation

- Ubuntu 18.04/16.04
- Debian 9/10
- CentOS 6
- CentOS 7 (via DD method) (Password: Pwd@CentOS)
- Custom DD Images

```bash
# Windows 7 32-bit Chinese (Windows Thin PC):
https://image.moeclub.org/GoogleDrive/1srhylymTjYS-Ky8uLw4R6LCWfAo1F3s7
https://moeclub.org/onedrive/IMAGE/Windows/win7emb_x86.tar.gz
 
# Windows 8.1 SP1 64-bit Chinese (Embedded):
https://image.moeclub.org/GoogleDrive/1cqVl2wSGx92UTdhOxU9pW3wJgmvZMT_J
https://moeclub.org/onedrive/IMAGE/Windows/win8.1emb_x64.tar.gz
 
# Windows 10 ltsc 64-bit Chinese:
https://image.moeclub.org/GoogleDrive/1OVA3t-ZI2arkM4E4gKvofcBN9aoVdneh
https://moeclub.org/onedrive/IMAGE/Windows/win10ltsc_x64.tar.gz
Default Username: Administrator
 
Default Password: Vicer
```

### Features / Optimizations

- Automatically obtains IP address, gateway, subnet mask
- Automatically detects network environment, selects domestic/foreign mirrors to resolve slow speeds
- One-click operation for ease of use, no complex commands required
- Fixes some issues in the MoeClub script that cause installation errors
- CentOS 7 image abandons LVM, reverts to ext4, reducing instability factors

### Notes

- System passwords after reinstallation are provided in the script. **Please change the password as soon as possible after installation.** **The default password is provided by the script during installation; please pay attention.** For Linux systems, enabling key-based login is recommended.
- Not applicable for OpenVZ / LXC architecture systems.