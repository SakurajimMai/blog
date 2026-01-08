---
title: 你好世界
icon: pen-to-square
date: 2025-12-30
category:
  - 教程
tag:
  - 介绍
  - 你好
article: true
star: true
isOriginal: true
---

# 你好世界

这是我的第一篇博客文章！

<!-- more -->

## 简介

欢迎来到我的博客。这是一篇示例文章，用于演示博客功能。

## 功能特性

- Markdown 支持
- 分类和标签
- 时间线视图
- RSS 订阅

## 结语

敬请期待更多内容！

::: tip 手动创建的项目也可参考此结构进行组织
:::

## 文档源目录

**文档源目录**包含站点的所有 Markdown 源文件。在使用命令行工具启动 VuePress 时需指定此目录：

```sh
# [!code word:docs]
vuepress dev docs
#            ↑ 文档源目录
```

::: file-tree
* docs
  * typescript
    * basic.md
    * types.md
  * rust
    * tuple.md
    * struct.md
  * README.md
:::