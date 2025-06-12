#!/bin/bash
set -eux

curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt-get update -y
sudo apt-get install -y docker-compose

sudo usermod -aG docker $USER

sudo apt-get install -y awscli
sudo apt-get install -y awscli jq 

aws ssm get-parameters-by-path \
  --path "/MyApp/prod/" \
  --with-decryption \
  --query "Parameters[*].{Name:Name,Value:Value}" \
  --output json > /tmp/env.json

cat /tmp/env.json \
  | jq -r '.[] | (.Name | split("/")[-1]) + "=" + .Value' \
  > .env.production

docker compose -f docker-compose.prod.yml down || true
docker compose -f docker-compose.prod.yml up -d --build    