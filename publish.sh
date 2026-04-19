#!/usr/bin/env bash
set -euo pipefail

[ $# -ne 1 ] && { echo "用法: $0 <version>"; exit 1; }

VERSION="$1"
FILE="package.json"

# 更新 version
sed -i.bak 's/"version": *"[^"]*"/"version": "'"$VERSION"'"/' "$FILE" && rm "${FILE}.bak"

# 验证修改
grep -q '"version": "'"$VERSION"'"' "$FILE" || { echo "更新 version 失败"; exit 1; }

npm run publish

git tag "v$VERSION"

echo "完成！版本 $VERSION 已发布并打 tag v$VERSION"
