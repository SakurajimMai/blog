---
title: 日常维护
date: 2026-1-9 15:52:07
---

## 会话被锁处理

### 第一步：找出谁在阻塞别人（Root Blocker）

请在数据库中执行以下 SQL。这段代码会展示锁的链条，帮你直接找到罪魁祸首。

```sql
SELECT 
    -- 等待者（被阻塞的）信息
    w.sid || ',' || w.serial# AS waiting_session,
    w.username AS waiting_user,
    w.seconds_in_wait AS wait_seconds,
    w.event AS waiting_event,
    -- 阻塞者（源头）信息
    '--> BLOCKED BY -->' AS flow,
    b.sid || ',' || b.serial# AS blocking_session,
    b.username AS blocking_user,
    b.status AS blocking_status,
    b.osuser AS blocking_os_user,
    b.machine AS blocking_machine,
    -- 阻塞者当前正在执行或最后执行的SQL
    nvl(b.sql_id, b.prev_sql_id) as blocking_sql_id
FROM 
    v$session w
JOIN 
    v$session b ON w.blocking_session = b.sid
WHERE 
    w.seconds_in_wait > 600 -- 过滤出等待超过600秒的会话
ORDER BY 
    w.seconds_in_wait DESC;
```

### 第二步：分析结果与处理

执行上面 SQL 后，重点看右边的 **Blocking Session**（阻塞者）列。

#### 情况 A：阻塞者状态是 `INACTIVE`

- **现象**：`blocking_status` 为 `INACTIVE`。

- **原因**：这通常是**人为事故**或**程序Bug**。用户在应用程序（如 PL/SQL Developer, DBeaver 或 Java应用）中执行了 `UPDATE/INSERT/DELETE`，但是**忘记点击提交（COMMIT）**，然后就去干别的事了，或者程序异常中断但连接没断。

- **解决**：

  1. 如果能联系到人，让他赶紧 `COMMIT` 或 `ROLLBACK`。

  2. 如果联系不到，直接杀掉该会话释放锁：

     ```sql
     -- 替换 sid 和 serial# 为查询出的 blocking_session 值
     ALTER SYSTEM KILL SESSION 'sid,serial#' IMMEDIATE;
     ```

#### 情况 B：阻塞者状态是 `ACTIVE`

- **现象**：`blocking_status` 为 `ACTIVE`。

- **原因**：该会话正在执行一个运行时间非常长的 SQL（可能是大批量更新，或者没有索引的全表更新），还没执行完，所以锁一直没释放。

- **解决**：

  1. 查看它在跑什么 SQL：

     ```sql
     SELECT sql_text FROM v$sqlarea WHERE sql_id = '查到的blocking_sql_id';
     ```

  2. 如果 SQL 还在正常运行且业务允许，只能等待。

  3. 如果 SQL 导致了严重的生产瘫痪，必须先杀掉会话止血：

     ```sql
     ALTER SYSTEM KILL SESSION 'sid,serial#' IMMEDIATE;
     ```



