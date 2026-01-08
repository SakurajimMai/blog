import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/book/",

  locales: {
    "/": {
      lang: "en-US",
      title: "Keep Learning",
      description: "As a low-dimensional being stretched by time, I am not blessed to enjoy shallow pleasures; instead, I can only take contemplation of the universe as my play, and will not cease until death.",
    },
    "/zh/": {
      lang: "zh-CN",
      title: "Keep Learning",
      description: "身为一条被时间拉长的低维生物，我无福消受浅薄的快乐，只能在对宇宙的沉思中，以此为戏，至死方休。",
    },
    "/ja/": {
      lang: "ja-JP",
      title: "Keep Learning",
      description: "時間によって引き伸ばされた低次元の存在である私は、浅薄な快楽を享受する幸運には恵まれず、ただ宇宙への思索の中にのみ遊びを見いだし、それを戯れとして、死に至るまで続けるのである。",
    },
  },
  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
