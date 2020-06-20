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

function getStartChromeCommand () {
  return 'DISPLAY=:1.0 /bin/sh -c ' +
        '"/opt/google/chrome/google-chrome ' +
        '--window-position=0,0 ' +
        '--window-size=1281,721 ' +
        '--remote-debugging-port=9222 ' +
        '--no-first-run ' +
        '--no-default-browser-check ' +
        '--start-fullscreen ' +
        '--kiosk ' +
        '--disable-gpu ' +
        '--no-sandbox ' +
        '--disable-extensions ' +
        '--autoplay-policy=no-user-gesture-required ' +
        '--allow-running-insecure-content --disable-features=TranslateUI"'
}

function getStartRecordingCommand () {
  return 'ffmpeg -y ' +
        '-f x11grab ' +
        '-draw_mouse 0 ' +
        '-s 1280x720 ' +
        '-thread_queue_size 4096 ' +
        '-i :1 ' +
        '-f pulse ' +
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
        `/output/${process.env.OUTPUT_FILENAME}`
}

async function init () {
  let client
  try {
    exec(getStartChromeCommand())

    await waitOn(opts)

    client = await CDP()

    const {
      Network,
      Page
    } = client

    Network.requestWillBeSent((params) => {
      console.log(params.request.url)
    })

    await Network.enable()
    await Page.enable()
    await Page.navigate({
      url: process.env.URL
    })
    await Page.loadEventFired()

    console.log('All assets are loaded')
    await exec(getStartRecordingCommand())
    console.log('Recording is completed')

  } catch (err) {
    console.error(err)
  } finally {
    process.exit()
  }
}

init()
