---
title: 無料クラウドデータベースまとめ
icon: iconoir:db
---

## 無料クラウドデータベースまとめ

以下は、現在利用可能な無料枠（Free Tier）のクラウドデータベースサービスの一覧で、個人開発、テスト、小規模プロジェクトに適しています。

| 番号 | サービス名      | 公式サイトリンク                    | データベース種別                         | 無料枠の詳細                                                   | 備考                                                         |
| ---- | ------------- | ----------------------------------- | --------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 1    | CockroachLabs | https://www.cockroachlabs.com/      | PostgreSQL                              | 月あたり $15 の無料クレジット（50M Request Units + 10 GiB ストレージ相当） | クレジットカードの登録が必要。初月はより高い枠（例：$400）の場合があり、超過分は課金 |
| 2    | Neon          | https://neon.com/                   | PostgreSQL                              | 500 MB ストレージ                                             | プロジェクトが長期間非アクティブだと自動停止（休眠）し、起動後に復帰 |
| 3    | MongoDB Atlas | https://cloud.mongodb.com/          | MongoDB                                 | 512 MB ストレージ（M0 層）                                    | 永久無料。共有クラスター。DBeaver などのツールから接続可能     |
| 4    | Supabase      | https://supabase.com/               | PostgreSQL                              | 500 MB ストレージ（プロジェクトごと）、複数プロジェクト作成可 | ダッシュボード機能が充実（Auth、Storage、Edge Functions など）。コミュニティおすすめの第一候補 |
| 5    | Aiven         | https://aiven.io/                   | PostgreSQL / MySQL / Valkey（Redis互換） | PostgreSQL & MySQL：1 CPU / 1 GB RAM / 5 GB ストレージ Valkey：1 CPU / 1 GB RAM | 3 種類のデータベースそれぞれに独立した無料プランがあり、同時に有効化可能 |
| 6    | TiDB Cloud    | https://www.pingcap.com/tidb-cloud/ | MySQL 互換（分散型）                    | 月あたり 25 GB 行ストレージ + 25 GB 列ストレージ + 250M Request Units（RU） | Pay-as-you-go 方式。利用上限の設定に対応。ゼロまでスケール可能 |
| 7    | SQLPub        | https://sqlpub.com/                 | MySQL                                   | 500 MB ストレージ、毎時 36,000 リクエスト、同時接続 30        | シンプルで軽量。小規模 API やテストに適する                                |