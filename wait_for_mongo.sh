#!/usr/bin/env bash

echo "Waiting for startup.."
until curl http://localhost:28017/serverStatus\?text\=1 2>&1 | grep uptime | head -1; do
  printf '.'
  sleep 1
done