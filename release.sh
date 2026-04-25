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

#git tag "v$VERSION"

#echo "完成！版本 $VERSION 已发布并打 tag v$VERSION"

echo "可以去 https://chrome.google.com/webstore/devconsole/d12b7608-f2cb-463b-9fa2-76b3ee0bc159 上传dist文件夹下的制品并正式发布了"
