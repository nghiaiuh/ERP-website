#!/bin/bash
set -Eeuo pipefail

keyfile_directory="/data/configdb"
keyfile_path="${keyfile_directory}/keyfile"

mkdir -p "${keyfile_directory}"

if [[ ! -s "${keyfile_path}" ]]; then
  temporary_keyfile="${keyfile_path}.tmp"
  umask 077
  openssl rand -base64 756 > "${temporary_keyfile}"
  mv "${temporary_keyfile}" "${keyfile_path}"
fi

chown -R mongodb:mongodb "${keyfile_directory}"
chmod 400 "${keyfile_path}"

exec /usr/local/bin/docker-entrypoint.sh mongod \
  --replSet rs0 \
  --bind_ip_all \
  --keyFile "${keyfile_path}"
