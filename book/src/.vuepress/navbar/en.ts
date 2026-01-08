import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
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
]);
