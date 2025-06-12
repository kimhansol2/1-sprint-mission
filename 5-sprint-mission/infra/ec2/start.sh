#!/bin/bash
set -eux

cd "$(dirname "$0")/../../../.."

echo "Docker 설치"
sudo yum update -y
sudo dnf install -y docker
sudo systemctl enable --now docker
sudo usermod -aG docker $USER

echo "Docker Compose 설치" 
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.6/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose version

echo "AWS CLI + jq 설치"
sudo yum install -y awscli jq 

echo "SSM 파리미터로 .env.production 생성"
aws ssm get-parameters-by-path \
  --path "/MyApp/prod/" \
  --with-decryption \
  --query "Parameters[*].{Name:Name,Value:Value}" \
  --output json > /tmp/env.json

cat /tmp/env.json \
  | jq -r '.[] | (.Name | split("/")[-1]) + "=" + .Value' \
  > .env.production

echo "Docker Compose 실행"
docker-compose -f docker-compose.prod.yml down || true
docker-compose -f docker-compose.prod.yml up -d --build    