#!/bin/bash
set -euxo pipefail

main() {
  log_i "Starting pulseaudio server"
  launch_pulseaudio
  log_i "Starting xvfb virtual display frame buffer."
  launch_xvfb
  log_i "Start recording."
  launch_recorder
}

launch_xvfb() {
  local xvfbLockFilePath="/tmp/.X1-lock"
  if [ -f "${xvfbLockFilePath}" ]; then
    log_i "Removing xvfb lock file '${xvfbLockFilePath}'..."
    if ! rm -v "${xvfbLockFilePath}"; then
      log_e "Failed to remove xvfb lock file"
      exit 1
    fi
  fi

  export DISPLAY=${XVFB_DISPLAY:-:1}
  local screen=${XVFB_SCREEN:-0}
  local resolution="${OUTPUT_VIDEO_WIDTH}x${OUTPUT_VIDEO_HEIGHT}x24"
  local timeout=${XVFB_TIMEOUT:-5}

  Xvfb "${DISPLAY}" -screen "${screen}" "${resolution}" &
  local loopCount=0
  until xdpyinfo -display "${DISPLAY}" >/dev/null 2>&1; do
    loopCount=$((loopCount + 1))
    sleep 1
    if [ "${loopCount}" -gt "${timeout}" ]; then
      log_e "xvfb failed to start"
      exit 1
    fi
  done
}

launch_pulseaudio() {
  pulseaudio -D --exit-idle-time=-1
}

launch_recorder() {
  node main.js
}

log_i() {
  log "[INFO] ${@}"
}

log_e() {
  log "[ERROR] ${@}"
}

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ${@}"
}

main

exit
