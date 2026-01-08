import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/zh/",
  "/zh/portfolio",
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
]);
