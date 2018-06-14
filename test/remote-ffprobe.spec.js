/*
 * remote-ffprobe
 * https://github.com/noblesamurai/remote-ffprobe
 *
 * Copyright (c) 2018, Tim Allen
 * Licensed under the BSD license.
 */

'use strict';

var chai = require('chai'),
    expect = chai.expect;

chai.should();

var remote-ffprobe = require('../lib/remote-ffprobe.js');

describe('remote-ffprobe module', function() {
    describe('#awesome()', function() {
        it('should return a hello', function() {
            expect(remote-ffprobe.awesome('livia')).to.equal('hello livia');
        });
    });
});
