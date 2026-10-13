#!/bin/bash
set -Eeuo pipefail

mongo_eval() {
  mongosh \
    --quiet \
    --host 127.0.0.1 \
    --port 27017 \
    --username "${MONGO_INITDB_ROOT_USERNAME}" \
    --password "${MONGO_INITDB_ROOT_PASSWORD}" \
    --authenticationDatabase admin \
    --eval "$1"
}

if mongo_eval 'quit(rs.status().ok === 1 && rs.isMaster().ismaster === true ? 0 : 1)' >/dev/null 2>&1; then
  exit 0
fi

mongo_eval '
  try {
    const result = rs.initiate({
      _id: "rs0",
      members: [{ _id: 0, host: "localhost:27017" }]
    });
    quit(result.ok === 1 || result.codeName === "AlreadyInitialized" ? 0 : 1);
  } catch (error) {
    quit(error.codeName === "AlreadyInitialized" ? 0 : 1);
  }
' >/dev/null 2>&1

# Initiation is asynchronous; remain unhealthy until this node is PRIMARY.
exit 1
