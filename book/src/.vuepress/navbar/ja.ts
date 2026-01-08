import { navbar } from "vuepress-theme-hope";

export const jaNavbar = navbar([
  "/ja/demo/",
  {
    text: "ブログ",
    icon: "pen-to-square",
    prefix: "/ja/blog/",
    children: [
      { text: "全部文章", icon: "list", link: "" },
      { text: "分类", icon: "folder", link: "/ja/category/" },
      { text: "标签", icon: "tag", link: "/ja/tag/" },
      { text: "时间线", icon: "clock", link: "/ja/timeline/" },
    ],
  },
  {
    text: "指南",
    icon: "lightbulb",
    prefix: "/ja/guide/",
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
