SHELL := bash
.DELETE_ON_ERROR:
.SHELLFLAGS := -eu -o pipefail -c
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

IMAGE := cipheredbytes/url-to-video

.PHONY: docker.build
docker.build:
	docker build -t "${IMAGE}" .
	docker image inspect "${IMAGE}" --format='{{.Size}}' | numfmt --to=iec-i --format='%10f'


.PHONY: format.js
format.js:
	type -p standard >/dev/null || npm install standard --global
	standard --fix

.PHONY: docker.run
docker.run:
	docker run --rm \
               -v /tmp:/recordings/ \
               -e URL=https://www.youtube.com/watch?v=PBYKqvDK8d8 \
               -e DURATION=20 \
               -e OUTPUT_FILENAME=forever_tracey.mp4 \
               "${IMAGE}"

.PHONY: docker.push
docker.push:
	docker push "${IMAGE}"

.PHONY: k8s.run
k8s.run:
	kubectl create -f ./k8s/job.yaml
