---
title: Free Cloud Database Collection
icon: iconoir:db
---

## Free Cloud Database Collection

Below is a summary of currently available free-tier cloud database services, suitable for personal development, testing, and small projects.

| No. | Service Name   | Official Website Link               | Database Type                           | Free Tier Details                                             | Notes                                                        |
| --- | -------------- | ----------------------------------- | --------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------ |
| 1   | CockroachLabs  | https://www.cockroachlabs.com/      | PostgreSQL                              | $15 free credit per month (equivalent to 50M Request Units + 10 GiB storage) | Requires a credit card; the first month may have a higher quota (e.g., $400); charges apply for overages |
| 2   | Neon           | https://neon.com/                   | PostgreSQL                              | 500 MB storage                                                | Projects that are inactive for a long time will be automatically paused (hibernated) and resume after waking |
| 3   | MongoDB Atlas  | https://cloud.mongodb.com/          | MongoDB                                 | 512 MB storage (M0 tier)                                      | Free forever; shared cluster; supports connecting from tools such as DBeaver |
| 4   | Supabase       | https://supabase.com/               | PostgreSQL                              | 500 MB storage (per project); you can create multiple projects | Feature-rich dashboard (Auth, Storage, Edge Functions, etc.); widely recommended by the community |
| 5   | Aiven          | https://aiven.io/                   | PostgreSQL / MySQL / Valkey (Redis-compatible) | PostgreSQL & MySQL: 1 CPU / 1 GB RAM / 5 GB storage; Valkey: 1 CPU / 1 GB RAM | Each of the three databases has an independent free plan; you can enable them simultaneously |
| 6   | TiDB Cloud     | https://www.pingcap.com/tidb-cloud/ | MySQL-compatible (distributed)          | 25 GB row storage + 25 GB columnar storage + 250M Request Units (RU) per month | Pay-as-you-go model; supports setting a spending cap; can scale down to zero |
| 7   | SQLPub         | https://sqlpub.com/                 | MySQL                                   | 500 MB storage, 36,000 requests/hour, 30 concurrent connections | Simple and lightweight; suitable for small APIs or testing |