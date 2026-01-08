import { hopeTheme } from "vuepress-theme-hope";

import { enNavbar, zhNavbar, jaNavbar } from "./navbar/index.js";
import { enSidebar, zhSidebar, jaSidebar } from "./sidebar/index.js";

export default hopeTheme({
  hostname: "https://www.ixacg.com",

  author: {
    name: "Sakurajiamai",
    url: "https://www.ixacg.com",
  },

  logo: "/logo.png",
  favicon: "/favicon.ico",

  repo: "SakurajimMai",
  license: "CC-BY-NC-SA-4.0",
  docsRepo: "SakurajimMai/blog",
  docsBranch: "main",
  docsDir: "book",

  // 禁用编辑链接
  editLink: false,
  changelog: true,

  locales: {
    "/": {
      // navbar
      navbar: enNavbar,

      // sidebar
      sidebar: enSidebar,

      footer: "MIT Licensed | Copyright © 2025 Sakurajiamai",

      displayFooter: true,
      blog: {
        avatar: "/avatar.png",
        name: "Sakurajiamai",
        description: "Flowers may bloom again, but youth never returns.",
        intro: "/intro.html",
      },
      metaLocales: {
        editLink: "Edit this page on GitHub",
      },
    },

    /**
     * Chinese locale config
     */
    "/zh/": {
      // navbar
      navbar: zhNavbar,

      // sidebar
      sidebar: zhSidebar,

      footer: "MIT Licensed | Copyright © 2025 Sakurajiamai",

      displayFooter: true,
      blog: {
        avatar: "/avatar.png",
        name: "Sakurajiamai",
        description: "花有重开日，人无再少年",
        intro: "/zh/intro.html",
      },

      // page meta
      metaLocales: {
        editLink: "在 GitHub 上编辑此页",
      },
    },
    /**
     * Japanese locale config
     */
    "/ja/": {
      // navbar
      navbar: jaNavbar,

      // sidebar
      sidebar: jaSidebar,

      footer: "MIT Licensed | Copyright © 2025 Sakurajiamai",

      displayFooter: true,
      blog: {
        avatar: "/avatar.png",
        name: "Sakurajiamai",
        description: "桜の花の落ちるスピード、秒速5センチメートル",
        intro: "/ja/intro.html",
      },

      // page meta
      metaLocales: {
        editLink: "GitHub でこのページを編集",
      },
    },
  },

  encrypt: {
    config: {
      "/demo/encrypt.html": {
        hint: "Password: 1234",
        password: "1234",
      },
      "/zh/demo/encrypt.html": {
        hint: "Password: 1234",
        password: "1234",
      },
    },
  },

  // These features are enabled for demo, only preserve features you need here
  markdown: {
    alert: true,
    hint: true,
    align: true,
    attrs: true,
    codeTabs: true,
    component: true,
    demo: true,
    figure: true,
    gfm: true,
    imgLazyload: true,
    imgSize: true,
    include: true,
    imgMark: true,
    mark: true,
    plantuml: true,
    spoiler: true,
    stylize: [
      {
        matcher: "Recommended",
        replacer: ({ tag }) => {
          if (tag === "em")
            return {
              tag: "Badge",
              attrs: { type: "tip" },
              content: "Recommended",
            };
        },
      },
    ],
    sub: true,
    sup: true,
    tabs: true,
    tasklist: true,
    vPre: true,
    highlighter: {
      type: "shiki", // or "prismjs"
      collapsedLines: 20,

    },

    // uncomment these if you need TeX support
    math: {
      // install katex before enabling it
      type: "katex",
    //   // or install @mathjax/src before enabling it
    //   type: "mathjax",
    },

    // install chart.js before enabling it
    // chartjs: true,

    // install echarts before enabling it
    // echarts: true,

    // install flowchart.ts before enabling it
    // flowchart: true,

    // install mermaid before enabling it
    // mermaid: true,

    // playground: {
    //   presets: ["ts", "vue"],
    // },

    // install @vue/repl before enabling it
    // vuePlayground: true,

    // install sandpack-vue3 before enabling it
    // sandpack: true,

    // install @vuepress/plugin-revealjs and uncomment these if you need slides
    // revealjs: {
    //   plugins: ["highlight", "math", "search", "notes", "zoom"],
    // },
  },

  plugins: {
    // Note: This is for testing ONLY!
    // You MUST generate and use your own comment service in production.
    search: true,
    comment: {
      provider: "Waline",
      serverURL: "https://pl.ixacg.com", // your server url
      reaction: [
        'https://unpkg.com/@waline/emojis@1.4.0/tieba/tieba_agree.png',
        'https://unpkg.com/@waline/emojis@1.1.0/weibo/weibo_heart_eyes.png',
        'https://unpkg.com/@waline/emojis@1.1.0/weibo/weibo_dog_joy.png',
        'https://unpkg.com/@waline/emojis@1.1.0/weibo/weibo_dog_consider.png',
        'https://unpkg.com/@waline/emojis@1.1.0/weibo/weibo_sob.png',
      ],
    },
    // comment: {
    //   provider: "Giscus",
    //   repo: "vuepress-theme-hope/giscus-discussions",
    //   repoId: "R_kgDOG_Pt2A",
    //   category: "Announcements",
    //   categoryId: "DIC_kwDOG_Pt2M4COD69",
    // },
    blog: {
      // 博客文章路径
      filter: ({ filePathRelative }) =>
        filePathRelative ? filePathRelative.startsWith("blog/") || filePathRelative.startsWith("zh/blog/") || filePathRelative.startsWith("ja/blog/") || filePathRelative.startsWith("zh/blog/") : false,
      // 摘要长度
      excerptLength: 200,
    },
    components: {
      components: [
        "ArtPlayer",
        "Badge",
        "BiliBili",
        "CodePen",
        "PDF",
        "Share",
        "SiteInfo",
        "StackBlitz",
        "VPBanner",
        "VPCard",
        "VidStack",
      ],
    },

    icon: {
      prefix: "fa6-solid:",
    },
    feed: {
      atom: true,
      rss: true,
      json: true, 
      //⭐ 多语言输出配置
      locales: {
        "/": {
          // 英文版输出文件名
          rssOutputFilename: "rss.xml",
          atomOutputFilename: "atom.xml",
          jsonOutputFilename: "feed.json",
        },
        "/zh/": {
          // 中文版输出文件名
          // 注意：插件会自动拼接 locale 路径，所以这里只需写文件名
          // 最终生成路径会是：/zh/rss.xml
          rssOutputFilename: "rss.xml",
          atomOutputFilename: "atom.xml",
          jsonOutputFilename: "feed.json",
        },
       "/ja/": {
          // 日文版输出文件名
          // 注意：插件会自动拼接 locale 路径，所以这里只需写文件名
          // 最终生成路径会是：/ja/rss.xml
          rssOutputFilename: "rss.xml",
          atomOutputFilename: "atom.xml",
          jsonOutputFilename: "feed.json",
        },
      },
    },
    watermark: {
      watermarkOptions: {
        content: "sakurajiamai",
        //移动
        movable: false, 
        // 其他选项
      },
    },

    // notice: [
    //   {
    //     path: "/",
    //     title: "Notice Title",
    //     content: "Notice Content",
    //     actions: [
    //       {
    //         text: "Primary Action",
    //         link: "https://theme-hope.vuejs.press/",
    //         type: "primary",
    //       },
    //       { text: "Default Action" },
    //     ],
    //   },
    //   {
    //     path: "/zh/",
    //     title: "Notice Title",
    //     content: "Notice Content",
    //     actions: [
    //       {
    //         text: "Primary Action",
    //         link: "https://theme-hope.vuejs.press/",
    //         type: "primary",
    //       },
    //       { text: "Default Action" },
    //     ],
    //   },
    // ],

    // Install @vuepress/plugin-pwa and uncomment these if you want a PWA
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cacheImage: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});
