#!/bin/bash
# 家庭后端隧道：重启 cloudflared quick tunnel 并打印新地址。
#
# 用法：bash scripts/tunnel.sh
#
# 注意（过渡期成本）：quick tunnel 地址每次重启都会变化。地址变更后需要用新地址
# 重烘发布副本并重发 QW Pages：
#   cd ../vsn-publish
#   BACKEND_URL=<新地址> SITE_URL=https://7ec2kfhc.qwenwork.host npm run build
#   （组装 standalone 后在 QwenWork 中重新发布 .next/standalone）
#
# 终态方案：自有域名 + cloudflared 命名隧道（固定子域，如 api.你的域名.com），
# 即可彻底免除重发；SEO 本来也需要这个域名。

pkill -f 'cloudflared tunnel' 2>/dev/null
sleep 2
nohup cloudflared tunnel --url http://localhost:3000 --no-autoupdate > /tmp/cfd.log 2>&1 &

URL=''
for i in $(seq 1 20); do
  sleep 1
  URL=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' /tmp/cfd.log | head -1)
  [ -n "$URL" ] && break
done

if [ -z "$URL" ]; then
  echo '隧道启动失败，日志：'; tail -5 /tmp/cfd.log; exit 1
fi
echo "隧道地址: $URL"
curl -s -o /dev/null -w "隧道首页: %{http_code}\n" --max-time 20 "$URL/"
