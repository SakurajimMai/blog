---
title: 日常メンテナンス
date: 2026-1-9 15:52:07
---

## セッションがロックされた場合の対処

### ステップ1：誰が他者をブロックしているか（Root Blocker）を特定する

データベースで以下の SQL を実行してください。このコードはロックのチェーンを表示し、犯人を直接特定するのに役立ちます。

```sql
SELECT 
    -- 待機者（ブロックされている側）の情報
    w.sid || ',' || w.serial# AS waiting_session,
    w.username AS waiting_user,
    w.seconds_in_wait AS wait_seconds,
    w.event AS waiting_event,
    -- ブロッカー（起点）の情報
    '--> BLOCKED BY -->' AS flow,
    b.sid || ',' || b.serial# AS blocking_session,
    b.username AS blocking_user,
    b.status AS blocking_status,
    b.osuser AS blocking_os_user,
    b.machine AS blocking_machine,
    -- ブロッカーが現在実行中、または最後に実行したSQL
    nvl(b.sql_id, b.prev_sql_id) as blocking_sql_id
FROM 
    v$session w
JOIN 
    v$session b ON w.blocking_session = b.sid
WHERE 
    w.seconds_in_wait > 600 -- 600秒を超えて待機しているセッションを抽出
ORDER BY 
    w.seconds_in_wait DESC;
```

### ステップ2：結果の分析と対処

上記の SQL を実行したら、右側の **Blocking Session**（ブロッカー）列を重点的に確認してください。

#### ケース A：ブロッカーの状態が `INACTIVE`

- **現象**：`blocking_status` が `INACTIVE`。

- **原因**：これは多くの場合、**人的事故**または**プログラムのバグ**です。ユーザーがアプリケーション（例：PL/SQL Developer、DBeaver、または Java アプリ）で `UPDATE/INSERT/DELETE` を実行したものの、**コミット（COMMIT）を押し忘れ**て別の作業をしてしまった、あるいはプログラムが異常終了したが接続は切れていない、といった状況です。

- **対処**：

  1. 連絡できるなら、すぐに `COMMIT` または `ROLLBACK` してもらう。

  2. 連絡できない場合は、そのセッションを直接 kill してロックを解放する：

     ```sql
     -- sid と serial# を、取得した blocking_session の値に置き換える
     ALTER SYSTEM KILL SESSION 'sid,serial#' IMMEDIATE;
     ```

#### ケース B：ブロッカーの状態が `ACTIVE`

- **現象**：`blocking_status` が `ACTIVE`。

- **原因**：そのセッションが非常に長時間かかる SQL（大規模な一括更新、またはインデックスのない全表更新など）を実行中で、まだ完了していないため、ロックが解放されていません。

- **対処**：

  1. 実行中の SQL を確認する：

     ```sql
     SELECT sql_text FROM v$sqlarea WHERE sql_id = '取得したblocking_sql_id';
     ```

  2. SQL が正常に実行中で、業務上問題がなければ待つしかありません。

  3. SQL が深刻な本番障害を引き起こしている場合は、まずセッションを kill して止血する：

     ```sql
     ALTER SYSTEM KILL SESSION 'sid,serial#' IMMEDIATE;
     ```