## Url-to-Video

## Overview
Url-to-Video generator allows you to create a video from html source. 

## Features

* Full **Docker** integration (based on [s6-overlay](https://github.com/just-containers/s6-overlay) hypervisor).
* **Xvfb** in-memory display server for UNIX-like operating system that enables you to run graphical applications without a display.
* **Ffmpeg** a complete, cross-platform solution to record, convert and stream audio and video.
* **Google chrome** a cross-platform web browser.
* **Node.js®** a JavaScript runtime built on Chrome's V8 JavaScript engine.
* **Pulseaudio** a sound server that provides a number of features on top of the low-level audio interface ALSA on Linux.

## Comparison with the existing solutions
Most of the existing open source solution render web pages badly and they mainly lack audio support. 
This solution rised to mitigate these issues.

## How to test it

```bash
docker run --rm \
           -v /tmp/:/recordings/ \
           -e URL=https://www.youtube.com/watch?v=PBYKqvDK8d8 \
           -e DURATION=20 \
           -e OUTPUT_FILENAME=forever_tracey.mp4 \
            cipheredbytes/url-to-video
```

You will notice a new file created in the following destination [/tmp/forever_tracey.mp4](https://github.com/OmarTrigui/url-to-video/raw/master/samples/forever_tracey.mp4).

## Development

Go to the project directory and run the following command:

```bash
git https://github.com/OmarTrigui/url-to-video.git && cd url-to-video/
make docker.build docker.run
```

## TODO list

- [ ] Add E2E tests
- [ ] Tweak recording performance
- [ ] Add Pub/Sub support (either [SQS](https://aws.amazon.com/sqs/) or [Kafka](https://kafka.apache.org/))


## Contributing
Contributions are always welcome, whether adding/suggesting new features, bug fixes, 
documenting new file formats or simply editing some grammar.