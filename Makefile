# remote-ffprobe
# https://github.com/noblesamurai/remote-ffprobe
#
# Copyright (c) 2018, Tim Allen
# Licensed under the BSD license.

test:

	@NODE_ENV=test ./node_modules/mocha/bin/mocha -R spec --ui bdd --colors --recursive -t 8000 ./test/*.spec.js

.PHONY: test