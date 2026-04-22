# kBookmarks Sync 设计规格

## 概述

基于现有 import/export 的合并策略，实现多端书签同步。客户端通过 push/pull 协议与远程服务器交换增量数据，服务端统一管理时间戳，客户端本地存储结构零侵入。

## 服务端存储结构

```sql
-- 用户表
CREATE TABLE users (
    token       VARCHAR(255) PRIMARY KEY,
    created_at  BIGINT NOT NULL          -- 服务端时间戳（毫秒）
);

-- 书签表
CREATE TABLE bookmarks (
    id          UUID PRIMARY KEY,
    token       VARCHAR(255) NOT NULL REFERENCES users(token),
    url         TEXT NOT NULL,
    title       TEXT NOT NULL,
    comment     TEXT DEFAULT '',
    date_added  BIGINT,                  -- 原始创建时间（客户端传入）
    updated_at  BIGINT NOT NULL,         -- 服务端赋值，每次 insert/update 时自动设置
    UNIQUE(token, url)                   -- 同一用户下 URL 唯一
);

CREATE INDEX idx_bookmarks_sync ON bookmarks(token, updated_at);
```

关键设计决策：
- `url + token` 构成唯一约束，与客户端"以 URL 为唯一标识"的策略一致
- `updated_at` 仅存在于服务端，由服务端统一赋值，消除多端时钟偏差
- 客户端 IndexedDB 结构无需改动

## 同步协议

### 认证

连接建立后，客户端发送首条消息进行认证：

```json
{ "action": "auth", "token": "user-token-xxx" }
```

服务端响应：

```json
{ "action": "auth_result", "status": "ok" }
```

认证通过后才能进行 push/pull 操作。token 通过消息体传输（非 URL 参数），避免泄露到日志。

### Push（本地 → 远程）

客户端在 save 书签后，将新增/更新的数据推送到服务端：

```json
{
  "action": "push",
  "bookmarks": [
    {
      "url": "https://example.com",
      "title": "Example",
      "comment": "some notes",
      "date_added": 1647000000
    }
  ]
}
```

服务端处理逻辑（按 `token + url` 查找）：
- **不存在** → 插入新记录，`updated_at = server_time`
- **已存在** → title 直接覆盖，comment 不同则换行 append，`updated_at = server_time`

服务端响应：

```json
{
  "action": "push_result",
  "status": "ok",
  "added": 1,
  "updated": 0
}
```

### Pull（远程 → 本地）

客户端请求上次同步后的增量数据：

```json
{ "action": "pull", "since": 1647000000 }
```

服务端执行：`SELECT * FROM bookmarks WHERE token = ? AND updated_at > ? ORDER BY updated_at ASC`

服务端响应：

```json
{
  "action": "pull_result",
  "bookmarks": [
    {
      "url": "https://example.com",
      "title": "Example",
      "comment": "some notes",
      "date_added": 1647000000
    }
  ],
  "server_time": 1647200000
}
```

客户端收到后：
- 复用现有 import 的合并逻辑处理每条记录（URL 去重、comment append、title 按 date_added 比较更新）
- 将 `server_time` 存入 `chrome.storage.sync`，作为下次 pull 的 `since` 参数
- `since = 0` 表示全量拉取（首次同步）

## 冲突解决策略

与现有 import 逻辑完全一致：
- **URL 本地已存在**：
  - title：比较 `date_added`，更新的胜出（同步更新 Chrome 书签 API + IndexedDB）
  - comment：不同则换行 append 到现有 comment 后面
- **URL 本地不存在**：在 kBookmarks 文件夹下创建新书签 + 写入 IndexedDB

## 时间戳策略

- 全链路使用 Unix 时间戳（毫秒）
- `updated_at` 由服务端统一赋值，解决多端时钟不同步问题
- 客户端不感知 `updated_at`，只记住 `server_time` 用于增量 pull
- `date_added` 保留客户端原始值，用于 title 冲突解决

## 客户端配置

存储在 `chrome.storage.sync` 中：
- `sync.enabled` → boolean（sync 开关）
- `sync.endpoint` → string（服务端地址）
- `sync.token` → string（用户认证 token）
- `sync.last_sync` → number（上次 pull 返回的 server_time）

## 通信方案（待定）

具体采用 WebSocket 还是 HTTP 后续决定。MV3 service worker 会被挂起，长连接需要 offscreen document 支持。短连接（按需连接或 HTTP）实现更简单。协议设计与通信方案无关，可灵活切换。

## 暂不实现

- 删除同步：当前只有添加和更新操作，无删除需求
- 客户端 `updated_at` 字段：服务端专属，客户端 IndexedDB 无需改动
