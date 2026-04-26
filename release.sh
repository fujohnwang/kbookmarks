#!/usr/bin/env bash
set -euo pipefail

[ $# -ne 1 ] && { echo "用法: $0 <version>"; exit 1; }

VERSION="$1"
FILE="package.json"

# 正则表达式：以数字开头，中间两个点分隔数字，以数字结尾
# 注意：在 Bash 的 =~ 右侧，正则表达式不要加双引号，否则会被当成普通字符串匹配！
if [[ ! "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "错误: VERSION '$VERSION' 格式不正确！必须是类似 '1.2.2' 的格式, v1.2.3这样的格式是适用于git tag场景，发布的版本号不能带其他前缀。"
    exit 1
fi

# 更新 version
sed -i.bak 's/"version": *"[^"]*"/"version": "'"$VERSION"'"/' "$FILE" && rm "${FILE}.bak"

# 验证修改
grep -q '"version": "'"$VERSION"'"' "$FILE" || { echo "更新 version 失败"; exit 1; }

npm run publish

#git tag "v$VERSION"

#echo "完成！版本 $VERSION 已发布并打 tag v$VERSION"

echo "可以去 https://chrome.google.com/webstore/devconsole/d12b7608-f2cb-463b-9fa2-76b3ee0bc159 上传dist文件夹下的制品并正式发布了"
