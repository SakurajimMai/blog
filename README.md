# my-vuepress-site

The Site is generated using [vuepress](https://vuepress.vuejs.org/) and [vuepress-theme-plume](https://github.com/pengzhanbo/vuepress-theme-plume)

## Install

```sh
pnpm i
```

## Usage

```sh
# start dev server
pnpm docs:dev
# build for production
pnpm docs:build
# preview production build in local
pnpm docs:preview
# update vuepress and theme
pnpm vp-update
```

## Documents

- [vuepress](https://vuepress.vuejs.org/)
- [vuepress-theme-plume](https://theme-plume.vuejs.press/)


项目	开发命令	构建命令
docs	pnpm docs:dev	pnpm docs:build
book	pnpm book:dev	pnpm book:build

pnpm build	构建两个项目，并将 book 产物复制到 docs/.vuepress/dist/book