FROM ubuntu:bionic

LABEL maintainer="omar.trigui.tn@gmail.com"

ENV OUTPUT_VIDEO_WIDTH 1280
ENV OUTPUT_VIDEO_HEIGHT 720

ADD https://github.com/just-containers/s6-overlay/releases/download/v2.0.0.1/s6-overlay-amd64.tar.gz /tmp/
RUN tar xzf /tmp/s6-overlay-amd64.tar.gz -C / && \
    rm /tmp/s6-overlay-amd64.tar.gz

RUN useradd apps

RUN mkdir -p /home/apps && \
    chown apps:apps /home/apps

RUN apt-get update && \
    apt-get --no-install-recommends install -yqq \
    wget \
    software-properties-common \
    curl \
    gpg-agent

RUN add-apt-repository ppa:mc3man/bionic-prop && \
    curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list

RUN apt-get update && \
    apt-get install -yqq \
    nodejs \
    ffmpeg \
    google-chrome-stable \
    xvfb \
    pulseaudio

COPY package.json /app/

WORKDIR /app/

RUN npm install && \
    npm audit fix

COPY . .

RUN apt-get purge curl gpg-agent -y && \
    apt-get clean -y && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["/init"]
CMD ["/app/entrypoint.sh"]