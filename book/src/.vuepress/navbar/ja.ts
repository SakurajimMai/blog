import { navbar } from "vuepress-theme-hope";

export const jaNavbar = navbar([
  "/ja/database/",
  "/ja/demo/",
  {
    text: "ブログ",
    icon: "pen-to-square",
    prefix: "/ja/blog/",
    children: [
      { text: "全文", icon: "list", link: "" },
      { text: "カテゴリー", icon: "folder", link: "/ja/category/" },
      { text: "タグ", icon: "tag", link: "/ja/tag/" },
      { text: "タイムライン", icon: "clock", link: "/ja/timeline/" },
    ],
  },
  {
    text: "ガイド",
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
  {
    text: 'その他',
    icon: 'icon-park-outline:more-three',
    children: [
      { text: 'よくある質問', link: '/ja/faq/', icon: 'wpf:faq' },
      { text: '総合ツール', link: '/ja/tools/', icon: 'jam:tools' },
      { text: '友達', link: '/ja/friends', icon: 'carbon:friendship' },
      {
        text: 'Vuepress',
        icon: 'logos:vue',
        children: [
          { text: '公式ドキュメント', link: 'https://v2.vuepress.vuejs.org', icon: 'logos:vue' },
          { text: '生態系', link: 'https://ecosystem.vuejs.press/', icon: 'logos:vue' },
        ],
      },
    ],
  },
]);
