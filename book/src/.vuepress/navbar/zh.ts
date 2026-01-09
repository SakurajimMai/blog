import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/zh/database/",
  "/zh/demo/",
  {
    text: "博客",
    icon: "pen-to-square",
    prefix: "/zh/blog/",
    children: [
      { text: "全部文章", icon: "list", link: "" },
      { text: "分类", icon: "folder", link: "/zh/category/" },
      { text: "标签", icon: "tag", link: "/zh/tag/" },
      { text: "时间线", icon: "clock", link: "/zh/timeline/" },
    ],
  },
  {
    text: "指南",
    icon: "lightbulb",
    prefix: "/zh/guide/",
    children: [
      {
        text: "Bar",
        icon: "lightbulb",
        prefix: "bar/",
        children: ["baz", { text: "...", icon: "ellipsis", link: "" }],
      },
      {
        text: "Foo",
        icon: "lightbulb",
        prefix: "foo/",
        children: ["ray", { text: "...", icon: "ellipsis", link: "" }],
      },
    ],
  },
  {
    text: '更多',
    icon: 'icon-park-outline:more-three',
    children: [
      { text: '常见问题', link: '/zh/faq/', icon: 'wpf:faq' },
      { text: '综合工具', link: '/zh/tools/', icon: 'jam:tools' },
      { text: '友情链接', link: '/zh/friends', icon: 'carbon:friendship' },
      {
        text: 'Vuepress',
        icon: 'logos:vue',
        children: [
          { text: '官方文档', link: 'https://v2.vuepress.vuejs.org', icon: 'logos:vue' },
          { text: '生态系统', link: 'https://ecosystem.vuejs.press/', icon: 'logos:vue' },
        ],
      },
    ],
  },
]);
