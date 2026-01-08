import { defineClientConfig } from "vuepress/client";
import { defineWalineConfig } from "@vuepress/plugin-comment/client";
import { h } from "vue";
// 禁用 Waline 图片上传功能
defineWalineConfig({
  serverURL: "https://pl.ixacg.com",
  imageUploader: false,
});

export default defineClientConfig({
  // 客户端配置在此添加
});