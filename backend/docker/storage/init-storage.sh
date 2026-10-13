#!/bin/sh
set -eu

silo server /data --console-address ":9001" &
server_pid="$!"

stop_server() {
  kill -TERM "${server_pid}" 2>/dev/null || true
  wait "${server_pid}" || true
}

trap stop_server INT TERM

attempt=0
until mcli alias set local http://127.0.0.1:9000 "${MINIO_ROOT_USER}" "${MINIO_ROOT_PASSWORD}" >/dev/null 2>&1; do
  if ! kill -0 "${server_pid}" 2>/dev/null; then
    wait "${server_pid}"
    exit $?
  fi

  attempt=$((attempt + 1))
  if [ "${attempt}" -ge 60 ]; then
    echo "Object storage did not become ready within 60 seconds" >&2
    stop_server
    exit 1
  fi

  sleep 1
done

mcli mb --ignore-existing "local/${STORAGE_BUCKET}" >/dev/null
wait "${server_pid}"
