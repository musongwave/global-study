#!/bin/bash
set -e

BUCKET="global-study-site-300272448240"
REGION="eu-north-1"
DIST_ID="EKSIK23VB2V4N"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SITE_DIR="$(dirname "$SCRIPT_DIR")"

echo "==> Собираем проект..."
cd "$SITE_DIR"
VITE_BASE_PATH=/ bun run build

echo "==> Загружаем dist/ в S3..."
aws s3 sync "$SITE_DIR/dist/" "s3://$BUCKET/" \
  --region "$REGION" \
  --delete

echo "==> Сбрасываем кеш CloudFront..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id "$DIST_ID" \
  --paths "/*" \
  --query 'Invalidation.Id' \
  --output text)

echo ""
echo "======================================"
echo "Готово! Сайт обновлён."
echo "URL: https://d35ugerun4abmu.cloudfront.net"
echo "Кеш сброшен (ID: $INVALIDATION_ID)"
echo "Изменения появятся через ~30 секунд."
echo "======================================"
