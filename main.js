const CDP = require('chrome-remote-interface')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const waitOn = require('wait-on')

var opts = {
  resources: [
    'tcp:localhost:9222'
  ],
  interval: 100,
  tcpTimeout: 100
}

// List of Chromium Command Line Switches
// https://peter.sh/experiments/chromium-command-line-switches/
function getStartChromeCommand () {
  return 'DISPLAY=:1.0 /bin/sh -c ' +
        '"/opt/google/chrome/google-chrome ' +
        '--window-position=0,0 ' +
        `--window-size=${+process.env.OUTPUT_VIDEO_WIDTH + 1},${+process.env.OUTPUT_VIDEO_HEIGHT + 1} ` +
        '--remote-debugging-port=9222 ' +
        '--no-first-run ' +
        '--no-default-browser-check ' +
        '--start-fullscreen ' +
        '--kiosk ' +
        '--disable-gpu ' +
        '--no-sandbox ' +
        '--disable-extensions ' +
        '--autoplay-policy=no-user-gesture-required ' +
        '--allow-running-insecure-content ' +
        '--disable-features=TranslateUI"' +
        '--disable-dev-shm-usage'
}

function getStartRecordingCommand () {
  return 'ffmpeg -y ' +
        '-f x11grab ' +
        '-draw_mouse 0 ' +
        `-s ${process.env.OUTPUT_VIDEO_WIDTH}x${process.env.OUTPUT_VIDEO_HEIGHT} ` +
        '-thread_queue_size 4096 ' +
        '-i :1 ' +
        '-f alsa ' +
        '-i default ' +
        '-c:v libx264 ' +
        '-tune zerolatency ' +
        '-preset ultrafast ' +
        '-v info ' +
        '-bufsize 5952k ' +
        '-acodec aac ' +
        '-pix_fmt yuv420p ' +
        '-r 30 ' +
        '-crf 17 ' +
        '-g 60 ' +
        '-strict -2 ' +
        '-ar 44100 ' +
        `-t ${process.env.DURATION} ` +
        `/recordings/${process.env.OUTPUT_FILENAME}`
}

async function fireChrome () {
  exec(getStartChromeCommand())

  await waitOn(opts)

  const client = await CDP()

  const { Network, Page } = client

  Network.requestWillBeSent((params) => {
    console.log(`Requested URL: ${params.request.url}`)
  })

  await Network.enable()
  await Page.enable()
  await Page.navigate({ url: process.env.URL })
  await Page.loadEventFired()

  console.log('All assets are loaded')
}

async function fireRecorder () {
  console.log('Firing recorder')
  await exec(getStartRecordingCommand())
  console.log('Recording completed')
}

async function init () {
  try {
    await fireChrome()
    await fireRecorder()
  } catch (err) {
    console.error(err)
    process.exit(1)
  } finally {
    process.exit()
  }
}

init()
