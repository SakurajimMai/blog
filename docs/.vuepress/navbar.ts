/**
 * @see https://theme-plume.vuejs.press/config/navigation/ 查看文档了解配置详情
 *
 * Navbar 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 */

import { defineNavbarConfig } from 'vuepress-theme-plume'

export const zhNavbar = defineNavbarConfig([
  { text: '首页', link: '/' },
  { text: '博客', link: '/blog/' },
  { text: '标签', link: '/blog/tags/' },
  { text: '归档', link: '/blog/archives/' },
  {
    text: '笔记',
    items: [{ text: '示例', link: '/demo/README.md' }]
  },
  {
    text: '更多',
    icon: 'icon-park-outline:more-three',
    items: [
      { text: '常见问题', link: '/faq/', icon: 'wpf:faq' },
      { text: '喝杯奶茶', link: '/sponsor/', icon: 'line-md:coffee-loop' },
      { text: '综合工具', link: '/tools/', icon: 'jam:tools' },
      { text: '友情链接', link: '/friends/', icon: 'carbon:friendship' },
      {
        text: 'Vuepress',
        icon: 'logos:vue',
        items: [
          { text: '官方文档', link: 'https://v2.vuepress.vuejs.org', icon: 'logos:vue' },
          { text: '生态系统', link: 'https://ecosystem.vuejs.press/', icon: 'logos:vue' },
        ],
      },
    ],
  },
])

export const enNavbar = defineNavbarConfig([
  { text: 'Home', link: '/en/' },
  { text: 'Blog', link: '/en/blog/' },
  { text: 'Tags', link: '/en/blog/tags/' },
  { text: 'Archives', link: '/en/blog/archives/' },
  {
    text: 'Notes',
    items: [{ text: 'Demo', link: '/en/demo/README.md' }]
  },
  {
    text: 'More',
    icon: 'icon-park-outline:more-three',
    items: [
      { text: 'FAQ', link: '/en/faq/', icon: 'wpf:faq' },
      { text: 'Comprehensive tools', link: '/en/tools/', icon: 'jam:tools' },
      { text: 'Friend Links', link: '/en/friends/', icon: 'carbon:friendship' },
      {
        text: 'Vuepress',
        icon: 'logos:vue',
        items: [
          { text: 'Official Docs', link: 'https://v2.vuepress.vuejs.org', icon: 'logos:vue' },
          { text: 'Ecosystem', link: 'https://ecosystem.vuejs.press/', icon: 'logos:vue' },
        ],
      },
    ],
  },
])

export const jaNavbar = defineNavbarConfig([
  { text: 'Home', link: '/ja/' },
  { text: 'Blog', link: '/ja/blog/' },
  { text: 'Tags', link: '/ja/blog/tags/' },
  { text: 'Archives', link: '/ja/blog/archives/' },
  {
    text: 'Notes',
    items: [{ text: 'Demo', link: '/ja/demo/README.md' }]
  },
  {
    text: 'More',
    icon: 'icon-park-outline:more-three',
    items: [
      { text: 'FAQ', link: '/ja/faq/', icon: 'wpf:faq' },
      { text: 'Comprehensive tools', link: '/ja/tools/', icon: 'jam:tools' },
      { text: 'Friend Links', link: '/ja/friends/', icon: 'carbon:friendship' },
      {
        text: 'Vuepress',
        icon: 'logos:vue',
        items: [
          { text: 'Official Docs', link: 'https://v2.vuepress.vuejs.org', icon: 'logos:vue' },
          { text: 'Ecosystem', link: 'https://ecosystem.vuejs.press/', icon: 'logos:vue' },
        ],
      },
    ],
  },
])

