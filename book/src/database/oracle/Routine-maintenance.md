---
title: Routine Maintenance
date: 2026-1-9 15:52:07
---

## Handling Locked Sessions

### Step 1:Find Who Is Blocking Others (Root Blocker)

Please execute the following SQL in the database. This code will display the lock chain and help you directly identify the culprit.

```sql
SELECT 
    -- Waiter (blocked) information
    w.sid || ',' || w.serial# AS waiting_session,
    w.username AS waiting_user,
    w.seconds_in_wait AS wait_seconds,
    w.event AS waiting_event,
    -- Blocker (source) information
    '--> BLOCKED BY -->' AS flow,
    b.sid || ',' || b.serial# AS blocking_session,
    b.username AS blocking_user,
    b.status AS blocking_status,
    b.osuser AS blocking_os_user,
    b.machine AS blocking_machine,
    -- The SQL the blocker is currently executing or last executed
    nvl(b.sql_id, b.prev_sql_id) as blocking_sql_id
FROM 
    v$session w
JOIN 
    v$session b ON w.blocking_session = b.sid
WHERE 
    w.seconds_in_wait > 600 -- Filter sessions waiting more than 600 seconds
ORDER BY 
    w.seconds_in_wait DESC;
```

### Step 2: Analyze Results and Take Action

After running the SQL above, focus on the **Blocking Session** (blocker) column on the right.

#### Case A: Blocker status is `INACTIVE`

- **Symptom**: `blocking_status` is `INACTIVE`.

- **Cause**: This is usually a **human error** or an **application bug**. A user executed an `UPDATE/INSERT/DELETE` in an application (such as PL/SQL Developer, DBeaver, or a Java application) but **forgot to click commit (COMMIT)**, and then went on to do something else; or the program crashed/terminated abnormally but the connection remained open.

- **Resolution**:

  1. If you can reach the person, have them `COMMIT` or `ROLLBACK` immediately.

  2. If you can’t reach them, kill the session directly to release the lock:

     ```sql
     -- Replace sid and serial# with the blocking_session values returned by the query
     ALTER SYSTEM KILL SESSION 'sid,serial#' IMMEDIATE;
     ```

#### Case B: Blocker status is `ACTIVE`

- **Symptom**: `blocking_status` is `ACTIVE`.

- **Cause**: The session is executing a very long-running SQL (possibly a large batch update, or a full-table update without an index). It hasn’t finished yet, so the lock hasn’t been released.

- **Resolution**:

  1. Check what SQL it is running:

     ```sql
     SELECT sql_text FROM v$sqlarea WHERE sql_id = 'the blocking_sql_id you found';
     ```

  2. If the SQL is still running normally and the business can tolerate it, you can only wait.

  3. If the SQL has caused a severe production outage, you must kill the session first to stop the bleeding:

     ```sql
     ALTER SYSTEM KILL SESSION 'sid,serial#' IMMEDIATE;
     ```