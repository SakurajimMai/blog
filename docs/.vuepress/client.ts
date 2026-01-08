import { defineClientConfig } from 'vuepress/client'
import { defineWalineConfig } from '@vuepress/plugin-comment/client'
import AsideNav from './theme/components/AsideNav.vue'
import { Layout } from 'vuepress-theme-plume/client'
import { h } from 'vue'
import PageContextMenu from 'vuepress-theme-plume/features/PageContextMenu.vue'

// 禁用 Waline 图片上传功能
defineWalineConfig({
  serverURL: 'https://pl.ixacg.com',
  imageUploader: false,
})
// import RepoCard from 'vuepress-theme-plume/features/RepoCard.vue'
// import NpmBadge from 'vuepress-theme-plume/features/NpmBadge.vue'
// import NpmBadgeGroup from 'vuepress-theme-plume/features/NpmBadgeGroup.vue'
// import Swiper from 'vuepress-theme-plume/features/Swiper.vue'

// import CustomComponent from './theme/components/Custom.vue'

// import './theme/styles/custom.css'

export default defineClientConfig({
  enhance({ app }) {
    // built-in components
    // app.component('RepoCard', RepoCard)
    // app.component('NpmBadge', NpmBadge)
    // app.component('NpmBadgeGroup', NpmBadgeGroup)
    // app.component('Swiper', Swiper) // you should install `swiper`

    // your custom components
    // app.component('CustomComponent', CustomComponent)
  },
  layouts: {
    Layout: () => h(Layout, null, {
      'aside-outline-after': () => h(AsideNav),
      'doc-title-after': () => h(PageContextMenu),
    }),
  },
})
