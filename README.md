## Url-to-Video

## Overview
Url-to-Video generator allows you to create a video from html source. This project aims mainly to convert HTML content into video which could be useful in several use cases.

## Features

* Full **Docker** integration (based on [s6-overlay](https://github.com/just-containers/s6-overlay) hypervisor).
* **Xvfb** in-memory display server for UNIX-like operating system that enables you to run graphical applications without a display.
* **Ffmpeg** a complete, cross-platform solution to record, convert and stream audio and video.
* **Google chrome** a cross-platform web browser.
* **Node.js®** a JavaScript runtime built on Chrome's V8 JavaScript engine.
* **Pulseaudio** a sound server that provides a number of features on top of the low-level audio interface ALSA on Linux.

## Brief insights about the existing solutions
Nowadays, the existing open source solutions are either based on [casperjs](https://www.casperjs.org/) or [puppeteer](https://github.com/puppeteer/puppeteer). As a result, the generated videos doesn't cover well rendered web pages and they mainly lack audio support.
Fortunately, this project rised to mitigate these issues and fill the gap.

## How to test it
After executing the following command, you will notice a new file created in the following destination `/tmp/forever_tracey.mp4`.
```bash
docker run --rm \
           -v /tmp/:/recordings/ \
           -e URL=https://www.youtube.com/watch?v=PBYKqvDK8d8 \
           -e DURATION=20 \
           -e OUTPUT_FILENAME=forever_tracey.mp4 \
           --shm-size=256m \
            cipheredbytes/url-to-video
```
This is a [sample](./samples/forever_tracey.mp4) output file.

## Development

Run the following commands to build and run the project:

```bash
git https://github.com/OmarTrigui/url-to-video.git && cd url-to-video/
make docker.build docker.run
```

## Roadmap

- [ ] Add E2E tests
- [ ] Tune recording performance (reduce resource consumption)
- [ ] Add Pub/Sub support (either [SQS](https://aws.amazon.com/sqs/) or [Kafka](https://kafka.apache.org/))


## Contributing
Contributions are always welcome, whether adding/suggesting new features, bug fixes or 
simply editing some grammar.

## License

This project is licensed under the MIT license - check the [LICENSE](./LICENSE) file for
details.
