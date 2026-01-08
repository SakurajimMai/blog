# Keep Learning

[中文](./README_CN.md) | [日本語](./README_JA.md) | English

> _As a low-dimensional being stretched by time, I cannot enjoy shallow happiness, only in contemplation of the universe, I make this my play, until death._

A personal tech blog and documentation site built with **VuePress**.

## ✨ Features

- 🌐 **Multilingual** — Full support for Chinese, English, and Japanese
- 📝 **Blog** — Technical tutorials on networking, Linux, and self-hosting
- 📚 **Documentation** — Comprehensive technical guides and references
- 💬 **Comments** — Powered by Waline
- 🎬 **Video Player** — Integrated Artplayer for media content
- ⚡ **Fast** — VuePress for blazing-fast static site generation

## 🛠️ Tech Stack

| Component | Technology                                                                                |
| --------- | ----------------------------------------------------------------------------------------- |
| Blog      | [VuePress](https://vuepress.vuejs.org/) + [Theme Plume](https://theme-plume.vuejs.press/) |
| Docs      | [VuePress](https://vuepress.vuejs.org/) + [Theme Hope](https://theme-hope.vuejs.press/)   |
| Comments  | [Waline](https://waline.js.org/)                                                          |
| Hosting   | Cloudflare Pages                                                                          |

## 📦 Installation

```sh
pnpm install
```

## 🚀 Usage

| Project | Dev Command     | Build Command     |
| ------- | --------------- | ----------------- |
| docs    | `pnpm docs:dev` | `pnpm docs:build` |
| book    | `pnpm book:dev` | `pnpm book:build` |

```sh
# Start dev server for blog
pnpm docs:dev

# Build for production
pnpm docs:build

# Preview production build locally
pnpm docs:preview

# Update VuePress and themes
pnpm vp-update

# Build both projects (blog + docs)
pnpm build
```

## 📁 Project Structure

```
├── docs/                # Blog (Theme Plume)
│   ├── blog/            # Blog posts
│   ├── en/              # English content
│   ├── ja/              # Japanese content
│   └── .vuepress/       # VuePress config
├── book/                # Documentation (Theme Hope)
│   └── src/
│       ├── guide/       # Guides
│       ├── zh/          # Chinese docs
│       └── ja/          # Japanese docs
└── package.json
```

## 📄 License

[MIT](./LICENSE)

## 👤 Author

**SakurajimMai** — [GitHub](https://github.com/SakurajimMai)
