import { sidebar } from "vuepress-theme-hope";

export const jaSidebar = sidebar({
  "/ja/blog/": false,
  "/ja/": [
    "",
    "portfolio",
    {
      text: "案例",
      icon: "laptop-code",
      prefix: "demo/",
      link: "demo/",
      children: "structure",
    },
    {
      text: "文档",
      icon: "book",
      prefix: "guide/",
      children: "structure",
    },
    {
      text: "幻灯片",
      icon: "person-chalkboard",
      link: "https://ecosystem.vuejs.press/ja/plugins/markdown/revealjs/demo.html",
    },
  ],
});
