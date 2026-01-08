# Keep Learning

[中文](./README_CN.md) | 日本語 | [English](./README.md)

> _時間に引き伸ばされた低次元の生き物として、浅はかな幸せを享受することはできず、宇宙への沈思の中でこれを戯れとし、死ぬまで続ける_

**VuePress** で構築された個人技術ブログ＆ドキュメントサイト。

## ✨ 特徴

- 🌐 **多言語対応** — 中国語、英語、日本語を完全サポート
- 📝 **ブログ** — ネットワーク、Linux、セルフホスティングの技術チュートリアル
- 📚 **ドキュメント** — 包括的な技術ガイドとリファレンス
- 💬 **コメント** — Waline 搭載
- 🎬 **動画プレーヤー** — Artplayer 統合
- ⚡ **高速** — VuePress による静的サイト生成

## 🛠️ 技術スタック

| コンポーネント | 技術                                                                                      |
| -------------- | ----------------------------------------------------------------------------------------- |
| ブログ         | [VuePress](https://vuepress.vuejs.org/) + [Theme Plume](https://theme-plume.vuejs.press/) |
| ドキュメント   | [VuePress](https://vuepress.vuejs.org/) + [Theme Hope](https://theme-hope.vuejs.press/)   |
| コメント       | [Waline](https://waline.js.org/)                                                          |
| ホスティング   | Cloudflare Pages                                                                          |

## 📦 インストール

```sh
pnpm install
```

## 🚀 使い方

| プロジェクト | 開発コマンド    | ビルドコマンド    |
| ------------ | --------------- | ----------------- |
| docs         | `pnpm docs:dev` | `pnpm docs:build` |
| book         | `pnpm book:dev` | `pnpm book:build` |

```sh
# ブログ開発サーバーを起動
pnpm docs:dev

# 本番用にビルド
pnpm docs:build

# ローカルで本番ビルドをプレビュー
pnpm docs:preview

# VuePress とテーマを更新
pnpm vp-update

# 両プロジェクトをビルド（ブログ + ドキュメント）
pnpm build
```

## 📁 プロジェクト構造

```
├── docs/                # ブログ (Theme Plume)
│   ├── blog/            # ブログ記事
│   ├── en/              # 英語コンテンツ
│   ├── ja/              # 日本語コンテンツ
│   └── .vuepress/       # VuePress 設定
├── book/                # ドキュメント (Theme Hope)
│   └── src/
│       ├── guide/       # ガイド
│       ├── zh/          # 中国語ドキュメント
│       └── ja/          # 日本語ドキュメント
└── package.json
```

## 📄 ライセンス

[MIT](./LICENSE)

## 👤 作者

**SakurajimMai** — [GitHub](https://github.com/SakurajimMai)
