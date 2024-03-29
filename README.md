# remote-ffprobe

> ffprobe a url.

## Purpose
ffprobe a remote file (url).

## Usage

```js
const ffprobe = require('remote-ffprobe');
ffprobe('http://my/url.mp4').then(metadata => {
  console.log(metadata);
});
```

## API

<a name="module_index"></a>

## index
<a name="exp_module_index--module.exports"></a>

### module.exports(url, opts) ⇒ <code>object</code> ⏏
**Kind**: Exported function
**Returns**: <code>object</code> - the ffprobe metadata

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> |  |
| opts | <code>object</code> | request options (ie. `{ timeout: 1500 }`). |
| opts.download | <code>boolean</code> | whether to download the file before probing.   Note that this is just to skip the streaming step if you already know you   are dealing with a non-streamable file. If streaming fails, we will   automatically fallback to a download probe. |

Note: To regenerate this section from the jsdoc run `npm run docs` and paste
the output above.

## Installation

This module is installed via npm:

``` bash
$ npm install <%= appNameSlug %>
```

## Contributing

### Prerequisites

```
$ pip install pre-commit
```

### Installation

```
$ pre-commit install --install-hooks
```

## License
The BSD License

Copyright (c) 2018, Noble Samurai Pty Ltd.

All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.

* Neither the name of the <%= authorName %> nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
