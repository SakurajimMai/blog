import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  "/database/",
  "/demo/",
  {
    text: "Blog",
    icon: "pen-to-square",
    prefix: "/blog/",
    children: [
      { text: "All Posts", icon: "list", link: "" },
      { text: "Category", icon: "folder", link: "/category/" },
      { text: "Tag", icon: "tag", link: "/tag/" },
      { text: "Timeline", icon: "clock", link: "/timeline/" },
    ],
  },
  {
    text: "Guide",
    icon: "lightbulb",
    prefix: "/guide/",
    children: [
      {
        text: "Bar",
        icon: "lightbulb",
        prefix: "bar/",
        children: ["baz", { text: "...", icon: "ellipsis", link: "#" }],
      },
      {
        text: "Foo",
        icon: "lightbulb",
        prefix: "foo/",
        children: ["ray", { text: "...", icon: "ellipsis", link: "#" }],
      },
    ],
  },
  {
    text: 'More',
    icon: 'icon-park-outline:more-three',
    children: [
      { text: 'FAQ', link: '/zh/faq/', icon: 'wpf:faq' },
      { text: 'Tools', link: '/zh/tools/', icon: 'jam:tools' },
      { text: 'Friends', link: '/zh/friends', icon: 'carbon:friendship' },
      {
        text: 'Vuepress',
        icon: 'logos:vue',
        children: [
          { text: 'Official Document', link: 'https://v2.vuepress.vuejs.org', icon: 'logos:vue' },
          { text: 'Ecosystem', link: 'https://ecosystem.vuejs.press/', icon: 'logos:vue' },
        ],
      },
    ],
  },
]);
