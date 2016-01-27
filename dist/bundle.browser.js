(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.AV = global.AV || {}, global.AV.realtime = factory());
}(this, function () { 'use strict';

    var global = typeof window !== 'undefined' ? window :
                 typeof global !== 'undefined' ? global :
                 this;


    var __commonjs_global = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this;
    function __commonjs(fn, module) { return module = { exports: {} }, fn(module, module.exports, __commonjs_global), module.exports; }

    var require$$1$1 = {};

    var long = __commonjs(function (module, exports, global) {
    /*
     Copyright 2013 Daniel Wirtz <dcode@dcode.io>
     Copyright 2009 The Closure Library Authors. All Rights Reserved.

     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS-IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
     */

    /**
     * @license long.js (c) 2013 Daniel Wirtz <dcode@dcode.io>
     * Released under the Apache License, Version 2.0
     * see: https://github.com/dcodeIO/long.js for details
     */
    (function(global, factory) {

        /* AMD */ if (typeof define === 'function' && define["amd"])
            define([], factory);
        /* CommonJS */ else if (typeof require === 'function' && typeof module === "object" && module && module["exports"])
            module["exports"] = factory();
        /* Global */ else
            (global["dcodeIO"] = global["dcodeIO"] || {})["Long"] = factory();

    })(__commonjs_global, function() {
        "use strict";

        /**
         * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
         *  See the from* functions below for more convenient ways of constructing Longs.
         * @exports Long
         * @class A Long class for representing a 64 bit two's-complement integer value.
         * @param {number} low The low (signed) 32 bits of the long
         * @param {number} high The high (signed) 32 bits of the long
         * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
         * @constructor
         */
        function Long(low, high, unsigned) {

            /**
             * The low 32 bits as a signed value.
             * @type {number}
             * @expose
             */
            this.low = low | 0;

            /**
             * The high 32 bits as a signed value.
             * @type {number}
             * @expose
             */
            this.high = high | 0;

            /**
             * Whether unsigned or not.
             * @type {boolean}
             * @expose
             */
            this.unsigned = !!unsigned;
        }

        // The internal representation of a long is the two given signed, 32-bit values.
        // We use 32-bit pieces because these are the size of integers on which
        // Javascript performs bit-operations.  For operations like addition and
        // multiplication, we split each number into 16 bit pieces, which can easily be
        // multiplied within Javascript's floating-point representation without overflow
        // or change in sign.
        //
        // In the algorithms below, we frequently reduce the negative case to the
        // positive case by negating the input(s) and then post-processing the result.
        // Note that we must ALWAYS check specially whether those values are MIN_VALUE
        // (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
        // a positive number, it overflows back into a negative).  Not handling this
        // case would often result in infinite recursion.
        //
        // Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the from*
        // methods on which they depend.

        /**
         * An indicator used to reliably determine if an object is a Long or not.
         * @type {boolean}
         * @const
         * @expose
         * @private
         */
        Long.__isLong__;

        Object.defineProperty(Long.prototype, "__isLong__", {
            value: true,
            enumerable: false,
            configurable: false
        });

        /**
         * @function
         * @param {*} obj Object
         * @returns {boolean}
         * @inner
         */
        function isLong(obj) {
            return (obj && obj["__isLong__"]) === true;
        }

        /**
         * Tests if the specified object is a Long.
         * @function
         * @param {*} obj Object
         * @returns {boolean}
         * @expose
         */
        Long.isLong = isLong;

        /**
         * A cache of the Long representations of small integer values.
         * @type {!Object}
         * @inner
         */
        var INT_CACHE = {};

        /**
         * A cache of the Long representations of small unsigned integer values.
         * @type {!Object}
         * @inner
         */
        var UINT_CACHE = {};

        /**
         * @param {number} value
         * @param {boolean=} unsigned
         * @returns {!Long}
         * @inner
         */
        function fromInt(value, unsigned) {
            var obj, cachedObj, cache;
            if (unsigned) {
                value >>>= 0;
                if (cache = (0 <= value && value < 256)) {
                    cachedObj = UINT_CACHE[value];
                    if (cachedObj)
                        return cachedObj;
                }
                obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true);
                if (cache)
                    UINT_CACHE[value] = obj;
                return obj;
            } else {
                value |= 0;
                if (cache = (-128 <= value && value < 128)) {
                    cachedObj = INT_CACHE[value];
                    if (cachedObj)
                        return cachedObj;
                }
                obj = fromBits(value, value < 0 ? -1 : 0, false);
                if (cache)
                    INT_CACHE[value] = obj;
                return obj;
            }
        }

        /**
         * Returns a Long representing the given 32 bit integer value.
         * @function
         * @param {number} value The 32 bit integer in question
         * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
         * @returns {!Long} The corresponding Long value
         * @expose
         */
        Long.fromInt = fromInt;

        /**
         * @param {number} value
         * @param {boolean=} unsigned
         * @returns {!Long}
         * @inner
         */
        function fromNumber(value, unsigned) {
            if (isNaN(value) || !isFinite(value))
                return unsigned ? UZERO : ZERO;
            if (unsigned) {
                if (value < 0)
                    return UZERO;
                if (value >= TWO_PWR_64_DBL)
                    return MAX_UNSIGNED_VALUE;
            } else {
                if (value <= -TWO_PWR_63_DBL)
                    return MIN_VALUE;
                if (value + 1 >= TWO_PWR_63_DBL)
                    return MAX_VALUE;
            }
            if (value < 0)
                return fromNumber(-value, unsigned).neg();
            return fromBits((value % TWO_PWR_32_DBL) | 0, (value / TWO_PWR_32_DBL) | 0, unsigned);
        }

        /**
         * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
         * @function
         * @param {number} value The number in question
         * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
         * @returns {!Long} The corresponding Long value
         * @expose
         */
        Long.fromNumber = fromNumber;

        /**
         * @param {number} lowBits
         * @param {number} highBits
         * @param {boolean=} unsigned
         * @returns {!Long}
         * @inner
         */
        function fromBits(lowBits, highBits, unsigned) {
            return new Long(lowBits, highBits, unsigned);
        }

        /**
         * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
         *  assumed to use 32 bits.
         * @function
         * @param {number} lowBits The low 32 bits
         * @param {number} highBits The high 32 bits
         * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
         * @returns {!Long} The corresponding Long value
         * @expose
         */
        Long.fromBits = fromBits;

        /**
         * @function
         * @param {number} base
         * @param {number} exponent
         * @returns {number}
         * @inner
         */
        var pow_dbl = Math.pow; // Used 4 times (4*8 to 15+4)

        /**
         * @param {string} str
         * @param {(boolean|number)=} unsigned
         * @param {number=} radix
         * @returns {!Long}
         * @inner
         */
        function fromString(str, unsigned, radix) {
            if (str.length === 0)
                throw Error('empty string');
            if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
                return ZERO;
            if (typeof unsigned === 'number') // For goog.math.long compatibility
                radix = unsigned,
                unsigned = false;
            radix = radix || 10;
            if (radix < 2 || 36 < radix)
                throw RangeError('radix');

            var p;
            if ((p = str.indexOf('-')) > 0)
                throw Error('interior hyphen');
            else if (p === 0) {
                return fromString(str.substring(1), unsigned, radix).neg();
            }

            // Do several (8) digits each time through the loop, so as to
            // minimize the calls to the very expensive emulated div.
            var radixToPower = fromNumber(pow_dbl(radix, 8));

            var result = ZERO;
            for (var i = 0; i < str.length; i += 8) {
                var size = Math.min(8, str.length - i),
                    value = parseInt(str.substring(i, i + size), radix);
                if (size < 8) {
                    var power = fromNumber(pow_dbl(radix, size));
                    result = result.mul(power).add(fromNumber(value));
                } else {
                    result = result.mul(radixToPower);
                    result = result.add(fromNumber(value));
                }
            }
            result.unsigned = unsigned;
            return result;
        }

        /**
         * Returns a Long representation of the given string, written using the specified radix.
         * @function
         * @param {string} str The textual representation of the Long
         * @param {(boolean|number)=} unsigned Whether unsigned or not, defaults to `false` for signed
         * @param {number=} radix The radix in which the text is written (2-36), defaults to 10
         * @returns {!Long} The corresponding Long value
         * @expose
         */
        Long.fromString = fromString;

        /**
         * @function
         * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
         * @returns {!Long}
         * @inner
         */
        function fromValue(val) {
            if (val /* is compatible */ instanceof Long)
                return val;
            if (typeof val === 'number')
                return fromNumber(val);
            if (typeof val === 'string')
                return fromString(val);
            // Throws for non-objects, converts non-instanceof Long:
            return fromBits(val.low, val.high, val.unsigned);
        }

        /**
         * Converts the specified value to a Long.
         * @function
         * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val Value
         * @returns {!Long}
         * @expose
         */
        Long.fromValue = fromValue;

        // NOTE: the compiler should inline these constant values below and then remove these variables, so there should be
        // no runtime penalty for these.

        /**
         * @type {number}
         * @const
         * @inner
         */
        var TWO_PWR_16_DBL = 1 << 16;

        /**
         * @type {number}
         * @const
         * @inner
         */
        var TWO_PWR_24_DBL = 1 << 24;

        /**
         * @type {number}
         * @const
         * @inner
         */
        var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;

        /**
         * @type {number}
         * @const
         * @inner
         */
        var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;

        /**
         * @type {number}
         * @const
         * @inner
         */
        var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;

        /**
         * @type {!Long}
         * @const
         * @inner
         */
        var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);

        /**
         * @type {!Long}
         * @inner
         */
        var ZERO = fromInt(0);

        /**
         * Signed zero.
         * @type {!Long}
         * @expose
         */
        Long.ZERO = ZERO;

        /**
         * @type {!Long}
         * @inner
         */
        var UZERO = fromInt(0, true);

        /**
         * Unsigned zero.
         * @type {!Long}
         * @expose
         */
        Long.UZERO = UZERO;

        /**
         * @type {!Long}
         * @inner
         */
        var ONE = fromInt(1);

        /**
         * Signed one.
         * @type {!Long}
         * @expose
         */
        Long.ONE = ONE;

        /**
         * @type {!Long}
         * @inner
         */
        var UONE = fromInt(1, true);

        /**
         * Unsigned one.
         * @type {!Long}
         * @expose
         */
        Long.UONE = UONE;

        /**
         * @type {!Long}
         * @inner
         */
        var NEG_ONE = fromInt(-1);

        /**
         * Signed negative one.
         * @type {!Long}
         * @expose
         */
        Long.NEG_ONE = NEG_ONE;

        /**
         * @type {!Long}
         * @inner
         */
        var MAX_VALUE = fromBits(0xFFFFFFFF|0, 0x7FFFFFFF|0, false);

        /**
         * Maximum signed value.
         * @type {!Long}
         * @expose
         */
        Long.MAX_VALUE = MAX_VALUE;

        /**
         * @type {!Long}
         * @inner
         */
        var MAX_UNSIGNED_VALUE = fromBits(0xFFFFFFFF|0, 0xFFFFFFFF|0, true);

        /**
         * Maximum unsigned value.
         * @type {!Long}
         * @expose
         */
        Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;

        /**
         * @type {!Long}
         * @inner
         */
        var MIN_VALUE = fromBits(0, 0x80000000|0, false);

        /**
         * Minimum signed value.
         * @type {!Long}
         * @expose
         */
        Long.MIN_VALUE = MIN_VALUE;

        /**
         * @alias Long.prototype
         * @inner
         */
        var LongPrototype = Long.prototype;

        /**
         * Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
         * @returns {number}
         * @expose
         */
        LongPrototype.toInt = function toInt() {
            return this.unsigned ? this.low >>> 0 : this.low;
        };

        /**
         * Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
         * @returns {number}
         * @expose
         */
        LongPrototype.toNumber = function toNumber() {
            if (this.unsigned)
                return ((this.high >>> 0) * TWO_PWR_32_DBL) + (this.low >>> 0);
            return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
        };

        /**
         * Converts the Long to a string written in the specified radix.
         * @param {number=} radix Radix (2-36), defaults to 10
         * @returns {string}
         * @override
         * @throws {RangeError} If `radix` is out of range
         * @expose
         */
        LongPrototype.toString = function toString(radix) {
            radix = radix || 10;
            if (radix < 2 || 36 < radix)
                throw RangeError('radix');
            if (this.isZero())
                return '0';
            if (this.isNegative()) { // Unsigned Longs are never negative
                if (this.eq(MIN_VALUE)) {
                    // We need to change the Long value before it can be negated, so we remove
                    // the bottom-most digit in this base and then recurse to do the rest.
                    var radixLong = fromNumber(radix),
                        div = this.div(radixLong),
                        rem1 = div.mul(radixLong).sub(this);
                    return div.toString(radix) + rem1.toInt().toString(radix);
                } else
                    return '-' + this.neg().toString(radix);
            }

            // Do several (6) digits each time through the loop, so as to
            // minimize the calls to the very expensive emulated div.
            var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned),
                rem = this;
            var result = '';
            while (true) {
                var remDiv = rem.div(radixToPower),
                    intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0,
                    digits = intval.toString(radix);
                rem = remDiv;
                if (rem.isZero())
                    return digits + result;
                else {
                    while (digits.length < 6)
                        digits = '0' + digits;
                    result = '' + digits + result;
                }
            }
        };

        /**
         * Gets the high 32 bits as a signed integer.
         * @returns {number} Signed high bits
         * @expose
         */
        LongPrototype.getHighBits = function getHighBits() {
            return this.high;
        };

        /**
         * Gets the high 32 bits as an unsigned integer.
         * @returns {number} Unsigned high bits
         * @expose
         */
        LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
            return this.high >>> 0;
        };

        /**
         * Gets the low 32 bits as a signed integer.
         * @returns {number} Signed low bits
         * @expose
         */
        LongPrototype.getLowBits = function getLowBits() {
            return this.low;
        };

        /**
         * Gets the low 32 bits as an unsigned integer.
         * @returns {number} Unsigned low bits
         * @expose
         */
        LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
            return this.low >>> 0;
        };

        /**
         * Gets the number of bits needed to represent the absolute value of this Long.
         * @returns {number}
         * @expose
         */
        LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
            if (this.isNegative()) // Unsigned Longs are never negative
                return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
            var val = this.high != 0 ? this.high : this.low;
            for (var bit = 31; bit > 0; bit--)
                if ((val & (1 << bit)) != 0)
                    break;
            return this.high != 0 ? bit + 33 : bit + 1;
        };

        /**
         * Tests if this Long's value equals zero.
         * @returns {boolean}
         * @expose
         */
        LongPrototype.isZero = function isZero() {
            return this.high === 0 && this.low === 0;
        };

        /**
         * Tests if this Long's value is negative.
         * @returns {boolean}
         * @expose
         */
        LongPrototype.isNegative = function isNegative() {
            return !this.unsigned && this.high < 0;
        };

        /**
         * Tests if this Long's value is positive.
         * @returns {boolean}
         * @expose
         */
        LongPrototype.isPositive = function isPositive() {
            return this.unsigned || this.high >= 0;
        };

        /**
         * Tests if this Long's value is odd.
         * @returns {boolean}
         * @expose
         */
        LongPrototype.isOdd = function isOdd() {
            return (this.low & 1) === 1;
        };

        /**
         * Tests if this Long's value is even.
         * @returns {boolean}
         * @expose
         */
        LongPrototype.isEven = function isEven() {
            return (this.low & 1) === 0;
        };

        /**
         * Tests if this Long's value equals the specified's.
         * @param {!Long|number|string} other Other value
         * @returns {boolean}
         * @expose
         */
        LongPrototype.equals = function equals(other) {
            if (!isLong(other))
                other = fromValue(other);
            if (this.unsigned !== other.unsigned && (this.high >>> 31) === 1 && (other.high >>> 31) === 1)
                return false;
            return this.high === other.high && this.low === other.low;
        };

        /**
         * Tests if this Long's value equals the specified's. This is an alias of {@link Long#equals}.
         * @function
         * @param {!Long|number|string} other Other value
         * @returns {boolean}
         * @expose
         */
        LongPrototype.eq = LongPrototype.equals;

        /**
         * Tests if this Long's value differs from the specified's.
         * @param {!Long|number|string} other Other value
         * @returns {boolean}
         * @expose
         */
        LongPrototype.notEquals = function notEquals(other) {
            return !this.eq(/* validates */ other);
        };

        /**
         * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
         * @function
         * @param {!Long|number|string} other Other value
         * @returns {boolean}
         * @expose
         */
        LongPrototype.neq = LongPrototype.notEquals;

        /**
         * Tests if this Long's value is less than the specified's.
         * @param {!Long|number|string} other Other value
         * @returns {boolean}
         * @expose
         */
        LongPrototype.lessThan = function lessThan(other) {
            return this.comp(/* validates */ other) < 0;
        };

        /**
         * Tests if this Long's value is less than the specified's. This is an alias of {@link Long#lessThan}.
         * @function
         * @param {!Long|number|string} other Other value
         * @returns {boolean}
         * @expose
         */
        LongPrototype.lt = LongPrototype.lessThan;

        /**
         * Tests if this Long's value is less than or equal the specified's.
         * @param {!Long|number|string} other Other value
         * @returns {boolean}
         * @expose
         */
        LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
            return this.comp(/* validates */ other) <= 0;
        };

        /**
         * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
         * @function
         * @param {!Long|number|string} other Other value
         * @returns {boolean}
         * @expose
         */
        LongPrototype.lte = LongPrototype.lessThanOrEqual;

        /**
         * Tests if this Long's value is greater than the specified's.
         * @param {!Long|number|string} other Other value
         * @returns {boolean}
         * @expose
         */
        LongPrototype.greaterThan = function greaterThan(other) {
            return this.comp(/* validates */ other) > 0;
        };

        /**
         * Tests if this Long's value is greater than the specified's. This is an alias of {@link Long#greaterThan}.
         * @function
         * @param {!Long|number|string} other Other value
         * @returns {boolean}
         * @expose
         */
        LongPrototype.gt = LongPrototype.greaterThan;

        /**
         * Tests if this Long's value is greater than or equal the specified's.
         * @param {!Long|number|string} other Other value
         * @returns {boolean}
         * @expose
         */
        LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
            return this.comp(/* validates */ other) >= 0;
        };

        /**
         * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
         * @function
         * @param {!Long|number|string} other Other value
         * @returns {boolean}
         * @expose
         */
        LongPrototype.gte = LongPrototype.greaterThanOrEqual;

        /**
         * Compares this Long's value with the specified's.
         * @param {!Long|number|string} other Other value
         * @returns {number} 0 if they are the same, 1 if the this is greater and -1
         *  if the given one is greater
         * @expose
         */
        LongPrototype.compare = function compare(other) {
            if (!isLong(other))
                other = fromValue(other);
            if (this.eq(other))
                return 0;
            var thisNeg = this.isNegative(),
                otherNeg = other.isNegative();
            if (thisNeg && !otherNeg)
                return -1;
            if (!thisNeg && otherNeg)
                return 1;
            // At this point the sign bits are the same
            if (!this.unsigned)
                return this.sub(other).isNegative() ? -1 : 1;
            // Both are positive if at least one is unsigned
            return (other.high >>> 0) > (this.high >>> 0) || (other.high === this.high && (other.low >>> 0) > (this.low >>> 0)) ? -1 : 1;
        };

        /**
         * Compares this Long's value with the specified's. This is an alias of {@link Long#compare}.
         * @function
         * @param {!Long|number|string} other Other value
         * @returns {number} 0 if they are the same, 1 if the this is greater and -1
         *  if the given one is greater
         * @expose
         */
        LongPrototype.comp = LongPrototype.compare;

        /**
         * Negates this Long's value.
         * @returns {!Long} Negated Long
         * @expose
         */
        LongPrototype.negate = function negate() {
            if (!this.unsigned && this.eq(MIN_VALUE))
                return MIN_VALUE;
            return this.not().add(ONE);
        };

        /**
         * Negates this Long's value. This is an alias of {@link Long#negate}.
         * @function
         * @returns {!Long} Negated Long
         * @expose
         */
        LongPrototype.neg = LongPrototype.negate;

        /**
         * Returns the sum of this and the specified Long.
         * @param {!Long|number|string} addend Addend
         * @returns {!Long} Sum
         * @expose
         */
        LongPrototype.add = function add(addend) {
            if (!isLong(addend))
                addend = fromValue(addend);

            // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

            var a48 = this.high >>> 16;
            var a32 = this.high & 0xFFFF;
            var a16 = this.low >>> 16;
            var a00 = this.low & 0xFFFF;

            var b48 = addend.high >>> 16;
            var b32 = addend.high & 0xFFFF;
            var b16 = addend.low >>> 16;
            var b00 = addend.low & 0xFFFF;

            var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
            c00 += a00 + b00;
            c16 += c00 >>> 16;
            c00 &= 0xFFFF;
            c16 += a16 + b16;
            c32 += c16 >>> 16;
            c16 &= 0xFFFF;
            c32 += a32 + b32;
            c48 += c32 >>> 16;
            c32 &= 0xFFFF;
            c48 += a48 + b48;
            c48 &= 0xFFFF;
            return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
        };

        /**
         * Returns the difference of this and the specified Long.
         * @param {!Long|number|string} subtrahend Subtrahend
         * @returns {!Long} Difference
         * @expose
         */
        LongPrototype.subtract = function subtract(subtrahend) {
            if (!isLong(subtrahend))
                subtrahend = fromValue(subtrahend);
            return this.add(subtrahend.neg());
        };

        /**
         * Returns the difference of this and the specified Long. This is an alias of {@link Long#subtract}.
         * @function
         * @param {!Long|number|string} subtrahend Subtrahend
         * @returns {!Long} Difference
         * @expose
         */
        LongPrototype.sub = LongPrototype.subtract;

        /**
         * Returns the product of this and the specified Long.
         * @param {!Long|number|string} multiplier Multiplier
         * @returns {!Long} Product
         * @expose
         */
        LongPrototype.multiply = function multiply(multiplier) {
            if (this.isZero())
                return ZERO;
            if (!isLong(multiplier))
                multiplier = fromValue(multiplier);
            if (multiplier.isZero())
                return ZERO;
            if (this.eq(MIN_VALUE))
                return multiplier.isOdd() ? MIN_VALUE : ZERO;
            if (multiplier.eq(MIN_VALUE))
                return this.isOdd() ? MIN_VALUE : ZERO;

            if (this.isNegative()) {
                if (multiplier.isNegative())
                    return this.neg().mul(multiplier.neg());
                else
                    return this.neg().mul(multiplier).neg();
            } else if (multiplier.isNegative())
                return this.mul(multiplier.neg()).neg();

            // If both longs are small, use float multiplication
            if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
                return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);

            // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
            // We can skip products that would overflow.

            var a48 = this.high >>> 16;
            var a32 = this.high & 0xFFFF;
            var a16 = this.low >>> 16;
            var a00 = this.low & 0xFFFF;

            var b48 = multiplier.high >>> 16;
            var b32 = multiplier.high & 0xFFFF;
            var b16 = multiplier.low >>> 16;
            var b00 = multiplier.low & 0xFFFF;

            var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
            c00 += a00 * b00;
            c16 += c00 >>> 16;
            c00 &= 0xFFFF;
            c16 += a16 * b00;
            c32 += c16 >>> 16;
            c16 &= 0xFFFF;
            c16 += a00 * b16;
            c32 += c16 >>> 16;
            c16 &= 0xFFFF;
            c32 += a32 * b00;
            c48 += c32 >>> 16;
            c32 &= 0xFFFF;
            c32 += a16 * b16;
            c48 += c32 >>> 16;
            c32 &= 0xFFFF;
            c32 += a00 * b32;
            c48 += c32 >>> 16;
            c32 &= 0xFFFF;
            c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
            c48 &= 0xFFFF;
            return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
        };

        /**
         * Returns the product of this and the specified Long. This is an alias of {@link Long#multiply}.
         * @function
         * @param {!Long|number|string} multiplier Multiplier
         * @returns {!Long} Product
         * @expose
         */
        LongPrototype.mul = LongPrototype.multiply;

        /**
         * Returns this Long divided by the specified.
         * @param {!Long|number|string} divisor Divisor
         * @returns {!Long} Quotient
         * @expose
         */
        LongPrototype.divide = function divide(divisor) {
            if (!isLong(divisor))
                divisor = fromValue(divisor);
            if (divisor.isZero())
                throw Error('division by zero');
            if (this.isZero())
                return this.unsigned ? UZERO : ZERO;
            var approx, rem, res;
            if (this.eq(MIN_VALUE)) {
                if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
                    return MIN_VALUE;  // recall that -MIN_VALUE == MIN_VALUE
                else if (divisor.eq(MIN_VALUE))
                    return ONE;
                else {
                    // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
                    var halfThis = this.shr(1);
                    approx = halfThis.div(divisor).shl(1);
                    if (approx.eq(ZERO)) {
                        return divisor.isNegative() ? ONE : NEG_ONE;
                    } else {
                        rem = this.sub(divisor.mul(approx));
                        res = approx.add(rem.div(divisor));
                        return res;
                    }
                }
            } else if (divisor.eq(MIN_VALUE))
                return this.unsigned ? UZERO : ZERO;
            if (this.isNegative()) {
                if (divisor.isNegative())
                    return this.neg().div(divisor.neg());
                return this.neg().div(divisor).neg();
            } else if (divisor.isNegative())
                return this.div(divisor.neg()).neg();

            // Repeat the following until the remainder is less than other:  find a
            // floating-point that approximates remainder / other *from below*, add this
            // into the result, and subtract it from the remainder.  It is critical that
            // the approximate value is less than or equal to the real value so that the
            // remainder never becomes negative.
            res = ZERO;
            rem = this;
            while (rem.gte(divisor)) {
                // Approximate the result of division. This may be a little greater or
                // smaller than the actual value.
                approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));

                // We will tweak the approximate result by changing it in the 48-th digit or
                // the smallest non-fractional digit, whichever is larger.
                var log2 = Math.ceil(Math.log(approx) / Math.LN2),
                    delta = (log2 <= 48) ? 1 : pow_dbl(2, log2 - 48),

                // Decrease the approximation until it is smaller than the remainder.  Note
                // that if it is too large, the product overflows and is negative.
                    approxRes = fromNumber(approx),
                    approxRem = approxRes.mul(divisor);
                while (approxRem.isNegative() || approxRem.gt(rem)) {
                    approx -= delta;
                    approxRes = fromNumber(approx, this.unsigned);
                    approxRem = approxRes.mul(divisor);
                }

                // We know the answer can't be zero... and actually, zero would cause
                // infinite recursion since we would make no progress.
                if (approxRes.isZero())
                    approxRes = ONE;

                res = res.add(approxRes);
                rem = rem.sub(approxRem);
            }
            return res;
        };

        /**
         * Returns this Long divided by the specified. This is an alias of {@link Long#divide}.
         * @function
         * @param {!Long|number|string} divisor Divisor
         * @returns {!Long} Quotient
         * @expose
         */
        LongPrototype.div = LongPrototype.divide;

        /**
         * Returns this Long modulo the specified.
         * @param {!Long|number|string} divisor Divisor
         * @returns {!Long} Remainder
         * @expose
         */
        LongPrototype.modulo = function modulo(divisor) {
            if (!isLong(divisor))
                divisor = fromValue(divisor);
            return this.sub(this.div(divisor).mul(divisor));
        };

        /**
         * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
         * @function
         * @param {!Long|number|string} divisor Divisor
         * @returns {!Long} Remainder
         * @expose
         */
        LongPrototype.mod = LongPrototype.modulo;

        /**
         * Returns the bitwise NOT of this Long.
         * @returns {!Long}
         * @expose
         */
        LongPrototype.not = function not() {
            return fromBits(~this.low, ~this.high, this.unsigned);
        };

        /**
         * Returns the bitwise AND of this Long and the specified.
         * @param {!Long|number|string} other Other Long
         * @returns {!Long}
         * @expose
         */
        LongPrototype.and = function and(other) {
            if (!isLong(other))
                other = fromValue(other);
            return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
        };

        /**
         * Returns the bitwise OR of this Long and the specified.
         * @param {!Long|number|string} other Other Long
         * @returns {!Long}
         * @expose
         */
        LongPrototype.or = function or(other) {
            if (!isLong(other))
                other = fromValue(other);
            return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
        };

        /**
         * Returns the bitwise XOR of this Long and the given one.
         * @param {!Long|number|string} other Other Long
         * @returns {!Long}
         * @expose
         */
        LongPrototype.xor = function xor(other) {
            if (!isLong(other))
                other = fromValue(other);
            return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
        };

        /**
         * Returns this Long with bits shifted to the left by the given amount.
         * @param {number|!Long} numBits Number of bits
         * @returns {!Long} Shifted Long
         * @expose
         */
        LongPrototype.shiftLeft = function shiftLeft(numBits) {
            if (isLong(numBits))
                numBits = numBits.toInt();
            if ((numBits &= 63) === 0)
                return this;
            else if (numBits < 32)
                return fromBits(this.low << numBits, (this.high << numBits) | (this.low >>> (32 - numBits)), this.unsigned);
            else
                return fromBits(0, this.low << (numBits - 32), this.unsigned);
        };

        /**
         * Returns this Long with bits shifted to the left by the given amount. This is an alias of {@link Long#shiftLeft}.
         * @function
         * @param {number|!Long} numBits Number of bits
         * @returns {!Long} Shifted Long
         * @expose
         */
        LongPrototype.shl = LongPrototype.shiftLeft;

        /**
         * Returns this Long with bits arithmetically shifted to the right by the given amount.
         * @param {number|!Long} numBits Number of bits
         * @returns {!Long} Shifted Long
         * @expose
         */
        LongPrototype.shiftRight = function shiftRight(numBits) {
            if (isLong(numBits))
                numBits = numBits.toInt();
            if ((numBits &= 63) === 0)
                return this;
            else if (numBits < 32)
                return fromBits((this.low >>> numBits) | (this.high << (32 - numBits)), this.high >> numBits, this.unsigned);
            else
                return fromBits(this.high >> (numBits - 32), this.high >= 0 ? 0 : -1, this.unsigned);
        };

        /**
         * Returns this Long with bits arithmetically shifted to the right by the given amount. This is an alias of {@link Long#shiftRight}.
         * @function
         * @param {number|!Long} numBits Number of bits
         * @returns {!Long} Shifted Long
         * @expose
         */
        LongPrototype.shr = LongPrototype.shiftRight;

        /**
         * Returns this Long with bits logically shifted to the right by the given amount.
         * @param {number|!Long} numBits Number of bits
         * @returns {!Long} Shifted Long
         * @expose
         */
        LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
            if (isLong(numBits))
                numBits = numBits.toInt();
            numBits &= 63;
            if (numBits === 0)
                return this;
            else {
                var high = this.high;
                if (numBits < 32) {
                    var low = this.low;
                    return fromBits((low >>> numBits) | (high << (32 - numBits)), high >>> numBits, this.unsigned);
                } else if (numBits === 32)
                    return fromBits(high, 0, this.unsigned);
                else
                    return fromBits(high >>> (numBits - 32), 0, this.unsigned);
            }
        };

        /**
         * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
         * @function
         * @param {number|!Long} numBits Number of bits
         * @returns {!Long} Shifted Long
         * @expose
         */
        LongPrototype.shru = LongPrototype.shiftRightUnsigned;

        /**
         * Converts this Long to signed.
         * @returns {!Long} Signed long
         * @expose
         */
        LongPrototype.toSigned = function toSigned() {
            if (!this.unsigned)
                return this;
            return fromBits(this.low, this.high, false);
        };

        /**
         * Converts this Long to unsigned.
         * @returns {!Long} Unsigned long
         * @expose
         */
        LongPrototype.toUnsigned = function toUnsigned() {
            if (this.unsigned)
                return this;
            return fromBits(this.low, this.high, true);
        };

        return Long;
    });
    });

    var require$$0$7 = (long && typeof long === 'object' && 'default' in long ? long['default'] : long);

    var bytebuffer = __commonjs(function (module, exports, global) {
    /*
     Copyright 2013-2014 Daniel Wirtz <dcode@dcode.io>

     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
     */

    /**
     * @license bytebuffer.js (c) 2015 Daniel Wirtz <dcode@dcode.io>
     * Backing buffer: ArrayBuffer, Accessor: Uint8Array
     * Released under the Apache License, Version 2.0
     * see: https://github.com/dcodeIO/bytebuffer.js for details
     */
    (function(global, factory) {

        /* AMD */ if (typeof define === 'function' && define["amd"])
            define(["long"], factory);
        /* CommonJS */ else if (typeof require === 'function' && typeof module === "object" && module && module["exports"])
            module['exports'] = (function() {
                var Long; try { Long = require$$0$7; } catch (e) {}
                return factory(Long);
            })();
        /* Global */ else
            (global["dcodeIO"] = global["dcodeIO"] || {})["ByteBuffer"] = factory(global["dcodeIO"]["Long"]);

    })(__commonjs_global, function(Long) {
        "use strict";

        /**
         * Constructs a new ByteBuffer.
         * @class The swiss army knife for binary data in JavaScript.
         * @exports ByteBuffer
         * @constructor
         * @param {number=} capacity Initial capacity. Defaults to {@link ByteBuffer.DEFAULT_CAPACITY}.
         * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
         *  {@link ByteBuffer.DEFAULT_ENDIAN}.
         * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to
         *  {@link ByteBuffer.DEFAULT_NOASSERT}.
         * @expose
         */
        var ByteBuffer = function(capacity, littleEndian, noAssert) {
            if (typeof capacity === 'undefined')
                capacity = ByteBuffer.DEFAULT_CAPACITY;
            if (typeof littleEndian === 'undefined')
                littleEndian = ByteBuffer.DEFAULT_ENDIAN;
            if (typeof noAssert === 'undefined')
                noAssert = ByteBuffer.DEFAULT_NOASSERT;
            if (!noAssert) {
                capacity = capacity | 0;
                if (capacity < 0)
                    throw RangeError("Illegal capacity");
                littleEndian = !!littleEndian;
                noAssert = !!noAssert;
            }

            /**
             * Backing ArrayBuffer.
             * @type {!ArrayBuffer}
             * @expose
             */
            this.buffer = capacity === 0 ? EMPTY_BUFFER : new ArrayBuffer(capacity);

            /**
             * Uint8Array utilized to manipulate the backing buffer. Becomes `null` if the backing buffer has a capacity of `0`.
             * @type {?Uint8Array}
             * @expose
             */
            this.view = capacity === 0 ? null : new Uint8Array(this.buffer);

            /**
             * Absolute read/write offset.
             * @type {number}
             * @expose
             * @see ByteBuffer#flip
             * @see ByteBuffer#clear
             */
            this.offset = 0;

            /**
             * Marked offset.
             * @type {number}
             * @expose
             * @see ByteBuffer#mark
             * @see ByteBuffer#reset
             */
            this.markedOffset = -1;

            /**
             * Absolute limit of the contained data. Set to the backing buffer's capacity upon allocation.
             * @type {number}
             * @expose
             * @see ByteBuffer#flip
             * @see ByteBuffer#clear
             */
            this.limit = capacity;

            /**
             * Whether to use little endian byte order, defaults to `false` for big endian.
             * @type {boolean}
             * @expose
             */
            this.littleEndian = typeof littleEndian !== 'undefined' ? !!littleEndian : false;

            /**
             * Whether to skip assertions of offsets and values, defaults to `false`.
             * @type {boolean}
             * @expose
             */
            this.noAssert = !!noAssert;
        };

        /**
         * ByteBuffer version.
         * @type {string}
         * @const
         * @expose
         */
        ByteBuffer.VERSION = "5.0.0";

        /**
         * Little endian constant that can be used instead of its boolean value. Evaluates to `true`.
         * @type {boolean}
         * @const
         * @expose
         */
        ByteBuffer.LITTLE_ENDIAN = true;

        /**
         * Big endian constant that can be used instead of its boolean value. Evaluates to `false`.
         * @type {boolean}
         * @const
         * @expose
         */
        ByteBuffer.BIG_ENDIAN = false;

        /**
         * Default initial capacity of `16`.
         * @type {number}
         * @expose
         */
        ByteBuffer.DEFAULT_CAPACITY = 16;

        /**
         * Default endianess of `false` for big endian.
         * @type {boolean}
         * @expose
         */
        ByteBuffer.DEFAULT_ENDIAN = ByteBuffer.BIG_ENDIAN;

        /**
         * Default no assertions flag of `false`.
         * @type {boolean}
         * @expose
         */
        ByteBuffer.DEFAULT_NOASSERT = false;

        /**
         * A `Long` class for representing a 64-bit two's-complement integer value. May be `null` if Long.js has not been loaded
         *  and int64 support is not available.
         * @type {?Long}
         * @const
         * @see https://github.com/dcodeIO/Long.js
         * @expose
         */
        ByteBuffer.Long = Long || null;

        /**
         * @alias ByteBuffer.prototype
         * @inner
         */
        var ByteBufferPrototype = ByteBuffer.prototype;

        /**
         * An indicator used to reliably determine if an object is a ByteBuffer or not.
         * @type {boolean}
         * @const
         * @expose
         * @private
         */
        ByteBufferPrototype.__isByteBuffer__;

        Object.defineProperty(ByteBufferPrototype, "__isByteBuffer__", {
            value: true,
            enumerable: false,
            configurable: false
        });

        // helpers

        /**
         * @type {!ArrayBuffer}
         * @inner
         */
        var EMPTY_BUFFER = new ArrayBuffer(0);

        /**
         * String.fromCharCode reference for compile-time renaming.
         * @type {function(...number):string}
         * @inner
         */
        var stringFromCharCode = String.fromCharCode;

        /**
         * Creates a source function for a string.
         * @param {string} s String to read from
         * @returns {function():number|null} Source function returning the next char code respectively `null` if there are
         *  no more characters left.
         * @throws {TypeError} If the argument is invalid
         * @inner
         */
        function stringSource(s) {
            var i=0; return function() {
                return i < s.length ? s.charCodeAt(i++) : null;
            };
        }

        /**
         * Creates a destination function for a string.
         * @returns {function(number=):undefined|string} Destination function successively called with the next char code.
         *  Returns the final string when called without arguments.
         * @inner
         */
        function stringDestination() {
            var cs = [], ps = []; return function() {
                if (arguments.length === 0)
                    return ps.join('')+stringFromCharCode.apply(String, cs);
                if (cs.length + arguments.length > 1024)
                    ps.push(stringFromCharCode.apply(String, cs)),
                        cs.length = 0;
                Array.prototype.push.apply(cs, arguments);
            };
        }

        /**
         * Gets the accessor type.
         * @returns {Function} `Buffer` under node.js, `Uint8Array` respectively `DataView` in the browser (classes)
         * @expose
         */
        ByteBuffer.accessor = function() {
            return Uint8Array;
        };
        /**
         * Allocates a new ByteBuffer backed by a buffer of the specified capacity.
         * @param {number=} capacity Initial capacity. Defaults to {@link ByteBuffer.DEFAULT_CAPACITY}.
         * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
         *  {@link ByteBuffer.DEFAULT_ENDIAN}.
         * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to
         *  {@link ByteBuffer.DEFAULT_NOASSERT}.
         * @returns {!ByteBuffer}
         * @expose
         */
        ByteBuffer.allocate = function(capacity, littleEndian, noAssert) {
            return new ByteBuffer(capacity, littleEndian, noAssert);
        };

        /**
         * Concatenates multiple ByteBuffers into one.
         * @param {!Array.<!ByteBuffer|!ArrayBuffer|!Uint8Array|string>} buffers Buffers to concatenate
         * @param {(string|boolean)=} encoding String encoding if `buffers` contains a string ("base64", "hex", "binary",
         *  defaults to "utf8")
         * @param {boolean=} littleEndian Whether to use little or big endian byte order for the resulting ByteBuffer. Defaults
         *  to {@link ByteBuffer.DEFAULT_ENDIAN}.
         * @param {boolean=} noAssert Whether to skip assertions of offsets and values for the resulting ByteBuffer. Defaults to
         *  {@link ByteBuffer.DEFAULT_NOASSERT}.
         * @returns {!ByteBuffer} Concatenated ByteBuffer
         * @expose
         */
        ByteBuffer.concat = function(buffers, encoding, littleEndian, noAssert) {
            if (typeof encoding === 'boolean' || typeof encoding !== 'string') {
                noAssert = littleEndian;
                littleEndian = encoding;
                encoding = undefined;
            }
            var capacity = 0;
            for (var i=0, k=buffers.length, length; i<k; ++i) {
                if (!ByteBuffer.isByteBuffer(buffers[i]))
                    buffers[i] = ByteBuffer.wrap(buffers[i], encoding);
                length = buffers[i].limit - buffers[i].offset;
                if (length > 0) capacity += length;
            }
            if (capacity === 0)
                return new ByteBuffer(0, littleEndian, noAssert);
            var bb = new ByteBuffer(capacity, littleEndian, noAssert),
                bi;
            i=0; while (i<k) {
                bi = buffers[i++];
                length = bi.limit - bi.offset;
                if (length <= 0) continue;
                bb.view.set(bi.view.subarray(bi.offset, bi.limit), bb.offset);
                bb.offset += length;
            }
            bb.limit = bb.offset;
            bb.offset = 0;
            return bb;
        };

        /**
         * Tests if the specified type is a ByteBuffer.
         * @param {*} bb ByteBuffer to test
         * @returns {boolean} `true` if it is a ByteBuffer, otherwise `false`
         * @expose
         */
        ByteBuffer.isByteBuffer = function(bb) {
            return (bb && bb["__isByteBuffer__"]) === true;
        };
        /**
         * Gets the backing buffer type.
         * @returns {Function} `Buffer` under node.js, `ArrayBuffer` in the browser (classes)
         * @expose
         */
        ByteBuffer.type = function() {
            return ArrayBuffer;
        };
        /**
         * Wraps a buffer or a string. Sets the allocated ByteBuffer's {@link ByteBuffer#offset} to `0` and its
         *  {@link ByteBuffer#limit} to the length of the wrapped data.
         * @param {!ByteBuffer|!ArrayBuffer|!Uint8Array|string|!Array.<number>} buffer Anything that can be wrapped
         * @param {(string|boolean)=} encoding String encoding if `buffer` is a string ("base64", "hex", "binary", defaults to
         *  "utf8")
         * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
         *  {@link ByteBuffer.DEFAULT_ENDIAN}.
         * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to
         *  {@link ByteBuffer.DEFAULT_NOASSERT}.
         * @returns {!ByteBuffer} A ByteBuffer wrapping `buffer`
         * @expose
         */
        ByteBuffer.wrap = function(buffer, encoding, littleEndian, noAssert) {
            if (typeof encoding !== 'string') {
                noAssert = littleEndian;
                littleEndian = encoding;
                encoding = undefined;
            }
            if (typeof buffer === 'string') {
                if (typeof encoding === 'undefined')
                    encoding = "utf8";
                switch (encoding) {
                    case "base64":
                        return ByteBuffer.fromBase64(buffer, littleEndian);
                    case "hex":
                        return ByteBuffer.fromHex(buffer, littleEndian);
                    case "binary":
                        return ByteBuffer.fromBinary(buffer, littleEndian);
                    case "utf8":
                        return ByteBuffer.fromUTF8(buffer, littleEndian);
                    case "debug":
                        return ByteBuffer.fromDebug(buffer, littleEndian);
                    default:
                        throw Error("Unsupported encoding: "+encoding);
                }
            }
            if (buffer === null || typeof buffer !== 'object')
                throw TypeError("Illegal buffer");
            var bb;
            if (ByteBuffer.isByteBuffer(buffer)) {
                bb = ByteBufferPrototype.clone.call(buffer);
                bb.markedOffset = -1;
                return bb;
            }
            if (buffer instanceof Uint8Array) { // Extract ArrayBuffer from Uint8Array
                bb = new ByteBuffer(0, littleEndian, noAssert);
                if (buffer.length > 0) { // Avoid references to more than one EMPTY_BUFFER
                    bb.buffer = buffer.buffer;
                    bb.offset = buffer.byteOffset;
                    bb.limit = buffer.byteOffset + buffer.byteLength;
                    bb.view = new Uint8Array(buffer.buffer);
                }
            } else if (buffer instanceof ArrayBuffer) { // Reuse ArrayBuffer
                bb = new ByteBuffer(0, littleEndian, noAssert);
                if (buffer.byteLength > 0) {
                    bb.buffer = buffer;
                    bb.offset = 0;
                    bb.limit = buffer.byteLength;
                    bb.view = buffer.byteLength > 0 ? new Uint8Array(buffer) : null;
                }
            } else if (Object.prototype.toString.call(buffer) === "[object Array]") { // Create from octets
                bb = new ByteBuffer(buffer.length, littleEndian, noAssert);
                bb.limit = buffer.length;
                for (var i=0; i<buffer.length; ++i)
                    bb.view[i] = buffer[i];
            } else
                throw TypeError("Illegal buffer"); // Otherwise fail
            return bb;
        };

        /**
         * Reads the specified number of bytes.
         * @param {number} length Number of bytes to read
         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `length` if omitted.
         * @returns {!ByteBuffer}
         * @expose
         */
        ByteBufferPrototype.readBytes = function(length, offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + length > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+length+") <= "+this.buffer.byteLength);
            }
            var slice = this.slice(offset, offset + length);
            if (relative) this.offset += length;
            return slice;
        };

        /**
         * Writes a payload of bytes. This is an alias of {@link ByteBuffer#append}.
         * @function
         * @param {!ByteBuffer|!ArrayBuffer|!Uint8Array|string} source Data to write. If `source` is a ByteBuffer, its offsets
         *  will be modified according to the performed read operation.
         * @param {(string|number)=} encoding Encoding if `data` is a string ("base64", "hex", "binary", defaults to "utf8")
         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
         *  written if omitted.
         * @returns {!ByteBuffer} this
         * @expose
         */
        ByteBufferPrototype.writeBytes = ByteBufferPrototype.append;

        // types/ints/int8

        /**
         * Writes an 8bit signed integer.
         * @param {number} value Value to write
         * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
         * @returns {!ByteBuffer} this
         * @expose
         */
        ByteBufferPrototype.writeInt8 = function(value, offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof value !== 'number' || value % 1 !== 0)
                    throw TypeError("Illegal value: "+value+" (not an integer)");
                value |= 0;
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 0 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
            }
            offset += 1;
            var capacity0 = this.buffer.byteLength;
            if (offset > capacity0)
                this.resize((capacity0 *= 2) > offset ? capacity0 : offset);
            offset -= 1;
            this.view[offset] = value;
            if (relative) this.offset += 1;
            return this;
        };

        /**
         * Writes an 8bit signed integer. This is an alias of {@link ByteBuffer#writeInt8}.
         * @function
         * @param {number} value Value to write
         * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
         * @returns {!ByteBuffer} this
         * @expose
         */
        ByteBufferPrototype.writeByte = ByteBufferPrototype.writeInt8;

        /**
         * Reads an 8bit signed integer.
         * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
         * @returns {number} Value read
         * @expose
         */
        ByteBufferPrototype.readInt8 = function(offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 1 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+1+") <= "+this.buffer.byteLength);
            }
            var value = this.view[offset];
            if ((value & 0x80) === 0x80) value = -(0xFF - value + 1); // Cast to signed
            if (relative) this.offset += 1;
            return value;
        };

        /**
         * Reads an 8bit signed integer. This is an alias of {@link ByteBuffer#readInt8}.
         * @function
         * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
         * @returns {number} Value read
         * @expose
         */
        ByteBufferPrototype.readByte = ByteBufferPrototype.readInt8;

        /**
         * Writes an 8bit unsigned integer.
         * @param {number} value Value to write
         * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
         * @returns {!ByteBuffer} this
         * @expose
         */
        ByteBufferPrototype.writeUint8 = function(value, offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof value !== 'number' || value % 1 !== 0)
                    throw TypeError("Illegal value: "+value+" (not an integer)");
                value >>>= 0;
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 0 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
            }
            offset += 1;
            var capacity1 = this.buffer.byteLength;
            if (offset > capacity1)
                this.resize((capacity1 *= 2) > offset ? capacity1 : offset);
            offset -= 1;
            this.view[offset] = value;
            if (relative) this.offset += 1;
            return this;
        };

        /**
         * Writes an 8bit unsigned integer. This is an alias of {@link ByteBuffer#writeUint8}.
         * @function
         * @param {number} value Value to write
         * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
         * @returns {!ByteBuffer} this
         * @expose
         */
        ByteBufferPrototype.writeUInt8 = ByteBufferPrototype.writeUint8;

        /**
         * Reads an 8bit unsigned integer.
         * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
         * @returns {number} Value read
         * @expose
         */
        ByteBufferPrototype.readUint8 = function(offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 1 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+1+") <= "+this.buffer.byteLength);
            }
            var value = this.view[offset];
            if (relative) this.offset += 1;
            return value;
        };

        /**
         * Reads an 8bit unsigned integer. This is an alias of {@link ByteBuffer#readUint8}.
         * @function
         * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
         * @returns {number} Value read
         * @expose
         */
        ByteBufferPrototype.readUInt8 = ByteBufferPrototype.readUint8;

        // types/ints/int16

        /**
         * Writes a 16bit signed integer.
         * @param {number} value Value to write
         * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
         * @throws {TypeError} If `offset` or `value` is not a valid number
         * @throws {RangeError} If `offset` is out of bounds
         * @expose
         */
        ByteBufferPrototype.writeInt16 = function(value, offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof value !== 'number' || value % 1 !== 0)
                    throw TypeError("Illegal value: "+value+" (not an integer)");
                value |= 0;
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 0 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
            }
            offset += 2;
            var capacity2 = this.buffer.byteLength;
            if (offset > capacity2)
                this.resize((capacity2 *= 2) > offset ? capacity2 : offset);
            offset -= 2;
            if (this.littleEndian) {
                this.view[offset+1] = (value & 0xFF00) >>> 8;
                this.view[offset  ] =  value & 0x00FF;
            } else {
                this.view[offset]   = (value & 0xFF00) >>> 8;
                this.view[offset+1] =  value & 0x00FF;
            }
            if (relative) this.offset += 2;
            return this;
        };

        /**
         * Writes a 16bit signed integer. This is an alias of {@link ByteBuffer#writeInt16}.
         * @function
         * @param {number} value Value to write
         * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
         * @throws {TypeError} If `offset` or `value` is not a valid number
         * @throws {RangeError} If `offset` is out of bounds
         * @expose
         */
        ByteBufferPrototype.writeShort = ByteBufferPrototype.writeInt16;

        /**
         * Reads a 16bit signed integer.
         * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
         * @returns {number} Value read
         * @throws {TypeError} If `offset` is not a valid number
         * @throws {RangeError} If `offset` is out of bounds
         * @expose
         */
        ByteBufferPrototype.readInt16 = function(offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 2 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+2+") <= "+this.buffer.byteLength);
            }
            var value = 0;
            if (this.littleEndian) {
                value  = this.view[offset  ];
                value |= this.view[offset+1] << 8;
            } else {
                value  = this.view[offset  ] << 8;
                value |= this.view[offset+1];
            }
            if ((value & 0x8000) === 0x8000) value = -(0xFFFF - value + 1); // Cast to signed
            if (relative) this.offset += 2;
            return value;
        };

        /**
         * Reads a 16bit signed integer. This is an alias of {@link ByteBuffer#readInt16}.
         * @function
         * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
         * @returns {number} Value read
         * @throws {TypeError} If `offset` is not a valid number
         * @throws {RangeError} If `offset` is out of bounds
         * @expose
         */
        ByteBufferPrototype.readShort = ByteBufferPrototype.readInt16;

        /**
         * Writes a 16bit unsigned integer.
         * @param {number} value Value to write
         * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
         * @throws {TypeError} If `offset` or `value` is not a valid number
         * @throws {RangeError} If `offset` is out of bounds
         * @expose
         */
        ByteBufferPrototype.writeUint16 = function(value, offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof value !== 'number' || value % 1 !== 0)
                    throw TypeError("Illegal value: "+value+" (not an integer)");
                value >>>= 0;
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 0 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
            }
            offset += 2;
            var capacity3 = this.buffer.byteLength;
            if (offset > capacity3)
                this.resize((capacity3 *= 2) > offset ? capacity3 : offset);
            offset -= 2;
            if (this.littleEndian) {
                this.view[offset+1] = (value & 0xFF00) >>> 8;
                this.view[offset  ] =  value & 0x00FF;
            } else {
                this.view[offset]   = (value & 0xFF00) >>> 8;
                this.view[offset+1] =  value & 0x00FF;
            }
            if (relative) this.offset += 2;
            return this;
        };

        /**
         * Writes a 16bit unsigned integer. This is an alias of {@link ByteBuffer#writeUint16}.
         * @function
         * @param {number} value Value to write
         * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
         * @throws {TypeError} If `offset` or `value` is not a valid number
         * @throws {RangeError} If `offset` is out of bounds
         * @expose
         */
        ByteBufferPrototype.writeUInt16 = ByteBufferPrototype.writeUint16;

        /**
         * Reads a 16bit unsigned integer.
         * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
         * @returns {number} Value read
         * @throws {TypeError} If `offset` is not a valid number
         * @throws {RangeError} If `offset` is out of bounds
         * @expose
         */
        ByteBufferPrototype.readUint16 = function(offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 2 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+2+") <= "+this.buffer.byteLength);
            }
            var value = 0;
            if (this.littleEndian) {
                value  = this.view[offset  ];
                value |= this.view[offset+1] << 8;
            } else {
                value  = this.view[offset  ] << 8;
                value |= this.view[offset+1];
            }
            if (relative) this.offset += 2;
            return value;
        };

        /**
         * Reads a 16bit unsigned integer. This is an alias of {@link ByteBuffer#readUint16}.
         * @function
         * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
         * @returns {number} Value read
         * @throws {TypeError} If `offset` is not a valid number
         * @throws {RangeError} If `offset` is out of bounds
         * @expose
         */
        ByteBufferPrototype.readUInt16 = ByteBufferPrototype.readUint16;

        // types/ints/int32

        /**
         * Writes a 32bit signed integer.
         * @param {number} value Value to write
         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
         * @expose
         */
        ByteBufferPrototype.writeInt32 = function(value, offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof value !== 'number' || value % 1 !== 0)
                    throw TypeError("Illegal value: "+value+" (not an integer)");
                value |= 0;
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 0 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
            }
            offset += 4;
            var capacity4 = this.buffer.byteLength;
            if (offset > capacity4)
                this.resize((capacity4 *= 2) > offset ? capacity4 : offset);
            offset -= 4;
            if (this.littleEndian) {
                this.view[offset+3] = (value >>> 24) & 0xFF;
                this.view[offset+2] = (value >>> 16) & 0xFF;
                this.view[offset+1] = (value >>>  8) & 0xFF;
                this.view[offset  ] =  value         & 0xFF;
            } else {
                this.view[offset  ] = (value >>> 24) & 0xFF;
                this.view[offset+1] = (value >>> 16) & 0xFF;
                this.view[offset+2] = (value >>>  8) & 0xFF;
                this.view[offset+3] =  value         & 0xFF;
            }
            if (relative) this.offset += 4;
            return this;
        };

        /**
         * Writes a 32bit signed integer. This is an alias of {@link ByteBuffer#writeInt32}.
         * @param {number} value Value to write
         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
         * @expose
         */
        ByteBufferPrototype.writeInt = ByteBufferPrototype.writeInt32;

        /**
         * Reads a 32bit signed integer.
         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
         * @returns {number} Value read
         * @expose
         */
        ByteBufferPrototype.readInt32 = function(offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 4 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+4+") <= "+this.buffer.byteLength);
            }
            var value = 0;
            if (this.littleEndian) {
                value  = this.view[offset+2] << 16;
                value |= this.view[offset+1] <<  8;
                value |= this.view[offset  ];
                value += this.view[offset+3] << 24 >>> 0;
            } else {
                value  = this.view[offset+1] << 16;
                value |= this.view[offset+2] <<  8;
                value |= this.view[offset+3];
                value += this.view[offset  ] << 24 >>> 0;
            }
            value |= 0; // Cast to signed
            if (relative) this.offset += 4;
            return value;
        };

        /**
         * Reads a 32bit signed integer. This is an alias of {@link ByteBuffer#readInt32}.
         * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `4` if omitted.
         * @returns {number} Value read
         * @expose
         */
        ByteBufferPrototype.readInt = ByteBufferPrototype.readInt32;

        /**
         * Writes a 32bit unsigned integer.
         * @param {number} value Value to write
         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
         * @expose
         */
        ByteBufferPrototype.writeUint32 = function(value, offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof value !== 'number' || value % 1 !== 0)
                    throw TypeError("Illegal value: "+value+" (not an integer)");
                value >>>= 0;
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 0 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
            }
            offset += 4;
            var capacity5 = this.buffer.byteLength;
            if (offset > capacity5)
                this.resize((capacity5 *= 2) > offset ? capacity5 : offset);
            offset -= 4;
            if (this.littleEndian) {
                this.view[offset+3] = (value >>> 24) & 0xFF;
                this.view[offset+2] = (value >>> 16) & 0xFF;
                this.view[offset+1] = (value >>>  8) & 0xFF;
                this.view[offset  ] =  value         & 0xFF;
            } else {
                this.view[offset  ] = (value >>> 24) & 0xFF;
                this.view[offset+1] = (value >>> 16) & 0xFF;
                this.view[offset+2] = (value >>>  8) & 0xFF;
                this.view[offset+3] =  value         & 0xFF;
            }
            if (relative) this.offset += 4;
            return this;
        };

        /**
         * Writes a 32bit unsigned integer. This is an alias of {@link ByteBuffer#writeUint32}.
         * @function
         * @param {number} value Value to write
         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
         * @expose
         */
        ByteBufferPrototype.writeUInt32 = ByteBufferPrototype.writeUint32;

        /**
         * Reads a 32bit unsigned integer.
         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
         * @returns {number} Value read
         * @expose
         */
        ByteBufferPrototype.readUint32 = function(offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 4 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+4+") <= "+this.buffer.byteLength);
            }
            var value = 0;
            if (this.littleEndian) {
                value  = this.view[offset+2] << 16;
                value |= this.view[offset+1] <<  8;
                value |= this.view[offset  ];
                value += this.view[offset+3] << 24 >>> 0;
            } else {
                value  = this.view[offset+1] << 16;
                value |= this.view[offset+2] <<  8;
                value |= this.view[offset+3];
                value += this.view[offset  ] << 24 >>> 0;
            }
            if (relative) this.offset += 4;
            return value;
        };

        /**
         * Reads a 32bit unsigned integer. This is an alias of {@link ByteBuffer#readUint32}.
         * @function
         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
         * @returns {number} Value read
         * @expose
         */
        ByteBufferPrototype.readUInt32 = ByteBufferPrototype.readUint32;

        // types/ints/int64

        if (Long) {

            /**
             * Writes a 64bit signed integer.
             * @param {number|!Long} value Value to write
             * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
             * @returns {!ByteBuffer} this
             * @expose
             */
            ByteBufferPrototype.writeInt64 = function(value, offset) {
                var relative = typeof offset === 'undefined';
                if (relative) offset = this.offset;
                if (!this.noAssert) {
                    if (typeof value === 'number')
                        value = Long.fromNumber(value);
                    else if (typeof value === 'string')
                        value = Long.fromString(value);
                    else if (!(value && value instanceof Long))
                        throw TypeError("Illegal value: "+value+" (not an integer or Long)");
                    if (typeof offset !== 'number' || offset % 1 !== 0)
                        throw TypeError("Illegal offset: "+offset+" (not an integer)");
                    offset >>>= 0;
                    if (offset < 0 || offset + 0 > this.buffer.byteLength)
                        throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
                }
                if (typeof value === 'number')
                    value = Long.fromNumber(value);
                else if (typeof value === 'string')
                    value = Long.fromString(value);
                offset += 8;
                var capacity6 = this.buffer.byteLength;
                if (offset > capacity6)
                    this.resize((capacity6 *= 2) > offset ? capacity6 : offset);
                offset -= 8;
                var lo = value.low,
                    hi = value.high;
                if (this.littleEndian) {
                    this.view[offset+3] = (lo >>> 24) & 0xFF;
                    this.view[offset+2] = (lo >>> 16) & 0xFF;
                    this.view[offset+1] = (lo >>>  8) & 0xFF;
                    this.view[offset  ] =  lo         & 0xFF;
                    offset += 4;
                    this.view[offset+3] = (hi >>> 24) & 0xFF;
                    this.view[offset+2] = (hi >>> 16) & 0xFF;
                    this.view[offset+1] = (hi >>>  8) & 0xFF;
                    this.view[offset  ] =  hi         & 0xFF;
                } else {
                    this.view[offset  ] = (hi >>> 24) & 0xFF;
                    this.view[offset+1] = (hi >>> 16) & 0xFF;
                    this.view[offset+2] = (hi >>>  8) & 0xFF;
                    this.view[offset+3] =  hi         & 0xFF;
                    offset += 4;
                    this.view[offset  ] = (lo >>> 24) & 0xFF;
                    this.view[offset+1] = (lo >>> 16) & 0xFF;
                    this.view[offset+2] = (lo >>>  8) & 0xFF;
                    this.view[offset+3] =  lo         & 0xFF;
                }
                if (relative) this.offset += 8;
                return this;
            };

            /**
             * Writes a 64bit signed integer. This is an alias of {@link ByteBuffer#writeInt64}.
             * @param {number|!Long} value Value to write
             * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
             * @returns {!ByteBuffer} this
             * @expose
             */
            ByteBufferPrototype.writeLong = ByteBufferPrototype.writeInt64;

            /**
             * Reads a 64bit signed integer.
             * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
             * @returns {!Long}
             * @expose
             */
            ByteBufferPrototype.readInt64 = function(offset) {
                var relative = typeof offset === 'undefined';
                if (relative) offset = this.offset;
                if (!this.noAssert) {
                    if (typeof offset !== 'number' || offset % 1 !== 0)
                        throw TypeError("Illegal offset: "+offset+" (not an integer)");
                    offset >>>= 0;
                    if (offset < 0 || offset + 8 > this.buffer.byteLength)
                        throw RangeError("Illegal offset: 0 <= "+offset+" (+"+8+") <= "+this.buffer.byteLength);
                }
                var lo = 0,
                    hi = 0;
                if (this.littleEndian) {
                    lo  = this.view[offset+2] << 16;
                    lo |= this.view[offset+1] <<  8;
                    lo |= this.view[offset  ];
                    lo += this.view[offset+3] << 24 >>> 0;
                    offset += 4;
                    hi  = this.view[offset+2] << 16;
                    hi |= this.view[offset+1] <<  8;
                    hi |= this.view[offset  ];
                    hi += this.view[offset+3] << 24 >>> 0;
                } else {
                    hi  = this.view[offset+1] << 16;
                    hi |= this.view[offset+2] <<  8;
                    hi |= this.view[offset+3];
                    hi += this.view[offset  ] << 24 >>> 0;
                    offset += 4;
                    lo  = this.view[offset+1] << 16;
                    lo |= this.view[offset+2] <<  8;
                    lo |= this.view[offset+3];
                    lo += this.view[offset  ] << 24 >>> 0;
                }
                var value = new Long(lo, hi, false);
                if (relative) this.offset += 8;
                return value;
            };

            /**
             * Reads a 64bit signed integer. This is an alias of {@link ByteBuffer#readInt64}.
             * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
             * @returns {!Long}
             * @expose
             */
            ByteBufferPrototype.readLong = ByteBufferPrototype.readInt64;

            /**
             * Writes a 64bit unsigned integer.
             * @param {number|!Long} value Value to write
             * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
             * @returns {!ByteBuffer} this
             * @expose
             */
            ByteBufferPrototype.writeUint64 = function(value, offset) {
                var relative = typeof offset === 'undefined';
                if (relative) offset = this.offset;
                if (!this.noAssert) {
                    if (typeof value === 'number')
                        value = Long.fromNumber(value);
                    else if (typeof value === 'string')
                        value = Long.fromString(value);
                    else if (!(value && value instanceof Long))
                        throw TypeError("Illegal value: "+value+" (not an integer or Long)");
                    if (typeof offset !== 'number' || offset % 1 !== 0)
                        throw TypeError("Illegal offset: "+offset+" (not an integer)");
                    offset >>>= 0;
                    if (offset < 0 || offset + 0 > this.buffer.byteLength)
                        throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
                }
                if (typeof value === 'number')
                    value = Long.fromNumber(value);
                else if (typeof value === 'string')
                    value = Long.fromString(value);
                offset += 8;
                var capacity7 = this.buffer.byteLength;
                if (offset > capacity7)
                    this.resize((capacity7 *= 2) > offset ? capacity7 : offset);
                offset -= 8;
                var lo = value.low,
                    hi = value.high;
                if (this.littleEndian) {
                    this.view[offset+3] = (lo >>> 24) & 0xFF;
                    this.view[offset+2] = (lo >>> 16) & 0xFF;
                    this.view[offset+1] = (lo >>>  8) & 0xFF;
                    this.view[offset  ] =  lo         & 0xFF;
                    offset += 4;
                    this.view[offset+3] = (hi >>> 24) & 0xFF;
                    this.view[offset+2] = (hi >>> 16) & 0xFF;
                    this.view[offset+1] = (hi >>>  8) & 0xFF;
                    this.view[offset  ] =  hi         & 0xFF;
                } else {
                    this.view[offset  ] = (hi >>> 24) & 0xFF;
                    this.view[offset+1] = (hi >>> 16) & 0xFF;
                    this.view[offset+2] = (hi >>>  8) & 0xFF;
                    this.view[offset+3] =  hi         & 0xFF;
                    offset += 4;
                    this.view[offset  ] = (lo >>> 24) & 0xFF;
                    this.view[offset+1] = (lo >>> 16) & 0xFF;
                    this.view[offset+2] = (lo >>>  8) & 0xFF;
                    this.view[offset+3] =  lo         & 0xFF;
                }
                if (relative) this.offset += 8;
                return this;
            };

            /**
             * Writes a 64bit unsigned integer. This is an alias of {@link ByteBuffer#writeUint64}.
             * @function
             * @param {number|!Long} value Value to write
             * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
             * @returns {!ByteBuffer} this
             * @expose
             */
            ByteBufferPrototype.writeUInt64 = ByteBufferPrototype.writeUint64;

            /**
             * Reads a 64bit unsigned integer.
             * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
             * @returns {!Long}
             * @expose
             */
            ByteBufferPrototype.readUint64 = function(offset) {
                var relative = typeof offset === 'undefined';
                if (relative) offset = this.offset;
                if (!this.noAssert) {
                    if (typeof offset !== 'number' || offset % 1 !== 0)
                        throw TypeError("Illegal offset: "+offset+" (not an integer)");
                    offset >>>= 0;
                    if (offset < 0 || offset + 8 > this.buffer.byteLength)
                        throw RangeError("Illegal offset: 0 <= "+offset+" (+"+8+") <= "+this.buffer.byteLength);
                }
                var lo = 0,
                    hi = 0;
                if (this.littleEndian) {
                    lo  = this.view[offset+2] << 16;
                    lo |= this.view[offset+1] <<  8;
                    lo |= this.view[offset  ];
                    lo += this.view[offset+3] << 24 >>> 0;
                    offset += 4;
                    hi  = this.view[offset+2] << 16;
                    hi |= this.view[offset+1] <<  8;
                    hi |= this.view[offset  ];
                    hi += this.view[offset+3] << 24 >>> 0;
                } else {
                    hi  = this.view[offset+1] << 16;
                    hi |= this.view[offset+2] <<  8;
                    hi |= this.view[offset+3];
                    hi += this.view[offset  ] << 24 >>> 0;
                    offset += 4;
                    lo  = this.view[offset+1] << 16;
                    lo |= this.view[offset+2] <<  8;
                    lo |= this.view[offset+3];
                    lo += this.view[offset  ] << 24 >>> 0;
                }
                var value = new Long(lo, hi, true);
                if (relative) this.offset += 8;
                return value;
            };

            /**
             * Reads a 64bit unsigned integer. This is an alias of {@link ByteBuffer#readUint64}.
             * @function
             * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
             * @returns {!Long}
             * @expose
             */
            ByteBufferPrototype.readUInt64 = ByteBufferPrototype.readUint64;

        } // Long


        // types/floats/float32

        /*
         ieee754 - https://github.com/feross/ieee754

         The MIT License (MIT)

         Copyright (c) Feross Aboukhadijeh

         Permission is hereby granted, free of charge, to any person obtaining a copy
         of this software and associated documentation files (the "Software"), to deal
         in the Software without restriction, including without limitation the rights
         to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
         copies of the Software, and to permit persons to whom the Software is
         furnished to do so, subject to the following conditions:

         The above copyright notice and this permission notice shall be included in
         all copies or substantial portions of the Software.

         THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
         IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
         FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
         AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
         LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
         OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
         THE SOFTWARE.
        */

        /**
         * Reads an IEEE754 float from a byte array.
         * @param {!Array} buffer
         * @param {number} offset
         * @param {boolean} isLE
         * @param {number} mLen
         * @param {number} nBytes
         * @returns {number}
         * @inner
         */
        function ieee754_read(buffer, offset, isLE, mLen, nBytes) {
            var e, m,
                eLen = nBytes * 8 - mLen - 1,
                eMax = (1 << eLen) - 1,
                eBias = eMax >> 1,
                nBits = -7,
                i = isLE ? (nBytes - 1) : 0,
                d = isLE ? -1 : 1,
                s = buffer[offset + i];

            i += d;

            e = s & ((1 << (-nBits)) - 1);
            s >>= (-nBits);
            nBits += eLen;
            for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

            m = e & ((1 << (-nBits)) - 1);
            e >>= (-nBits);
            nBits += mLen;
            for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

            if (e === 0) {
                e = 1 - eBias;
            } else if (e === eMax) {
                return m ? NaN : ((s ? -1 : 1) * Infinity);
            } else {
                m = m + Math.pow(2, mLen);
                e = e - eBias;
            }
            return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
        }

        /**
         * Writes an IEEE754 float to a byte array.
         * @param {!Array} buffer
         * @param {number} value
         * @param {number} offset
         * @param {boolean} isLE
         * @param {number} mLen
         * @param {number} nBytes
         * @inner
         */
        function ieee754_write(buffer, value, offset, isLE, mLen, nBytes) {
            var e, m, c,
                eLen = nBytes * 8 - mLen - 1,
                eMax = (1 << eLen) - 1,
                eBias = eMax >> 1,
                rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
                i = isLE ? 0 : (nBytes - 1),
                d = isLE ? 1 : -1,
                s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

            value = Math.abs(value);

            if (isNaN(value) || value === Infinity) {
                m = isNaN(value) ? 1 : 0;
                e = eMax;
            } else {
                e = Math.floor(Math.log(value) / Math.LN2);
                if (value * (c = Math.pow(2, -e)) < 1) {
                    e--;
                    c *= 2;
                }
                if (e + eBias >= 1) {
                    value += rt / c;
                } else {
                    value += rt * Math.pow(2, 1 - eBias);
                }
                if (value * c >= 2) {
                    e++;
                    c /= 2;
                }

                if (e + eBias >= eMax) {
                    m = 0;
                    e = eMax;
                } else if (e + eBias >= 1) {
                    m = (value * c - 1) * Math.pow(2, mLen);
                    e = e + eBias;
                } else {
                    m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
                    e = 0;
                }
            }

            for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

            e = (e << mLen) | m;
            eLen += mLen;
            for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

            buffer[offset + i - d] |= s * 128;
        }

        /**
         * Writes a 32bit float.
         * @param {number} value Value to write
         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
         * @returns {!ByteBuffer} this
         * @expose
         */
        ByteBufferPrototype.writeFloat32 = function(value, offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof value !== 'number')
                    throw TypeError("Illegal value: "+value+" (not a number)");
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 0 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
            }
            offset += 4;
            var capacity8 = this.buffer.byteLength;
            if (offset > capacity8)
                this.resize((capacity8 *= 2) > offset ? capacity8 : offset);
            offset -= 4;
            ieee754_write(this.view, value, offset, this.littleEndian, 23, 4);
            if (relative) this.offset += 4;
            return this;
        };

        /**
         * Writes a 32bit float. This is an alias of {@link ByteBuffer#writeFloat32}.
         * @function
         * @param {number} value Value to write
         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
         * @returns {!ByteBuffer} this
         * @expose
         */
        ByteBufferPrototype.writeFloat = ByteBufferPrototype.writeFloat32;

        /**
         * Reads a 32bit float.
         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
         * @returns {number}
         * @expose
         */
        ByteBufferPrototype.readFloat32 = function(offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 4 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+4+") <= "+this.buffer.byteLength);
            }
            var value = ieee754_read(this.view, offset, this.littleEndian, 23, 4);
            if (relative) this.offset += 4;
            return value;
        };

        /**
         * Reads a 32bit float. This is an alias of {@link ByteBuffer#readFloat32}.
         * @function
         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
         * @returns {number}
         * @expose
         */
        ByteBufferPrototype.readFloat = ByteBufferPrototype.readFloat32;

        // types/floats/float64

        /**
         * Writes a 64bit float.
         * @param {number} value Value to write
         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
         * @returns {!ByteBuffer} this
         * @expose
         */
        ByteBufferPrototype.writeFloat64 = function(value, offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof value !== 'number')
                    throw TypeError("Illegal value: "+value+" (not a number)");
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 0 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
            }
            offset += 8;
            var capacity9 = this.buffer.byteLength;
            if (offset > capacity9)
                this.resize((capacity9 *= 2) > offset ? capacity9 : offset);
            offset -= 8;
            ieee754_write(this.view, value, offset, this.littleEndian, 52, 8);
            if (relative) this.offset += 8;
            return this;
        };

        /**
         * Writes a 64bit float. This is an alias of {@link ByteBuffer#writeFloat64}.
         * @function
         * @param {number} value Value to write
         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
         * @returns {!ByteBuffer} this
         * @expose
         */
        ByteBufferPrototype.writeDouble = ByteBufferPrototype.writeFloat64;

        /**
         * Reads a 64bit float.
         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
         * @returns {number}
         * @expose
         */
        ByteBufferPrototype.readFloat64 = function(offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 8 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+8+") <= "+this.buffer.byteLength);
            }
            var value = ieee754_read(this.view, offset, this.littleEndian, 52, 8);
            if (relative) this.offset += 8;
            return value;
        };

        /**
         * Reads a 64bit float. This is an alias of {@link ByteBuffer#readFloat64}.
         * @function
         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
         * @returns {number}
         * @expose
         */
        ByteBufferPrototype.readDouble = ByteBufferPrototype.readFloat64;


        // types/varints/varint32

        /**
         * Maximum number of bytes required to store a 32bit base 128 variable-length integer.
         * @type {number}
         * @const
         * @expose
         */
        ByteBuffer.MAX_VARINT32_BYTES = 5;

        /**
         * Calculates the actual number of bytes required to store a 32bit base 128 variable-length integer.
         * @param {number} value Value to encode
         * @returns {number} Number of bytes required. Capped to {@link ByteBuffer.MAX_VARINT32_BYTES}
         * @expose
         */
        ByteBuffer.calculateVarint32 = function(value) {
            // ref: src/google/protobuf/io/coded_stream.cc
            value = value >>> 0;
                 if (value < 1 << 7 ) return 1;
            else if (value < 1 << 14) return 2;
            else if (value < 1 << 21) return 3;
            else if (value < 1 << 28) return 4;
            else                      return 5;
        };

        /**
         * Zigzag encodes a signed 32bit integer so that it can be effectively used with varint encoding.
         * @param {number} n Signed 32bit integer
         * @returns {number} Unsigned zigzag encoded 32bit integer
         * @expose
         */
        ByteBuffer.zigZagEncode32 = function(n) {
            return (((n |= 0) << 1) ^ (n >> 31)) >>> 0; // ref: src/google/protobuf/wire_format_lite.h
        };

        /**
         * Decodes a zigzag encoded signed 32bit integer.
         * @param {number} n Unsigned zigzag encoded 32bit integer
         * @returns {number} Signed 32bit integer
         * @expose
         */
        ByteBuffer.zigZagDecode32 = function(n) {
            return ((n >>> 1) ^ -(n & 1)) | 0; // // ref: src/google/protobuf/wire_format_lite.h
        };

        /**
         * Writes a 32bit base 128 variable-length integer.
         * @param {number} value Value to write
         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
         *  written if omitted.
         * @returns {!ByteBuffer|number} this if `offset` is omitted, else the actual number of bytes written
         * @expose
         */
        ByteBufferPrototype.writeVarint32 = function(value, offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof value !== 'number' || value % 1 !== 0)
                    throw TypeError("Illegal value: "+value+" (not an integer)");
                value |= 0;
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 0 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
            }
            var size = ByteBuffer.calculateVarint32(value),
                b;
            offset += size;
            var capacity10 = this.buffer.byteLength;
            if (offset > capacity10)
                this.resize((capacity10 *= 2) > offset ? capacity10 : offset);
            offset -= size;
            value >>>= 0;
            while (value >= 0x80) {
                b = (value & 0x7f) | 0x80;
                this.view[offset++] = b;
                value >>>= 7;
            }
            this.view[offset++] = value;
            if (relative) {
                this.offset = offset;
                return this;
            }
            return size;
        };

        /**
         * Writes a zig-zag encoded (signed) 32bit base 128 variable-length integer.
         * @param {number} value Value to write
         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
         *  written if omitted.
         * @returns {!ByteBuffer|number} this if `offset` is omitted, else the actual number of bytes written
         * @expose
         */
        ByteBufferPrototype.writeVarint32ZigZag = function(value, offset) {
            return this.writeVarint32(ByteBuffer.zigZagEncode32(value), offset);
        };

        /**
         * Reads a 32bit base 128 variable-length integer.
         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
         *  written if omitted.
         * @returns {number|!{value: number, length: number}} The value read if offset is omitted, else the value read
         *  and the actual number of bytes read.
         * @throws {Error} If it's not a valid varint. Has a property `truncated = true` if there is not enough data available
         *  to fully decode the varint.
         * @expose
         */
        ByteBufferPrototype.readVarint32 = function(offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 1 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+1+") <= "+this.buffer.byteLength);
            }
            var c = 0,
                value = 0 >>> 0,
                b;
            do {
                if (!this.noAssert && offset > this.limit) {
                    var err = Error("Truncated");
                    err['truncated'] = true;
                    throw err;
                }
                b = this.view[offset++];
                if (c < 5)
                    value |= (b & 0x7f) << (7*c);
                ++c;
            } while ((b & 0x80) !== 0);
            value |= 0;
            if (relative) {
                this.offset = offset;
                return value;
            }
            return {
                "value": value,
                "length": c
            };
        };

        /**
         * Reads a zig-zag encoded (signed) 32bit base 128 variable-length integer.
         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
         *  written if omitted.
         * @returns {number|!{value: number, length: number}} The value read if offset is omitted, else the value read
         *  and the actual number of bytes read.
         * @throws {Error} If it's not a valid varint
         * @expose
         */
        ByteBufferPrototype.readVarint32ZigZag = function(offset) {
            var val = this.readVarint32(offset);
            if (typeof val === 'object')
                val["value"] = ByteBuffer.zigZagDecode32(val["value"]);
            else
                val = ByteBuffer.zigZagDecode32(val);
            return val;
        };

        // types/varints/varint64

        if (Long) {

            /**
             * Maximum number of bytes required to store a 64bit base 128 variable-length integer.
             * @type {number}
             * @const
             * @expose
             */
            ByteBuffer.MAX_VARINT64_BYTES = 10;

            /**
             * Calculates the actual number of bytes required to store a 64bit base 128 variable-length integer.
             * @param {number|!Long} value Value to encode
             * @returns {number} Number of bytes required. Capped to {@link ByteBuffer.MAX_VARINT64_BYTES}
             * @expose
             */
            ByteBuffer.calculateVarint64 = function(value) {
                if (typeof value === 'number')
                    value = Long.fromNumber(value);
                else if (typeof value === 'string')
                    value = Long.fromString(value);
                // ref: src/google/protobuf/io/coded_stream.cc
                var part0 = value.toInt() >>> 0,
                    part1 = value.shiftRightUnsigned(28).toInt() >>> 0,
                    part2 = value.shiftRightUnsigned(56).toInt() >>> 0;
                if (part2 == 0) {
                    if (part1 == 0) {
                        if (part0 < 1 << 14)
                            return part0 < 1 << 7 ? 1 : 2;
                        else
                            return part0 < 1 << 21 ? 3 : 4;
                    } else {
                        if (part1 < 1 << 14)
                            return part1 < 1 << 7 ? 5 : 6;
                        else
                            return part1 < 1 << 21 ? 7 : 8;
                    }
                } else
                    return part2 < 1 << 7 ? 9 : 10;
            };

            /**
             * Zigzag encodes a signed 64bit integer so that it can be effectively used with varint encoding.
             * @param {number|!Long} value Signed long
             * @returns {!Long} Unsigned zigzag encoded long
             * @expose
             */
            ByteBuffer.zigZagEncode64 = function(value) {
                if (typeof value === 'number')
                    value = Long.fromNumber(value, false);
                else if (typeof value === 'string')
                    value = Long.fromString(value, false);
                else if (value.unsigned !== false) value = value.toSigned();
                // ref: src/google/protobuf/wire_format_lite.h
                return value.shiftLeft(1).xor(value.shiftRight(63)).toUnsigned();
            };

            /**
             * Decodes a zigzag encoded signed 64bit integer.
             * @param {!Long|number} value Unsigned zigzag encoded long or JavaScript number
             * @returns {!Long} Signed long
             * @expose
             */
            ByteBuffer.zigZagDecode64 = function(value) {
                if (typeof value === 'number')
                    value = Long.fromNumber(value, false);
                else if (typeof value === 'string')
                    value = Long.fromString(value, false);
                else if (value.unsigned !== false) value = value.toSigned();
                // ref: src/google/protobuf/wire_format_lite.h
                return value.shiftRightUnsigned(1).xor(value.and(Long.ONE).toSigned().negate()).toSigned();
            };

            /**
             * Writes a 64bit base 128 variable-length integer.
             * @param {number|Long} value Value to write
             * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
             *  written if omitted.
             * @returns {!ByteBuffer|number} `this` if offset is omitted, else the actual number of bytes written.
             * @expose
             */
            ByteBufferPrototype.writeVarint64 = function(value, offset) {
                var relative = typeof offset === 'undefined';
                if (relative) offset = this.offset;
                if (!this.noAssert) {
                    if (typeof value === 'number')
                        value = Long.fromNumber(value);
                    else if (typeof value === 'string')
                        value = Long.fromString(value);
                    else if (!(value && value instanceof Long))
                        throw TypeError("Illegal value: "+value+" (not an integer or Long)");
                    if (typeof offset !== 'number' || offset % 1 !== 0)
                        throw TypeError("Illegal offset: "+offset+" (not an integer)");
                    offset >>>= 0;
                    if (offset < 0 || offset + 0 > this.buffer.byteLength)
                        throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
                }
                if (typeof value === 'number')
                    value = Long.fromNumber(value, false);
                else if (typeof value === 'string')
                    value = Long.fromString(value, false);
                else if (value.unsigned !== false) value = value.toSigned();
                var size = ByteBuffer.calculateVarint64(value),
                    part0 = value.toInt() >>> 0,
                    part1 = value.shiftRightUnsigned(28).toInt() >>> 0,
                    part2 = value.shiftRightUnsigned(56).toInt() >>> 0;
                offset += size;
                var capacity11 = this.buffer.byteLength;
                if (offset > capacity11)
                    this.resize((capacity11 *= 2) > offset ? capacity11 : offset);
                offset -= size;
                switch (size) {
                    case 10: this.view[offset+9] = (part2 >>>  7) & 0x01;
                    case 9 : this.view[offset+8] = size !== 9 ? (part2       ) | 0x80 : (part2       ) & 0x7F;
                    case 8 : this.view[offset+7] = size !== 8 ? (part1 >>> 21) | 0x80 : (part1 >>> 21) & 0x7F;
                    case 7 : this.view[offset+6] = size !== 7 ? (part1 >>> 14) | 0x80 : (part1 >>> 14) & 0x7F;
                    case 6 : this.view[offset+5] = size !== 6 ? (part1 >>>  7) | 0x80 : (part1 >>>  7) & 0x7F;
                    case 5 : this.view[offset+4] = size !== 5 ? (part1       ) | 0x80 : (part1       ) & 0x7F;
                    case 4 : this.view[offset+3] = size !== 4 ? (part0 >>> 21) | 0x80 : (part0 >>> 21) & 0x7F;
                    case 3 : this.view[offset+2] = size !== 3 ? (part0 >>> 14) | 0x80 : (part0 >>> 14) & 0x7F;
                    case 2 : this.view[offset+1] = size !== 2 ? (part0 >>>  7) | 0x80 : (part0 >>>  7) & 0x7F;
                    case 1 : this.view[offset  ] = size !== 1 ? (part0       ) | 0x80 : (part0       ) & 0x7F;
                }
                if (relative) {
                    this.offset += size;
                    return this;
                } else {
                    return size;
                }
            };

            /**
             * Writes a zig-zag encoded 64bit base 128 variable-length integer.
             * @param {number|Long} value Value to write
             * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
             *  written if omitted.
             * @returns {!ByteBuffer|number} `this` if offset is omitted, else the actual number of bytes written.
             * @expose
             */
            ByteBufferPrototype.writeVarint64ZigZag = function(value, offset) {
                return this.writeVarint64(ByteBuffer.zigZagEncode64(value), offset);
            };

            /**
             * Reads a 64bit base 128 variable-length integer. Requires Long.js.
             * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
             *  read if omitted.
             * @returns {!Long|!{value: Long, length: number}} The value read if offset is omitted, else the value read and
             *  the actual number of bytes read.
             * @throws {Error} If it's not a valid varint
             * @expose
             */
            ByteBufferPrototype.readVarint64 = function(offset) {
                var relative = typeof offset === 'undefined';
                if (relative) offset = this.offset;
                if (!this.noAssert) {
                    if (typeof offset !== 'number' || offset % 1 !== 0)
                        throw TypeError("Illegal offset: "+offset+" (not an integer)");
                    offset >>>= 0;
                    if (offset < 0 || offset + 1 > this.buffer.byteLength)
                        throw RangeError("Illegal offset: 0 <= "+offset+" (+"+1+") <= "+this.buffer.byteLength);
                }
                // ref: src/google/protobuf/io/coded_stream.cc
                var start = offset,
                    part0 = 0,
                    part1 = 0,
                    part2 = 0,
                    b  = 0;
                b = this.view[offset++]; part0  = (b & 0x7F)      ; if ( b & 0x80                                                   ) {
                b = this.view[offset++]; part0 |= (b & 0x7F) <<  7; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
                b = this.view[offset++]; part0 |= (b & 0x7F) << 14; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
                b = this.view[offset++]; part0 |= (b & 0x7F) << 21; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
                b = this.view[offset++]; part1  = (b & 0x7F)      ; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
                b = this.view[offset++]; part1 |= (b & 0x7F) <<  7; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
                b = this.view[offset++]; part1 |= (b & 0x7F) << 14; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
                b = this.view[offset++]; part1 |= (b & 0x7F) << 21; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
                b = this.view[offset++]; part2  = (b & 0x7F)      ; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
                b = this.view[offset++]; part2 |= (b & 0x7F) <<  7; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
                throw Error("Buffer overrun"); }}}}}}}}}}
                var value = Long.fromBits(part0 | (part1 << 28), (part1 >>> 4) | (part2) << 24, false);
                if (relative) {
                    this.offset = offset;
                    return value;
                } else {
                    return {
                        'value': value,
                        'length': offset-start
                    };
                }
            };

            /**
             * Reads a zig-zag encoded 64bit base 128 variable-length integer. Requires Long.js.
             * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
             *  read if omitted.
             * @returns {!Long|!{value: Long, length: number}} The value read if offset is omitted, else the value read and
             *  the actual number of bytes read.
             * @throws {Error} If it's not a valid varint
             * @expose
             */
            ByteBufferPrototype.readVarint64ZigZag = function(offset) {
                var val = this.readVarint64(offset);
                if (val && val['value'] instanceof Long)
                    val["value"] = ByteBuffer.zigZagDecode64(val["value"]);
                else
                    val = ByteBuffer.zigZagDecode64(val);
                return val;
            };

        } // Long


        // types/strings/cstring

        /**
         * Writes a NULL-terminated UTF8 encoded string. For this to work the specified string must not contain any NULL
         *  characters itself.
         * @param {string} str String to write
         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
         *  contained in `str` + 1 if omitted.
         * @returns {!ByteBuffer|number} this if offset is omitted, else the actual number of bytes written
         * @expose
         */
        ByteBufferPrototype.writeCString = function(str, offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            var i,
                k = str.length;
            if (!this.noAssert) {
                if (typeof str !== 'string')
                    throw TypeError("Illegal str: Not a string");
                for (i=0; i<k; ++i) {
                    if (str.charCodeAt(i) === 0)
                        throw RangeError("Illegal str: Contains NULL-characters");
                }
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 0 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
            }
            // UTF8 strings do not contain zero bytes in between except for the zero character, so:
            k = utfx.calculateUTF16asUTF8(stringSource(str))[1];
            offset += k+1;
            var capacity12 = this.buffer.byteLength;
            if (offset > capacity12)
                this.resize((capacity12 *= 2) > offset ? capacity12 : offset);
            offset -= k+1;
            utfx.encodeUTF16toUTF8(stringSource(str), function(b) {
                this.view[offset++] = b;
            }.bind(this));
            this.view[offset++] = 0;
            if (relative) {
                this.offset = offset;
                return this;
            }
            return k;
        };

        /**
         * Reads a NULL-terminated UTF8 encoded string. For this to work the string read must not contain any NULL characters
         *  itself.
         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
         *  read if omitted.
         * @returns {string|!{string: string, length: number}} The string read if offset is omitted, else the string
         *  read and the actual number of bytes read.
         * @expose
         */
        ByteBufferPrototype.readCString = function(offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 1 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+1+") <= "+this.buffer.byteLength);
            }
            var start = offset,
                temp;
            // UTF8 strings do not contain zero bytes in between except for the zero character itself, so:
            var sd, b = -1;
            utfx.decodeUTF8toUTF16(function() {
                if (b === 0) return null;
                if (offset >= this.limit)
                    throw RangeError("Illegal range: Truncated data, "+offset+" < "+this.limit);
                b = this.view[offset++];
                return b === 0 ? null : b;
            }.bind(this), sd = stringDestination(), true);
            if (relative) {
                this.offset = offset;
                return sd();
            } else {
                return {
                    "string": sd(),
                    "length": offset - start
                };
            }
        };

        // types/strings/istring

        /**
         * Writes a length as uint32 prefixed UTF8 encoded string.
         * @param {string} str String to write
         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
         *  written if omitted.
         * @returns {!ByteBuffer|number} `this` if `offset` is omitted, else the actual number of bytes written
         * @expose
         * @see ByteBuffer#writeVarint32
         */
        ByteBufferPrototype.writeIString = function(str, offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof str !== 'string')
                    throw TypeError("Illegal str: Not a string");
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 0 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
            }
            var start = offset,
                k;
            k = utfx.calculateUTF16asUTF8(stringSource(str), this.noAssert)[1];
            offset += 4+k;
            var capacity13 = this.buffer.byteLength;
            if (offset > capacity13)
                this.resize((capacity13 *= 2) > offset ? capacity13 : offset);
            offset -= 4+k;
            if (this.littleEndian) {
                this.view[offset+3] = (k >>> 24) & 0xFF;
                this.view[offset+2] = (k >>> 16) & 0xFF;
                this.view[offset+1] = (k >>>  8) & 0xFF;
                this.view[offset  ] =  k         & 0xFF;
            } else {
                this.view[offset  ] = (k >>> 24) & 0xFF;
                this.view[offset+1] = (k >>> 16) & 0xFF;
                this.view[offset+2] = (k >>>  8) & 0xFF;
                this.view[offset+3] =  k         & 0xFF;
            }
            offset += 4;
            utfx.encodeUTF16toUTF8(stringSource(str), function(b) {
                this.view[offset++] = b;
            }.bind(this));
            if (offset !== start + 4 + k)
                throw RangeError("Illegal range: Truncated data, "+offset+" == "+(offset+4+k));
            if (relative) {
                this.offset = offset;
                return this;
            }
            return offset - start;
        };

        /**
         * Reads a length as uint32 prefixed UTF8 encoded string.
         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
         *  read if omitted.
         * @returns {string|!{string: string, length: number}} The string read if offset is omitted, else the string
         *  read and the actual number of bytes read.
         * @expose
         * @see ByteBuffer#readVarint32
         */
        ByteBufferPrototype.readIString = function(offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 4 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+4+") <= "+this.buffer.byteLength);
            }
            var start = offset;
            var len = this.readUint32(offset);
            var str = this.readUTF8String(len, ByteBuffer.METRICS_BYTES, offset += 4);
            offset += str['length'];
            if (relative) {
                this.offset = offset;
                return str['string'];
            } else {
                return {
                    'string': str['string'],
                    'length': offset - start
                };
            }
        };

        // types/strings/utf8string

        /**
         * Metrics representing number of UTF8 characters. Evaluates to `c`.
         * @type {string}
         * @const
         * @expose
         */
        ByteBuffer.METRICS_CHARS = 'c';

        /**
         * Metrics representing number of bytes. Evaluates to `b`.
         * @type {string}
         * @const
         * @expose
         */
        ByteBuffer.METRICS_BYTES = 'b';

        /**
         * Writes an UTF8 encoded string.
         * @param {string} str String to write
         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} if omitted.
         * @returns {!ByteBuffer|number} this if offset is omitted, else the actual number of bytes written.
         * @expose
         */
        ByteBufferPrototype.writeUTF8String = function(str, offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 0 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
            }
            var k;
            var start = offset;
            k = utfx.calculateUTF16asUTF8(stringSource(str))[1];
            offset += k;
            var capacity14 = this.buffer.byteLength;
            if (offset > capacity14)
                this.resize((capacity14 *= 2) > offset ? capacity14 : offset);
            offset -= k;
            utfx.encodeUTF16toUTF8(stringSource(str), function(b) {
                this.view[offset++] = b;
            }.bind(this));
            if (relative) {
                this.offset = offset;
                return this;
            }
            return offset - start;
        };

        /**
         * Writes an UTF8 encoded string. This is an alias of {@link ByteBuffer#writeUTF8String}.
         * @function
         * @param {string} str String to write
         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} if omitted.
         * @returns {!ByteBuffer|number} this if offset is omitted, else the actual number of bytes written.
         * @expose
         */
        ByteBufferPrototype.writeString = ByteBufferPrototype.writeUTF8String;

        /**
         * Calculates the number of UTF8 characters of a string. JavaScript itself uses UTF-16, so that a string's
         *  `length` property does not reflect its actual UTF8 size if it contains code points larger than 0xFFFF.
         * @param {string} str String to calculate
         * @returns {number} Number of UTF8 characters
         * @expose
         */
        ByteBuffer.calculateUTF8Chars = function(str) {
            return utfx.calculateUTF16asUTF8(stringSource(str))[0];
        };

        /**
         * Calculates the number of UTF8 bytes of a string.
         * @param {string} str String to calculate
         * @returns {number} Number of UTF8 bytes
         * @expose
         */
        ByteBuffer.calculateUTF8Bytes = function(str) {
            return utfx.calculateUTF16asUTF8(stringSource(str))[1];
        };

        /**
         * Calculates the number of UTF8 bytes of a string. This is an alias of {@link ByteBuffer.calculateUTF8Bytes}.
         * @function
         * @param {string} str String to calculate
         * @returns {number} Number of UTF8 bytes
         * @expose
         */
        ByteBuffer.calculateString = ByteBuffer.calculateUTF8Bytes;

        /**
         * Reads an UTF8 encoded string.
         * @param {number} length Number of characters or bytes to read.
         * @param {string=} metrics Metrics specifying what `length` is meant to count. Defaults to
         *  {@link ByteBuffer.METRICS_CHARS}.
         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
         *  read if omitted.
         * @returns {string|!{string: string, length: number}} The string read if offset is omitted, else the string
         *  read and the actual number of bytes read.
         * @expose
         */
        ByteBufferPrototype.readUTF8String = function(length, metrics, offset) {
            if (typeof metrics === 'number') {
                offset = metrics;
                metrics = undefined;
            }
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (typeof metrics === 'undefined') metrics = ByteBuffer.METRICS_CHARS;
            if (!this.noAssert) {
                if (typeof length !== 'number' || length % 1 !== 0)
                    throw TypeError("Illegal length: "+length+" (not an integer)");
                length |= 0;
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 0 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
            }
            var i = 0,
                start = offset,
                sd;
            if (metrics === ByteBuffer.METRICS_CHARS) { // The same for node and the browser
                sd = stringDestination();
                utfx.decodeUTF8(function() {
                    return i < length && offset < this.limit ? this.view[offset++] : null;
                }.bind(this), function(cp) {
                    ++i; utfx.UTF8toUTF16(cp, sd);
                });
                if (i !== length)
                    throw RangeError("Illegal range: Truncated data, "+i+" == "+length);
                if (relative) {
                    this.offset = offset;
                    return sd();
                } else {
                    return {
                        "string": sd(),
                        "length": offset - start
                    };
                }
            } else if (metrics === ByteBuffer.METRICS_BYTES) {
                if (!this.noAssert) {
                    if (typeof offset !== 'number' || offset % 1 !== 0)
                        throw TypeError("Illegal offset: "+offset+" (not an integer)");
                    offset >>>= 0;
                    if (offset < 0 || offset + length > this.buffer.byteLength)
                        throw RangeError("Illegal offset: 0 <= "+offset+" (+"+length+") <= "+this.buffer.byteLength);
                }
                var k = offset + length;
                utfx.decodeUTF8toUTF16(function() {
                    return offset < k ? this.view[offset++] : null;
                }.bind(this), sd = stringDestination(), this.noAssert);
                if (offset !== k)
                    throw RangeError("Illegal range: Truncated data, "+offset+" == "+k);
                if (relative) {
                    this.offset = offset;
                    return sd();
                } else {
                    return {
                        'string': sd(),
                        'length': offset - start
                    };
                }
            } else
                throw TypeError("Unsupported metrics: "+metrics);
        };

        /**
         * Reads an UTF8 encoded string. This is an alias of {@link ByteBuffer#readUTF8String}.
         * @function
         * @param {number} length Number of characters or bytes to read
         * @param {number=} metrics Metrics specifying what `n` is meant to count. Defaults to
         *  {@link ByteBuffer.METRICS_CHARS}.
         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
         *  read if omitted.
         * @returns {string|!{string: string, length: number}} The string read if offset is omitted, else the string
         *  read and the actual number of bytes read.
         * @expose
         */
        ByteBufferPrototype.readString = ByteBufferPrototype.readUTF8String;

        // types/strings/vstring

        /**
         * Writes a length as varint32 prefixed UTF8 encoded string.
         * @param {string} str String to write
         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
         *  written if omitted.
         * @returns {!ByteBuffer|number} `this` if `offset` is omitted, else the actual number of bytes written
         * @expose
         * @see ByteBuffer#writeVarint32
         */
        ByteBufferPrototype.writeVString = function(str, offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof str !== 'string')
                    throw TypeError("Illegal str: Not a string");
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 0 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
            }
            var start = offset,
                k, l;
            k = utfx.calculateUTF16asUTF8(stringSource(str), this.noAssert)[1];
            l = ByteBuffer.calculateVarint32(k);
            offset += l+k;
            var capacity15 = this.buffer.byteLength;
            if (offset > capacity15)
                this.resize((capacity15 *= 2) > offset ? capacity15 : offset);
            offset -= l+k;
            offset += this.writeVarint32(k, offset);
            utfx.encodeUTF16toUTF8(stringSource(str), function(b) {
                this.view[offset++] = b;
            }.bind(this));
            if (offset !== start+k+l)
                throw RangeError("Illegal range: Truncated data, "+offset+" == "+(offset+k+l));
            if (relative) {
                this.offset = offset;
                return this;
            }
            return offset - start;
        };

        /**
         * Reads a length as varint32 prefixed UTF8 encoded string.
         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
         *  read if omitted.
         * @returns {string|!{string: string, length: number}} The string read if offset is omitted, else the string
         *  read and the actual number of bytes read.
         * @expose
         * @see ByteBuffer#readVarint32
         */
        ByteBufferPrototype.readVString = function(offset) {
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 1 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+1+") <= "+this.buffer.byteLength);
            }
            var start = offset;
            var len = this.readVarint32(offset);
            var str = this.readUTF8String(len['value'], ByteBuffer.METRICS_BYTES, offset += len['length']);
            offset += str['length'];
            if (relative) {
                this.offset = offset;
                return str['string'];
            } else {
                return {
                    'string': str['string'],
                    'length': offset - start
                };
            }
        };


        /**
         * Appends some data to this ByteBuffer. This will overwrite any contents behind the specified offset up to the appended
         *  data's length.
         * @param {!ByteBuffer|!ArrayBuffer|!Uint8Array|string} source Data to append. If `source` is a ByteBuffer, its offsets
         *  will be modified according to the performed read operation.
         * @param {(string|number)=} encoding Encoding if `data` is a string ("base64", "hex", "binary", defaults to "utf8")
         * @param {number=} offset Offset to append at. Will use and increase {@link ByteBuffer#offset} by the number of bytes
         *  written if omitted.
         * @returns {!ByteBuffer} this
         * @expose
         * @example A relative `<01 02>03.append(<04 05>)` will result in `<01 02 04 05>, 04 05|`
         * @example An absolute `<01 02>03.append(04 05>, 1)` will result in `<01 04>05, 04 05|`
         */
        ByteBufferPrototype.append = function(source, encoding, offset) {
            if (typeof encoding === 'number' || typeof encoding !== 'string') {
                offset = encoding;
                encoding = undefined;
            }
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 0 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
            }
            if (!(source instanceof ByteBuffer))
                source = ByteBuffer.wrap(source, encoding);
            var length = source.limit - source.offset;
            if (length <= 0) return this; // Nothing to append
            offset += length;
            var capacity16 = this.buffer.byteLength;
            if (offset > capacity16)
                this.resize((capacity16 *= 2) > offset ? capacity16 : offset);
            offset -= length;
            this.view.set(source.view.subarray(source.offset, source.limit), offset);
            source.offset += length;
            if (relative) this.offset += length;
            return this;
        };

        /**
         * Appends this ByteBuffer's contents to another ByteBuffer. This will overwrite any contents at and after the
            specified offset up to the length of this ByteBuffer's data.
         * @param {!ByteBuffer} target Target ByteBuffer
         * @param {number=} offset Offset to append to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
         *  read if omitted.
         * @returns {!ByteBuffer} this
         * @expose
         * @see ByteBuffer#append
         */
        ByteBufferPrototype.appendTo = function(target, offset) {
            target.append(this, offset);
            return this;
        };

        /**
         * Enables or disables assertions of argument types and offsets. Assertions are enabled by default but you can opt to
         *  disable them if your code already makes sure that everything is valid.
         * @param {boolean} assert `true` to enable assertions, otherwise `false`
         * @returns {!ByteBuffer} this
         * @expose
         */
        ByteBufferPrototype.assert = function(assert) {
            this.noAssert = !assert;
            return this;
        };

        /**
         * Gets the capacity of this ByteBuffer's backing buffer.
         * @returns {number} Capacity of the backing buffer
         * @expose
         */
        ByteBufferPrototype.capacity = function() {
            return this.buffer.byteLength;
        };
        /**
         * Clears this ByteBuffer's offsets by setting {@link ByteBuffer#offset} to `0` and {@link ByteBuffer#limit} to the
         *  backing buffer's capacity. Discards {@link ByteBuffer#markedOffset}.
         * @returns {!ByteBuffer} this
         * @expose
         */
        ByteBufferPrototype.clear = function() {
            this.offset = 0;
            this.limit = this.buffer.byteLength;
            this.markedOffset = -1;
            return this;
        };

        /**
         * Creates a cloned instance of this ByteBuffer, preset with this ByteBuffer's values for {@link ByteBuffer#offset},
         *  {@link ByteBuffer#markedOffset} and {@link ByteBuffer#limit}.
         * @param {boolean=} copy Whether to copy the backing buffer or to return another view on the same, defaults to `false`
         * @returns {!ByteBuffer} Cloned instance
         * @expose
         */
        ByteBufferPrototype.clone = function(copy) {
            var bb = new ByteBuffer(0, this.littleEndian, this.noAssert);
            if (copy) {
                bb.buffer = new ArrayBuffer(this.buffer.byteLength);
                bb.view = new Uint8Array(bb.buffer);
            } else {
                bb.buffer = this.buffer;
                bb.view = this.view;
            }
            bb.offset = this.offset;
            bb.markedOffset = this.markedOffset;
            bb.limit = this.limit;
            return bb;
        };

        /**
         * Compacts this ByteBuffer to be backed by a {@link ByteBuffer#buffer} of its contents' length. Contents are the bytes
         *  between {@link ByteBuffer#offset} and {@link ByteBuffer#limit}. Will set `offset = 0` and `limit = capacity` and
         *  adapt {@link ByteBuffer#markedOffset} to the same relative position if set.
         * @param {number=} begin Offset to start at, defaults to {@link ByteBuffer#offset}
         * @param {number=} end Offset to end at, defaults to {@link ByteBuffer#limit}
         * @returns {!ByteBuffer} this
         * @expose
         */
        ByteBufferPrototype.compact = function(begin, end) {
            if (typeof begin === 'undefined') begin = this.offset;
            if (typeof end === 'undefined') end = this.limit;
            if (!this.noAssert) {
                if (typeof begin !== 'number' || begin % 1 !== 0)
                    throw TypeError("Illegal begin: Not an integer");
                begin >>>= 0;
                if (typeof end !== 'number' || end % 1 !== 0)
                    throw TypeError("Illegal end: Not an integer");
                end >>>= 0;
                if (begin < 0 || begin > end || end > this.buffer.byteLength)
                    throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
            }
            if (begin === 0 && end === this.buffer.byteLength)
                return this; // Already compacted
            var len = end - begin;
            if (len === 0) {
                this.buffer = EMPTY_BUFFER;
                this.view = null;
                if (this.markedOffset >= 0) this.markedOffset -= begin;
                this.offset = 0;
                this.limit = 0;
                return this;
            }
            var buffer = new ArrayBuffer(len);
            var view = new Uint8Array(buffer);
            view.set(this.view.subarray(begin, end));
            this.buffer = buffer;
            this.view = view;
            if (this.markedOffset >= 0) this.markedOffset -= begin;
            this.offset = 0;
            this.limit = len;
            return this;
        };

        /**
         * Creates a copy of this ByteBuffer's contents. Contents are the bytes between {@link ByteBuffer#offset} and
         *  {@link ByteBuffer#limit}.
         * @param {number=} begin Begin offset, defaults to {@link ByteBuffer#offset}.
         * @param {number=} end End offset, defaults to {@link ByteBuffer#limit}.
         * @returns {!ByteBuffer} Copy
         * @expose
         */
        ByteBufferPrototype.copy = function(begin, end) {
            if (typeof begin === 'undefined') begin = this.offset;
            if (typeof end === 'undefined') end = this.limit;
            if (!this.noAssert) {
                if (typeof begin !== 'number' || begin % 1 !== 0)
                    throw TypeError("Illegal begin: Not an integer");
                begin >>>= 0;
                if (typeof end !== 'number' || end % 1 !== 0)
                    throw TypeError("Illegal end: Not an integer");
                end >>>= 0;
                if (begin < 0 || begin > end || end > this.buffer.byteLength)
                    throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
            }
            if (begin === end)
                return new ByteBuffer(0, this.littleEndian, this.noAssert);
            var capacity = end - begin,
                bb = new ByteBuffer(capacity, this.littleEndian, this.noAssert);
            bb.offset = 0;
            bb.limit = capacity;
            if (bb.markedOffset >= 0) bb.markedOffset -= begin;
            this.copyTo(bb, 0, begin, end);
            return bb;
        };

        /**
         * Copies this ByteBuffer's contents to another ByteBuffer. Contents are the bytes between {@link ByteBuffer#offset} and
         *  {@link ByteBuffer#limit}.
         * @param {!ByteBuffer} target Target ByteBuffer
         * @param {number=} targetOffset Offset to copy to. Will use and increase the target's {@link ByteBuffer#offset}
         *  by the number of bytes copied if omitted.
         * @param {number=} sourceOffset Offset to start copying from. Will use and increase {@link ByteBuffer#offset} by the
         *  number of bytes copied if omitted.
         * @param {number=} sourceLimit Offset to end copying from, defaults to {@link ByteBuffer#limit}
         * @returns {!ByteBuffer} this
         * @expose
         */
        ByteBufferPrototype.copyTo = function(target, targetOffset, sourceOffset, sourceLimit) {
            var relative,
                targetRelative;
            if (!this.noAssert) {
                if (!ByteBuffer.isByteBuffer(target))
                    throw TypeError("Illegal target: Not a ByteBuffer");
            }
            targetOffset = (targetRelative = typeof targetOffset === 'undefined') ? target.offset : targetOffset | 0;
            sourceOffset = (relative = typeof sourceOffset === 'undefined') ? this.offset : sourceOffset | 0;
            sourceLimit = typeof sourceLimit === 'undefined' ? this.limit : sourceLimit | 0;

            if (targetOffset < 0 || targetOffset > target.buffer.byteLength)
                throw RangeError("Illegal target range: 0 <= "+targetOffset+" <= "+target.buffer.byteLength);
            if (sourceOffset < 0 || sourceLimit > this.buffer.byteLength)
                throw RangeError("Illegal source range: 0 <= "+sourceOffset+" <= "+this.buffer.byteLength);

            var len = sourceLimit - sourceOffset;
            if (len === 0)
                return target; // Nothing to copy

            target.ensureCapacity(targetOffset + len);

            target.view.set(this.view.subarray(sourceOffset, sourceLimit), targetOffset);

            if (relative) this.offset += len;
            if (targetRelative) target.offset += len;

            return this;
        };

        /**
         * Makes sure that this ByteBuffer is backed by a {@link ByteBuffer#buffer} of at least the specified capacity. If the
         *  current capacity is exceeded, it will be doubled. If double the current capacity is less than the required capacity,
         *  the required capacity will be used instead.
         * @param {number} capacity Required capacity
         * @returns {!ByteBuffer} this
         * @expose
         */
        ByteBufferPrototype.ensureCapacity = function(capacity) {
            var current = this.buffer.byteLength;
            if (current < capacity)
                return this.resize((current *= 2) > capacity ? current : capacity);
            return this;
        };

        /**
         * Overwrites this ByteBuffer's contents with the specified value. Contents are the bytes between
         *  {@link ByteBuffer#offset} and {@link ByteBuffer#limit}.
         * @param {number|string} value Byte value to fill with. If given as a string, the first character is used.
         * @param {number=} begin Begin offset. Will use and increase {@link ByteBuffer#offset} by the number of bytes
         *  written if omitted. defaults to {@link ByteBuffer#offset}.
         * @param {number=} end End offset, defaults to {@link ByteBuffer#limit}.
         * @returns {!ByteBuffer} this
         * @expose
         * @example `someByteBuffer.clear().fill(0)` fills the entire backing buffer with zeroes
         */
        ByteBufferPrototype.fill = function(value, begin, end) {
            var relative = typeof begin === 'undefined';
            if (relative) begin = this.offset;
            if (typeof value === 'string' && value.length > 0)
                value = value.charCodeAt(0);
            if (typeof begin === 'undefined') begin = this.offset;
            if (typeof end === 'undefined') end = this.limit;
            if (!this.noAssert) {
                if (typeof value !== 'number' || value % 1 !== 0)
                    throw TypeError("Illegal value: "+value+" (not an integer)");
                value |= 0;
                if (typeof begin !== 'number' || begin % 1 !== 0)
                    throw TypeError("Illegal begin: Not an integer");
                begin >>>= 0;
                if (typeof end !== 'number' || end % 1 !== 0)
                    throw TypeError("Illegal end: Not an integer");
                end >>>= 0;
                if (begin < 0 || begin > end || end > this.buffer.byteLength)
                    throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
            }
            if (begin >= end)
                return this; // Nothing to fill
            while (begin < end) this.view[begin++] = value;
            if (relative) this.offset = begin;
            return this;
        };

        /**
         * Makes this ByteBuffer ready for a new sequence of write or relative read operations. Sets `limit = offset` and
         *  `offset = 0`. Make sure always to flip a ByteBuffer when all relative read or write operations are complete.
         * @returns {!ByteBuffer} this
         * @expose
         */
        ByteBufferPrototype.flip = function() {
            this.limit = this.offset;
            this.offset = 0;
            return this;
        };
        /**
         * Marks an offset on this ByteBuffer to be used later.
         * @param {number=} offset Offset to mark. Defaults to {@link ByteBuffer#offset}.
         * @returns {!ByteBuffer} this
         * @throws {TypeError} If `offset` is not a valid number
         * @throws {RangeError} If `offset` is out of bounds
         * @see ByteBuffer#reset
         * @expose
         */
        ByteBufferPrototype.mark = function(offset) {
            offset = typeof offset === 'undefined' ? this.offset : offset;
            if (!this.noAssert) {
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 0 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
            }
            this.markedOffset = offset;
            return this;
        };
        /**
         * Sets the byte order.
         * @param {boolean} littleEndian `true` for little endian byte order, `false` for big endian
         * @returns {!ByteBuffer} this
         * @expose
         */
        ByteBufferPrototype.order = function(littleEndian) {
            if (!this.noAssert) {
                if (typeof littleEndian !== 'boolean')
                    throw TypeError("Illegal littleEndian: Not a boolean");
            }
            this.littleEndian = !!littleEndian;
            return this;
        };

        /**
         * Switches (to) little endian byte order.
         * @param {boolean=} littleEndian Defaults to `true`, otherwise uses big endian
         * @returns {!ByteBuffer} this
         * @expose
         */
        ByteBufferPrototype.LE = function(littleEndian) {
            this.littleEndian = typeof littleEndian !== 'undefined' ? !!littleEndian : true;
            return this;
        };

        /**
         * Switches (to) big endian byte order.
         * @param {boolean=} bigEndian Defaults to `true`, otherwise uses little endian
         * @returns {!ByteBuffer} this
         * @expose
         */
        ByteBufferPrototype.BE = function(bigEndian) {
            this.littleEndian = typeof bigEndian !== 'undefined' ? !bigEndian : false;
            return this;
        };
        /**
         * Prepends some data to this ByteBuffer. This will overwrite any contents before the specified offset up to the
         *  prepended data's length. If there is not enough space available before the specified `offset`, the backing buffer
         *  will be resized and its contents moved accordingly.
         * @param {!ByteBuffer|string|!ArrayBuffer} source Data to prepend. If `source` is a ByteBuffer, its offset will be
         *  modified according to the performed read operation.
         * @param {(string|number)=} encoding Encoding if `data` is a string ("base64", "hex", "binary", defaults to "utf8")
         * @param {number=} offset Offset to prepend at. Will use and decrease {@link ByteBuffer#offset} by the number of bytes
         *  prepended if omitted.
         * @returns {!ByteBuffer} this
         * @expose
         * @example A relative `00<01 02 03>.prepend(<04 05>)` results in `<04 05 01 02 03>, 04 05|`
         * @example An absolute `00<01 02 03>.prepend(<04 05>, 2)` results in `04<05 02 03>, 04 05|`
         */
        ByteBufferPrototype.prepend = function(source, encoding, offset) {
            if (typeof encoding === 'number' || typeof encoding !== 'string') {
                offset = encoding;
                encoding = undefined;
            }
            var relative = typeof offset === 'undefined';
            if (relative) offset = this.offset;
            if (!this.noAssert) {
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
                offset >>>= 0;
                if (offset < 0 || offset + 0 > this.buffer.byteLength)
                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
            }
            if (!(source instanceof ByteBuffer))
                source = ByteBuffer.wrap(source, encoding);
            var len = source.limit - source.offset;
            if (len <= 0) return this; // Nothing to prepend
            var diff = len - offset;
            if (diff > 0) { // Not enough space before offset, so resize + move
                var buffer = new ArrayBuffer(this.buffer.byteLength + diff);
                var view = new Uint8Array(buffer);
                view.set(this.view.subarray(offset, this.buffer.byteLength), len);
                this.buffer = buffer;
                this.view = view;
                this.offset += diff;
                if (this.markedOffset >= 0) this.markedOffset += diff;
                this.limit += diff;
                offset += diff;
            } else {
                var arrayView = new Uint8Array(this.buffer);
            }
            this.view.set(source.view.subarray(source.offset, source.limit), offset - len);

            source.offset = source.limit;
            if (relative)
                this.offset -= len;
            return this;
        };

        /**
         * Prepends this ByteBuffer to another ByteBuffer. This will overwrite any contents before the specified offset up to the
         *  prepended data's length. If there is not enough space available before the specified `offset`, the backing buffer
         *  will be resized and its contents moved accordingly.
         * @param {!ByteBuffer} target Target ByteBuffer
         * @param {number=} offset Offset to prepend at. Will use and decrease {@link ByteBuffer#offset} by the number of bytes
         *  prepended if omitted.
         * @returns {!ByteBuffer} this
         * @expose
         * @see ByteBuffer#prepend
         */
        ByteBufferPrototype.prependTo = function(target, offset) {
            target.prepend(this, offset);
            return this;
        };
        /**
         * Prints debug information about this ByteBuffer's contents.
         * @param {function(string)=} out Output function to call, defaults to console.log
         * @expose
         */
        ByteBufferPrototype.printDebug = function(out) {
            if (typeof out !== 'function') out = console.log.bind(console);
            out(
                this.toString()+"\n"+
                "-------------------------------------------------------------------\n"+
                this.toDebug(/* columns */ true)
            );
        };

        /**
         * Gets the number of remaining readable bytes. Contents are the bytes between {@link ByteBuffer#offset} and
         *  {@link ByteBuffer#limit}, so this returns `limit - offset`.
         * @returns {number} Remaining readable bytes. May be negative if `offset > limit`.
         * @expose
         */
        ByteBufferPrototype.remaining = function() {
            return this.limit - this.offset;
        };
        /**
         * Resets this ByteBuffer's {@link ByteBuffer#offset}. If an offset has been marked through {@link ByteBuffer#mark}
         *  before, `offset` will be set to {@link ByteBuffer#markedOffset}, which will then be discarded. If no offset has been
         *  marked, sets `offset = 0`.
         * @returns {!ByteBuffer} this
         * @see ByteBuffer#mark
         * @expose
         */
        ByteBufferPrototype.reset = function() {
            if (this.markedOffset >= 0) {
                this.offset = this.markedOffset;
                this.markedOffset = -1;
            } else {
                this.offset = 0;
            }
            return this;
        };
        /**
         * Resizes this ByteBuffer to be backed by a buffer of at least the given capacity. Will do nothing if already that
         *  large or larger.
         * @param {number} capacity Capacity required
         * @returns {!ByteBuffer} this
         * @throws {TypeError} If `capacity` is not a number
         * @throws {RangeError} If `capacity < 0`
         * @expose
         */
        ByteBufferPrototype.resize = function(capacity) {
            if (!this.noAssert) {
                if (typeof capacity !== 'number' || capacity % 1 !== 0)
                    throw TypeError("Illegal capacity: "+capacity+" (not an integer)");
                capacity |= 0;
                if (capacity < 0)
                    throw RangeError("Illegal capacity: 0 <= "+capacity);
            }
            if (this.buffer.byteLength < capacity) {
                var buffer = new ArrayBuffer(capacity);
                var view = new Uint8Array(buffer);
                view.set(this.view);
                this.buffer = buffer;
                this.view = view;
            }
            return this;
        };
        /**
         * Reverses this ByteBuffer's contents.
         * @param {number=} begin Offset to start at, defaults to {@link ByteBuffer#offset}
         * @param {number=} end Offset to end at, defaults to {@link ByteBuffer#limit}
         * @returns {!ByteBuffer} this
         * @expose
         */
        ByteBufferPrototype.reverse = function(begin, end) {
            if (typeof begin === 'undefined') begin = this.offset;
            if (typeof end === 'undefined') end = this.limit;
            if (!this.noAssert) {
                if (typeof begin !== 'number' || begin % 1 !== 0)
                    throw TypeError("Illegal begin: Not an integer");
                begin >>>= 0;
                if (typeof end !== 'number' || end % 1 !== 0)
                    throw TypeError("Illegal end: Not an integer");
                end >>>= 0;
                if (begin < 0 || begin > end || end > this.buffer.byteLength)
                    throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
            }
            if (begin === end)
                return this; // Nothing to reverse
            Array.prototype.reverse.call(this.view.subarray(begin, end));
            return this;
        };
        /**
         * Skips the next `length` bytes. This will just advance
         * @param {number} length Number of bytes to skip. May also be negative to move the offset back.
         * @returns {!ByteBuffer} this
         * @expose
         */
        ByteBufferPrototype.skip = function(length) {
            if (!this.noAssert) {
                if (typeof length !== 'number' || length % 1 !== 0)
                    throw TypeError("Illegal length: "+length+" (not an integer)");
                length |= 0;
            }
            var offset = this.offset + length;
            if (!this.noAssert) {
                if (offset < 0 || offset > this.buffer.byteLength)
                    throw RangeError("Illegal length: 0 <= "+this.offset+" + "+length+" <= "+this.buffer.byteLength);
            }
            this.offset = offset;
            return this;
        };

        /**
         * Slices this ByteBuffer by creating a cloned instance with `offset = begin` and `limit = end`.
         * @param {number=} begin Begin offset, defaults to {@link ByteBuffer#offset}.
         * @param {number=} end End offset, defaults to {@link ByteBuffer#limit}.
         * @returns {!ByteBuffer} Clone of this ByteBuffer with slicing applied, backed by the same {@link ByteBuffer#buffer}
         * @expose
         */
        ByteBufferPrototype.slice = function(begin, end) {
            if (typeof begin === 'undefined') begin = this.offset;
            if (typeof end === 'undefined') end = this.limit;
            if (!this.noAssert) {
                if (typeof begin !== 'number' || begin % 1 !== 0)
                    throw TypeError("Illegal begin: Not an integer");
                begin >>>= 0;
                if (typeof end !== 'number' || end % 1 !== 0)
                    throw TypeError("Illegal end: Not an integer");
                end >>>= 0;
                if (begin < 0 || begin > end || end > this.buffer.byteLength)
                    throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
            }
            var bb = this.clone();
            bb.offset = begin;
            bb.limit = end;
            return bb;
        };
        /**
         * Returns a copy of the backing buffer that contains this ByteBuffer's contents. Contents are the bytes between
         *  {@link ByteBuffer#offset} and {@link ByteBuffer#limit}.
         * @param {boolean=} forceCopy If `true` returns a copy, otherwise returns a view referencing the same memory if
         *  possible. Defaults to `false`
         * @returns {!ArrayBuffer} Contents as an ArrayBuffer
         * @expose
         */
        ByteBufferPrototype.toBuffer = function(forceCopy) {
            var offset = this.offset,
                limit = this.limit;
            if (!this.noAssert) {
                if (typeof offset !== 'number' || offset % 1 !== 0)
                    throw TypeError("Illegal offset: Not an integer");
                offset >>>= 0;
                if (typeof limit !== 'number' || limit % 1 !== 0)
                    throw TypeError("Illegal limit: Not an integer");
                limit >>>= 0;
                if (offset < 0 || offset > limit || limit > this.buffer.byteLength)
                    throw RangeError("Illegal range: 0 <= "+offset+" <= "+limit+" <= "+this.buffer.byteLength);
            }
            // NOTE: It's not possible to have another ArrayBuffer reference the same memory as the backing buffer. This is
            // possible with Uint8Array#subarray only, but we have to return an ArrayBuffer by contract. So:
            if (!forceCopy && offset === 0 && limit === this.buffer.byteLength)
                return this.buffer;
            if (offset === limit)
                return EMPTY_BUFFER;
            var buffer = new ArrayBuffer(limit - offset);
            new Uint8Array(buffer).set(new Uint8Array(this.buffer).subarray(offset, limit), 0);
            return buffer;
        };

        /**
         * Returns a raw buffer compacted to contain this ByteBuffer's contents. Contents are the bytes between
         *  {@link ByteBuffer#offset} and {@link ByteBuffer#limit}. This is an alias of {@link ByteBuffer#toBuffer}.
         * @function
         * @param {boolean=} forceCopy If `true` returns a copy, otherwise returns a view referencing the same memory.
         *  Defaults to `false`
         * @returns {!ArrayBuffer} Contents as an ArrayBuffer
         * @expose
         */
        ByteBufferPrototype.toArrayBuffer = ByteBufferPrototype.toBuffer;

        /**
         * Converts the ByteBuffer's contents to a string.
         * @param {string=} encoding Output encoding. Returns an informative string representation if omitted but also allows
         *  direct conversion to "utf8", "hex", "base64" and "binary" encoding. "debug" returns a hex representation with
         *  highlighted offsets.
         * @param {number=} begin Offset to begin at, defaults to {@link ByteBuffer#offset}
         * @param {number=} end Offset to end at, defaults to {@link ByteBuffer#limit}
         * @returns {string} String representation
         * @throws {Error} If `encoding` is invalid
         * @expose
         */
        ByteBufferPrototype.toString = function(encoding, begin, end) {
            if (typeof encoding === 'undefined')
                return "ByteBufferAB(offset="+this.offset+",markedOffset="+this.markedOffset+",limit="+this.limit+",capacity="+this.capacity()+")";
            if (typeof encoding === 'number')
                encoding = "utf8",
                begin = encoding,
                end = begin;
            switch (encoding) {
                case "utf8":
                    return this.toUTF8(begin, end);
                case "base64":
                    return this.toBase64(begin, end);
                case "hex":
                    return this.toHex(begin, end);
                case "binary":
                    return this.toBinary(begin, end);
                case "debug":
                    return this.toDebug();
                case "columns":
                    return this.toColumns();
                default:
                    throw Error("Unsupported encoding: "+encoding);
            }
        };

        // lxiv-embeddable

        /**
         * lxiv-embeddable (c) 2014 Daniel Wirtz <dcode@dcode.io>
         * Released under the Apache License, Version 2.0
         * see: https://github.com/dcodeIO/lxiv for details
         */
        var lxiv = function() {
            "use strict";

            /**
             * lxiv namespace.
             * @type {!Object.<string,*>}
             * @exports lxiv
             */
            var lxiv = {};

            /**
             * Character codes for output.
             * @type {!Array.<number>}
             * @inner
             */
            var aout = [
                65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
                81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102,
                103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118,
                119, 120, 121, 122, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 43, 47
            ];

            /**
             * Character codes for input.
             * @type {!Array.<number>}
             * @inner
             */
            var ain = [];
            for (var i=0, k=aout.length; i<k; ++i)
                ain[aout[i]] = i;

            /**
             * Encodes bytes to base64 char codes.
             * @param {!function():number|null} src Bytes source as a function returning the next byte respectively `null` if
             *  there are no more bytes left.
             * @param {!function(number)} dst Characters destination as a function successively called with each encoded char
             *  code.
             */
            lxiv.encode = function(src, dst) {
                var b, t;
                while ((b = src()) !== null) {
                    dst(aout[(b>>2)&0x3f]);
                    t = (b&0x3)<<4;
                    if ((b = src()) !== null) {
                        t |= (b>>4)&0xf;
                        dst(aout[(t|((b>>4)&0xf))&0x3f]);
                        t = (b&0xf)<<2;
                        if ((b = src()) !== null)
                            dst(aout[(t|((b>>6)&0x3))&0x3f]),
                            dst(aout[b&0x3f]);
                        else
                            dst(aout[t&0x3f]),
                            dst(61);
                    } else
                        dst(aout[t&0x3f]),
                        dst(61),
                        dst(61);
                }
            };

            /**
             * Decodes base64 char codes to bytes.
             * @param {!function():number|null} src Characters source as a function returning the next char code respectively
             *  `null` if there are no more characters left.
             * @param {!function(number)} dst Bytes destination as a function successively called with the next byte.
             * @throws {Error} If a character code is invalid
             */
            lxiv.decode = function(src, dst) {
                var c, t1, t2;
                function fail(c) {
                    throw Error("Illegal character code: "+c);
                }
                while ((c = src()) !== null) {
                    t1 = ain[c];
                    if (typeof t1 === 'undefined') fail(c);
                    if ((c = src()) !== null) {
                        t2 = ain[c];
                        if (typeof t2 === 'undefined') fail(c);
                        dst((t1<<2)>>>0|(t2&0x30)>>4);
                        if ((c = src()) !== null) {
                            t1 = ain[c];
                            if (typeof t1 === 'undefined')
                                if (c === 61) break; else fail(c);
                            dst(((t2&0xf)<<4)>>>0|(t1&0x3c)>>2);
                            if ((c = src()) !== null) {
                                t2 = ain[c];
                                if (typeof t2 === 'undefined')
                                    if (c === 61) break; else fail(c);
                                dst(((t1&0x3)<<6)>>>0|t2);
                            }
                        }
                    }
                }
            };

            /**
             * Tests if a string is valid base64.
             * @param {string} str String to test
             * @returns {boolean} `true` if valid, otherwise `false`
             */
            lxiv.test = function(str) {
                return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(str);
            };

            return lxiv;
        }();

        // encodings/base64

        /**
         * Encodes this ByteBuffer's contents to a base64 encoded string.
         * @param {number=} begin Offset to begin at, defaults to {@link ByteBuffer#offset}.
         * @param {number=} end Offset to end at, defaults to {@link ByteBuffer#limit}.
         * @returns {string} Base64 encoded string
         * @throws {RangeError} If `begin` or `end` is out of bounds
         * @expose
         */
        ByteBufferPrototype.toBase64 = function(begin, end) {
            if (typeof begin === 'undefined')
                begin = this.offset;
            if (typeof end === 'undefined')
                end = this.limit;
            begin = begin | 0; end = end | 0;
            if (begin < 0 || end > this.capacity || begin > end)
                throw RangeError("begin, end");
            var sd; lxiv.encode(function() {
                return begin < end ? this.view[begin++] : null;
            }.bind(this), sd = stringDestination());
            return sd();
        };

        /**
         * Decodes a base64 encoded string to a ByteBuffer.
         * @param {string} str String to decode
         * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
         *  {@link ByteBuffer.DEFAULT_ENDIAN}.
         * @returns {!ByteBuffer} ByteBuffer
         * @expose
         */
        ByteBuffer.fromBase64 = function(str, littleEndian) {
            if (typeof str !== 'string')
                throw TypeError("str");
            var bb = new ByteBuffer(str.length/4*3, littleEndian),
                i = 0;
            lxiv.decode(stringSource(str), function(b) {
                bb.view[i++] = b;
            });
            bb.limit = i;
            return bb;
        };

        /**
         * Encodes a binary string to base64 like `window.btoa` does.
         * @param {string} str Binary string
         * @returns {string} Base64 encoded string
         * @see https://developer.mozilla.org/en-US/docs/Web/API/Window.btoa
         * @expose
         */
        ByteBuffer.btoa = function(str) {
            return ByteBuffer.fromBinary(str).toBase64();
        };

        /**
         * Decodes a base64 encoded string to binary like `window.atob` does.
         * @param {string} b64 Base64 encoded string
         * @returns {string} Binary string
         * @see https://developer.mozilla.org/en-US/docs/Web/API/Window.atob
         * @expose
         */
        ByteBuffer.atob = function(b64) {
            return ByteBuffer.fromBase64(b64).toBinary();
        };

        // encodings/binary

        /**
         * Encodes this ByteBuffer to a binary encoded string, that is using only characters 0x00-0xFF as bytes.
         * @param {number=} begin Offset to begin at. Defaults to {@link ByteBuffer#offset}.
         * @param {number=} end Offset to end at. Defaults to {@link ByteBuffer#limit}.
         * @returns {string} Binary encoded string
         * @throws {RangeError} If `offset > limit`
         * @expose
         */
        ByteBufferPrototype.toBinary = function(begin, end) {
            if (typeof begin === 'undefined')
                begin = this.offset;
            if (typeof end === 'undefined')
                end = this.limit;
            begin |= 0; end |= 0;
            if (begin < 0 || end > this.capacity() || begin > end)
                throw RangeError("begin, end");
            if (begin === end)
                return "";
            var chars = [],
                parts = [];
            while (begin < end) {
                chars.push(this.view[begin++]);
                if (chars.length >= 1024)
                    parts.push(String.fromCharCode.apply(String, chars)),
                    chars = [];
            }
            return parts.join('') + String.fromCharCode.apply(String, chars);
        };

        /**
         * Decodes a binary encoded string, that is using only characters 0x00-0xFF as bytes, to a ByteBuffer.
         * @param {string} str String to decode
         * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
         *  {@link ByteBuffer.DEFAULT_ENDIAN}.
         * @returns {!ByteBuffer} ByteBuffer
         * @expose
         */
        ByteBuffer.fromBinary = function(str, littleEndian) {
            if (typeof str !== 'string')
                throw TypeError("str");
            var i = 0,
                k = str.length,
                charCode,
                bb = new ByteBuffer(k, littleEndian);
            while (i<k) {
                charCode = str.charCodeAt(i);
                if (charCode > 0xff)
                    throw RangeError("illegal char code: "+charCode);
                bb.view[i++] = charCode;
            }
            bb.limit = k;
            return bb;
        };

        // encodings/debug

        /**
         * Encodes this ByteBuffer to a hex encoded string with marked offsets. Offset symbols are:
         * * `<` : offset,
         * * `'` : markedOffset,
         * * `>` : limit,
         * * `|` : offset and limit,
         * * `[` : offset and markedOffset,
         * * `]` : markedOffset and limit,
         * * `!` : offset, markedOffset and limit
         * @param {boolean=} columns If `true` returns two columns hex + ascii, defaults to `false`
         * @returns {string|!Array.<string>} Debug string or array of lines if `asArray = true`
         * @expose
         * @example `>00'01 02<03` contains four bytes with `limit=0, markedOffset=1, offset=3`
         * @example `00[01 02 03>` contains four bytes with `offset=markedOffset=1, limit=4`
         * @example `00|01 02 03` contains four bytes with `offset=limit=1, markedOffset=-1`
         * @example `|` contains zero bytes with `offset=limit=0, markedOffset=-1`
         */
        ByteBufferPrototype.toDebug = function(columns) {
            var i = -1,
                k = this.buffer.byteLength,
                b,
                hex = "",
                asc = "",
                out = "";
            while (i<k) {
                if (i !== -1) {
                    b = this.view[i];
                    if (b < 0x10) hex += "0"+b.toString(16).toUpperCase();
                    else hex += b.toString(16).toUpperCase();
                    if (columns)
                        asc += b > 32 && b < 127 ? String.fromCharCode(b) : '.';
                }
                ++i;
                if (columns) {
                    if (i > 0 && i % 16 === 0 && i !== k) {
                        while (hex.length < 3*16+3) hex += " ";
                        out += hex+asc+"\n";
                        hex = asc = "";
                    }
                }
                if (i === this.offset && i === this.limit)
                    hex += i === this.markedOffset ? "!" : "|";
                else if (i === this.offset)
                    hex += i === this.markedOffset ? "[" : "<";
                else if (i === this.limit)
                    hex += i === this.markedOffset ? "]" : ">";
                else
                    hex += i === this.markedOffset ? "'" : (columns || (i !== 0 && i !== k) ? " " : "");
            }
            if (columns && hex !== " ") {
                while (hex.length < 3*16+3)
                    hex += " ";
                out += hex + asc + "\n";
            }
            return columns ? out : hex;
        };

        /**
         * Decodes a hex encoded string with marked offsets to a ByteBuffer.
         * @param {string} str Debug string to decode (not be generated with `columns = true`)
         * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
         *  {@link ByteBuffer.DEFAULT_ENDIAN}.
         * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to
         *  {@link ByteBuffer.DEFAULT_NOASSERT}.
         * @returns {!ByteBuffer} ByteBuffer
         * @expose
         * @see ByteBuffer#toDebug
         */
        ByteBuffer.fromDebug = function(str, littleEndian, noAssert) {
            var k = str.length,
                bb = new ByteBuffer(((k+1)/3)|0, littleEndian, noAssert);
            var i = 0, j = 0, ch, b,
                rs = false, // Require symbol next
                ho = false, hm = false, hl = false, // Already has offset (ho), markedOffset (hm), limit (hl)?
                fail = false;
            while (i<k) {
                switch (ch = str.charAt(i++)) {
                    case '!':
                        if (!noAssert) {
                            if (ho || hm || hl) {
                                fail = true;
                                break;
                            }
                            ho = hm = hl = true;
                        }
                        bb.offset = bb.markedOffset = bb.limit = j;
                        rs = false;
                        break;
                    case '|':
                        if (!noAssert) {
                            if (ho || hl) {
                                fail = true;
                                break;
                            }
                            ho = hl = true;
                        }
                        bb.offset = bb.limit = j;
                        rs = false;
                        break;
                    case '[':
                        if (!noAssert) {
                            if (ho || hm) {
                                fail = true;
                                break;
                            }
                            ho = hm = true;
                        }
                        bb.offset = bb.markedOffset = j;
                        rs = false;
                        break;
                    case '<':
                        if (!noAssert) {
                            if (ho) {
                                fail = true;
                                break;
                            }
                            ho = true;
                        }
                        bb.offset = j;
                        rs = false;
                        break;
                    case ']':
                        if (!noAssert) {
                            if (hl || hm) {
                                fail = true;
                                break;
                            }
                            hl = hm = true;
                        }
                        bb.limit = bb.markedOffset = j;
                        rs = false;
                        break;
                    case '>':
                        if (!noAssert) {
                            if (hl) {
                                fail = true;
                                break;
                            }
                            hl = true;
                        }
                        bb.limit = j;
                        rs = false;
                        break;
                    case "'":
                        if (!noAssert) {
                            if (hm) {
                                fail = true;
                                break;
                            }
                            hm = true;
                        }
                        bb.markedOffset = j;
                        rs = false;
                        break;
                    case ' ':
                        rs = false;
                        break;
                    default:
                        if (!noAssert) {
                            if (rs) {
                                fail = true;
                                break;
                            }
                        }
                        b = parseInt(ch+str.charAt(i++), 16);
                        if (!noAssert) {
                            if (isNaN(b) || b < 0 || b > 255)
                                throw TypeError("Illegal str: Not a debug encoded string");
                        }
                        bb.view[j++] = b;
                        rs = true;
                }
                if (fail)
                    throw TypeError("Illegal str: Invalid symbol at "+i);
            }
            if (!noAssert) {
                if (!ho || !hl)
                    throw TypeError("Illegal str: Missing offset or limit");
                if (j<bb.buffer.byteLength)
                    throw TypeError("Illegal str: Not a debug encoded string (is it hex?) "+j+" < "+k);
            }
            return bb;
        };

        // encodings/hex

        /**
         * Encodes this ByteBuffer's contents to a hex encoded string.
         * @param {number=} begin Offset to begin at. Defaults to {@link ByteBuffer#offset}.
         * @param {number=} end Offset to end at. Defaults to {@link ByteBuffer#limit}.
         * @returns {string} Hex encoded string
         * @expose
         */
        ByteBufferPrototype.toHex = function(begin, end) {
            begin = typeof begin === 'undefined' ? this.offset : begin;
            end = typeof end === 'undefined' ? this.limit : end;
            if (!this.noAssert) {
                if (typeof begin !== 'number' || begin % 1 !== 0)
                    throw TypeError("Illegal begin: Not an integer");
                begin >>>= 0;
                if (typeof end !== 'number' || end % 1 !== 0)
                    throw TypeError("Illegal end: Not an integer");
                end >>>= 0;
                if (begin < 0 || begin > end || end > this.buffer.byteLength)
                    throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
            }
            var out = new Array(end - begin),
                b;
            while (begin < end) {
                b = this.view[begin++];
                if (b < 0x10)
                    out.push("0", b.toString(16));
                else out.push(b.toString(16));
            }
            return out.join('');
        };

        /**
         * Decodes a hex encoded string to a ByteBuffer.
         * @param {string} str String to decode
         * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
         *  {@link ByteBuffer.DEFAULT_ENDIAN}.
         * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to
         *  {@link ByteBuffer.DEFAULT_NOASSERT}.
         * @returns {!ByteBuffer} ByteBuffer
         * @expose
         */
        ByteBuffer.fromHex = function(str, littleEndian, noAssert) {
            if (!noAssert) {
                if (typeof str !== 'string')
                    throw TypeError("Illegal str: Not a string");
                if (str.length % 2 !== 0)
                    throw TypeError("Illegal str: Length not a multiple of 2");
            }
            var k = str.length,
                bb = new ByteBuffer((k / 2) | 0, littleEndian),
                b;
            for (var i=0, j=0; i<k; i+=2) {
                b = parseInt(str.substring(i, i+2), 16);
                if (!noAssert)
                    if (!isFinite(b) || b < 0 || b > 255)
                        throw TypeError("Illegal str: Contains non-hex characters");
                bb.view[j++] = b;
            }
            bb.limit = j;
            return bb;
        };

        // utfx-embeddable

        /**
         * utfx-embeddable (c) 2014 Daniel Wirtz <dcode@dcode.io>
         * Released under the Apache License, Version 2.0
         * see: https://github.com/dcodeIO/utfx for details
         */
        var utfx = function() {
            "use strict";

            /**
             * utfx namespace.
             * @inner
             * @type {!Object.<string,*>}
             */
            var utfx = {};

            /**
             * Maximum valid code point.
             * @type {number}
             * @const
             */
            utfx.MAX_CODEPOINT = 0x10FFFF;

            /**
             * Encodes UTF8 code points to UTF8 bytes.
             * @param {(!function():number|null) | number} src Code points source, either as a function returning the next code point
             *  respectively `null` if there are no more code points left or a single numeric code point.
             * @param {!function(number)} dst Bytes destination as a function successively called with the next byte
             */
            utfx.encodeUTF8 = function(src, dst) {
                var cp = null;
                if (typeof src === 'number')
                    cp = src,
                    src = function() { return null; };
                while (cp !== null || (cp = src()) !== null) {
                    if (cp < 0x80)
                        dst(cp&0x7F);
                    else if (cp < 0x800)
                        dst(((cp>>6)&0x1F)|0xC0),
                        dst((cp&0x3F)|0x80);
                    else if (cp < 0x10000)
                        dst(((cp>>12)&0x0F)|0xE0),
                        dst(((cp>>6)&0x3F)|0x80),
                        dst((cp&0x3F)|0x80);
                    else
                        dst(((cp>>18)&0x07)|0xF0),
                        dst(((cp>>12)&0x3F)|0x80),
                        dst(((cp>>6)&0x3F)|0x80),
                        dst((cp&0x3F)|0x80);
                    cp = null;
                }
            };

            /**
             * Decodes UTF8 bytes to UTF8 code points.
             * @param {!function():number|null} src Bytes source as a function returning the next byte respectively `null` if there
             *  are no more bytes left.
             * @param {!function(number)} dst Code points destination as a function successively called with each decoded code point.
             * @throws {RangeError} If a starting byte is invalid in UTF8
             * @throws {Error} If the last sequence is truncated. Has an array property `bytes` holding the
             *  remaining bytes.
             */
            utfx.decodeUTF8 = function(src, dst) {
                var a, b, c, d, fail = function(b) {
                    b = b.slice(0, b.indexOf(null));
                    var err = Error(b.toString());
                    err.name = "TruncatedError";
                    err['bytes'] = b;
                    throw err;
                };
                while ((a = src()) !== null) {
                    if ((a&0x80) === 0)
                        dst(a);
                    else if ((a&0xE0) === 0xC0)
                        ((b = src()) === null) && fail([a, b]),
                        dst(((a&0x1F)<<6) | (b&0x3F));
                    else if ((a&0xF0) === 0xE0)
                        ((b=src()) === null || (c=src()) === null) && fail([a, b, c]),
                        dst(((a&0x0F)<<12) | ((b&0x3F)<<6) | (c&0x3F));
                    else if ((a&0xF8) === 0xF0)
                        ((b=src()) === null || (c=src()) === null || (d=src()) === null) && fail([a, b, c ,d]),
                        dst(((a&0x07)<<18) | ((b&0x3F)<<12) | ((c&0x3F)<<6) | (d&0x3F));
                    else throw RangeError("Illegal starting byte: "+a);
                }
            };

            /**
             * Converts UTF16 characters to UTF8 code points.
             * @param {!function():number|null} src Characters source as a function returning the next char code respectively
             *  `null` if there are no more characters left.
             * @param {!function(number)} dst Code points destination as a function successively called with each converted code
             *  point.
             */
            utfx.UTF16toUTF8 = function(src, dst) {
                var c1, c2 = null;
                while (true) {
                    if ((c1 = c2 !== null ? c2 : src()) === null)
                        break;
                    if (c1 >= 0xD800 && c1 <= 0xDFFF) {
                        if ((c2 = src()) !== null) {
                            if (c2 >= 0xDC00 && c2 <= 0xDFFF) {
                                dst((c1-0xD800)*0x400+c2-0xDC00+0x10000);
                                c2 = null; continue;
                            }
                        }
                    }
                    dst(c1);
                }
                if (c2 !== null) dst(c2);
            };

            /**
             * Converts UTF8 code points to UTF16 characters.
             * @param {(!function():number|null) | number} src Code points source, either as a function returning the next code point
             *  respectively `null` if there are no more code points left or a single numeric code point.
             * @param {!function(number)} dst Characters destination as a function successively called with each converted char code.
             * @throws {RangeError} If a code point is out of range
             */
            utfx.UTF8toUTF16 = function(src, dst) {
                var cp = null;
                if (typeof src === 'number')
                    cp = src, src = function() { return null; };
                while (cp !== null || (cp = src()) !== null) {
                    if (cp <= 0xFFFF)
                        dst(cp);
                    else
                        cp -= 0x10000,
                        dst((cp>>10)+0xD800),
                        dst((cp%0x400)+0xDC00);
                    cp = null;
                }
            };

            /**
             * Converts and encodes UTF16 characters to UTF8 bytes.
             * @param {!function():number|null} src Characters source as a function returning the next char code respectively `null`
             *  if there are no more characters left.
             * @param {!function(number)} dst Bytes destination as a function successively called with the next byte.
             */
            utfx.encodeUTF16toUTF8 = function(src, dst) {
                utfx.UTF16toUTF8(src, function(cp) {
                    utfx.encodeUTF8(cp, dst);
                });
            };

            /**
             * Decodes and converts UTF8 bytes to UTF16 characters.
             * @param {!function():number|null} src Bytes source as a function returning the next byte respectively `null` if there
             *  are no more bytes left.
             * @param {!function(number)} dst Characters destination as a function successively called with each converted char code.
             * @throws {RangeError} If a starting byte is invalid in UTF8
             * @throws {Error} If the last sequence is truncated. Has an array property `bytes` holding the remaining bytes.
             */
            utfx.decodeUTF8toUTF16 = function(src, dst) {
                utfx.decodeUTF8(src, function(cp) {
                    utfx.UTF8toUTF16(cp, dst);
                });
            };

            /**
             * Calculates the byte length of an UTF8 code point.
             * @param {number} cp UTF8 code point
             * @returns {number} Byte length
             */
            utfx.calculateCodePoint = function(cp) {
                return (cp < 0x80) ? 1 : (cp < 0x800) ? 2 : (cp < 0x10000) ? 3 : 4;
            };

            /**
             * Calculates the number of UTF8 bytes required to store UTF8 code points.
             * @param {(!function():number|null)} src Code points source as a function returning the next code point respectively
             *  `null` if there are no more code points left.
             * @returns {number} The number of UTF8 bytes required
             */
            utfx.calculateUTF8 = function(src) {
                var cp, l=0;
                while ((cp = src()) !== null)
                    l += (cp < 0x80) ? 1 : (cp < 0x800) ? 2 : (cp < 0x10000) ? 3 : 4;
                return l;
            };

            /**
             * Calculates the number of UTF8 code points respectively UTF8 bytes required to store UTF16 char codes.
             * @param {(!function():number|null)} src Characters source as a function returning the next char code respectively
             *  `null` if there are no more characters left.
             * @returns {!Array.<number>} The number of UTF8 code points at index 0 and the number of UTF8 bytes required at index 1.
             */
            utfx.calculateUTF16asUTF8 = function(src) {
                var n=0, l=0;
                utfx.UTF16toUTF8(src, function(cp) {
                    ++n; l += (cp < 0x80) ? 1 : (cp < 0x800) ? 2 : (cp < 0x10000) ? 3 : 4;
                });
                return [n,l];
            };

            return utfx;
        }();

        // encodings/utf8

        /**
         * Encodes this ByteBuffer's contents between {@link ByteBuffer#offset} and {@link ByteBuffer#limit} to an UTF8 encoded
         *  string.
         * @returns {string} Hex encoded string
         * @throws {RangeError} If `offset > limit`
         * @expose
         */
        ByteBufferPrototype.toUTF8 = function(begin, end) {
            if (typeof begin === 'undefined') begin = this.offset;
            if (typeof end === 'undefined') end = this.limit;
            if (!this.noAssert) {
                if (typeof begin !== 'number' || begin % 1 !== 0)
                    throw TypeError("Illegal begin: Not an integer");
                begin >>>= 0;
                if (typeof end !== 'number' || end % 1 !== 0)
                    throw TypeError("Illegal end: Not an integer");
                end >>>= 0;
                if (begin < 0 || begin > end || end > this.buffer.byteLength)
                    throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
            }
            var sd; try {
                utfx.decodeUTF8toUTF16(function() {
                    return begin < end ? this.view[begin++] : null;
                }.bind(this), sd = stringDestination());
            } catch (e) {
                if (begin !== end)
                    throw RangeError("Illegal range: Truncated data, "+begin+" != "+end);
            }
            return sd();
        };

        /**
         * Decodes an UTF8 encoded string to a ByteBuffer.
         * @param {string} str String to decode
         * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
         *  {@link ByteBuffer.DEFAULT_ENDIAN}.
         * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to
         *  {@link ByteBuffer.DEFAULT_NOASSERT}.
         * @returns {!ByteBuffer} ByteBuffer
         * @expose
         */
        ByteBuffer.fromUTF8 = function(str, littleEndian, noAssert) {
            if (!noAssert)
                if (typeof str !== 'string')
                    throw TypeError("Illegal str: Not a string");
            var bb = new ByteBuffer(utfx.calculateUTF16asUTF8(stringSource(str), true)[1], littleEndian, noAssert),
                i = 0;
            utfx.encodeUTF16toUTF8(stringSource(str), function(b) {
                bb.view[i++] = b;
            });
            bb.limit = i;
            return bb;
        };

        return ByteBuffer;
    });
    });

    var require$$2$1 = (bytebuffer && typeof bytebuffer === 'object' && 'default' in bytebuffer ? bytebuffer['default'] : bytebuffer);

    var protobuf = __commonjs(function (module, exports, global) {
    /*
     Copyright 2013 Daniel Wirtz <dcode@dcode.io>

     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
     */

    /**
     * @license protobuf.js (c) 2013 Daniel Wirtz <dcode@dcode.io>
     * Released under the Apache License, Version 2.0
     * see: https://github.com/dcodeIO/protobuf.js for details
     */
    (function(global, factory) {

        /* AMD */ if (typeof define === 'function' && define["amd"])
            define(["bytebuffer"], factory);
        /* CommonJS */ else if (typeof require === "function" && typeof module === "object" && module && module["exports"])
            module["exports"] = factory(require$$2$1, true);
        /* Global */ else
            (global["dcodeIO"] = global["dcodeIO"] || {})["ProtoBuf"] = factory(global["dcodeIO"]["ByteBuffer"]);

    })(__commonjs_global, function(ByteBuffer, isCommonJS) {
        "use strict";

        /**
         * The ProtoBuf namespace.
         * @exports ProtoBuf
         * @namespace
         * @expose
         */
        var ProtoBuf = {};

        /**
         * @type {!function(new: ByteBuffer, ...[*])}
         * @expose
         */
        ProtoBuf.ByteBuffer = ByteBuffer;

        /**
         * @type {?function(new: Long, ...[*])}
         * @expose
         */
        ProtoBuf.Long = ByteBuffer.Long || null;

        /**
         * ProtoBuf.js version.
         * @type {string}
         * @const
         * @expose
         */
        ProtoBuf.VERSION = "5.0.1";

        /**
         * Wire types.
         * @type {Object.<string,number>}
         * @const
         * @expose
         */
        ProtoBuf.WIRE_TYPES = {};

        /**
         * Varint wire type.
         * @type {number}
         * @expose
         */
        ProtoBuf.WIRE_TYPES.VARINT = 0;

        /**
         * Fixed 64 bits wire type.
         * @type {number}
         * @const
         * @expose
         */
        ProtoBuf.WIRE_TYPES.BITS64 = 1;

        /**
         * Length delimited wire type.
         * @type {number}
         * @const
         * @expose
         */
        ProtoBuf.WIRE_TYPES.LDELIM = 2;

        /**
         * Start group wire type.
         * @type {number}
         * @const
         * @expose
         */
        ProtoBuf.WIRE_TYPES.STARTGROUP = 3;

        /**
         * End group wire type.
         * @type {number}
         * @const
         * @expose
         */
        ProtoBuf.WIRE_TYPES.ENDGROUP = 4;

        /**
         * Fixed 32 bits wire type.
         * @type {number}
         * @const
         * @expose
         */
        ProtoBuf.WIRE_TYPES.BITS32 = 5;

        /**
         * Packable wire types.
         * @type {!Array.<number>}
         * @const
         * @expose
         */
        ProtoBuf.PACKABLE_WIRE_TYPES = [
            ProtoBuf.WIRE_TYPES.VARINT,
            ProtoBuf.WIRE_TYPES.BITS64,
            ProtoBuf.WIRE_TYPES.BITS32
        ];

        /**
         * Types.
         * @dict
         * @type {!Object.<string,{name: string, wireType: number, defaultValue: *}>}
         * @const
         * @expose
         */
        ProtoBuf.TYPES = {
            // According to the protobuf spec.
            "int32": {
                name: "int32",
                wireType: ProtoBuf.WIRE_TYPES.VARINT,
                defaultValue: 0
            },
            "uint32": {
                name: "uint32",
                wireType: ProtoBuf.WIRE_TYPES.VARINT,
                defaultValue: 0
            },
            "sint32": {
                name: "sint32",
                wireType: ProtoBuf.WIRE_TYPES.VARINT,
                defaultValue: 0
            },
            "int64": {
                name: "int64",
                wireType: ProtoBuf.WIRE_TYPES.VARINT,
                defaultValue: ProtoBuf.Long ? ProtoBuf.Long.ZERO : undefined
            },
            "uint64": {
                name: "uint64",
                wireType: ProtoBuf.WIRE_TYPES.VARINT,
                defaultValue: ProtoBuf.Long ? ProtoBuf.Long.UZERO : undefined
            },
            "sint64": {
                name: "sint64",
                wireType: ProtoBuf.WIRE_TYPES.VARINT,
                defaultValue: ProtoBuf.Long ? ProtoBuf.Long.ZERO : undefined
            },
            "bool": {
                name: "bool",
                wireType: ProtoBuf.WIRE_TYPES.VARINT,
                defaultValue: false
            },
            "double": {
                name: "double",
                wireType: ProtoBuf.WIRE_TYPES.BITS64,
                defaultValue: 0
            },
            "string": {
                name: "string",
                wireType: ProtoBuf.WIRE_TYPES.LDELIM,
                defaultValue: ""
            },
            "bytes": {
                name: "bytes",
                wireType: ProtoBuf.WIRE_TYPES.LDELIM,
                defaultValue: null // overridden in the code, must be a unique instance
            },
            "fixed32": {
                name: "fixed32",
                wireType: ProtoBuf.WIRE_TYPES.BITS32,
                defaultValue: 0
            },
            "sfixed32": {
                name: "sfixed32",
                wireType: ProtoBuf.WIRE_TYPES.BITS32,
                defaultValue: 0
            },
            "fixed64": {
                name: "fixed64",
                wireType: ProtoBuf.WIRE_TYPES.BITS64,
                defaultValue:  ProtoBuf.Long ? ProtoBuf.Long.UZERO : undefined
            },
            "sfixed64": {
                name: "sfixed64",
                wireType: ProtoBuf.WIRE_TYPES.BITS64,
                defaultValue: ProtoBuf.Long ? ProtoBuf.Long.ZERO : undefined
            },
            "float": {
                name: "float",
                wireType: ProtoBuf.WIRE_TYPES.BITS32,
                defaultValue: 0
            },
            "enum": {
                name: "enum",
                wireType: ProtoBuf.WIRE_TYPES.VARINT,
                defaultValue: 0
            },
            "message": {
                name: "message",
                wireType: ProtoBuf.WIRE_TYPES.LDELIM,
                defaultValue: null
            },
            "group": {
                name: "group",
                wireType: ProtoBuf.WIRE_TYPES.STARTGROUP,
                defaultValue: null
            }
        };

        /**
         * Valid map key types.
         * @type {!Array.<!Object.<string,{name: string, wireType: number, defaultValue: *}>>}
         * @const
         * @expose
         */
        ProtoBuf.MAP_KEY_TYPES = [
            ProtoBuf.TYPES["int32"],
            ProtoBuf.TYPES["sint32"],
            ProtoBuf.TYPES["sfixed32"],
            ProtoBuf.TYPES["uint32"],
            ProtoBuf.TYPES["fixed32"],
            ProtoBuf.TYPES["int64"],
            ProtoBuf.TYPES["sint64"],
            ProtoBuf.TYPES["sfixed64"],
            ProtoBuf.TYPES["uint64"],
            ProtoBuf.TYPES["fixed64"],
            ProtoBuf.TYPES["bool"],
            ProtoBuf.TYPES["string"],
            ProtoBuf.TYPES["bytes"]
        ];

        /**
         * Minimum field id.
         * @type {number}
         * @const
         * @expose
         */
        ProtoBuf.ID_MIN = 1;

        /**
         * Maximum field id.
         * @type {number}
         * @const
         * @expose
         */
        ProtoBuf.ID_MAX = 0x1FFFFFFF;

        /**
         * If set to `true`, field names will be converted from underscore notation to camel case. Defaults to `false`.
         *  Must be set prior to parsing.
         * @type {boolean}
         * @expose
         */
        ProtoBuf.convertFieldsToCamelCase = false;

        /**
         * By default, messages are populated with (setX, set_x) accessors for each field. This can be disabled by
         *  setting this to `false` prior to building messages.
         * @type {boolean}
         * @expose
         */
        ProtoBuf.populateAccessors = true;

        /**
         * By default, messages are populated with default values if a field is not present on the wire. To disable
         *  this behavior, set this setting to `false`.
         * @type {boolean}
         * @expose
         */
        ProtoBuf.populateDefaults = true;

        /**
         * @alias ProtoBuf.Util
         * @expose
         */
        ProtoBuf.Util = (function() {
            "use strict";

            /**
             * ProtoBuf utilities.
             * @exports ProtoBuf.Util
             * @namespace
             */
            var Util = {};

            /**
             * Flag if running in node or not.
             * @type {boolean}
             * @const
             * @expose
             */
            Util.IS_NODE = !!(
                typeof process === 'object' && process+'' === '[object process]' && !process['browser']
            );

            /**
             * Constructs a XMLHttpRequest object.
             * @return {XMLHttpRequest}
             * @throws {Error} If XMLHttpRequest is not supported
             * @expose
             */
            Util.XHR = function() {
                // No dependencies please, ref: http://www.quirksmode.org/js/xmlhttp.html
                var XMLHttpFactories = [
                    function () {return new XMLHttpRequest()},
                    function () {return new ActiveXObject("Msxml2.XMLHTTP")},
                    function () {return new ActiveXObject("Msxml3.XMLHTTP")},
                    function () {return new ActiveXObject("Microsoft.XMLHTTP")}
                ];
                /** @type {?XMLHttpRequest} */
                var xhr = null;
                for (var i=0;i<XMLHttpFactories.length;i++) {
                    try { xhr = XMLHttpFactories[i](); }
                    catch (e) { continue; }
                    break;
                }
                if (!xhr)
                    throw Error("XMLHttpRequest is not supported");
                return xhr;
            };

            /**
             * Fetches a resource.
             * @param {string} path Resource path
             * @param {function(?string)=} callback Callback receiving the resource's contents. If omitted the resource will
             *   be fetched synchronously. If the request failed, contents will be null.
             * @return {?string|undefined} Resource contents if callback is omitted (null if the request failed), else undefined.
             * @expose
             */
            Util.fetch = function(path, callback) {
                if (callback && typeof callback != 'function')
                    callback = null;
                if (Util.IS_NODE) {
                    var fs = require$$1$1;
                    if (callback) {
                        fs.readFile(path, function(err, data) {
                            if (err)
                                callback(null);
                            else
                                callback(""+data);
                        });
                    } else
                        try {
                            return fs.readFileSync(path);
                        } catch (e) {
                            return null;
                        }
                } else {
                    var xhr = Util.XHR();
                    xhr.open('GET', path, callback ? true : false);
                    // xhr.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
                    xhr.setRequestHeader('Accept', 'text/plain');
                    if (typeof xhr.overrideMimeType === 'function') xhr.overrideMimeType('text/plain');
                    if (callback) {
                        xhr.onreadystatechange = function() {
                            if (xhr.readyState != 4) return;
                            if (/* remote */ xhr.status == 200 || /* local */ (xhr.status == 0 && typeof xhr.responseText === 'string'))
                                callback(xhr.responseText);
                            else
                                callback(null);
                        };
                        if (xhr.readyState == 4)
                            return;
                        xhr.send(null);
                    } else {
                        xhr.send(null);
                        if (/* remote */ xhr.status == 200 || /* local */ (xhr.status == 0 && typeof xhr.responseText === 'string'))
                            return xhr.responseText;
                        return null;
                    }
                }
            };

            /**
             * Converts a string to camel case.
             * @param {string} str
             * @returns {string}
             * @expose
             */
            Util.toCamelCase = function(str) {
                return str.replace(/_([a-zA-Z])/g, function ($0, $1) {
                    return $1.toUpperCase();
                });
            };

            return Util;
        })();

        /**
         * Language expressions.
         * @type {!Object.<string,!RegExp>}
         * @expose
         */
        ProtoBuf.Lang = {

            // Characters always ending a statement
            DELIM: /[\s\{\}=;:\[\],'"\(\)<>]/g,

            // Field rules
            RULE: /^(?:required|optional|repeated|map)$/,

            // Field types
            TYPE: /^(?:double|float|int32|uint32|sint32|int64|uint64|sint64|fixed32|sfixed32|fixed64|sfixed64|bool|string|bytes)$/,

            // Names
            NAME: /^[a-zA-Z_][a-zA-Z_0-9]*$/,

            // Type definitions
            TYPEDEF: /^[a-zA-Z][a-zA-Z_0-9]*$/,

            // Type references
            TYPEREF: /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)+$/,

            // Fully qualified type references
            FQTYPEREF: /^(?:\.[a-zA-Z][a-zA-Z_0-9]*)+$/,

            // All numbers
            NUMBER: /^-?(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+|([0-9]*(\.[0-9]*)?([Ee][+-]?[0-9]+)?)|inf|nan)$/,

            // Decimal numbers
            NUMBER_DEC: /^(?:[1-9][0-9]*|0)$/,

            // Hexadecimal numbers
            NUMBER_HEX: /^0[xX][0-9a-fA-F]+$/,

            // Octal numbers
            NUMBER_OCT: /^0[0-7]+$/,

            // Floating point numbers
            NUMBER_FLT: /^([0-9]*(\.[0-9]*)?([Ee][+-]?[0-9]+)?|inf|nan)$/,

            // Booleans
            BOOL: /^(?:true|false)$/i,

            // Id numbers
            ID: /^(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+)$/,

            // Negative id numbers (enum values)
            NEGID: /^\-?(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+)$/,

            // Whitespaces
            WHITESPACE: /\s/,

            // All strings
            STRING: /(?:"([^"\\]*(?:\\.[^"\\]*)*)")|(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g,

            // Double quoted strings
            STRING_DQ: /(?:"([^"\\]*(?:\\.[^"\\]*)*)")/g,

            // Single quoted strings
            STRING_SQ: /(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g
        };

        /**
         * @alias ProtoBuf.DotProto
         * @expose
         */
        ProtoBuf.DotProto = (function(ProtoBuf, Lang) {
            "use strict";

            /**
             * Utilities to parse .proto files.
             * @exports ProtoBuf.DotProto
             * @namespace
             */
            var DotProto = {};

            /**
             * Constructs a new Tokenizer.
             * @exports ProtoBuf.DotProto.Tokenizer
             * @class prototype tokenizer
             * @param {string} proto Proto to tokenize
             * @constructor
             */
            var Tokenizer = function(proto) {

                /**
                 * Source to parse.
                 * @type {string}
                 * @expose
                 */
                this.source = proto+"";

                /**
                 * Current index.
                 * @type {number}
                 * @expose
                 */
                this.index = 0;

                /**
                 * Current line.
                 * @type {number}
                 * @expose
                 */
                this.line = 1;

                /**
                 * Token stack.
                 * @type {!Array.<string>}
                 * @expose
                 */
                this.stack = [];

                /**
                 * Opening character of the current string read, if any.
                 * @type {?string}
                 * @private
                 */
                this._stringOpen = null;
            };

            /**
             * @alias ProtoBuf.DotProto.Tokenizer.prototype
             * @inner
             */
            var TokenizerPrototype = Tokenizer.prototype;

            /**
             * Reads a string beginning at the current index.
             * @return {string}
             * @private
             */
            TokenizerPrototype._readString = function() {
                var re = this._stringOpen === '"'
                    ? Lang.STRING_DQ
                    : Lang.STRING_SQ;
                re.lastIndex = this.index - 1; // Include the open quote
                var match = re.exec(this.source);
                if (!match)
                    throw Error("unterminated string");
                this.index = re.lastIndex;
                this.stack.push(this._stringOpen);
                this._stringOpen = null;
                return match[1];
            };

            /**
             * Gets the next token and advances by one.
             * @return {?string} Token or `null` on EOF
             * @expose
             */
            TokenizerPrototype.next = function() {
                if (this.stack.length > 0)
                    return this.stack.shift();
                if (this.index >= this.source.length)
                    return null;
                if (this._stringOpen !== null)
                    return this._readString();

                var repeat,
                    prev,
                    next;
                do {
                    repeat = false;

                    // Strip white spaces
                    while (Lang.WHITESPACE.test(next = this.source.charAt(this.index))) {
                        if (next === '\n')
                            ++this.line;
                        if (++this.index === this.source.length)
                            return null;
                    }

                    // Strip comments
                    if (this.source.charAt(this.index) === '/') {
                        ++this.index;
                        if (this.source.charAt(this.index) === '/') { // Line
                            while (this.source.charAt(++this.index) !== '\n')
                                if (this.index == this.source.length)
                                    return null;
                            ++this.index;
                            ++this.line;
                            repeat = true;
                        } else if ((next = this.source.charAt(this.index)) === '*') { /* Block */
                            do {
                                if (next === '\n')
                                    ++this.line;
                                if (++this.index === this.source.length)
                                    return null;
                                prev = next;
                                next = this.source.charAt(this.index);
                            } while (prev !== '*' || next !== '/');
                            ++this.index;
                            repeat = true;
                        } else
                            return '/';
                    }
                } while (repeat);

                if (this.index === this.source.length)
                    return null;

                // Read the next token
                var end = this.index;
                Lang.DELIM.lastIndex = 0;
                var delim = Lang.DELIM.test(this.source.charAt(end++));
                if (!delim)
                    while(end < this.source.length && !Lang.DELIM.test(this.source.charAt(end)))
                        ++end;
                var token = this.source.substring(this.index, this.index = end);
                if (token === '"' || token === "'")
                    this._stringOpen = token;
                return token;
            };

            /**
             * Peeks for the next token.
             * @return {?string} Token or `null` on EOF
             * @expose
             */
            TokenizerPrototype.peek = function() {
                if (this.stack.length === 0) {
                    var token = this.next();
                    if (token === null)
                        return null;
                    this.stack.push(token);
                }
                return this.stack[0];
            };

            /**
             * Skips a specific token and throws if it differs.
             * @param {string} expected Expected token
             * @throws {Error} If the actual token differs
             */
            TokenizerPrototype.skip = function(expected) {
                var actual = this.next();
                if (actual !== expected)
                    throw Error("illegal '"+actual+"', '"+expected+"' expected");
            };

            /**
             * Omits an optional token.
             * @param {string} expected Expected optional token
             * @returns {boolean} `true` if the token exists
             */
            TokenizerPrototype.omit = function(expected) {
                if (this.peek() === expected) {
                    this.next();
                    return true;
                }
                return false;
            };

            /**
             * Returns a string representation of this object.
             * @return {string} String representation as of "Tokenizer(index/length)"
             * @expose
             */
            TokenizerPrototype.toString = function() {
                return "Tokenizer ("+this.index+"/"+this.source.length+" at line "+this.line+")";
            };

            /**
             * @alias ProtoBuf.DotProto.Tokenizer
             * @expose
             */
            DotProto.Tokenizer = Tokenizer;

            /**
             * Constructs a new Parser.
             * @exports ProtoBuf.DotProto.Parser
             * @class prototype parser
             * @param {string} source Source
             * @constructor
             */
            var Parser = function(source) {

                /**
                 * Tokenizer.
                 * @type {!ProtoBuf.DotProto.Tokenizer}
                 * @expose
                 */
                this.tn = new Tokenizer(source);

                /**
                 * Whether parsing proto3 or not.
                 * @type {boolean}
                 */
                this.proto3 = false;
            };

            /**
             * @alias ProtoBuf.DotProto.Parser.prototype
             * @inner
             */
            var ParserPrototype = Parser.prototype;

            /**
             * Parses the source.
             * @returns {!Object}
             * @throws {Error} If the source cannot be parsed
             * @expose
             */
            ParserPrototype.parse = function() {
                var topLevel = {
                    "name": "[ROOT]", // temporary
                    "package": null,
                    "messages": [],
                    "enums": [],
                    "imports": [],
                    "options": {},
                    "services": []
                    // "syntax": undefined
                };
                var token,
                    head = true,
                    weak;
                try {
                    while (token = this.tn.next()) {
                        switch (token) {
                            case 'package':
                                if (!head || topLevel["package"] !== null)
                                    throw Error("unexpected 'package'");
                                token = this.tn.next();
                                if (!Lang.TYPEREF.test(token))
                                    throw Error("illegal package name: " + token);
                                this.tn.skip(";");
                                topLevel["package"] = token;
                                break;
                            case 'import':
                                if (!head)
                                    throw Error("unexpected 'import'");
                                token = this.tn.peek();
                                if (token === "public" || (weak = token === "weak")) // token ignored
                                    this.tn.next();
                                token = this._readString();
                                this.tn.skip(";");
                                if (!weak) // import ignored
                                    topLevel["imports"].push(token);
                                break;
                            case 'syntax':
                                if (!head)
                                    throw Error("unexpected 'syntax'");
                                this.tn.skip("=");
                                if ((topLevel["syntax"] = this._readString()) === "proto3")
                                    this.proto3 = true;
                                this.tn.skip(";");
                                break;
                            case 'message':
                                this._parseMessage(topLevel, null);
                                head = false;
                                break;
                            case 'enum':
                                this._parseEnum(topLevel);
                                head = false;
                                break;
                            case 'option':
                                this._parseOption(topLevel);
                                break;
                            case 'service':
                                this._parseService(topLevel);
                                break;
                            case 'extend':
                                this._parseExtend(topLevel);
                                break;
                            default:
                                throw Error("unexpected '" + token + "'");
                        }
                    }
                } catch (e) {
                    e.message = "Parse error at line "+this.tn.line+": " + e.message;
                    throw e;
                }
                delete topLevel["name"];
                return topLevel;
            };

            /**
             * Parses the specified source.
             * @returns {!Object}
             * @throws {Error} If the source cannot be parsed
             * @expose
             */
            Parser.parse = function(source) {
                return new Parser(source).parse();
            };

            // ----- Conversion ------

            /**
             * Converts a numerical string to an id.
             * @param {string} value
             * @param {boolean=} mayBeNegative
             * @returns {number}
             * @inner
             */
            function mkId(value, mayBeNegative) {
                var id = -1,
                    sign = 1;
                if (value.charAt(0) == '-') {
                    sign = -1;
                    value = value.substring(1);
                }
                if (Lang.NUMBER_DEC.test(value))
                    id = parseInt(value);
                else if (Lang.NUMBER_HEX.test(value))
                    id = parseInt(value.substring(2), 16);
                else if (Lang.NUMBER_OCT.test(value))
                    id = parseInt(value.substring(1), 8);
                else
                    throw Error("illegal id value: " + (sign < 0 ? '-' : '') + value);
                id = (sign*id)|0; // Force to 32bit
                if (!mayBeNegative && id < 0)
                    throw Error("illegal id value: " + (sign < 0 ? '-' : '') + value);
                return id;
            }

            /**
             * Converts a numerical string to a number.
             * @param {string} val
             * @returns {number}
             * @inner
             */
            function mkNumber(val) {
                var sign = 1;
                if (val.charAt(0) == '-') {
                    sign = -1;
                    val = val.substring(1);
                }
                if (Lang.NUMBER_DEC.test(val))
                    return sign * parseInt(val, 10);
                else if (Lang.NUMBER_HEX.test(val))
                    return sign * parseInt(val.substring(2), 16);
                else if (Lang.NUMBER_OCT.test(val))
                    return sign * parseInt(val.substring(1), 8);
                else if (val === 'inf')
                    return sign * Infinity;
                else if (val === 'nan')
                    return NaN;
                else if (Lang.NUMBER_FLT.test(val))
                    return sign * parseFloat(val);
                throw Error("illegal number value: " + (sign < 0 ? '-' : '') + val);
            }

            // ----- Reading ------

            /**
             * Reads a string.
             * @returns {string}
             * @private
             */
            ParserPrototype._readString = function() {
                var value = "",
                    token,
                    delim;
                do {
                    delim = this.tn.next();
                    if (delim !== "'" && delim !== '"')
                        throw Error("illegal string delimiter: "+delim);
                    value += this.tn.next();
                    this.tn.skip(delim);
                    token = this.tn.peek();
                } while (token === '"' || token === '"'); // multi line?
                return value;
            };

            /**
             * Reads a value.
             * @param {boolean=} mayBeTypeRef
             * @returns {number|boolean|string}
             * @private
             */
            ParserPrototype._readValue = function(mayBeTypeRef) {
                var token = this.tn.peek(),
                    value;
                if (token === '"' || token === "'")
                    return this._readString();
                this.tn.next();
                if (Lang.NUMBER.test(token))
                    return mkNumber(token);
                if (Lang.BOOL.test(token))
                    return (token.toLowerCase() === 'true');
                if (mayBeTypeRef && Lang.TYPEREF.test(token))
                    return token;
                throw Error("illegal value: "+token);

            };

            // ----- Parsing constructs -----

            /**
             * Parses a namespace option.
             * @param {!Object} parent Parent definition
             * @param {boolean=} isList
             * @private
             */
            ParserPrototype._parseOption = function(parent, isList) {
                var token = this.tn.next(),
                    custom = false;
                if (token === '(') {
                    custom = true;
                    token = this.tn.next();
                }
                if (!Lang.TYPEREF.test(token))
                    // we can allow options of the form google.protobuf.* since they will just get ignored anyways
                    // if (!/google\.protobuf\./.test(token)) // FIXME: Why should that not be a valid typeref?
                        throw Error("illegal option name: "+token);
                var name = token;
                if (custom) { // (my_method_option).foo, (my_method_option), some_method_option, (foo.my_option).bar
                    this.tn.skip(')');
                    name = '('+name+')';
                    token = this.tn.peek();
                    if (Lang.FQTYPEREF.test(token)) {
                        name += token;
                        this.tn.next();
                    }
                }
                this.tn.skip('=');
                this._parseOptionValue(parent, name);
                if (!isList)
                    this.tn.skip(";");
            };

            /**
             * Sets an option on the specified options object.
             * @param {!Object.<string,*>} options
             * @param {string} name
             * @param {string|number|boolean} value
             * @inner
             */
            function setOption(options, name, value) {
                if (typeof options[name] === 'undefined')
                    options[name] = value;
                else {
                    if (!Array.isArray(options[name]))
                        options[name] = [ options[name] ];
                    options[name].push(value);
                }
            }

            /**
             * Parses an option value.
             * @param {!Object} parent
             * @param {string} name
             * @private
             */
            ParserPrototype._parseOptionValue = function(parent, name) {
                var token = this.tn.peek();
                if (token !== '{') { // Plain value
                    setOption(parent["options"], name, this._readValue(true));
                } else { // Aggregate options
                    this.tn.skip("{");
                    while ((token = this.tn.next()) !== '}') {
                        if (!Lang.NAME.test(token))
                            throw Error("illegal option name: " + name + "." + token);
                        if (this.tn.omit(":"))
                            setOption(parent["options"], name + "." + token, this._readValue(true));
                        else
                            this._parseOptionValue(parent, name + "." + token);
                    }
                }
            };

            /**
             * Parses a service definition.
             * @param {!Object} parent Parent definition
             * @private
             */
            ParserPrototype._parseService = function(parent) {
                var token = this.tn.next();
                if (!Lang.NAME.test(token))
                    throw Error("illegal service name at line "+this.tn.line+": "+token);
                var name = token;
                var svc = {
                    "name": name,
                    "rpc": {},
                    "options": {}
                };
                this.tn.skip("{");
                while ((token = this.tn.next()) !== '}') {
                    if (token === "option")
                        this._parseOption(svc);
                    else if (token === 'rpc')
                        this._parseServiceRPC(svc);
                    else
                        throw Error("illegal service token: "+token);
                }
                this.tn.omit(";");
                parent["services"].push(svc);
            };

            /**
             * Parses a RPC service definition of the form ['rpc', name, (request), 'returns', (response)].
             * @param {!Object} svc Service definition
             * @private
             */
            ParserPrototype._parseServiceRPC = function(svc) {
                var type = "rpc",
                    token = this.tn.next();
                if (!Lang.NAME.test(token))
                    throw Error("illegal rpc service method name: "+token);
                var name = token;
                var method = {
                    "request": null,
                    "response": null,
                    "request_stream": false,
                    "response_stream": false,
                    "options": {}
                };
                this.tn.skip("(");
                token = this.tn.next();
                if (token.toLowerCase() === "stream") {
                  method["request_stream"] = true;
                  token = this.tn.next();
                }
                if (!Lang.TYPEREF.test(token))
                    throw Error("illegal rpc service request type: "+token);
                method["request"] = token;
                this.tn.skip(")");
                token = this.tn.next();
                if (token.toLowerCase() !== "returns")
                    throw Error("illegal rpc service request type delimiter: "+token);
                this.tn.skip("(");
                token = this.tn.next();
                if (token.toLowerCase() === "stream") {
                  method["response_stream"] = true;
                  token = this.tn.next();
                }
                method["response"] = token;
                this.tn.skip(")");
                token = this.tn.peek();
                if (token === '{') {
                    this.tn.next();
                    while ((token = this.tn.next()) !== '}') {
                        if (token === 'option')
                            this._parseOption(method);
                        else
                            throw Error("illegal rpc service token: " + token);
                    }
                    this.tn.omit(";");
                } else
                    this.tn.skip(";");
                if (typeof svc[type] === 'undefined')
                    svc[type] = {};
                svc[type][name] = method;
            };

            /**
             * Parses a message definition.
             * @param {!Object} parent Parent definition
             * @param {!Object=} fld Field definition if this is a group
             * @returns {!Object}
             * @private
             */
            ParserPrototype._parseMessage = function(parent, fld) {
                var isGroup = !!fld,
                    token = this.tn.next();
                var msg = {
                    "name": "",
                    "fields": [],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "services": [],
                    "oneofs": {}
                    // "extensions": undefined
                };
                if (!Lang.NAME.test(token))
                    throw Error("illegal "+(isGroup ? "group" : "message")+" name: "+token);
                msg["name"] = token;
                if (isGroup) {
                    this.tn.skip("=");
                    fld["id"] = mkId(this.tn.next());
                    msg["isGroup"] = true;
                }
                token = this.tn.peek();
                if (token === '[' && fld)
                    this._parseFieldOptions(fld);
                this.tn.skip("{");
                while ((token = this.tn.next()) !== '}') {
                    if (Lang.RULE.test(token))
                        this._parseMessageField(msg, token);
                    else if (token === "oneof")
                        this._parseMessageOneOf(msg);
                    else if (token === "enum")
                        this._parseEnum(msg);
                    else if (token === "message")
                        this._parseMessage(msg);
                    else if (token === "option")
                        this._parseOption(msg);
                    else if (token === "service")
                        this._parseService(msg);
                    else if (token === "extensions")
                        msg["extensions"] = this._parseExtensionRanges();
                    else if (token === "reserved")
                        this._parseIgnored(); // TODO
                    else if (token === "extend")
                        this._parseExtend(msg);
                    else if (Lang.TYPEREF.test(token)) {
                        if (!this.proto3)
                            throw Error("illegal field rule: "+token);
                        this._parseMessageField(msg, "optional", token);
                    } else
                        throw Error("illegal message token: "+token);
                }
                this.tn.omit(";");
                parent["messages"].push(msg);
                return msg;
            };

            /**
             * Parses an ignored statement.
             * @private
             */
            ParserPrototype._parseIgnored = function() {
                while (this.tn.peek() !== ';')
                    this.tn.next();
                this.tn.skip(";");
            };

            /**
             * Parses a message field.
             * @param {!Object} msg Message definition
             * @param {string} rule Field rule
             * @param {string=} type Field type if already known (never known for maps)
             * @returns {!Object} Field descriptor
             * @private
             */
            ParserPrototype._parseMessageField = function(msg, rule, type) {
                if (!Lang.RULE.test(rule))
                    throw Error("illegal message field rule: "+rule);
                var fld = {
                    "rule": rule,
                    "type": "",
                    "name": "",
                    "options": {},
                    "id": 0
                };
                var token;
                if (rule === "map") {

                    if (type)
                        throw Error("illegal type: " + type);
                    this.tn.skip('<');
                    token = this.tn.next();
                    if (!Lang.TYPE.test(token) && !Lang.TYPEREF.test(token))
                        throw Error("illegal message field type: " + token);
                    fld["keytype"] = token;
                    this.tn.skip(',');
                    token = this.tn.next();
                    if (!Lang.TYPE.test(token) && !Lang.TYPEREF.test(token))
                        throw Error("illegal message field: " + token);
                    fld["type"] = token;
                    this.tn.skip('>');
                    token = this.tn.next();
                    if (!Lang.NAME.test(token))
                        throw Error("illegal message field name: " + token);
                    fld["name"] = token;
                    this.tn.skip("=");
                    fld["id"] = mkId(this.tn.next());
                    token = this.tn.peek();
                    if (token === '[')
                        this._parseFieldOptions(fld);
                    this.tn.skip(";");

                } else {

                    type = typeof type !== 'undefined' ? type : this.tn.next();

                    if (type === "group") {

                        // "A [legacy] group simply combines a nested message type and a field into a single declaration. In your
                        // code, you can treat this message just as if it had a Result type field called result (the latter name is
                        // converted to lower-case so that it does not conflict with the former)."
                        var grp = this._parseMessage(msg, fld);
                        if (!/^[A-Z]/.test(grp["name"]))
                            throw Error('illegal group name: '+grp["name"]);
                        fld["type"] = grp["name"];
                        fld["name"] = grp["name"].toLowerCase();
                        this.tn.omit(";");

                    } else {

                        if (!Lang.TYPE.test(type) && !Lang.TYPEREF.test(type))
                            throw Error("illegal message field type: " + type);
                        fld["type"] = type;
                        token = this.tn.next();
                        if (!Lang.NAME.test(token))
                            throw Error("illegal message field name: " + token);
                        fld["name"] = token;
                        this.tn.skip("=");
                        fld["id"] = mkId(this.tn.next());
                        token = this.tn.peek();
                        if (token === "[")
                            this._parseFieldOptions(fld);
                        this.tn.skip(";");

                    }
                }
                msg["fields"].push(fld);
                return fld;
            };

            /**
             * Parses a message oneof.
             * @param {!Object} msg Message definition
             * @private
             */
            ParserPrototype._parseMessageOneOf = function(msg) {
                var token = this.tn.next();
                if (!Lang.NAME.test(token))
                    throw Error("illegal oneof name: "+token);
                var name = token,
                    fld;
                var fields = [];
                this.tn.skip("{");
                while ((token = this.tn.next()) !== "}") {
                    fld = this._parseMessageField(msg, "optional", token);
                    fld["oneof"] = name;
                    fields.push(fld["id"]);
                }
                this.tn.omit(";");
                msg["oneofs"][name] = fields;
            };

            /**
             * Parses a set of field option definitions.
             * @param {!Object} fld Field definition
             * @private
             */
            ParserPrototype._parseFieldOptions = function(fld) {
                this.tn.skip("[");
                var token,
                    first = true;
                while ((token = this.tn.peek()) !== ']') {
                    if (!first)
                        this.tn.skip(",");
                    this._parseOption(fld, true);
                    first = false;
                }
                this.tn.next();
            };

            /**
             * Parses an enum.
             * @param {!Object} msg Message definition
             * @private
             */
            ParserPrototype._parseEnum = function(msg) {
                var enm = {
                    "name": "",
                    "values": [],
                    "options": {}
                };
                var token = this.tn.next();
                if (!Lang.NAME.test(token))
                    throw Error("illegal name: "+token);
                enm["name"] = token;
                this.tn.skip("{");
                while ((token = this.tn.next()) !== '}') {
                    if (token === "option")
                        this._parseOption(enm);
                    else {
                        if (!Lang.NAME.test(token))
                            throw Error("illegal name: "+token);
                        this.tn.skip("=");
                        var val = {
                            "name": token,
                            "id": mkId(this.tn.next(), true)
                        };
                        token = this.tn.peek();
                        if (token === "[")
                            this._parseFieldOptions({ "options": {} });
                        this.tn.skip(";");
                        enm["values"].push(val);
                    }
                }
                this.tn.omit(";");
                msg["enums"].push(enm);
            };

            /**
             * Parses extension / reserved ranges.
             * @returns {!Array.<!Array.<number>>}
             * @private
             */
            ParserPrototype._parseExtensionRanges = function() {
                var ranges = [];
                var token,
                    range,
                    value;
                do {
                    range = [];
                    while (true) {
                        token = this.tn.next();
                        switch (token) {
                            case "min":
                                value = ProtoBuf.ID_MIN;
                                break;
                            case "max":
                                value = ProtoBuf.ID_MAX;
                                break;
                            default:
                                value = mkNumber(token);
                                break;
                        }
                        range.push(value);
                        if (range.length === 2)
                            break;
                        if (this.tn.peek() !== "to") {
                            range.push(value);
                            break;
                        }
                        this.tn.next();
                    }
                    ranges.push(range);
                } while (this.tn.omit(","));
                this.tn.skip(";");
                return ranges;
            };

            /**
             * Parses an extend block.
             * @param {!Object} parent Parent object
             * @private
             */
            ParserPrototype._parseExtend = function(parent) {
                var token = this.tn.next();
                if (!Lang.TYPEREF.test(token))
                    throw Error("illegal extend reference: "+token);
                var ext = {
                    "ref": token,
                    "fields": []
                };
                this.tn.skip("{");
                while ((token = this.tn.next()) !== '}') {
                    if (Lang.RULE.test(token))
                        this._parseMessageField(ext, token);
                    else if (Lang.TYPEREF.test(token)) {
                        if (!this.proto3)
                            throw Error("illegal field rule: "+token);
                        this._parseMessageField(ext, "optional", token);
                    } else
                        throw Error("illegal extend token: "+token);
                }
                this.tn.omit(";");
                parent["messages"].push(ext);
                return ext;
            };

            // ----- General -----

            /**
             * Returns a string representation of this parser.
             * @returns {string}
             */
            ParserPrototype.toString = function() {
                return "Parser at line "+this.tn.line;
            };

            /**
             * @alias ProtoBuf.DotProto.Parser
             * @expose
             */
            DotProto.Parser = Parser;

            return DotProto;

        })(ProtoBuf, ProtoBuf.Lang);

        /**
         * @alias ProtoBuf.Reflect
         * @expose
         */
        ProtoBuf.Reflect = (function(ProtoBuf) {
            "use strict";

            /**
             * Reflection types.
             * @exports ProtoBuf.Reflect
             * @namespace
             */
            var Reflect = {};

            /**
             * Constructs a Reflect base class.
             * @exports ProtoBuf.Reflect.T
             * @constructor
             * @abstract
             * @param {!ProtoBuf.Builder} builder Builder reference
             * @param {?ProtoBuf.Reflect.T} parent Parent object
             * @param {string} name Object name
             */
            var T = function(builder, parent, name) {

                /**
                 * Builder reference.
                 * @type {!ProtoBuf.Builder}
                 * @expose
                 */
                this.builder = builder;

                /**
                 * Parent object.
                 * @type {?ProtoBuf.Reflect.T}
                 * @expose
                 */
                this.parent = parent;

                /**
                 * Object name in namespace.
                 * @type {string}
                 * @expose
                 */
                this.name = name;

                /**
                 * Fully qualified class name
                 * @type {string}
                 * @expose
                 */
                this.className;
            };

            /**
             * @alias ProtoBuf.Reflect.T.prototype
             * @inner
             */
            var TPrototype = T.prototype;

            /**
             * Returns the fully qualified name of this object.
             * @returns {string} Fully qualified name as of ".PATH.TO.THIS"
             * @expose
             */
            TPrototype.fqn = function() {
                var name = this.name,
                    ptr = this;
                do {
                    ptr = ptr.parent;
                    if (ptr == null)
                        break;
                    name = ptr.name+"."+name;
                } while (true);
                return name;
            };

            /**
             * Returns a string representation of this Reflect object (its fully qualified name).
             * @param {boolean=} includeClass Set to true to include the class name. Defaults to false.
             * @return String representation
             * @expose
             */
            TPrototype.toString = function(includeClass) {
                return (includeClass ? this.className + " " : "") + this.fqn();
            };

            /**
             * Builds this type.
             * @throws {Error} If this type cannot be built directly
             * @expose
             */
            TPrototype.build = function() {
                throw Error(this.toString(true)+" cannot be built directly");
            };

            /**
             * @alias ProtoBuf.Reflect.T
             * @expose
             */
            Reflect.T = T;

            /**
             * Constructs a new Namespace.
             * @exports ProtoBuf.Reflect.Namespace
             * @param {!ProtoBuf.Builder} builder Builder reference
             * @param {?ProtoBuf.Reflect.Namespace} parent Namespace parent
             * @param {string} name Namespace name
             * @param {Object.<string,*>=} options Namespace options
             * @param {string?} syntax The syntax level of this definition (e.g., proto3)
             * @constructor
             * @extends ProtoBuf.Reflect.T
             */
            var Namespace = function(builder, parent, name, options, syntax) {
                T.call(this, builder, parent, name);

                /**
                 * @override
                 */
                this.className = "Namespace";

                /**
                 * Children inside the namespace.
                 * @type {!Array.<ProtoBuf.Reflect.T>}
                 */
                this.children = [];

                /**
                 * Options.
                 * @type {!Object.<string, *>}
                 */
                this.options = options || {};

                /**
                 * Syntax level (e.g., proto2 or proto3).
                 * @type {!string}
                 */
                this.syntax = syntax || "proto2";
            };

            /**
             * @alias ProtoBuf.Reflect.Namespace.prototype
             * @inner
             */
            var NamespacePrototype = Namespace.prototype = Object.create(T.prototype);

            /**
             * Returns an array of the namespace's children.
             * @param {ProtoBuf.Reflect.T=} type Filter type (returns instances of this type only). Defaults to null (all children).
             * @return {Array.<ProtoBuf.Reflect.T>}
             * @expose
             */
            NamespacePrototype.getChildren = function(type) {
                type = type || null;
                if (type == null)
                    return this.children.slice();
                var children = [];
                for (var i=0, k=this.children.length; i<k; ++i)
                    if (this.children[i] instanceof type)
                        children.push(this.children[i]);
                return children;
            };

            /**
             * Adds a child to the namespace.
             * @param {ProtoBuf.Reflect.T} child Child
             * @throws {Error} If the child cannot be added (duplicate)
             * @expose
             */
            NamespacePrototype.addChild = function(child) {
                var other;
                if (other = this.getChild(child.name)) {
                    // Try to revert camelcase transformation on collision
                    if (other instanceof Message.Field && other.name !== other.originalName && this.getChild(other.originalName) === null)
                        other.name = other.originalName; // Revert previous first (effectively keeps both originals)
                    else if (child instanceof Message.Field && child.name !== child.originalName && this.getChild(child.originalName) === null)
                        child.name = child.originalName;
                    else
                        throw Error("Duplicate name in namespace "+this.toString(true)+": "+child.name);
                }
                this.children.push(child);
            };

            /**
             * Gets a child by its name or id.
             * @param {string|number} nameOrId Child name or id
             * @return {?ProtoBuf.Reflect.T} The child or null if not found
             * @expose
             */
            NamespacePrototype.getChild = function(nameOrId) {
                var key = typeof nameOrId === 'number' ? 'id' : 'name';
                for (var i=0, k=this.children.length; i<k; ++i)
                    if (this.children[i][key] === nameOrId)
                        return this.children[i];
                return null;
            };

            /**
             * Resolves a reflect object inside of this namespace.
             * @param {string|!Array.<string>} qn Qualified name to resolve
             * @param {boolean=} excludeNonNamespace Excludes non-namespace types, defaults to `false`
             * @return {?ProtoBuf.Reflect.Namespace} The resolved type or null if not found
             * @expose
             */
            NamespacePrototype.resolve = function(qn, excludeNonNamespace) {
                var part = typeof qn === 'string' ? qn.split(".") : qn,
                    ptr = this,
                    i = 0;
                if (part[i] === "") { // Fully qualified name, e.g. ".My.Message'
                    while (ptr.parent !== null)
                        ptr = ptr.parent;
                    i++;
                }
                var child;
                do {
                    do {
                        if (!(ptr instanceof Reflect.Namespace)) {
                            ptr = null;
                            break;
                        }
                        child = ptr.getChild(part[i]);
                        if (!child || !(child instanceof Reflect.T) || (excludeNonNamespace && !(child instanceof Reflect.Namespace))) {
                            ptr = null;
                            break;
                        }
                        ptr = child; i++;
                    } while (i < part.length);
                    if (ptr != null)
                        break; // Found
                    // Else search the parent
                    if (this.parent !== null)
                        return this.parent.resolve(qn, excludeNonNamespace);
                } while (ptr != null);
                return ptr;
            };

            /**
             * Determines the shortest qualified name of the specified type, if any, relative to this namespace.
             * @param {!ProtoBuf.Reflect.T} t Reflection type
             * @returns {string} The shortest qualified name or, if there is none, the fqn
             * @expose
             */
            NamespacePrototype.qn = function(t) {
                var part = [], ptr = t;
                do {
                    part.unshift(ptr.name);
                    ptr = ptr.parent;
                } while (ptr !== null);
                for (var len=1; len <= part.length; len++) {
                    var qn = part.slice(part.length-len);
                    if (t === this.resolve(qn, t instanceof Reflect.Namespace))
                        return qn.join(".");
                }
                return t.fqn();
            };

            /**
             * Builds the namespace and returns the runtime counterpart.
             * @return {Object.<string,Function|Object>} Runtime namespace
             * @expose
             */
            NamespacePrototype.build = function() {
                /** @dict */
                var ns = {};
                var children = this.children;
                for (var i=0, k=children.length, child; i<k; ++i) {
                    child = children[i];
                    if (child instanceof Namespace)
                        ns[child.name] = child.build();
                }
                if (Object.defineProperty)
                    Object.defineProperty(ns, "$options", { "value": this.buildOpt() });
                return ns;
            };

            /**
             * Builds the namespace's '$options' property.
             * @return {Object.<string,*>}
             */
            NamespacePrototype.buildOpt = function() {
                var opt = {},
                    keys = Object.keys(this.options);
                for (var i=0, k=keys.length; i<k; ++i) {
                    var key = keys[i],
                        val = this.options[keys[i]];
                    // TODO: Options are not resolved, yet.
                    // if (val instanceof Namespace) {
                    //     opt[key] = val.build();
                    // } else {
                    opt[key] = val;
                    // }
                }
                return opt;
            };

            /**
             * Gets the value assigned to the option with the specified name.
             * @param {string=} name Returns the option value if specified, otherwise all options are returned.
             * @return {*|Object.<string,*>}null} Option value or NULL if there is no such option
             */
            NamespacePrototype.getOption = function(name) {
                if (typeof name === 'undefined')
                    return this.options;
                return typeof this.options[name] !== 'undefined' ? this.options[name] : null;
            };

            /**
             * @alias ProtoBuf.Reflect.Namespace
             * @expose
             */
            Reflect.Namespace = Namespace;

            /**
             * Constructs a new Element implementation that checks and converts values for a
             * particular field type, as appropriate.
             *
             * An Element represents a single value: either the value of a singular field,
             * or a value contained in one entry of a repeated field or map field. This
             * class does not implement these higher-level concepts; it only encapsulates
             * the low-level typechecking and conversion.
             *
             * @exports ProtoBuf.Reflect.Element
             * @param {{name: string, wireType: number}} type Resolved data type
             * @param {ProtoBuf.Reflect.T|null} resolvedType Resolved type, if relevant
             * (e.g. submessage field).
             * @param {boolean} isMapKey Is this element a Map key? The value will be
             * converted to string form if so.
             * @param {string} syntax Syntax level of defining message type, e.g.,
             * proto2 or proto3.
             * @constructor
             */
            var Element = function(type, resolvedType, isMapKey, syntax) {

                /**
                 * Element type, as a string (e.g., int32).
                 * @type {{name: string, wireType: number}}
                 */
                this.type = type;

                /**
                 * Element type reference to submessage or enum definition, if needed.
                 * @type {ProtoBuf.Reflect.T|null}
                 */
                this.resolvedType = resolvedType;

                /**
                 * Element is a map key.
                 * @type {boolean}
                 */
                this.isMapKey = isMapKey;

                /**
                 * Syntax level of defining message type, e.g., proto2 or proto3.
                 * @type {string}
                 */
                this.syntax = syntax;

                if (isMapKey && ProtoBuf.MAP_KEY_TYPES.indexOf(type) < 0)
                    throw Error("Invalid map key type: " + type.name);
            };

            var ElementPrototype = Element.prototype;

            /**
             * Obtains a (new) default value for the specified type.
             * @param type {string|{name: string, wireType: number}} Field type
             * @returns {*} Default value
             * @inner
             */
            function mkDefault(type) {
                if (typeof type === 'string')
                    type = ProtoBuf.TYPES[type];
                if (typeof type.defaultValue === 'undefined')
                    throw Error("default value for type "+type.name+" is not supported");
                if (type == ProtoBuf.TYPES["bytes"])
                    return new ByteBuffer(0);
                return type.defaultValue;
            }

            /**
             * Returns the default value for this field in proto3.
             * @function
             * @param type {string|{name: string, wireType: number}} the field type
             * @returns {*} Default value
             */
            Element.defaultFieldValue = mkDefault;

            /**
             * Makes a Long from a value.
             * @param {{low: number, high: number, unsigned: boolean}|string|number} value Value
             * @param {boolean=} unsigned Whether unsigned or not, defaults to reuse it from Long-like objects or to signed for
             *  strings and numbers
             * @returns {!Long}
             * @throws {Error} If the value cannot be converted to a Long
             * @inner
             */
            function mkLong(value, unsigned) {
                if (value && typeof value.low === 'number' && typeof value.high === 'number' && typeof value.unsigned === 'boolean'
                    && value.low === value.low && value.high === value.high)
                    return new ProtoBuf.Long(value.low, value.high, typeof unsigned === 'undefined' ? value.unsigned : unsigned);
                if (typeof value === 'string')
                    return ProtoBuf.Long.fromString(value, unsigned || false, 10);
                if (typeof value === 'number')
                    return ProtoBuf.Long.fromNumber(value, unsigned || false);
                throw Error("not convertible to Long");
            }

            /**
             * Checks if the given value can be set for an element of this type (singular
             * field or one element of a repeated field or map).
             * @param {*} value Value to check
             * @return {*} Verified, maybe adjusted, value
             * @throws {Error} If the value cannot be verified for this element slot
             * @expose
             */
            ElementPrototype.verifyValue = function(value) {
                var self = this;
                function fail(val, msg) {
                    throw Error("Illegal value for "+self.toString(true)+" of type "+self.type.name+": "+val+" ("+msg+")");
                }
                switch (this.type) {
                    // Signed 32bit
                    case ProtoBuf.TYPES["int32"]:
                    case ProtoBuf.TYPES["sint32"]:
                    case ProtoBuf.TYPES["sfixed32"]:
                        // Account for !NaN: value === value
                        if (typeof value !== 'number' || (value === value && value % 1 !== 0))
                            fail(typeof value, "not an integer");
                        return value > 4294967295 ? value | 0 : value;

                    // Unsigned 32bit
                    case ProtoBuf.TYPES["uint32"]:
                    case ProtoBuf.TYPES["fixed32"]:
                        if (typeof value !== 'number' || (value === value && value % 1 !== 0))
                            fail(typeof value, "not an integer");
                        return value < 0 ? value >>> 0 : value;

                    // Signed 64bit
                    case ProtoBuf.TYPES["int64"]:
                    case ProtoBuf.TYPES["sint64"]:
                    case ProtoBuf.TYPES["sfixed64"]: {
                        if (ProtoBuf.Long)
                            try {
                                return mkLong(value, false);
                            } catch (e) {
                                fail(typeof value, e.message);
                            }
                        else
                            fail(typeof value, "requires Long.js");
                    }

                    // Unsigned 64bit
                    case ProtoBuf.TYPES["uint64"]:
                    case ProtoBuf.TYPES["fixed64"]: {
                        if (ProtoBuf.Long)
                            try {
                                return mkLong(value, true);
                            } catch (e) {
                                fail(typeof value, e.message);
                            }
                        else
                            fail(typeof value, "requires Long.js");
                    }

                    // Bool
                    case ProtoBuf.TYPES["bool"]:
                        if (typeof value !== 'boolean')
                            fail(typeof value, "not a boolean");
                        return value;

                    // Float
                    case ProtoBuf.TYPES["float"]:
                    case ProtoBuf.TYPES["double"]:
                        if (typeof value !== 'number')
                            fail(typeof value, "not a number");
                        return value;

                    // Length-delimited string
                    case ProtoBuf.TYPES["string"]:
                        if (typeof value !== 'string' && !(value && value instanceof String))
                            fail(typeof value, "not a string");
                        return ""+value; // Convert String object to string

                    // Length-delimited bytes
                    case ProtoBuf.TYPES["bytes"]:
                        if (ByteBuffer.isByteBuffer(value))
                            return value;
                        return ByteBuffer.wrap(value, "base64");

                    // Constant enum value
                    case ProtoBuf.TYPES["enum"]: {
                        var values = this.resolvedType.getChildren(ProtoBuf.Reflect.Enum.Value);
                        for (i=0; i<values.length; i++)
                            if (values[i].name == value)
                                return values[i].id;
                            else if (values[i].id == value)
                                return values[i].id;

                        if (this.syntax === 'proto3') {
                            // proto3: just make sure it's an integer.
                            if (typeof value !== 'number' || (value === value && value % 1 !== 0))
                                fail(typeof value, "not an integer");
                            if (value > 4294967295 || value < 0)
                                fail(typeof value, "not in range for uint32")
                            return value;
                        } else {
                            // proto2 requires enum values to be valid.
                            fail(value, "not a valid enum value");
                        }
                    }
                    // Embedded message
                    case ProtoBuf.TYPES["group"]:
                    case ProtoBuf.TYPES["message"]: {
                        if (!value || typeof value !== 'object')
                            fail(typeof value, "object expected");
                        if (value instanceof this.resolvedType.clazz)
                            return value;
                        if (value instanceof ProtoBuf.Builder.Message) {
                            // Mismatched type: Convert to object (see: https://github.com/dcodeIO/ProtoBuf.js/issues/180)
                            var obj = {};
                            for (var i in value)
                                if (value.hasOwnProperty(i))
                                    obj[i] = value[i];
                            value = obj;
                        }
                        // Else let's try to construct one from a key-value object
                        return new (this.resolvedType.clazz)(value); // May throw for a hundred of reasons
                    }
                }

                // We should never end here
                throw Error("[INTERNAL] Illegal value for "+this.toString(true)+": "+value+" (undefined type "+this.type+")");
            };

            /**
             * Calculates the byte length of an element on the wire.
             * @param {number} id Field number
             * @param {*} value Field value
             * @returns {number} Byte length
             * @throws {Error} If the value cannot be calculated
             * @expose
             */
            ElementPrototype.calculateLength = function(id, value) {
                if (value === null) return 0; // Nothing to encode
                // Tag has already been written
                var n;
                switch (this.type) {
                    case ProtoBuf.TYPES["int32"]:
                        return value < 0 ? ByteBuffer.calculateVarint64(value) : ByteBuffer.calculateVarint32(value);
                    case ProtoBuf.TYPES["uint32"]:
                        return ByteBuffer.calculateVarint32(value);
                    case ProtoBuf.TYPES["sint32"]:
                        return ByteBuffer.calculateVarint32(ByteBuffer.zigZagEncode32(value));
                    case ProtoBuf.TYPES["fixed32"]:
                    case ProtoBuf.TYPES["sfixed32"]:
                    case ProtoBuf.TYPES["float"]:
                        return 4;
                    case ProtoBuf.TYPES["int64"]:
                    case ProtoBuf.TYPES["uint64"]:
                        return ByteBuffer.calculateVarint64(value);
                    case ProtoBuf.TYPES["sint64"]:
                        return ByteBuffer.calculateVarint64(ByteBuffer.zigZagEncode64(value));
                    case ProtoBuf.TYPES["fixed64"]:
                    case ProtoBuf.TYPES["sfixed64"]:
                        return 8;
                    case ProtoBuf.TYPES["bool"]:
                        return 1;
                    case ProtoBuf.TYPES["enum"]:
                        return ByteBuffer.calculateVarint32(value);
                    case ProtoBuf.TYPES["double"]:
                        return 8;
                    case ProtoBuf.TYPES["string"]:
                        n = ByteBuffer.calculateUTF8Bytes(value);
                        return ByteBuffer.calculateVarint32(n) + n;
                    case ProtoBuf.TYPES["bytes"]:
                        if (value.remaining() < 0)
                            throw Error("Illegal value for "+this.toString(true)+": "+value.remaining()+" bytes remaining");
                        return ByteBuffer.calculateVarint32(value.remaining()) + value.remaining();
                    case ProtoBuf.TYPES["message"]:
                        n = this.resolvedType.calculate(value);
                        return ByteBuffer.calculateVarint32(n) + n;
                    case ProtoBuf.TYPES["group"]:
                        n = this.resolvedType.calculate(value);
                        return n + ByteBuffer.calculateVarint32((id << 3) | ProtoBuf.WIRE_TYPES.ENDGROUP);
                }
                // We should never end here
                throw Error("[INTERNAL] Illegal value to encode in "+this.toString(true)+": "+value+" (unknown type)");
            };

            /**
             * Encodes a value to the specified buffer. Does not encode the key.
             * @param {number} id Field number
             * @param {*} value Field value
             * @param {ByteBuffer} buffer ByteBuffer to encode to
             * @return {ByteBuffer} The ByteBuffer for chaining
             * @throws {Error} If the value cannot be encoded
             * @expose
             */
            ElementPrototype.encodeValue = function(id, value, buffer) {
                if (value === null) return buffer; // Nothing to encode
                // Tag has already been written

                switch (this.type) {
                    // 32bit signed varint
                    case ProtoBuf.TYPES["int32"]:
                        // "If you use int32 or int64 as the type for a negative number, the resulting varint is always ten bytes
                        // long – it is, effectively, treated like a very large unsigned integer." (see #122)
                        if (value < 0)
                            buffer.writeVarint64(value);
                        else
                            buffer.writeVarint32(value);
                        break;

                    // 32bit unsigned varint
                    case ProtoBuf.TYPES["uint32"]:
                        buffer.writeVarint32(value);
                        break;

                    // 32bit varint zig-zag
                    case ProtoBuf.TYPES["sint32"]:
                        buffer.writeVarint32ZigZag(value);
                        break;

                    // Fixed unsigned 32bit
                    case ProtoBuf.TYPES["fixed32"]:
                        buffer.writeUint32(value);
                        break;

                    // Fixed signed 32bit
                    case ProtoBuf.TYPES["sfixed32"]:
                        buffer.writeInt32(value);
                        break;

                    // 64bit varint as-is
                    case ProtoBuf.TYPES["int64"]:
                    case ProtoBuf.TYPES["uint64"]:
                        buffer.writeVarint64(value); // throws
                        break;

                    // 64bit varint zig-zag
                    case ProtoBuf.TYPES["sint64"]:
                        buffer.writeVarint64ZigZag(value); // throws
                        break;

                    // Fixed unsigned 64bit
                    case ProtoBuf.TYPES["fixed64"]:
                        buffer.writeUint64(value); // throws
                        break;

                    // Fixed signed 64bit
                    case ProtoBuf.TYPES["sfixed64"]:
                        buffer.writeInt64(value); // throws
                        break;

                    // Bool
                    case ProtoBuf.TYPES["bool"]:
                        if (typeof value === 'string')
                            buffer.writeVarint32(value.toLowerCase() === 'false' ? 0 : !!value);
                        else
                            buffer.writeVarint32(value ? 1 : 0);
                        break;

                    // Constant enum value
                    case ProtoBuf.TYPES["enum"]:
                        buffer.writeVarint32(value);
                        break;

                    // 32bit float
                    case ProtoBuf.TYPES["float"]:
                        buffer.writeFloat32(value);
                        break;

                    // 64bit float
                    case ProtoBuf.TYPES["double"]:
                        buffer.writeFloat64(value);
                        break;

                    // Length-delimited string
                    case ProtoBuf.TYPES["string"]:
                        buffer.writeVString(value);
                        break;

                    // Length-delimited bytes
                    case ProtoBuf.TYPES["bytes"]:
                        if (value.remaining() < 0)
                            throw Error("Illegal value for "+this.toString(true)+": "+value.remaining()+" bytes remaining");
                        var prevOffset = value.offset;
                        buffer.writeVarint32(value.remaining());
                        buffer.append(value);
                        value.offset = prevOffset;
                        break;

                    // Embedded message
                    case ProtoBuf.TYPES["message"]:
                        var bb = new ByteBuffer().LE();
                        this.resolvedType.encode(value, bb);
                        buffer.writeVarint32(bb.offset);
                        buffer.append(bb.flip());
                        break;

                    // Legacy group
                    case ProtoBuf.TYPES["group"]:
                        this.resolvedType.encode(value, buffer);
                        buffer.writeVarint32((id << 3) | ProtoBuf.WIRE_TYPES.ENDGROUP);
                        break;

                    default:
                        // We should never end here
                        throw Error("[INTERNAL] Illegal value to encode in "+this.toString(true)+": "+value+" (unknown type)");
                }
                return buffer;
            };

            /**
             * Decode one element value from the specified buffer.
             * @param {ByteBuffer} buffer ByteBuffer to decode from
             * @param {number} wireType The field wire type
             * @param {number} id The field number
             * @return {*} Decoded value
             * @throws {Error} If the field cannot be decoded
             * @expose
             */
            ElementPrototype.decode = function(buffer, wireType, id) {
                if (wireType != this.type.wireType)
                    throw Error("Unexpected wire type for element");

                var value, nBytes;
                switch (this.type) {
                    // 32bit signed varint
                    case ProtoBuf.TYPES["int32"]:
                        return buffer.readVarint32() | 0;

                    // 32bit unsigned varint
                    case ProtoBuf.TYPES["uint32"]:
                        return buffer.readVarint32() >>> 0;

                    // 32bit signed varint zig-zag
                    case ProtoBuf.TYPES["sint32"]:
                        return buffer.readVarint32ZigZag() | 0;

                    // Fixed 32bit unsigned
                    case ProtoBuf.TYPES["fixed32"]:
                        return buffer.readUint32() >>> 0;

                    case ProtoBuf.TYPES["sfixed32"]:
                        return buffer.readInt32() | 0;

                    // 64bit signed varint
                    case ProtoBuf.TYPES["int64"]:
                        return buffer.readVarint64();

                    // 64bit unsigned varint
                    case ProtoBuf.TYPES["uint64"]:
                        return buffer.readVarint64().toUnsigned();

                    // 64bit signed varint zig-zag
                    case ProtoBuf.TYPES["sint64"]:
                        return buffer.readVarint64ZigZag();

                    // Fixed 64bit unsigned
                    case ProtoBuf.TYPES["fixed64"]:
                        return buffer.readUint64();

                    // Fixed 64bit signed
                    case ProtoBuf.TYPES["sfixed64"]:
                        return buffer.readInt64();

                    // Bool varint
                    case ProtoBuf.TYPES["bool"]:
                        return !!buffer.readVarint32();

                    // Constant enum value (varint)
                    case ProtoBuf.TYPES["enum"]:
                        // The following Builder.Message#set will already throw
                        return buffer.readVarint32();

                    // 32bit float
                    case ProtoBuf.TYPES["float"]:
                        return buffer.readFloat();

                    // 64bit float
                    case ProtoBuf.TYPES["double"]:
                        return buffer.readDouble();

                    // Length-delimited string
                    case ProtoBuf.TYPES["string"]:
                        return buffer.readVString();

                    // Length-delimited bytes
                    case ProtoBuf.TYPES["bytes"]: {
                        nBytes = buffer.readVarint32();
                        if (buffer.remaining() < nBytes)
                            throw Error("Illegal number of bytes for "+this.toString(true)+": "+nBytes+" required but got only "+buffer.remaining());
                        value = buffer.clone(); // Offset already set
                        value.limit = value.offset+nBytes;
                        buffer.offset += nBytes;
                        return value;
                    }

                    // Length-delimited embedded message
                    case ProtoBuf.TYPES["message"]: {
                        nBytes = buffer.readVarint32();
                        return this.resolvedType.decode(buffer, nBytes);
                    }

                    // Legacy group
                    case ProtoBuf.TYPES["group"]:
                        return this.resolvedType.decode(buffer, -1, id);
                }

                // We should never end here
                throw Error("[INTERNAL] Illegal decode type");
            };

            /**
             * Converts a value from a string to the canonical element type.
             *
             * Legal only when isMapKey is true.
             *
             * @param {string} str The string value
             * @returns {*} The value
             */
            ElementPrototype.valueFromString = function(str) {
                if (!this.isMapKey) {
                    throw Error("valueFromString() called on non-map-key element");
                }

                switch (this.type) {
                    case ProtoBuf.TYPES["int32"]:
                    case ProtoBuf.TYPES["sint32"]:
                    case ProtoBuf.TYPES["sfixed32"]:
                    case ProtoBuf.TYPES["uint32"]:
                    case ProtoBuf.TYPES["fixed32"]:
                        return this.verifyValue(parseInt(str));

                    case ProtoBuf.TYPES["int64"]:
                    case ProtoBuf.TYPES["sint64"]:
                    case ProtoBuf.TYPES["sfixed64"]:
                    case ProtoBuf.TYPES["uint64"]:
                    case ProtoBuf.TYPES["fixed64"]:
                          // Long-based fields support conversions from string already.
                          return this.verifyValue(str);

                    case ProtoBuf.TYPES["bool"]:
                          return str === "true";

                    case ProtoBuf.TYPES["string"]:
                          return this.verifyValue(str);

                    case ProtoBuf.TYPES["bytes"]:
                          return ByteBuffer.fromBinary(str);
                }
            };

            /**
             * Converts a value from the canonical element type to a string.
             *
             * It should be the case that `valueFromString(valueToString(val))` returns
             * a value equivalent to `verifyValue(val)` for every legal value of `val`
             * according to this element type.
             *
             * This may be used when the element must be stored or used as a string,
             * e.g., as a map key on an Object.
             *
             * Legal only when isMapKey is true.
             *
             * @param {*} val The value
             * @returns {string} The string form of the value.
             */
            ElementPrototype.valueToString = function(value) {
                if (!this.isMapKey) {
                    throw Error("valueToString() called on non-map-key element");
                }

                if (this.type === ProtoBuf.TYPES["bytes"]) {
                    return value.toString("binary");
                } else {
                    return value.toString();
                }
            };

            /**
             * @alias ProtoBuf.Reflect.Element
             * @expose
             */
            Reflect.Element = Element;

            /**
             * Constructs a new Message.
             * @exports ProtoBuf.Reflect.Message
             * @param {!ProtoBuf.Builder} builder Builder reference
             * @param {!ProtoBuf.Reflect.Namespace} parent Parent message or namespace
             * @param {string} name Message name
             * @param {Object.<string,*>=} options Message options
             * @param {boolean=} isGroup `true` if this is a legacy group
             * @param {string?} syntax The syntax level of this definition (e.g., proto3)
             * @constructor
             * @extends ProtoBuf.Reflect.Namespace
             */
            var Message = function(builder, parent, name, options, isGroup, syntax) {
                Namespace.call(this, builder, parent, name, options, syntax);

                /**
                 * @override
                 */
                this.className = "Message";

                /**
                 * Extensions range.
                 * @type {!Array.<number>|undefined}
                 * @expose
                 */
                this.extensions = undefined;

                /**
                 * Runtime message class.
                 * @type {?function(new:ProtoBuf.Builder.Message)}
                 * @expose
                 */
                this.clazz = null;

                /**
                 * Whether this is a legacy group or not.
                 * @type {boolean}
                 * @expose
                 */
                this.isGroup = !!isGroup;

                // The following cached collections are used to efficiently iterate over or look up fields when decoding.

                /**
                 * Cached fields.
                 * @type {?Array.<!ProtoBuf.Reflect.Message.Field>}
                 * @private
                 */
                this._fields = null;

                /**
                 * Cached fields by id.
                 * @type {?Object.<number,!ProtoBuf.Reflect.Message.Field>}
                 * @private
                 */
                this._fieldsById = null;

                /**
                 * Cached fields by name.
                 * @type {?Object.<string,!ProtoBuf.Reflect.Message.Field>}
                 * @private
                 */
                this._fieldsByName = null;
            };

            /**
             * @alias ProtoBuf.Reflect.Message.prototype
             * @inner
             */
            var MessagePrototype = Message.prototype = Object.create(Namespace.prototype);

            /**
             * Builds the message and returns the runtime counterpart, which is a fully functional class.
             * @see ProtoBuf.Builder.Message
             * @param {boolean=} rebuild Whether to rebuild or not, defaults to false
             * @return {ProtoBuf.Reflect.Message} Message class
             * @throws {Error} If the message cannot be built
             * @expose
             */
            MessagePrototype.build = function(rebuild) {
                if (this.clazz && !rebuild)
                    return this.clazz;

                // Create the runtime Message class in its own scope
                var clazz = (function(ProtoBuf, T) {

                    var fields = T.getChildren(ProtoBuf.Reflect.Message.Field),
                        oneofs = T.getChildren(ProtoBuf.Reflect.Message.OneOf);

                    /**
                     * Constructs a new runtime Message.
                     * @name ProtoBuf.Builder.Message
                     * @class Barebone of all runtime messages.
                     * @param {!Object.<string,*>|string} values Preset values
                     * @param {...string} var_args
                     * @constructor
                     * @throws {Error} If the message cannot be created
                     */
                    var Message = function(values, var_args) {
                        ProtoBuf.Builder.Message.call(this);

                        // Create virtual oneof properties
                        for (var i=0, k=oneofs.length; i<k; ++i)
                            this[oneofs[i].name] = null;
                        // Create fields and set default values
                        for (i=0, k=fields.length; i<k; ++i) {
                            var field = fields[i];
                            this[field.name] =
                                field.repeated ? [] :
                                (field.map ? new ProtoBuf.Map(field) : null);
                            if ((field.required || T.syntax === 'proto3') &&
                                field.defaultValue !== null)
                                this[field.name] = field.defaultValue;
                        }

                        if (arguments.length > 0) {
                            var value;
                            // Set field values from a values object
                            if (arguments.length === 1 && values !== null && typeof values === 'object' &&
                                /* not _another_ Message */ (typeof values.encode !== 'function' || values instanceof Message) &&
                                /* not a repeated field */ !Array.isArray(values) &&
                                /* not a Map */ !(values instanceof ProtoBuf.Map) &&
                                /* not a ByteBuffer */ !ByteBuffer.isByteBuffer(values) &&
                                /* not an ArrayBuffer */ !(values instanceof ArrayBuffer) &&
                                /* not a Long */ !(ProtoBuf.Long && values instanceof ProtoBuf.Long)) {
                                this.$set(values);
                            } else // Set field values from arguments, in declaration order
                                for (i=0, k=arguments.length; i<k; ++i)
                                    if (typeof (value = arguments[i]) !== 'undefined')
                                        this.$set(fields[i].name, value); // May throw
                        }
                    };

                    /**
                     * @alias ProtoBuf.Builder.Message.prototype
                     * @inner
                     */
                    var MessagePrototype = Message.prototype = Object.create(ProtoBuf.Builder.Message.prototype);

                    /**
                     * Adds a value to a repeated field.
                     * @name ProtoBuf.Builder.Message#add
                     * @function
                     * @param {string} key Field name
                     * @param {*} value Value to add
                     * @param {boolean=} noAssert Whether to assert the value or not (asserts by default)
                     * @returns {!ProtoBuf.Builder.Message} this
                     * @throws {Error} If the value cannot be added
                     * @expose
                     */
                    MessagePrototype.add = function(key, value, noAssert) {
                        var field = T._fieldsByName[key];
                        if (!noAssert) {
                            if (!field)
                                throw Error(this+"#"+key+" is undefined");
                            if (!(field instanceof ProtoBuf.Reflect.Message.Field))
                                throw Error(this+"#"+key+" is not a field: "+field.toString(true)); // May throw if it's an enum or embedded message
                            if (!field.repeated)
                                throw Error(this+"#"+key+" is not a repeated field");
                            value = field.verifyValue(value, true);
                        }
                        if (this[key] === null)
                            this[key] = [];
                        this[key].push(value);
                        return this;
                    };

                    /**
                     * Adds a value to a repeated field. This is an alias for {@link ProtoBuf.Builder.Message#add}.
                     * @name ProtoBuf.Builder.Message#$add
                     * @function
                     * @param {string} key Field name
                     * @param {*} value Value to add
                     * @param {boolean=} noAssert Whether to assert the value or not (asserts by default)
                     * @returns {!ProtoBuf.Builder.Message} this
                     * @throws {Error} If the value cannot be added
                     * @expose
                     */
                    MessagePrototype.$add = MessagePrototype.add;

                    /**
                     * Sets a field's value.
                     * @name ProtoBuf.Builder.Message#set
                     * @function
                     * @param {string|!Object.<string,*>} keyOrObj String key or plain object holding multiple values
                     * @param {(*|boolean)=} value Value to set if key is a string, otherwise omitted
                     * @param {boolean=} noAssert Whether to not assert for an actual field / proper value type, defaults to `false`
                     * @returns {!ProtoBuf.Builder.Message} this
                     * @throws {Error} If the value cannot be set
                     * @expose
                     */
                    MessagePrototype.set = function(keyOrObj, value, noAssert) {
                        if (keyOrObj && typeof keyOrObj === 'object') {
                            noAssert = value;
                            for (var ikey in keyOrObj)
                                if (keyOrObj.hasOwnProperty(ikey) && typeof (value = keyOrObj[ikey]) !== 'undefined')
                                    this.$set(ikey, value, noAssert);
                            return this;
                        }
                        var field = T._fieldsByName[keyOrObj];
                        if (!noAssert) {
                            if (!field)
                                throw Error(this+"#"+keyOrObj+" is not a field: undefined");
                            if (!(field instanceof ProtoBuf.Reflect.Message.Field))
                                throw Error(this+"#"+keyOrObj+" is not a field: "+field.toString(true));
                            this[field.name] = (value = field.verifyValue(value)); // May throw
                        } else
                            this[keyOrObj] = value;
                        if (field && field.oneof) { // Field is part of an OneOf (not a virtual OneOf field)
                            var currentField = this[field.oneof.name]; // Virtual field references currently set field
                            if (value !== null) {
                                if (currentField !== null && currentField !== field.name)
                                    this[currentField] = null; // Clear currently set field
                                this[field.oneof.name] = field.name; // Point virtual field at this field
                            } else if (/* value === null && */currentField === keyOrObj)
                                this[field.oneof.name] = null; // Clear virtual field (current field explicitly cleared)
                        }
                        return this;
                    };

                    /**
                     * Sets a field's value. This is an alias for [@link ProtoBuf.Builder.Message#set}.
                     * @name ProtoBuf.Builder.Message#$set
                     * @function
                     * @param {string|!Object.<string,*>} keyOrObj String key or plain object holding multiple values
                     * @param {(*|boolean)=} value Value to set if key is a string, otherwise omitted
                     * @param {boolean=} noAssert Whether to not assert the value, defaults to `false`
                     * @throws {Error} If the value cannot be set
                     * @expose
                     */
                    MessagePrototype.$set = MessagePrototype.set;

                    /**
                     * Gets a field's value.
                     * @name ProtoBuf.Builder.Message#get
                     * @function
                     * @param {string} key Key
                     * @param {boolean=} noAssert Whether to not assert for an actual field, defaults to `false`
                     * @return {*} Value
                     * @throws {Error} If there is no such field
                     * @expose
                     */
                    MessagePrototype.get = function(key, noAssert) {
                        if (noAssert)
                            return this[key];
                        var field = T._fieldsByName[key];
                        if (!field || !(field instanceof ProtoBuf.Reflect.Message.Field))
                            throw Error(this+"#"+key+" is not a field: undefined");
                        if (!(field instanceof ProtoBuf.Reflect.Message.Field))
                            throw Error(this+"#"+key+" is not a field: "+field.toString(true));
                        return this[field.name];
                    };

                    /**
                     * Gets a field's value. This is an alias for {@link ProtoBuf.Builder.Message#$get}.
                     * @name ProtoBuf.Builder.Message#$get
                     * @function
                     * @param {string} key Key
                     * @return {*} Value
                     * @throws {Error} If there is no such field
                     * @expose
                     */
                    MessagePrototype.$get = MessagePrototype.get;

                    // Getters and setters

                    for (var i=0; i<fields.length; i++) {
                        var field = fields[i];
                        // no setters for extension fields as these are named by their fqn
                        if (field instanceof ProtoBuf.Reflect.Message.ExtensionField)
                            continue;

                        if (T.builder.options['populateAccessors'])
                            (function(field) {
                                // set/get[SomeValue]
                                var Name = field.originalName.replace(/(_[a-zA-Z])/g, function(match) {
                                    return match.toUpperCase().replace('_','');
                                });
                                Name = Name.substring(0,1).toUpperCase() + Name.substring(1);

                                // set/get_[some_value] FIXME: Do we really need these?
                                var name = field.originalName.replace(/([A-Z])/g, function(match) {
                                    return "_"+match;
                                });

                                /**
                                 * The current field's unbound setter function.
                                 * @function
                                 * @param {*} value
                                 * @param {boolean=} noAssert
                                 * @returns {!ProtoBuf.Builder.Message}
                                 * @inner
                                 */
                                var setter = function(value, noAssert) {
                                    this[field.name] = noAssert ? value : field.verifyValue(value);
                                    return this;
                                };

                                /**
                                 * The current field's unbound getter function.
                                 * @function
                                 * @returns {*}
                                 * @inner
                                 */
                                var getter = function() {
                                    return this[field.name];
                                };

                                if (T.getChild("set"+Name) === null)
                                    /**
                                     * Sets a value. This method is present for each field, but only if there is no name conflict with
                                     *  another field.
                                     * @name ProtoBuf.Builder.Message#set[SomeField]
                                     * @function
                                     * @param {*} value Value to set
                                     * @param {boolean=} noAssert Whether to not assert the value, defaults to `false`
                                     * @returns {!ProtoBuf.Builder.Message} this
                                     * @abstract
                                     * @throws {Error} If the value cannot be set
                                     */
                                    MessagePrototype["set"+Name] = setter;

                                if (T.getChild("set_"+name) === null)
                                    /**
                                     * Sets a value. This method is present for each field, but only if there is no name conflict with
                                     *  another field.
                                     * @name ProtoBuf.Builder.Message#set_[some_field]
                                     * @function
                                     * @param {*} value Value to set
                                     * @param {boolean=} noAssert Whether to not assert the value, defaults to `false`
                                     * @returns {!ProtoBuf.Builder.Message} this
                                     * @abstract
                                     * @throws {Error} If the value cannot be set
                                     */
                                    MessagePrototype["set_"+name] = setter;

                                if (T.getChild("get"+Name) === null)
                                    /**
                                     * Gets a value. This method is present for each field, but only if there is no name conflict with
                                     *  another field.
                                     * @name ProtoBuf.Builder.Message#get[SomeField]
                                     * @function
                                     * @abstract
                                     * @return {*} The value
                                     */
                                    MessagePrototype["get"+Name] = getter;

                                if (T.getChild("get_"+name) === null)
                                    /**
                                     * Gets a value. This method is present for each field, but only if there is no name conflict with
                                     *  another field.
                                     * @name ProtoBuf.Builder.Message#get_[some_field]
                                     * @function
                                     * @return {*} The value
                                     * @abstract
                                     */
                                    MessagePrototype["get_"+name] = getter;

                            })(field);
                    }

                    // En-/decoding

                    /**
                     * Encodes the message.
                     * @name ProtoBuf.Builder.Message#$encode
                     * @function
                     * @param {(!ByteBuffer|boolean)=} buffer ByteBuffer to encode to. Will create a new one and flip it if omitted.
                     * @param {boolean=} noVerify Whether to not verify field values, defaults to `false`
                     * @return {!ByteBuffer} Encoded message as a ByteBuffer
                     * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                     *  returns the encoded ByteBuffer in the `encoded` property on the error.
                     * @expose
                     * @see ProtoBuf.Builder.Message#encode64
                     * @see ProtoBuf.Builder.Message#encodeHex
                     * @see ProtoBuf.Builder.Message#encodeAB
                     */
                    MessagePrototype.encode = function(buffer, noVerify) {
                        if (typeof buffer === 'boolean')
                            noVerify = buffer,
                            buffer = undefined;
                        var isNew = false;
                        if (!buffer)
                            buffer = new ByteBuffer(),
                            isNew = true;
                        var le = buffer.littleEndian;
                        try {
                            T.encode(this, buffer.LE(), noVerify);
                            return (isNew ? buffer.flip() : buffer).LE(le);
                        } catch (e) {
                            buffer.LE(le);
                            throw(e);
                        }
                    };

                    /**
                     * Encodes a message using the specified data payload.
                     * @param {!Object.<string,*>} data Data payload
                     * @param {(!ByteBuffer|boolean)=} buffer ByteBuffer to encode to. Will create a new one and flip it if omitted.
                     * @param {boolean=} noVerify Whether to not verify field values, defaults to `false`
                     * @return {!ByteBuffer} Encoded message as a ByteBuffer
                     * @expose
                     */
                    Message.encode = function(data, buffer, noVerify) {
                        return new Message(data).encode(buffer, noVerify);
                    };

                    /**
                     * Calculates the byte length of the message.
                     * @name ProtoBuf.Builder.Message#calculate
                     * @function
                     * @returns {number} Byte length
                     * @throws {Error} If the message cannot be calculated or if required fields are missing.
                     * @expose
                     */
                    MessagePrototype.calculate = function() {
                        return T.calculate(this);
                    };

                    /**
                     * Encodes the varint32 length-delimited message.
                     * @name ProtoBuf.Builder.Message#encodeDelimited
                     * @function
                     * @param {(!ByteBuffer|boolean)=} buffer ByteBuffer to encode to. Will create a new one and flip it if omitted.
                     * @param {boolean=} noVerify Whether to not verify field values, defaults to `false`
                     * @return {!ByteBuffer} Encoded message as a ByteBuffer
                     * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                     *  returns the encoded ByteBuffer in the `encoded` property on the error.
                     * @expose
                     */
                    MessagePrototype.encodeDelimited = function(buffer, noVerify) {
                        var isNew = false;
                        if (!buffer)
                            buffer = new ByteBuffer(),
                            isNew = true;
                        var enc = new ByteBuffer().LE();
                        T.encode(this, enc, noVerify).flip();
                        buffer.writeVarint32(enc.remaining());
                        buffer.append(enc);
                        return isNew ? buffer.flip() : buffer;
                    };

                    /**
                     * Directly encodes the message to an ArrayBuffer.
                     * @name ProtoBuf.Builder.Message#encodeAB
                     * @function
                     * @return {ArrayBuffer} Encoded message as ArrayBuffer
                     * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                     *  returns the encoded ArrayBuffer in the `encoded` property on the error.
                     * @expose
                     */
                    MessagePrototype.encodeAB = function() {
                        try {
                            return this.encode().toArrayBuffer();
                        } catch (e) {
                            if (e["encoded"]) e["encoded"] = e["encoded"].toArrayBuffer();
                            throw(e);
                        }
                    };

                    /**
                     * Returns the message as an ArrayBuffer. This is an alias for {@link ProtoBuf.Builder.Message#encodeAB}.
                     * @name ProtoBuf.Builder.Message#toArrayBuffer
                     * @function
                     * @return {ArrayBuffer} Encoded message as ArrayBuffer
                     * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                     *  returns the encoded ArrayBuffer in the `encoded` property on the error.
                     * @expose
                     */
                    MessagePrototype.toArrayBuffer = MessagePrototype.encodeAB;

                    /**
                     * Directly encodes the message to a node Buffer.
                     * @name ProtoBuf.Builder.Message#encodeNB
                     * @function
                     * @return {!Buffer}
                     * @throws {Error} If the message cannot be encoded, not running under node.js or if required fields are
                     *  missing. The later still returns the encoded node Buffer in the `encoded` property on the error.
                     * @expose
                     */
                    MessagePrototype.encodeNB = function() {
                        try {
                            return this.encode().toBuffer();
                        } catch (e) {
                            if (e["encoded"]) e["encoded"] = e["encoded"].toBuffer();
                            throw(e);
                        }
                    };

                    /**
                     * Returns the message as a node Buffer. This is an alias for {@link ProtoBuf.Builder.Message#encodeNB}.
                     * @name ProtoBuf.Builder.Message#toBuffer
                     * @function
                     * @return {!Buffer}
                     * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                     *  returns the encoded node Buffer in the `encoded` property on the error.
                     * @expose
                     */
                    MessagePrototype.toBuffer = MessagePrototype.encodeNB;

                    /**
                     * Directly encodes the message to a base64 encoded string.
                     * @name ProtoBuf.Builder.Message#encode64
                     * @function
                     * @return {string} Base64 encoded string
                     * @throws {Error} If the underlying buffer cannot be encoded or if required fields are missing. The later
                     *  still returns the encoded base64 string in the `encoded` property on the error.
                     * @expose
                     */
                    MessagePrototype.encode64 = function() {
                        try {
                            return this.encode().toBase64();
                        } catch (e) {
                            if (e["encoded"]) e["encoded"] = e["encoded"].toBase64();
                            throw(e);
                        }
                    };

                    /**
                     * Returns the message as a base64 encoded string. This is an alias for {@link ProtoBuf.Builder.Message#encode64}.
                     * @name ProtoBuf.Builder.Message#toBase64
                     * @function
                     * @return {string} Base64 encoded string
                     * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                     *  returns the encoded base64 string in the `encoded` property on the error.
                     * @expose
                     */
                    MessagePrototype.toBase64 = MessagePrototype.encode64;

                    /**
                     * Directly encodes the message to a hex encoded string.
                     * @name ProtoBuf.Builder.Message#encodeHex
                     * @function
                     * @return {string} Hex encoded string
                     * @throws {Error} If the underlying buffer cannot be encoded or if required fields are missing. The later
                     *  still returns the encoded hex string in the `encoded` property on the error.
                     * @expose
                     */
                    MessagePrototype.encodeHex = function() {
                        try {
                            return this.encode().toHex();
                        } catch (e) {
                            if (e["encoded"]) e["encoded"] = e["encoded"].toHex();
                            throw(e);
                        }
                    };

                    /**
                     * Returns the message as a hex encoded string. This is an alias for {@link ProtoBuf.Builder.Message#encodeHex}.
                     * @name ProtoBuf.Builder.Message#toHex
                     * @function
                     * @return {string} Hex encoded string
                     * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                     *  returns the encoded hex string in the `encoded` property on the error.
                     * @expose
                     */
                    MessagePrototype.toHex = MessagePrototype.encodeHex;

                    /**
                     * Clones a message object or field value to a raw object.
                     * @param {*} obj Object to clone
                     * @param {boolean} binaryAsBase64 Whether to include binary data as base64 strings or as a buffer otherwise
                     * @param {boolean} longsAsStrings Whether to encode longs as strings
                     * @param {!ProtoBuf.Reflect.T=} resolvedType The resolved field type if a field
                     * @returns {*} Cloned object
                     * @inner
                     */
                    function cloneRaw(obj, binaryAsBase64, longsAsStrings, resolvedType) {
                        if (obj === null || typeof obj !== 'object') {
                            // Convert enum values to their respective names
                            if (resolvedType && resolvedType instanceof ProtoBuf.Reflect.Enum) {
                                var name = ProtoBuf.Reflect.Enum.getName(resolvedType.object, obj);
                                if (name !== null)
                                    return name;
                            }
                            // Pass-through string, number, boolean, null...
                            return obj;
                        }
                        // Convert ByteBuffers to raw buffer or strings
                        if (ByteBuffer.isByteBuffer(obj))
                            return binaryAsBase64 ? obj.toBase64() : obj.toBuffer();
                        // Convert Longs to proper objects or strings
                        if (ProtoBuf.Long.isLong(obj))
                            return longsAsStrings ? obj.toString() : ProtoBuf.Long.fromValue(obj);
                        var clone;
                        // Clone arrays
                        if (Array.isArray(obj)) {
                            clone = [];
                            obj.forEach(function(v, k) {
                                clone[k] = cloneRaw(v, binaryAsBase64, longsAsStrings, resolvedType);
                            });
                            return clone;
                        }
                        clone = {};
                        // Convert maps to objects
                        if (obj instanceof ProtoBuf.Map) {
                            var it = obj.entries();
                            for (var e = it.next(); !e.done; e = it.next())
                                clone[obj.keyElem.valueToString(e.value[0])] = cloneRaw(e.value[1], binaryAsBase64, longsAsStrings, obj.valueElem.resolvedType);
                            return clone;
                        }
                        // Everything else is a non-null object
                        var type = obj.$type,
                            field = undefined;
                        for (var i in obj)
                            if (obj.hasOwnProperty(i)) {
                                if (type && (field = type.getChild(i)))
                                    clone[i] = cloneRaw(obj[i], binaryAsBase64, longsAsStrings, field.resolvedType);
                                else
                                    clone[i] = cloneRaw(obj[i], binaryAsBase64, longsAsStrings);
                            }
                        return clone;
                    }

                    /**
                     * Returns the message's raw payload.
                     * @param {boolean=} binaryAsBase64 Whether to include binary data as base64 strings instead of Buffers, defaults to `false`
                     * @param {boolean} longsAsStrings Whether to encode longs as strings
                     * @returns {Object.<string,*>} Raw payload
                     * @expose
                     */
                    MessagePrototype.toRaw = function(binaryAsBase64, longsAsStrings) {
                        return cloneRaw(this, !!binaryAsBase64, !!longsAsStrings, this.$type);
                    };

                    /**
                     * Encodes a message to JSON.
                     * @returns {string} JSON string
                     * @expose
                     */
                    MessagePrototype.encodeJSON = function() {
                        return JSON.stringify(
                            cloneRaw(this,
                                 /* binary-as-base64 */ true,
                                 /* longs-as-strings */ true,
                                 this.$type
                            )
                        );
                    };

                    /**
                     * Decodes a message from the specified buffer or string.
                     * @name ProtoBuf.Builder.Message.decode
                     * @function
                     * @param {!ByteBuffer|!ArrayBuffer|!Buffer|string} buffer Buffer to decode from
                     * @param {(number|string)=} length Message length. Defaults to decode all the remainig data.
                     * @param {string=} enc Encoding if buffer is a string: hex, utf8 (not recommended), defaults to base64
                     * @return {!ProtoBuf.Builder.Message} Decoded message
                     * @throws {Error} If the message cannot be decoded or if required fields are missing. The later still
                     *  returns the decoded message with missing fields in the `decoded` property on the error.
                     * @expose
                     * @see ProtoBuf.Builder.Message.decode64
                     * @see ProtoBuf.Builder.Message.decodeHex
                     */
                    Message.decode = function(buffer, length, enc) {
                        if (typeof length === 'string')
                            enc = length,
                            length = -1;
                        if (typeof buffer === 'string')
                            buffer = ByteBuffer.wrap(buffer, enc ? enc : "base64");
                        buffer = ByteBuffer.isByteBuffer(buffer) ? buffer : ByteBuffer.wrap(buffer); // May throw
                        var le = buffer.littleEndian;
                        try {
                            var msg = T.decode(buffer.LE());
                            buffer.LE(le);
                            return msg;
                        } catch (e) {
                            buffer.LE(le);
                            throw(e);
                        }
                    };

                    /**
                     * Decodes a varint32 length-delimited message from the specified buffer or string.
                     * @name ProtoBuf.Builder.Message.decodeDelimited
                     * @function
                     * @param {!ByteBuffer|!ArrayBuffer|!Buffer|string} buffer Buffer to decode from
                     * @param {string=} enc Encoding if buffer is a string: hex, utf8 (not recommended), defaults to base64
                     * @return {ProtoBuf.Builder.Message} Decoded message or `null` if not enough bytes are available yet
                     * @throws {Error} If the message cannot be decoded or if required fields are missing. The later still
                     *  returns the decoded message with missing fields in the `decoded` property on the error.
                     * @expose
                     */
                    Message.decodeDelimited = function(buffer, enc) {
                        if (typeof buffer === 'string')
                            buffer = ByteBuffer.wrap(buffer, enc ? enc : "base64");
                        buffer = ByteBuffer.isByteBuffer(buffer) ? buffer : ByteBuffer.wrap(buffer); // May throw
                        if (buffer.remaining() < 1)
                            return null;
                        var off = buffer.offset,
                            len = buffer.readVarint32();
                        if (buffer.remaining() < len) {
                            buffer.offset = off;
                            return null;
                        }
                        try {
                            var msg = T.decode(buffer.slice(buffer.offset, buffer.offset + len).LE());
                            buffer.offset += len;
                            return msg;
                        } catch (err) {
                            buffer.offset += len;
                            throw err;
                        }
                    };

                    /**
                     * Decodes the message from the specified base64 encoded string.
                     * @name ProtoBuf.Builder.Message.decode64
                     * @function
                     * @param {string} str String to decode from
                     * @return {!ProtoBuf.Builder.Message} Decoded message
                     * @throws {Error} If the message cannot be decoded or if required fields are missing. The later still
                     *  returns the decoded message with missing fields in the `decoded` property on the error.
                     * @expose
                     */
                    Message.decode64 = function(str) {
                        return Message.decode(str, "base64");
                    };

                    /**
                     * Decodes the message from the specified hex encoded string.
                     * @name ProtoBuf.Builder.Message.decodeHex
                     * @function
                     * @param {string} str String to decode from
                     * @return {!ProtoBuf.Builder.Message} Decoded message
                     * @throws {Error} If the message cannot be decoded or if required fields are missing. The later still
                     *  returns the decoded message with missing fields in the `decoded` property on the error.
                     * @expose
                     */
                    Message.decodeHex = function(str) {
                        return Message.decode(str, "hex");
                    };

                    /**
                     * Decodes the message from a JSON string.
                     * @name ProtoBuf.Builder.Message.decodeJSON
                     * @function
                     * @param {string} str String to decode from
                     * @return {!ProtoBuf.Builder.Message} Decoded message
                     * @throws {Error} If the message cannot be decoded or if required fields are
                     * missing.
                     * @expose
                     */
                    Message.decodeJSON = function(str) {
                        return new Message(JSON.parse(str));
                    };

                    // Utility

                    /**
                     * Returns a string representation of this Message.
                     * @name ProtoBuf.Builder.Message#toString
                     * @function
                     * @return {string} String representation as of ".Fully.Qualified.MessageName"
                     * @expose
                     */
                    MessagePrototype.toString = function() {
                        return T.toString();
                    };

                    // Properties

                    /**
                     * Message options.
                     * @name ProtoBuf.Builder.Message.$options
                     * @type {Object.<string,*>}
                     * @expose
                     */
                    var $optionsS; // cc needs this

                    /**
                     * Message options.
                     * @name ProtoBuf.Builder.Message#$options
                     * @type {Object.<string,*>}
                     * @expose
                     */
                    var $options;

                    /**
                     * Reflection type.
                     * @name ProtoBuf.Builder.Message.$type
                     * @type {!ProtoBuf.Reflect.Message}
                     * @expose
                     */
                    var $typeS;

                    /**
                     * Reflection type.
                     * @name ProtoBuf.Builder.Message#$type
                     * @type {!ProtoBuf.Reflect.Message}
                     * @expose
                     */
                    var $type;

                    if (Object.defineProperty)
                        Object.defineProperty(Message, '$options', { "value": T.buildOpt() }),
                        Object.defineProperty(MessagePrototype, "$options", { "value": Message["$options"] }),
                        Object.defineProperty(Message, "$type", { "value": T }),
                        Object.defineProperty(MessagePrototype, "$type", { "value": T });

                    return Message;

                })(ProtoBuf, this);

                // Static enums and prototyped sub-messages / cached collections
                this._fields = [];
                this._fieldsById = {};
                this._fieldsByName = {};
                for (var i=0, k=this.children.length, child; i<k; i++) {
                    child = this.children[i];
                    if (child instanceof Enum || child instanceof Message || child instanceof Service) {
                        if (clazz.hasOwnProperty(child.name))
                            throw Error("Illegal reflect child of "+this.toString(true)+": "+child.toString(true)+" cannot override static property '"+child.name+"'");
                        clazz[child.name] = child.build();
                    } else if (child instanceof Message.Field)
                        child.build(),
                        this._fields.push(child),
                        this._fieldsById[child.id] = child,
                        this._fieldsByName[child.name] = child;
                    else if (!(child instanceof Message.OneOf) && !(child instanceof Extension)) // Not built
                        throw Error("Illegal reflect child of "+this.toString(true)+": "+this.children[i].toString(true));
                }

                return this.clazz = clazz;
            };

            /**
             * Encodes a runtime message's contents to the specified buffer.
             * @param {!ProtoBuf.Builder.Message} message Runtime message to encode
             * @param {ByteBuffer} buffer ByteBuffer to write to
             * @param {boolean=} noVerify Whether to not verify field values, defaults to `false`
             * @return {ByteBuffer} The ByteBuffer for chaining
             * @throws {Error} If required fields are missing or the message cannot be encoded for another reason
             * @expose
             */
            MessagePrototype.encode = function(message, buffer, noVerify) {
                var fieldMissing = null,
                    field;
                for (var i=0, k=this._fields.length, val; i<k; ++i) {
                    field = this._fields[i];
                    val = message[field.name];
                    if (field.required && val === null) {
                        if (fieldMissing === null)
                            fieldMissing = field;
                    } else
                        field.encode(noVerify ? val : field.verifyValue(val), buffer, message);
                }
                if (fieldMissing !== null) {
                    var err = Error("Missing at least one required field for "+this.toString(true)+": "+fieldMissing);
                    err["encoded"] = buffer; // Still expose what we got
                    throw(err);
                }
                return buffer;
            };

            /**
             * Calculates a runtime message's byte length.
             * @param {!ProtoBuf.Builder.Message} message Runtime message to encode
             * @returns {number} Byte length
             * @throws {Error} If required fields are missing or the message cannot be calculated for another reason
             * @expose
             */
            MessagePrototype.calculate = function(message) {
                for (var n=0, i=0, k=this._fields.length, field, val; i<k; ++i) {
                    field = this._fields[i];
                    val = message[field.name];
                    if (field.required && val === null)
                       throw Error("Missing at least one required field for "+this.toString(true)+": "+field);
                    else
                        n += field.calculate(val, message);
                }
                return n;
            };

            /**
             * Skips all data until the end of the specified group has been reached.
             * @param {number} expectedId Expected GROUPEND id
             * @param {!ByteBuffer} buf ByteBuffer
             * @returns {boolean} `true` if a value as been skipped, `false` if the end has been reached
             * @throws {Error} If it wasn't possible to find the end of the group (buffer overrun or end tag mismatch)
             * @inner
             */
            function skipTillGroupEnd(expectedId, buf) {
                var tag = buf.readVarint32(), // Throws on OOB
                    wireType = tag & 0x07,
                    id = tag >>> 3;
                switch (wireType) {
                    case ProtoBuf.WIRE_TYPES.VARINT:
                        do tag = buf.readUint8();
                        while ((tag & 0x80) === 0x80);
                        break;
                    case ProtoBuf.WIRE_TYPES.BITS64:
                        buf.offset += 8;
                        break;
                    case ProtoBuf.WIRE_TYPES.LDELIM:
                        tag = buf.readVarint32(); // reads the varint
                        buf.offset += tag;        // skips n bytes
                        break;
                    case ProtoBuf.WIRE_TYPES.STARTGROUP:
                        skipTillGroupEnd(id, buf);
                        break;
                    case ProtoBuf.WIRE_TYPES.ENDGROUP:
                        if (id === expectedId)
                            return false;
                        else
                            throw Error("Illegal GROUPEND after unknown group: "+id+" ("+expectedId+" expected)");
                    case ProtoBuf.WIRE_TYPES.BITS32:
                        buf.offset += 4;
                        break;
                    default:
                        throw Error("Illegal wire type in unknown group "+expectedId+": "+wireType);
                }
                return true;
            }

            /**
             * Decodes an encoded message and returns the decoded message.
             * @param {ByteBuffer} buffer ByteBuffer to decode from
             * @param {number=} length Message length. Defaults to decode all remaining data.
             * @param {number=} expectedGroupEndId Expected GROUPEND id if this is a legacy group
             * @return {ProtoBuf.Builder.Message} Decoded message
             * @throws {Error} If the message cannot be decoded
             * @expose
             */
            MessagePrototype.decode = function(buffer, length, expectedGroupEndId) {
                length = typeof length === 'number' ? length : -1;
                var start = buffer.offset,
                    msg = new (this.clazz)(),
                    tag, wireType, id, field;
                while (buffer.offset < start+length || (length === -1 && buffer.remaining() > 0)) {
                    tag = buffer.readVarint32();
                    wireType = tag & 0x07;
                    id = tag >>> 3;
                    if (wireType === ProtoBuf.WIRE_TYPES.ENDGROUP) {
                        if (id !== expectedGroupEndId)
                            throw Error("Illegal group end indicator for "+this.toString(true)+": "+id+" ("+(expectedGroupEndId ? expectedGroupEndId+" expected" : "not a group")+")");
                        break;
                    }
                    if (!(field = this._fieldsById[id])) {
                        // "messages created by your new code can be parsed by your old code: old binaries simply ignore the new field when parsing."
                        switch (wireType) {
                            case ProtoBuf.WIRE_TYPES.VARINT:
                                buffer.readVarint32();
                                break;
                            case ProtoBuf.WIRE_TYPES.BITS32:
                                buffer.offset += 4;
                                break;
                            case ProtoBuf.WIRE_TYPES.BITS64:
                                buffer.offset += 8;
                                break;
                            case ProtoBuf.WIRE_TYPES.LDELIM:
                                var len = buffer.readVarint32();
                                buffer.offset += len;
                                break;
                            case ProtoBuf.WIRE_TYPES.STARTGROUP:
                                while (skipTillGroupEnd(id, buffer)) {}
                                break;
                            default:
                                throw Error("Illegal wire type for unknown field "+id+" in "+this.toString(true)+"#decode: "+wireType);
                        }
                        continue;
                    }
                    if (field.repeated && !field.options["packed"]) {
                        msg[field.name].push(field.decode(wireType, buffer));
                    } else if (field.map) {
                        var keyval = field.decode(wireType, buffer);
                        msg[field.name].set(keyval[0], keyval[1]);
                    } else {
                        msg[field.name] = field.decode(wireType, buffer);
                        if (field.oneof) { // Field is part of an OneOf (not a virtual OneOf field)
                            var currentField = msg[field.oneof.name]; // Virtual field references currently set field
                            if (currentField !== null && currentField !== field.name)
                                msg[currentField] = null; // Clear currently set field
                            msg[field.oneof.name] = field.name; // Point virtual field at this field
                        }
                    }
                }

                // Check if all required fields are present and set default values for optional fields that are not
                for (var i=0, k=this._fields.length; i<k; ++i) {
                    field = this._fields[i];
                    if (msg[field.name] === null) {
                        if (this.syntax === "proto3") { // Proto3 sets default values by specification
                            msg[field.name] = field.defaultValue;
                        } else if (field.required) {
                            var err = Error("Missing at least one required field for " + this.toString(true) + ": " + field.name);
                            err["decoded"] = msg; // Still expose what we got
                            throw(err);
                        } else if (ProtoBuf.populateDefaults && field.defaultValue !== null)
                            msg[field.name] = field.defaultValue;
                    }
                }
                return msg;
            };

            /**
             * @alias ProtoBuf.Reflect.Message
             * @expose
             */
            Reflect.Message = Message;

            /**
             * Constructs a new Message Field.
             * @exports ProtoBuf.Reflect.Message.Field
             * @param {!ProtoBuf.Builder} builder Builder reference
             * @param {!ProtoBuf.Reflect.Message} message Message reference
             * @param {string} rule Rule, one of requried, optional, repeated
             * @param {string?} keytype Key data type, if any.
             * @param {string} type Data type, e.g. int32
             * @param {string} name Field name
             * @param {number} id Unique field id
             * @param {Object.<string,*>=} options Options
             * @param {!ProtoBuf.Reflect.Message.OneOf=} oneof Enclosing OneOf
             * @param {string?} syntax The syntax level of this definition (e.g., proto3)
             * @constructor
             * @extends ProtoBuf.Reflect.T
             */
            var Field = function(builder, message, rule, keytype, type, name, id, options, oneof, syntax) {
                T.call(this, builder, message, name);

                /**
                 * @override
                 */
                this.className = "Message.Field";

                /**
                 * Message field required flag.
                 * @type {boolean}
                 * @expose
                 */
                this.required = rule === "required";

                /**
                 * Message field repeated flag.
                 * @type {boolean}
                 * @expose
                 */
                this.repeated = rule === "repeated";

                /**
                 * Message field map flag.
                 * @type {boolean}
                 * @expose
                 */
                this.map = rule === "map";

                /**
                 * Message field key type. Type reference string if unresolved, protobuf
                 * type if resolved. Valid only if this.map === true, null otherwise.
                 * @type {string|{name: string, wireType: number}|null}
                 * @expose
                 */
                this.keyType = keytype || null;

                /**
                 * Message field type. Type reference string if unresolved, protobuf type if
                 * resolved. In a map field, this is the value type.
                 * @type {string|{name: string, wireType: number}}
                 * @expose
                 */
                this.type = type;

                /**
                 * Resolved type reference inside the global namespace.
                 * @type {ProtoBuf.Reflect.T|null}
                 * @expose
                 */
                this.resolvedType = null;

                /**
                 * Unique message field id.
                 * @type {number}
                 * @expose
                 */
                this.id = id;

                /**
                 * Message field options.
                 * @type {!Object.<string,*>}
                 * @dict
                 * @expose
                 */
                this.options = options || {};

                /**
                 * Default value.
                 * @type {*}
                 * @expose
                 */
                this.defaultValue = null;

                /**
                 * Enclosing OneOf.
                 * @type {?ProtoBuf.Reflect.Message.OneOf}
                 * @expose
                 */
                this.oneof = oneof || null;

                /**
                 * Syntax level of this definition (e.g., proto3).
                 * @type {string}
                 * @expose
                 */
                this.syntax = syntax || 'proto2';

                /**
                 * Original field name.
                 * @type {string}
                 * @expose
                 */
                this.originalName = this.name; // Used to revert camelcase transformation on naming collisions

                /**
                 * Element implementation. Created in build() after types are resolved.
                 * @type {ProtoBuf.Element}
                 * @expose
                 */
                this.element = null;

                /**
                 * Key element implementation, for map fields. Created in build() after
                 * types are resolved.
                 * @type {ProtoBuf.Element}
                 * @expose
                 */
                this.keyElement = null;

                // Convert field names to camel case notation if the override is set
                if (this.builder.options['convertFieldsToCamelCase'] && !(this instanceof Message.ExtensionField))
                    this.name = ProtoBuf.Util.toCamelCase(this.name);
            };

            /**
             * @alias ProtoBuf.Reflect.Message.Field.prototype
             * @inner
             */
            var FieldPrototype = Field.prototype = Object.create(T.prototype);

            /**
             * Builds the field.
             * @override
             * @expose
             */
            FieldPrototype.build = function() {
                this.element = new Element(this.type, this.resolvedType, false, this.syntax);
                if (this.map)
                    this.keyElement = new Element(this.keyType, undefined, true, this.syntax);

                // In proto3, fields do not have field presence, and every field is set to
                // its type's default value ("", 0, 0.0, or false).
                if (this.syntax === 'proto3' && !this.repeated && !this.map)
                    this.defaultValue = Element.defaultFieldValue(this.type);

                // Otherwise, default values are present when explicitly specified
                else if (typeof this.options['default'] !== 'undefined')
                    this.defaultValue = this.verifyValue(this.options['default']);
            };

            /**
             * Checks if the given value can be set for this field.
             * @param {*} value Value to check
             * @param {boolean=} skipRepeated Whether to skip the repeated value check or not. Defaults to false.
             * @return {*} Verified, maybe adjusted, value
             * @throws {Error} If the value cannot be set for this field
             * @expose
             */
            FieldPrototype.verifyValue = function(value, skipRepeated) {
                skipRepeated = skipRepeated || false;
                var self = this;
                function fail(val, msg) {
                    throw Error("Illegal value for "+self.toString(true)+" of type "+self.type.name+": "+val+" ("+msg+")");
                }
                if (value === null) { // NULL values for optional fields
                    if (this.required)
                        fail(typeof value, "required");
                    if (this.syntax === 'proto3' && this.type !== ProtoBuf.TYPES["message"])
                        fail(typeof value, "proto3 field without field presence cannot be null");
                    return null;
                }
                var i;
                if (this.repeated && !skipRepeated) { // Repeated values as arrays
                    if (!Array.isArray(value))
                        value = [value];
                    var res = [];
                    for (i=0; i<value.length; i++)
                        res.push(this.element.verifyValue(value[i]));
                    return res;
                }
                if (this.map && !skipRepeated) { // Map values as objects
                    if (!(value instanceof ProtoBuf.Map)) {
                        // If not already a Map, attempt to convert.
                        if (!(value instanceof Object)) {
                            fail(typeof value,
                                 "expected ProtoBuf.Map or raw object for map field");
                        }
                        return new ProtoBuf.Map(this, value);
                    } else {
                        return value;
                    }
                }
                // All non-repeated fields expect no array
                if (!this.repeated && Array.isArray(value))
                    fail(typeof value, "no array expected");

                return this.element.verifyValue(value);
            };

            /**
             * Determines whether the field will have a presence on the wire given its
             * value.
             * @param {*} value Verified field value
             * @param {!ProtoBuf.Builder.Message} message Runtime message
             * @return {boolean} Whether the field will be present on the wire
             */
            FieldPrototype.hasWirePresence = function(value, message) {
                if (this.syntax !== 'proto3')
                    return (value !== null);
                if (this.oneof && message[this.oneof.name] === this.name)
                    return true;
                switch (this.type) {
                    case ProtoBuf.TYPES["int32"]:
                    case ProtoBuf.TYPES["sint32"]:
                    case ProtoBuf.TYPES["sfixed32"]:
                    case ProtoBuf.TYPES["uint32"]:
                    case ProtoBuf.TYPES["fixed32"]:
                        return value !== 0;

                    case ProtoBuf.TYPES["int64"]:
                    case ProtoBuf.TYPES["sint64"]:
                    case ProtoBuf.TYPES["sfixed64"]:
                    case ProtoBuf.TYPES["uint64"]:
                    case ProtoBuf.TYPES["fixed64"]:
                        return value.low !== 0 || value.high !== 0;

                    case ProtoBuf.TYPES["bool"]:
                        return value;

                    case ProtoBuf.TYPES["float"]:
                    case ProtoBuf.TYPES["double"]:
                        return value !== 0.0;

                    case ProtoBuf.TYPES["string"]:
                        return value.length > 0;

                    case ProtoBuf.TYPES["bytes"]:
                        return value.remaining() > 0;

                    case ProtoBuf.TYPES["enum"]:
                        return value !== 0;

                    case ProtoBuf.TYPES["message"]:
                        return value !== null;
                    default:
                        return true;
                }
            };

            /**
             * Encodes the specified field value to the specified buffer.
             * @param {*} value Verified field value
             * @param {ByteBuffer} buffer ByteBuffer to encode to
             * @param {!ProtoBuf.Builder.Message} message Runtime message
             * @return {ByteBuffer} The ByteBuffer for chaining
             * @throws {Error} If the field cannot be encoded
             * @expose
             */
            FieldPrototype.encode = function(value, buffer, message) {
                if (this.type === null || typeof this.type !== 'object')
                    throw Error("[INTERNAL] Unresolved type in "+this.toString(true)+": "+this.type);
                if (value === null || (this.repeated && value.length == 0))
                    return buffer; // Optional omitted
                try {
                    if (this.repeated) {
                        var i;
                        // "Only repeated fields of primitive numeric types (types which use the varint, 32-bit, or 64-bit wire
                        // types) can be declared 'packed'."
                        if (this.options["packed"] && ProtoBuf.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0) {
                            // "All of the elements of the field are packed into a single key-value pair with wire type 2
                            // (length-delimited). Each element is encoded the same way it would be normally, except without a
                            // tag preceding it."
                            buffer.writeVarint32((this.id << 3) | ProtoBuf.WIRE_TYPES.LDELIM);
                            buffer.ensureCapacity(buffer.offset += 1); // We do not know the length yet, so let's assume a varint of length 1
                            var start = buffer.offset; // Remember where the contents begin
                            for (i=0; i<value.length; i++)
                                this.element.encodeValue(this.id, value[i], buffer);
                            var len = buffer.offset-start,
                                varintLen = ByteBuffer.calculateVarint32(len);
                            if (varintLen > 1) { // We need to move the contents
                                var contents = buffer.slice(start, buffer.offset);
                                start += varintLen-1;
                                buffer.offset = start;
                                buffer.append(contents);
                            }
                            buffer.writeVarint32(len, start-varintLen);
                        } else {
                            // "If your message definition has repeated elements (without the [packed=true] option), the encoded
                            // message has zero or more key-value pairs with the same tag number"
                            for (i=0; i<value.length; i++)
                                buffer.writeVarint32((this.id << 3) | this.type.wireType),
                                this.element.encodeValue(this.id, value[i], buffer);
                        }
                    } else if (this.map) {
                        // Write out each map entry as a submessage.
                        value.forEach(function(val, key, m) {
                            // Compute the length of the submessage (key, val) pair.
                            var length =
                                ByteBuffer.calculateVarint32((1 << 3) | this.keyType.wireType) +
                                this.keyElement.calculateLength(1, key) +
                                ByteBuffer.calculateVarint32((2 << 3) | this.type.wireType) +
                                this.element.calculateLength(2, val);

                            // Submessage with wire type of length-delimited.
                            buffer.writeVarint32((this.id << 3) | ProtoBuf.WIRE_TYPES.LDELIM);
                            buffer.writeVarint32(length);

                            // Write out the key and val.
                            buffer.writeVarint32((1 << 3) | this.keyType.wireType);
                            this.keyElement.encodeValue(1, key, buffer);
                            buffer.writeVarint32((2 << 3) | this.type.wireType);
                            this.element.encodeValue(2, val, buffer);
                        }, this);
                    } else {
                        if (this.hasWirePresence(value, message)) {
                            buffer.writeVarint32((this.id << 3) | this.type.wireType);
                            this.element.encodeValue(this.id, value, buffer);
                        }
                    }
                } catch (e) {
                    throw Error("Illegal value for "+this.toString(true)+": "+value+" ("+e+")");
                }
                return buffer;
            };

            /**
             * Calculates the length of this field's value on the network level.
             * @param {*} value Field value
             * @param {!ProtoBuf.Builder.Message} message Runtime message
             * @returns {number} Byte length
             * @expose
             */
            FieldPrototype.calculate = function(value, message) {
                value = this.verifyValue(value); // May throw
                if (this.type === null || typeof this.type !== 'object')
                    throw Error("[INTERNAL] Unresolved type in "+this.toString(true)+": "+this.type);
                if (value === null || (this.repeated && value.length == 0))
                    return 0; // Optional omitted
                var n = 0;
                try {
                    if (this.repeated) {
                        var i, ni;
                        if (this.options["packed"] && ProtoBuf.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0) {
                            n += ByteBuffer.calculateVarint32((this.id << 3) | ProtoBuf.WIRE_TYPES.LDELIM);
                            ni = 0;
                            for (i=0; i<value.length; i++)
                                ni += this.element.calculateLength(this.id, value[i]);
                            n += ByteBuffer.calculateVarint32(ni);
                            n += ni;
                        } else {
                            for (i=0; i<value.length; i++)
                                n += ByteBuffer.calculateVarint32((this.id << 3) | this.type.wireType),
                                n += this.element.calculateLength(this.id, value[i]);
                        }
                    } else if (this.map) {
                        // Each map entry becomes a submessage.
                        value.forEach(function(val, key, m) {
                            // Compute the length of the submessage (key, val) pair.
                            var length =
                                ByteBuffer.calculateVarint32((1 << 3) | this.keyType.wireType) +
                                this.keyElement.calculateLength(1, key) +
                                ByteBuffer.calculateVarint32((2 << 3) | this.type.wireType) +
                                this.element.calculateLength(2, val);

                            n += ByteBuffer.calculateVarint32((this.id << 3) | ProtoBuf.WIRE_TYPES.LDELIM);
                            n += ByteBuffer.calculateVarint32(length);
                            n += length;
                        }, this);
                    } else {
                        if (this.hasWirePresence(value, message)) {
                            n += ByteBuffer.calculateVarint32((this.id << 3) | this.type.wireType);
                            n += this.element.calculateLength(this.id, value);
                        }
                    }
                } catch (e) {
                    throw Error("Illegal value for "+this.toString(true)+": "+value+" ("+e+")");
                }
                return n;
            };

            /**
             * Decode the field value from the specified buffer.
             * @param {number} wireType Leading wire type
             * @param {ByteBuffer} buffer ByteBuffer to decode from
             * @param {boolean=} skipRepeated Whether to skip the repeated check or not. Defaults to false.
             * @return {*} Decoded value: array for packed repeated fields, [key, value] for
             *             map fields, or an individual value otherwise.
             * @throws {Error} If the field cannot be decoded
             * @expose
             */
            FieldPrototype.decode = function(wireType, buffer, skipRepeated) {
                var value, nBytes;

                // We expect wireType to match the underlying type's wireType unless we see
                // a packed repeated field, or unless this is a map field.
                var wireTypeOK =
                    (!this.map && wireType == this.type.wireType) ||
                    (!skipRepeated && this.repeated && this.options["packed"] &&
                     wireType == ProtoBuf.WIRE_TYPES.LDELIM) ||
                    (this.map && wireType == ProtoBuf.WIRE_TYPES.LDELIM);
                if (!wireTypeOK)
                    throw Error("Illegal wire type for field "+this.toString(true)+": "+wireType+" ("+this.type.wireType+" expected)");

                // Handle packed repeated fields.
                if (wireType == ProtoBuf.WIRE_TYPES.LDELIM && this.repeated && this.options["packed"] && ProtoBuf.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0) {
                    if (!skipRepeated) {
                        nBytes = buffer.readVarint32();
                        nBytes = buffer.offset + nBytes; // Limit
                        var values = [];
                        while (buffer.offset < nBytes)
                            values.push(this.decode(this.type.wireType, buffer, true));
                        return values;
                    }
                    // Read the next value otherwise...
                }

                // Handle maps.
                if (this.map) {
                    // Read one (key, value) submessage, and return [key, value]
                    var key = Element.defaultFieldValue(this.keyType);
                    value = Element.defaultFieldValue(this.type);

                    // Read the length
                    nBytes = buffer.readVarint32();
                    if (buffer.remaining() < nBytes)
                        throw Error("Illegal number of bytes for "+this.toString(true)+": "+nBytes+" required but got only "+buffer.remaining());

                    // Get a sub-buffer of this key/value submessage
                    var msgbuf = buffer.clone();
                    msgbuf.limit = msgbuf.offset + nBytes;
                    buffer.offset += nBytes;

                    while (msgbuf.remaining() > 0) {
                        var tag = msgbuf.readVarint32();
                        wireType = tag & 0x07;
                        var id = tag >>> 3;
                        if (id === 1) {
                            key = this.keyElement.decode(msgbuf, wireType, id);
                        } else if (id === 2) {
                            value = this.element.decode(msgbuf, wireType, id);
                        } else {
                            throw Error("Unexpected tag in map field key/value submessage");
                        }
                    }

                    return [key, value];
                }

                // Handle singular and non-packed repeated field values.
                return this.element.decode(buffer, wireType, this.id);
            };

            /**
             * @alias ProtoBuf.Reflect.Message.Field
             * @expose
             */
            Reflect.Message.Field = Field;

            /**
             * Constructs a new Message ExtensionField.
             * @exports ProtoBuf.Reflect.Message.ExtensionField
             * @param {!ProtoBuf.Builder} builder Builder reference
             * @param {!ProtoBuf.Reflect.Message} message Message reference
             * @param {string} rule Rule, one of requried, optional, repeated
             * @param {string} type Data type, e.g. int32
             * @param {string} name Field name
             * @param {number} id Unique field id
             * @param {!Object.<string,*>=} options Options
             * @constructor
             * @extends ProtoBuf.Reflect.Message.Field
             */
            var ExtensionField = function(builder, message, rule, type, name, id, options) {
                Field.call(this, builder, message, rule, /* keytype = */ null, type, name, id, options);

                /**
                 * Extension reference.
                 * @type {!ProtoBuf.Reflect.Extension}
                 * @expose
                 */
                this.extension;
            };

            // Extends Field
            ExtensionField.prototype = Object.create(Field.prototype);

            /**
             * @alias ProtoBuf.Reflect.Message.ExtensionField
             * @expose
             */
            Reflect.Message.ExtensionField = ExtensionField;

            /**
             * Constructs a new Message OneOf.
             * @exports ProtoBuf.Reflect.Message.OneOf
             * @param {!ProtoBuf.Builder} builder Builder reference
             * @param {!ProtoBuf.Reflect.Message} message Message reference
             * @param {string} name OneOf name
             * @constructor
             * @extends ProtoBuf.Reflect.T
             */
            var OneOf = function(builder, message, name) {
                T.call(this, builder, message, name);

                /**
                 * Enclosed fields.
                 * @type {!Array.<!ProtoBuf.Reflect.Message.Field>}
                 * @expose
                 */
                this.fields = [];
            };

            /**
             * @alias ProtoBuf.Reflect.Message.OneOf
             * @expose
             */
            Reflect.Message.OneOf = OneOf;

            /**
             * Constructs a new Enum.
             * @exports ProtoBuf.Reflect.Enum
             * @param {!ProtoBuf.Builder} builder Builder reference
             * @param {!ProtoBuf.Reflect.T} parent Parent Reflect object
             * @param {string} name Enum name
             * @param {Object.<string,*>=} options Enum options
             * @param {string?} syntax The syntax level (e.g., proto3)
             * @constructor
             * @extends ProtoBuf.Reflect.Namespace
             */
            var Enum = function(builder, parent, name, options, syntax) {
                Namespace.call(this, builder, parent, name, options, syntax);

                /**
                 * @override
                 */
                this.className = "Enum";

                /**
                 * Runtime enum object.
                 * @type {Object.<string,number>|null}
                 * @expose
                 */
                this.object = null;
            };

            /**
             * Gets the string name of an enum value.
             * @param {!ProtoBuf.Builder.Enum} enm Runtime enum
             * @param {number} value Enum value
             * @returns {?string} Name or `null` if not present
             * @expose
             */
            Enum.getName = function(enm, value) {
                var keys = Object.keys(enm);
                for (var i=0, key; i<keys.length; ++i)
                    if (enm[key = keys[i]] === value)
                        return key;
                return null;
            };

            /**
             * @alias ProtoBuf.Reflect.Enum.prototype
             * @inner
             */
            var EnumPrototype = Enum.prototype = Object.create(Namespace.prototype);

            /**
             * Builds this enum and returns the runtime counterpart.
             * @param {boolean} rebuild Whether to rebuild or not, defaults to false
             * @returns {!Object.<string,number>}
             * @expose
             */
            EnumPrototype.build = function(rebuild) {
                if (this.object && !rebuild)
                    return this.object;
                var enm = new ProtoBuf.Builder.Enum(),
                    values = this.getChildren(Enum.Value);
                for (var i=0, k=values.length; i<k; ++i)
                    enm[values[i]['name']] = values[i]['id'];
                if (Object.defineProperty)
                    Object.defineProperty(enm, '$options', {
                        "value": this.buildOpt(),
                        "enumerable": false
                    });
                return this.object = enm;
            };

            /**
             * @alias ProtoBuf.Reflect.Enum
             * @expose
             */
            Reflect.Enum = Enum;

            /**
             * Constructs a new Enum Value.
             * @exports ProtoBuf.Reflect.Enum.Value
             * @param {!ProtoBuf.Builder} builder Builder reference
             * @param {!ProtoBuf.Reflect.Enum} enm Enum reference
             * @param {string} name Field name
             * @param {number} id Unique field id
             * @constructor
             * @extends ProtoBuf.Reflect.T
             */
            var Value = function(builder, enm, name, id) {
                T.call(this, builder, enm, name);

                /**
                 * @override
                 */
                this.className = "Enum.Value";

                /**
                 * Unique enum value id.
                 * @type {number}
                 * @expose
                 */
                this.id = id;
            };

            // Extends T
            Value.prototype = Object.create(T.prototype);

            /**
             * @alias ProtoBuf.Reflect.Enum.Value
             * @expose
             */
            Reflect.Enum.Value = Value;

            /**
             * An extension (field).
             * @exports ProtoBuf.Reflect.Extension
             * @constructor
             * @param {!ProtoBuf.Builder} builder Builder reference
             * @param {!ProtoBuf.Reflect.T} parent Parent object
             * @param {string} name Object name
             * @param {!ProtoBuf.Reflect.Message.Field} field Extension field
             */
            var Extension = function(builder, parent, name, field) {
                T.call(this, builder, parent, name);

                /**
                 * Extended message field.
                 * @type {!ProtoBuf.Reflect.Message.Field}
                 * @expose
                 */
                this.field = field;
            };

            // Extends T
            Extension.prototype = Object.create(T.prototype);

            /**
             * @alias ProtoBuf.Reflect.Extension
             * @expose
             */
            Reflect.Extension = Extension;

            /**
             * Constructs a new Service.
             * @exports ProtoBuf.Reflect.Service
             * @param {!ProtoBuf.Builder} builder Builder reference
             * @param {!ProtoBuf.Reflect.Namespace} root Root
             * @param {string} name Service name
             * @param {Object.<string,*>=} options Options
             * @constructor
             * @extends ProtoBuf.Reflect.Namespace
             */
            var Service = function(builder, root, name, options) {
                Namespace.call(this, builder, root, name, options);

                /**
                 * @override
                 */
                this.className = "Service";

                /**
                 * Built runtime service class.
                 * @type {?function(new:ProtoBuf.Builder.Service)}
                 */
                this.clazz = null;
            };

            /**
             * @alias ProtoBuf.Reflect.Service.prototype
             * @inner
             */
            var ServicePrototype = Service.prototype = Object.create(Namespace.prototype);

            /**
             * Builds the service and returns the runtime counterpart, which is a fully functional class.
             * @see ProtoBuf.Builder.Service
             * @param {boolean=} rebuild Whether to rebuild or not
             * @return {Function} Service class
             * @throws {Error} If the message cannot be built
             * @expose
             */
            ServicePrototype.build = function(rebuild) {
                if (this.clazz && !rebuild)
                    return this.clazz;

                // Create the runtime Service class in its own scope
                return this.clazz = (function(ProtoBuf, T) {

                    /**
                     * Constructs a new runtime Service.
                     * @name ProtoBuf.Builder.Service
                     * @param {function(string, ProtoBuf.Builder.Message, function(Error, ProtoBuf.Builder.Message=))=} rpcImpl RPC implementation receiving the method name and the message
                     * @class Barebone of all runtime services.
                     * @constructor
                     * @throws {Error} If the service cannot be created
                     */
                    var Service = function(rpcImpl) {
                        ProtoBuf.Builder.Service.call(this);

                        /**
                         * Service implementation.
                         * @name ProtoBuf.Builder.Service#rpcImpl
                         * @type {!function(string, ProtoBuf.Builder.Message, function(Error, ProtoBuf.Builder.Message=))}
                         * @expose
                         */
                        this.rpcImpl = rpcImpl || function(name, msg, callback) {
                            // This is what a user has to implement: A function receiving the method name, the actual message to
                            // send (type checked) and the callback that's either provided with the error as its first
                            // argument or null and the actual response message.
                            setTimeout(callback.bind(this, Error("Not implemented, see: https://github.com/dcodeIO/ProtoBuf.js/wiki/Services")), 0); // Must be async!
                        };
                    };

                    /**
                     * @alias ProtoBuf.Builder.Service.prototype
                     * @inner
                     */
                    var ServicePrototype = Service.prototype = Object.create(ProtoBuf.Builder.Service.prototype);

                    /**
                     * Asynchronously performs an RPC call using the given RPC implementation.
                     * @name ProtoBuf.Builder.Service.[Method]
                     * @function
                     * @param {!function(string, ProtoBuf.Builder.Message, function(Error, ProtoBuf.Builder.Message=))} rpcImpl RPC implementation
                     * @param {ProtoBuf.Builder.Message} req Request
                     * @param {function(Error, (ProtoBuf.Builder.Message|ByteBuffer|Buffer|string)=)} callback Callback receiving
                     *  the error if any and the response either as a pre-parsed message or as its raw bytes
                     * @abstract
                     */

                    /**
                     * Asynchronously performs an RPC call using the instance's RPC implementation.
                     * @name ProtoBuf.Builder.Service#[Method]
                     * @function
                     * @param {ProtoBuf.Builder.Message} req Request
                     * @param {function(Error, (ProtoBuf.Builder.Message|ByteBuffer|Buffer|string)=)} callback Callback receiving
                     *  the error if any and the response either as a pre-parsed message or as its raw bytes
                     * @abstract
                     */

                    var rpc = T.getChildren(ProtoBuf.Reflect.Service.RPCMethod);
                    for (var i=0; i<rpc.length; i++) {
                        (function(method) {

                            // service#Method(message, callback)
                            ServicePrototype[method.name] = function(req, callback) {
                                try {
                                    try {
                                        // If given as a buffer, decode the request. Will throw a TypeError if not a valid buffer.
                                        req = method.resolvedRequestType.clazz.decode(ByteBuffer.wrap(req));
                                    } catch (err) {
                                        if (!(err instanceof TypeError))
                                            throw err;
                                    }
                                    if (req === null || typeof req !== 'object')
                                        throw Error("Illegal arguments");
                                    if (!(req instanceof method.resolvedRequestType.clazz))
                                        req = new method.resolvedRequestType.clazz(req);
                                    this.rpcImpl(method.fqn(), req, function(err, res) { // Assumes that this is properly async
                                        if (err) {
                                            callback(err);
                                            return;
                                        }
                                        // Coalesce to empty string when service response has empty content
                                        if (res === null)
                                            res = ''
                                        try { res = method.resolvedResponseType.clazz.decode(res); } catch (notABuffer) {}
                                        if (!res || !(res instanceof method.resolvedResponseType.clazz)) {
                                            callback(Error("Illegal response type received in service method "+ T.name+"#"+method.name));
                                            return;
                                        }
                                        callback(null, res);
                                    });
                                } catch (err) {
                                    setTimeout(callback.bind(this, err), 0);
                                }
                            };

                            // Service.Method(rpcImpl, message, callback)
                            Service[method.name] = function(rpcImpl, req, callback) {
                                new Service(rpcImpl)[method.name](req, callback);
                            };

                            if (Object.defineProperty)
                                Object.defineProperty(Service[method.name], "$options", { "value": method.buildOpt() }),
                                Object.defineProperty(ServicePrototype[method.name], "$options", { "value": Service[method.name]["$options"] });
                        })(rpc[i]);
                    }

                    // Properties

                    /**
                     * Service options.
                     * @name ProtoBuf.Builder.Service.$options
                     * @type {Object.<string,*>}
                     * @expose
                     */
                    var $optionsS; // cc needs this

                    /**
                     * Service options.
                     * @name ProtoBuf.Builder.Service#$options
                     * @type {Object.<string,*>}
                     * @expose
                     */
                    var $options;

                    /**
                     * Reflection type.
                     * @name ProtoBuf.Builder.Service.$type
                     * @type {!ProtoBuf.Reflect.Service}
                     * @expose
                     */
                    var $typeS;

                    /**
                     * Reflection type.
                     * @name ProtoBuf.Builder.Service#$type
                     * @type {!ProtoBuf.Reflect.Service}
                     * @expose
                     */
                    var $type;

                    if (Object.defineProperty)
                        Object.defineProperty(Service, "$options", { "value": T.buildOpt() }),
                        Object.defineProperty(ServicePrototype, "$options", { "value": Service["$options"] }),
                        Object.defineProperty(Service, "$type", { "value": T }),
                        Object.defineProperty(ServicePrototype, "$type", { "value": T });

                    return Service;

                })(ProtoBuf, this);
            };

            /**
             * @alias ProtoBuf.Reflect.Service
             * @expose
             */
            Reflect.Service = Service;

            /**
             * Abstract service method.
             * @exports ProtoBuf.Reflect.Service.Method
             * @param {!ProtoBuf.Builder} builder Builder reference
             * @param {!ProtoBuf.Reflect.Service} svc Service
             * @param {string} name Method name
             * @param {Object.<string,*>=} options Options
             * @constructor
             * @extends ProtoBuf.Reflect.T
             */
            var Method = function(builder, svc, name, options) {
                T.call(this, builder, svc, name);

                /**
                 * @override
                 */
                this.className = "Service.Method";

                /**
                 * Options.
                 * @type {Object.<string, *>}
                 * @expose
                 */
                this.options = options || {};
            };

            /**
             * @alias ProtoBuf.Reflect.Service.Method.prototype
             * @inner
             */
            var MethodPrototype = Method.prototype = Object.create(T.prototype);

            /**
             * Builds the method's '$options' property.
             * @name ProtoBuf.Reflect.Service.Method#buildOpt
             * @function
             * @return {Object.<string,*>}
             */
            MethodPrototype.buildOpt = NamespacePrototype.buildOpt;

            /**
             * @alias ProtoBuf.Reflect.Service.Method
             * @expose
             */
            Reflect.Service.Method = Method;

            /**
             * RPC service method.
             * @exports ProtoBuf.Reflect.Service.RPCMethod
             * @param {!ProtoBuf.Builder} builder Builder reference
             * @param {!ProtoBuf.Reflect.Service} svc Service
             * @param {string} name Method name
             * @param {string} request Request message name
             * @param {string} response Response message name
             * @param {boolean} request_stream Whether requests are streamed
             * @param {boolean} response_stream Whether responses are streamed
             * @param {Object.<string,*>=} options Options
             * @constructor
             * @extends ProtoBuf.Reflect.Service.Method
             */
            var RPCMethod = function(builder, svc, name, request, response, request_stream, response_stream, options) {
                Method.call(this, builder, svc, name, options);

                /**
                 * @override
                 */
                this.className = "Service.RPCMethod";

                /**
                 * Request message name.
                 * @type {string}
                 * @expose
                 */
                this.requestName = request;

                /**
                 * Response message name.
                 * @type {string}
                 * @expose
                 */
                this.responseName = response;

                /**
                 * Whether requests are streamed
                 * @type {bool}
                 * @expose
                 */
                this.requestStream = request_stream;

                /**
                 * Whether responses are streamed
                 * @type {bool}
                 * @expose
                 */
                this.responseStream = response_stream;

                /**
                 * Resolved request message type.
                 * @type {ProtoBuf.Reflect.Message}
                 * @expose
                 */
                this.resolvedRequestType = null;

                /**
                 * Resolved response message type.
                 * @type {ProtoBuf.Reflect.Message}
                 * @expose
                 */
                this.resolvedResponseType = null;
            };

            // Extends Method
            RPCMethod.prototype = Object.create(Method.prototype);

            /**
             * @alias ProtoBuf.Reflect.Service.RPCMethod
             * @expose
             */
            Reflect.Service.RPCMethod = RPCMethod;

            return Reflect;

        })(ProtoBuf);

        /**
         * @alias ProtoBuf.Builder
         * @expose
         */
        ProtoBuf.Builder = (function(ProtoBuf, Lang, Reflect) {
            "use strict";

            /**
             * Constructs a new Builder.
             * @exports ProtoBuf.Builder
             * @class Provides the functionality to build protocol messages.
             * @param {Object.<string,*>=} options Options
             * @constructor
             */
            var Builder = function(options) {

                /**
                 * Namespace.
                 * @type {ProtoBuf.Reflect.Namespace}
                 * @expose
                 */
                this.ns = new Reflect.Namespace(this, null, ""); // Global namespace

                /**
                 * Namespace pointer.
                 * @type {ProtoBuf.Reflect.T}
                 * @expose
                 */
                this.ptr = this.ns;

                /**
                 * Resolved flag.
                 * @type {boolean}
                 * @expose
                 */
                this.resolved = false;

                /**
                 * The current building result.
                 * @type {Object.<string,ProtoBuf.Builder.Message|Object>|null}
                 * @expose
                 */
                this.result = null;

                /**
                 * Imported files.
                 * @type {Array.<string>}
                 * @expose
                 */
                this.files = {};

                /**
                 * Import root override.
                 * @type {?string}
                 * @expose
                 */
                this.importRoot = null;

                /**
                 * Options.
                 * @type {!Object.<string, *>}
                 * @expose
                 */
                this.options = options || {};
            };

            /**
             * @alias ProtoBuf.Builder.prototype
             * @inner
             */
            var BuilderPrototype = Builder.prototype;

            // ----- Definition tests -----

            /**
             * Tests if a definition most likely describes a message.
             * @param {!Object} def
             * @returns {boolean}
             * @expose
             */
            Builder.isMessage = function(def) {
                // Messages require a string name
                if (typeof def["name"] !== 'string')
                    return false;
                // Messages do not contain values (enum) or rpc methods (service)
                if (typeof def["values"] !== 'undefined' || typeof def["rpc"] !== 'undefined')
                    return false;
                return true;
            };

            /**
             * Tests if a definition most likely describes a message field.
             * @param {!Object} def
             * @returns {boolean}
             * @expose
             */
            Builder.isMessageField = function(def) {
                // Message fields require a string rule, name and type and an id
                if (typeof def["rule"] !== 'string' || typeof def["name"] !== 'string' || typeof def["type"] !== 'string' || typeof def["id"] === 'undefined')
                    return false;
                return true;
            };

            /**
             * Tests if a definition most likely describes an enum.
             * @param {!Object} def
             * @returns {boolean}
             * @expose
             */
            Builder.isEnum = function(def) {
                // Enums require a string name
                if (typeof def["name"] !== 'string')
                    return false;
                // Enums require at least one value
                if (typeof def["values"] === 'undefined' || !Array.isArray(def["values"]) || def["values"].length === 0)
                    return false;
                return true;
            };

            /**
             * Tests if a definition most likely describes a service.
             * @param {!Object} def
             * @returns {boolean}
             * @expose
             */
            Builder.isService = function(def) {
                // Services require a string name and an rpc object
                if (typeof def["name"] !== 'string' || typeof def["rpc"] !== 'object' || !def["rpc"])
                    return false;
                return true;
            };

            /**
             * Tests if a definition most likely describes an extended message
             * @param {!Object} def
             * @returns {boolean}
             * @expose
             */
            Builder.isExtend = function(def) {
                // Extends rquire a string ref
                if (typeof def["ref"] !== 'string')
                    return false;
                return true;
            };

            // ----- Building -----

            /**
             * Resets the pointer to the root namespace.
             * @returns {!ProtoBuf.Builder} this
             * @expose
             */
            BuilderPrototype.reset = function() {
                this.ptr = this.ns;
                return this;
            };

            /**
             * Defines a namespace on top of the current pointer position and places the pointer on it.
             * @param {string} namespace
             * @return {!ProtoBuf.Builder} this
             * @expose
             */
            BuilderPrototype.define = function(namespace) {
                if (typeof namespace !== 'string' || !Lang.TYPEREF.test(namespace))
                    throw Error("illegal namespace: "+namespace);
                namespace.split(".").forEach(function(part) {
                    var ns = this.ptr.getChild(part);
                    if (ns === null) // Keep existing
                        this.ptr.addChild(ns = new Reflect.Namespace(this, this.ptr, part));
                    this.ptr = ns;
                }, this);
                return this;
            };

            /**
             * Creates the specified definitions at the current pointer position.
             * @param {!Array.<!Object>} defs Messages, enums or services to create
             * @returns {!ProtoBuf.Builder} this
             * @throws {Error} If a message definition is invalid
             * @expose
             */
            BuilderPrototype.create = function(defs) {
                if (!defs)
                    return this; // Nothing to create
                if (!Array.isArray(defs))
                    defs = [defs];
                else {
                    if (defs.length === 0)
                        return this;
                    defs = defs.slice();
                }

                // It's quite hard to keep track of scopes and memory here, so let's do this iteratively.
                var stack = [defs];
                while (stack.length > 0) {
                    defs = stack.pop();

                    if (!Array.isArray(defs)) // Stack always contains entire namespaces
                        throw Error("not a valid namespace: "+JSON.stringify(defs));

                    while (defs.length > 0) {
                        var def = defs.shift(); // Namespaces always contain an array of messages, enums and services

                        if (Builder.isMessage(def)) {
                            var obj = new Reflect.Message(this, this.ptr, def["name"], def["options"], def["isGroup"], def["syntax"]);

                            // Create OneOfs
                            var oneofs = {};
                            if (def["oneofs"])
                                Object.keys(def["oneofs"]).forEach(function(name) {
                                    obj.addChild(oneofs[name] = new Reflect.Message.OneOf(this, obj, name));
                                }, this);

                            // Create fields
                            if (def["fields"])
                                def["fields"].forEach(function(fld) {
                                    if (obj.getChild(fld["id"]|0) !== null)
                                        throw Error("duplicate or invalid field id in "+obj.name+": "+fld['id']);
                                    if (fld["options"] && typeof fld["options"] !== 'object')
                                        throw Error("illegal field options in "+obj.name+"#"+fld["name"]);
                                    var oneof = null;
                                    if (typeof fld["oneof"] === 'string' && !(oneof = oneofs[fld["oneof"]]))
                                        throw Error("illegal oneof in "+obj.name+"#"+fld["name"]+": "+fld["oneof"]);
                                    fld = new Reflect.Message.Field(this, obj, fld["rule"], fld["keytype"], fld["type"], fld["name"], fld["id"], fld["options"], oneof, def["syntax"]);
                                    if (oneof)
                                        oneof.fields.push(fld);
                                    obj.addChild(fld);
                                }, this);

                            // Push children to stack
                            var subObj = [];
                            if (def["enums"])
                                def["enums"].forEach(function(enm) {
                                    subObj.push(enm);
                                });
                            if (def["messages"])
                                def["messages"].forEach(function(msg) {
                                    subObj.push(msg);
                                });
                            if (def["services"])
                                def["services"].forEach(function(svc) {
                                    subObj.push(svc);
                                });

                            // Set extension ranges
                            if (def["extensions"]) {
                                if (typeof def["extensions"][0] === 'number') // pre 5.0.1
                                    obj.extensions = [ def["extensions"] ];
                                else
                                    obj.extensions = def["extensions"];
                            }

                            // Create on top of current namespace
                            this.ptr.addChild(obj);
                            if (subObj.length > 0) {
                                stack.push(defs); // Push the current level back
                                defs = subObj; // Continue processing sub level
                                subObj = null;
                                this.ptr = obj; // And move the pointer to this namespace
                                obj = null;
                                continue;
                            }
                            subObj = null;

                        } else if (Builder.isEnum(def)) {

                            obj = new Reflect.Enum(this, this.ptr, def["name"], def["options"], def["syntax"]);
                            def["values"].forEach(function(val) {
                                obj.addChild(new Reflect.Enum.Value(this, obj, val["name"], val["id"]));
                            }, this);
                            this.ptr.addChild(obj);

                        } else if (Builder.isService(def)) {

                            obj = new Reflect.Service(this, this.ptr, def["name"], def["options"]);
                            Object.keys(def["rpc"]).forEach(function(name) {
                                var mtd = def["rpc"][name];
                                obj.addChild(new Reflect.Service.RPCMethod(this, obj, name, mtd["request"], mtd["response"], !!mtd["request_stream"], !!mtd["response_stream"], mtd["options"]));
                            }, this);
                            this.ptr.addChild(obj);

                        } else if (Builder.isExtend(def)) {

                            obj = this.ptr.resolve(def["ref"], true);
                            if (obj) {
                                def["fields"].forEach(function(fld) {
                                    if (obj.getChild(fld['id']|0) !== null)
                                        throw Error("duplicate extended field id in "+obj.name+": "+fld['id']);
                                    // Check if field id is allowed to be extended
                                    if (obj.extensions) {
                                        var valid = false;
                                        obj.extensions.forEach(function(range) {
                                            if (fld["id"] >= range[0] && fld["id"] <= range[1])
                                                valid = true;
                                        });
                                        if (!valid)
                                            throw Error("illegal extended field id in "+obj.name+": "+fld['id']+" (not within valid ranges)");
                                    }
                                    // Convert extension field names to camel case notation if the override is set
                                    var name = fld["name"];
                                    if (this.options['convertFieldsToCamelCase'])
                                        name = ProtoBuf.Util.toCamelCase(name);
                                    // see #161: Extensions use their fully qualified name as their runtime key and...
                                    var field = new Reflect.Message.ExtensionField(this, obj, fld["rule"], fld["type"], this.ptr.fqn()+'.'+name, fld["id"], fld["options"]);
                                    // ...are added on top of the current namespace as an extension which is used for
                                    // resolving their type later on (the extension always keeps the original name to
                                    // prevent naming collisions)
                                    var ext = new Reflect.Extension(this, this.ptr, fld["name"], field);
                                    field.extension = ext;
                                    this.ptr.addChild(ext);
                                    obj.addChild(field);
                                }, this);

                            } else if (!/\.?google\.protobuf\./.test(def["ref"])) // Silently skip internal extensions
                                throw Error("extended message "+def["ref"]+" is not defined");

                        } else
                            throw Error("not a valid definition: "+JSON.stringify(def));

                        def = null;
                        obj = null;
                    }
                    // Break goes here
                    defs = null;
                    this.ptr = this.ptr.parent; // Namespace done, continue at parent
                }
                this.resolved = false; // Require re-resolve
                this.result = null; // Require re-build
                return this;
            };

            /**
             * Propagates syntax to all children.
             * @param {!Object} parent
             * @inner
             */
            function propagateSyntax(parent) {
                if (parent['messages']) {
                    parent['messages'].forEach(function(child) {
                        child["syntax"] = parent["syntax"];
                        propagateSyntax(child);
                    });
                }
                if (parent['enums']) {
                    parent['enums'].forEach(function(child) {
                        child["syntax"] = parent["syntax"];
                    });
                }
            }

            /**
             * Imports another definition into this builder.
             * @param {Object.<string,*>} json Parsed import
             * @param {(string|{root: string, file: string})=} filename Imported file name
             * @returns {!ProtoBuf.Builder} this
             * @throws {Error} If the definition or file cannot be imported
             * @expose
             */
            BuilderPrototype["import"] = function(json, filename) {
                var delim = '/';

                // Make sure to skip duplicate imports

                if (typeof filename === 'string') {

                    if (ProtoBuf.Util.IS_NODE)
                        filename = require$$1$1['resolve'](filename);
                    if (this.files[filename] === true)
                        return this.reset();
                    this.files[filename] = true;

                } else if (typeof filename === 'object') { // Object with root, file.

                    var root = filename.root;
                    if (ProtoBuf.Util.IS_NODE)
                        root = require$$1$1['resolve'](root);
                    if (root.indexOf("\\") >= 0 || filename.file.indexOf("\\") >= 0)
                        delim = '\\';
                    var fname = root + delim + filename.file;
                    if (this.files[fname] === true)
                        return this.reset();
                    this.files[fname] = true;
                }

                // Import imports

                if (json['imports'] && json['imports'].length > 0) {
                    var importRoot,
                        resetRoot = false;

                    if (typeof filename === 'object') { // If an import root is specified, override

                        this.importRoot = filename["root"]; resetRoot = true; // ... and reset afterwards
                        importRoot = this.importRoot;
                        filename = filename["file"];
                        if (importRoot.indexOf("\\") >= 0 || filename.indexOf("\\") >= 0)
                            delim = '\\';

                    } else if (typeof filename === 'string') {

                        if (this.importRoot) // If import root is overridden, use it
                            importRoot = this.importRoot;
                        else { // Otherwise compute from filename
                            if (filename.indexOf("/") >= 0) { // Unix
                                importRoot = filename.replace(/\/[^\/]*$/, "");
                                if (/* /file.proto */ importRoot === "")
                                    importRoot = "/";
                            } else if (filename.indexOf("\\") >= 0) { // Windows
                                importRoot = filename.replace(/\\[^\\]*$/, "");
                                delim = '\\';
                            } else
                                importRoot = ".";
                        }

                    } else
                        importRoot = null;

                    for (var i=0; i<json['imports'].length; i++) {
                        if (typeof json['imports'][i] === 'string') { // Import file
                            if (!importRoot)
                                throw Error("cannot determine import root");
                            var importFilename = json['imports'][i];
                            if (importFilename === "google/protobuf/descriptor.proto")
                                continue; // Not needed and therefore not used
                            importFilename = importRoot + delim + importFilename;
                            if (this.files[importFilename] === true)
                                continue; // Already imported
                            if (/\.proto$/i.test(importFilename) && !ProtoBuf.DotProto)       // If this is a light build
                                importFilename = importFilename.replace(/\.proto$/, ".json"); // always load the JSON file
                            var contents = ProtoBuf.Util.fetch(importFilename);
                            if (contents === null)
                                throw Error("failed to import '"+importFilename+"' in '"+filename+"': file not found");
                            if (/\.json$/i.test(importFilename)) // Always possible
                                this["import"](JSON.parse(contents+""), importFilename); // May throw
                            else
                                this["import"](ProtoBuf.DotProto.Parser.parse(contents), importFilename); // May throw
                        } else // Import structure
                            if (!filename)
                                this["import"](json['imports'][i]);
                            else if (/\.(\w+)$/.test(filename)) // With extension: Append _importN to the name portion to make it unique
                                this["import"](json['imports'][i], filename.replace(/^(.+)\.(\w+)$/, function($0, $1, $2) { return $1+"_import"+i+"."+$2; }));
                            else // Without extension: Append _importN to make it unique
                                this["import"](json['imports'][i], filename+"_import"+i);
                    }
                    if (resetRoot) // Reset import root override when all imports are done
                        this.importRoot = null;
                }

                // Import structures

                if (json['package'])
                    this.define(json['package']);
                if (json['syntax'])
                    propagateSyntax(json);
                var base = this.ptr;
                if (json['options'])
                    Object.keys(json['options']).forEach(function(key) {
                        base.options[key] = json['options'][key];
                    });
                if (json['messages'])
                    this.create(json['messages']),
                    this.ptr = base;
                if (json['enums'])
                    this.create(json['enums']),
                    this.ptr = base;
                if (json['services'])
                    this.create(json['services']),
                    this.ptr = base;
                if (json['extends'])
                    this.create(json['extends']);

                return this.reset();
            };

            /**
             * Resolves all namespace objects.
             * @throws {Error} If a type cannot be resolved
             * @returns {!ProtoBuf.Builder} this
             * @expose
             */
            BuilderPrototype.resolveAll = function() {
                // Resolve all reflected objects
                var res;
                if (this.ptr == null || typeof this.ptr.type === 'object')
                    return this; // Done (already resolved)

                if (this.ptr instanceof Reflect.Namespace) { // Resolve children

                    this.ptr.children.forEach(function(child) {
                        this.ptr = child;
                        this.resolveAll();
                    }, this);

                } else if (this.ptr instanceof Reflect.Message.Field) { // Resolve type

                    if (!Lang.TYPE.test(this.ptr.type)) {
                        if (!Lang.TYPEREF.test(this.ptr.type))
                            throw Error("illegal type reference in "+this.ptr.toString(true)+": "+this.ptr.type);
                        res = (this.ptr instanceof Reflect.Message.ExtensionField ? this.ptr.extension.parent : this.ptr.parent).resolve(this.ptr.type, true);
                        if (!res)
                            throw Error("unresolvable type reference in "+this.ptr.toString(true)+": "+this.ptr.type);
                        this.ptr.resolvedType = res;
                        if (res instanceof Reflect.Enum) {
                            this.ptr.type = ProtoBuf.TYPES["enum"];
                            if (this.ptr.syntax === 'proto3' && res.syntax !== 'proto3')
                                throw Error("proto3 message cannot reference proto2 enum");
                        }
                        else if (res instanceof Reflect.Message)
                            this.ptr.type = res.isGroup ? ProtoBuf.TYPES["group"] : ProtoBuf.TYPES["message"];
                        else
                            throw Error("illegal type reference in "+this.ptr.toString(true)+": "+this.ptr.type);
                    } else
                        this.ptr.type = ProtoBuf.TYPES[this.ptr.type];

                    // If it's a map field, also resolve the key type. The key type can be only a numeric, string, or bool type
                    // (i.e., no enums or messages), so we don't need to resolve against the current namespace.
                    if (this.ptr.map) {
                        if (!Lang.TYPE.test(this.ptr.keyType))
                            throw Error("illegal key type for map field in "+this.ptr.toString(true)+": "+this.ptr.keyType);
                        this.ptr.keyType = ProtoBuf.TYPES[this.ptr.keyType];
                    }

                } else if (this.ptr instanceof ProtoBuf.Reflect.Service.Method) {

                    if (this.ptr instanceof ProtoBuf.Reflect.Service.RPCMethod) {
                        res = this.ptr.parent.resolve(this.ptr.requestName, true);
                        if (!res || !(res instanceof ProtoBuf.Reflect.Message))
                            throw Error("Illegal type reference in "+this.ptr.toString(true)+": "+this.ptr.requestName);
                        this.ptr.resolvedRequestType = res;
                        res = this.ptr.parent.resolve(this.ptr.responseName, true);
                        if (!res || !(res instanceof ProtoBuf.Reflect.Message))
                            throw Error("Illegal type reference in "+this.ptr.toString(true)+": "+this.ptr.responseName);
                        this.ptr.resolvedResponseType = res;
                    } else // Should not happen as nothing else is implemented
                        throw Error("illegal service type in "+this.ptr.toString(true));

                } else if (
                    !(this.ptr instanceof ProtoBuf.Reflect.Message.OneOf) && // Not built
                    !(this.ptr instanceof ProtoBuf.Reflect.Extension) && // Not built
                    !(this.ptr instanceof ProtoBuf.Reflect.Enum.Value) // Built in enum
                )
                    throw Error("illegal object in namespace: "+typeof(this.ptr)+": "+this.ptr);

                return this.reset();
            };

            /**
             * Builds the protocol. This will first try to resolve all definitions and, if this has been successful,
             * return the built package.
             * @param {(string|Array.<string>)=} path Specifies what to return. If omitted, the entire namespace will be returned.
             * @returns {!ProtoBuf.Builder.Message|!Object.<string,*>}
             * @throws {Error} If a type could not be resolved
             * @expose
             */
            BuilderPrototype.build = function(path) {
                this.reset();
                if (!this.resolved)
                    this.resolveAll(),
                    this.resolved = true,
                    this.result = null; // Require re-build
                if (this.result === null) // (Re-)Build
                    this.result = this.ns.build();
                if (!path)
                    return this.result;
                var part = typeof path === 'string' ? path.split(".") : path,
                    ptr = this.result; // Build namespace pointer (no hasChild etc.)
                for (var i=0; i<part.length; i++)
                    if (ptr[part[i]])
                        ptr = ptr[part[i]];
                    else {
                        ptr = null;
                        break;
                    }
                return ptr;
            };

            /**
             * Similar to {@link ProtoBuf.Builder#build}, but looks up the internal reflection descriptor.
             * @param {string=} path Specifies what to return. If omitted, the entire namespace wiil be returned.
             * @param {boolean=} excludeNonNamespace Excludes non-namespace types like fields, defaults to `false`
             * @returns {?ProtoBuf.Reflect.T} Reflection descriptor or `null` if not found
             */
            BuilderPrototype.lookup = function(path, excludeNonNamespace) {
                return path ? this.ns.resolve(path, excludeNonNamespace) : this.ns;
            };

            /**
             * Returns a string representation of this object.
             * @return {string} String representation as of "Builder"
             * @expose
             */
            BuilderPrototype.toString = function() {
                return "Builder";
            };

            // ----- Base classes -----
            // Exist for the sole purpose of being able to "... instanceof ProtoBuf.Builder.Message" etc.

            /**
             * @alias ProtoBuf.Builder.Message
             */
            Builder.Message = function() {};

            /**
             * @alias ProtoBuf.Builder.Enum
             */
            Builder.Enum = function() {};

            /**
             * @alias ProtoBuf.Builder.Message
             */
            Builder.Service = function() {};

            return Builder;

        })(ProtoBuf, ProtoBuf.Lang, ProtoBuf.Reflect);

        /**
         * @alias ProtoBuf.Map
         * @expose
         */
        ProtoBuf.Map = (function(ProtoBuf, Reflect) {
            "use strict";

            /**
             * Constructs a new Map. A Map is a container that is used to implement map
             * fields on message objects. It closely follows the ES6 Map API; however,
             * it is distinct because we do not want to depend on external polyfills or
             * on ES6 itself.
             *
             * @exports ProtoBuf.Map
             * @param {!ProtoBuf.Reflect.Field} field Map field
             * @param {Object.<string,*>=} contents Initial contents
             * @constructor
             */
            var Map = function(field, contents) {
                if (!field.map)
                    throw Error("field is not a map");

                /**
                 * The field corresponding to this map.
                 * @type {!ProtoBuf.Reflect.Field}
                 */
                this.field = field;

                /**
                 * Element instance corresponding to key type.
                 * @type {!ProtoBuf.Reflect.Element}
                 */
                this.keyElem = new Reflect.Element(field.keyType, null, true, field.syntax);

                /**
                 * Element instance corresponding to value type.
                 * @type {!ProtoBuf.Reflect.Element}
                 */
                this.valueElem = new Reflect.Element(field.type, field.resolvedType, false, field.syntax);

                /**
                 * Internal map: stores mapping of (string form of key) -> (key, value)
                 * pair.
                 *
                 * We provide map semantics for arbitrary key types, but we build on top
                 * of an Object, which has only string keys. In order to avoid the need
                 * to convert a string key back to its native type in many situations,
                 * we store the native key value alongside the value. Thus, we only need
                 * a one-way mapping from a key type to its string form that guarantees
                 * uniqueness and equality (i.e., str(K1) === str(K2) if and only if K1
                 * === K2).
                 *
                 * @type {!Object<string, {key: *, value: *}>}
                 */
                this.map = {};

                /**
                 * Returns the number of elements in the map.
                 */
                Object.defineProperty(this, "size", {
                    get: function() { return Object.keys(this.map).length; }
                });

                // Fill initial contents from a raw object.
                if (contents) {
                    var keys = Object.keys(contents);
                    for (var i = 0; i < keys.length; i++) {
                        var key = this.keyElem.valueFromString(keys[i]);
                        var val = this.valueElem.verifyValue(contents[keys[i]]);
                        this.map[this.keyElem.valueToString(key)] =
                            { key: key, value: val };
                    }
                }
            };

            var MapPrototype = Map.prototype;

            /**
             * Helper: return an iterator over an array.
             * @param {!Array<*>} arr the array
             * @returns {!Object} an iterator
             * @inner
             */
            function arrayIterator(arr) {
                var idx = 0;
                return {
                    next: function() {
                        if (idx < arr.length)
                            return { done: false, value: arr[idx++] };
                        return { done: true };
                    }
                }
            }

            /**
             * Clears the map.
             */
            MapPrototype.clear = function() {
                this.map = {};
            };

            /**
             * Deletes a particular key from the map.
             * @returns {boolean} Whether any entry with this key was deleted.
             */
            MapPrototype["delete"] = function(key) {
                var keyValue = this.keyElem.valueToString(this.keyElem.verifyValue(key));
                var hadKey = keyValue in this.map;
                delete this.map[keyValue];
                return hadKey;
            };

            /**
             * Returns an iterator over [key, value] pairs in the map.
             * @returns {Object} The iterator
             */
            MapPrototype.entries = function() {
                var entries = [];
                var strKeys = Object.keys(this.map);
                for (var i = 0, entry; i < strKeys.length; i++)
                    entries.push([(entry=this.map[strKeys[i]]).key, entry.value]);
                return arrayIterator(entries);
            };

            /**
             * Returns an iterator over keys in the map.
             * @returns {Object} The iterator
             */
            MapPrototype.keys = function() {
                var keys = [];
                var strKeys = Object.keys(this.map);
                for (var i = 0; i < strKeys.length; i++)
                    keys.push(this.map[strKeys[i]].key);
                return arrayIterator(keys);
            };

            /**
             * Returns an iterator over values in the map.
             * @returns {!Object} The iterator
             */
            MapPrototype.values = function() {
                var values = [];
                var strKeys = Object.keys(this.map);
                for (var i = 0; i < strKeys.length; i++)
                    values.push(this.map[strKeys[i]].value);
                return arrayIterator(values);
            };

            /**
             * Iterates over entries in the map, calling a function on each.
             * @param {function(this:*, *, *, *)} cb The callback to invoke with value, key, and map arguments.
             * @param {Object=} thisArg The `this` value for the callback
             */
            MapPrototype.forEach = function(cb, thisArg) {
                var strKeys = Object.keys(this.map);
                for (var i = 0, entry; i < strKeys.length; i++)
                    cb.call(thisArg, (entry=this.map[strKeys[i]]).value, entry.key, this);
            };

            /**
             * Sets a key in the map to the given value.
             * @param {*} key The key
             * @param {*} value The value
             * @returns {!ProtoBuf.Map} The map instance
             */
            MapPrototype.set = function(key, value) {
                var keyValue = this.keyElem.verifyValue(key);
                var valValue = this.valueElem.verifyValue(value);
                this.map[this.keyElem.valueToString(keyValue)] =
                    { key: keyValue, value: valValue };
                return this;
            };

            /**
             * Gets the value corresponding to a key in the map.
             * @param {*} key The key
             * @returns {*|undefined} The value, or `undefined` if key not present
             */
            MapPrototype.get = function(key) {
                var keyValue = this.keyElem.valueToString(this.keyElem.verifyValue(key));
                if (!(keyValue in this.map))
                    return undefined;
                return this.map[keyValue].value;
            };

            /**
             * Determines whether the given key is present in the map.
             * @param {*} key The key
             * @returns {boolean} `true` if the key is present
             */
            MapPrototype.has = function(key) {
                var keyValue = this.keyElem.valueToString(this.keyElem.verifyValue(key));
                return (keyValue in this.map);
            };

            return Map;
        })(ProtoBuf, ProtoBuf.Reflect);


        /**
         * Loads a .proto string and returns the Builder.
         * @param {string} proto .proto file contents
         * @param {(ProtoBuf.Builder|string|{root: string, file: string})=} builder Builder to append to. Will create a new one if omitted.
         * @param {(string|{root: string, file: string})=} filename The corresponding file name if known. Must be specified for imports.
         * @return {ProtoBuf.Builder} Builder to create new messages
         * @throws {Error} If the definition cannot be parsed or built
         * @expose
         */
        ProtoBuf.loadProto = function(proto, builder, filename) {
            if (typeof builder === 'string' || (builder && typeof builder["file"] === 'string' && typeof builder["root"] === 'string'))
                filename = builder,
                builder = undefined;
            return ProtoBuf.loadJson(ProtoBuf.DotProto.Parser.parse(proto), builder, filename);
        };

        /**
         * Loads a .proto string and returns the Builder. This is an alias of {@link ProtoBuf.loadProto}.
         * @function
         * @param {string} proto .proto file contents
         * @param {(ProtoBuf.Builder|string)=} builder Builder to append to. Will create a new one if omitted.
         * @param {(string|{root: string, file: string})=} filename The corresponding file name if known. Must be specified for imports.
         * @return {ProtoBuf.Builder} Builder to create new messages
         * @throws {Error} If the definition cannot be parsed or built
         * @expose
         */
        ProtoBuf.protoFromString = ProtoBuf.loadProto; // Legacy

        /**
         * Loads a .proto file and returns the Builder.
         * @param {string|{root: string, file: string}} filename Path to proto file or an object specifying 'file' with
         *  an overridden 'root' path for all imported files.
         * @param {function(?Error, !ProtoBuf.Builder=)=} callback Callback that will receive `null` as the first and
         *  the Builder as its second argument on success, otherwise the error as its first argument. If omitted, the
         *  file will be read synchronously and this function will return the Builder.
         * @param {ProtoBuf.Builder=} builder Builder to append to. Will create a new one if omitted.
         * @return {?ProtoBuf.Builder|undefined} The Builder if synchronous (no callback specified, will be NULL if the
         *   request has failed), else undefined
         * @expose
         */
        ProtoBuf.loadProtoFile = function(filename, callback, builder) {
            if (callback && typeof callback === 'object')
                builder = callback,
                callback = null;
            else if (!callback || typeof callback !== 'function')
                callback = null;
            if (callback)
                return ProtoBuf.Util.fetch(typeof filename === 'string' ? filename : filename["root"]+"/"+filename["file"], function(contents) {
                    if (contents === null) {
                        callback(Error("Failed to fetch file"));
                        return;
                    }
                    try {
                        callback(null, ProtoBuf.loadProto(contents, builder, filename));
                    } catch (e) {
                        callback(e);
                    }
                });
            var contents = ProtoBuf.Util.fetch(typeof filename === 'object' ? filename["root"]+"/"+filename["file"] : filename);
            return contents === null ? null : ProtoBuf.loadProto(contents, builder, filename);
        };

        /**
         * Loads a .proto file and returns the Builder. This is an alias of {@link ProtoBuf.loadProtoFile}.
         * @function
         * @param {string|{root: string, file: string}} filename Path to proto file or an object specifying 'file' with
         *  an overridden 'root' path for all imported files.
         * @param {function(?Error, !ProtoBuf.Builder=)=} callback Callback that will receive `null` as the first and
         *  the Builder as its second argument on success, otherwise the error as its first argument. If omitted, the
         *  file will be read synchronously and this function will return the Builder.
         * @param {ProtoBuf.Builder=} builder Builder to append to. Will create a new one if omitted.
         * @return {!ProtoBuf.Builder|undefined} The Builder if synchronous (no callback specified, will be NULL if the
         *   request has failed), else undefined
         * @expose
         */
        ProtoBuf.protoFromFile = ProtoBuf.loadProtoFile; // Legacy


        /**
         * Constructs a new empty Builder.
         * @param {Object.<string,*>=} options Builder options, defaults to global options set on ProtoBuf
         * @return {!ProtoBuf.Builder} Builder
         * @expose
         */
        ProtoBuf.newBuilder = function(options) {
            options = options || {};
            if (typeof options['convertFieldsToCamelCase'] === 'undefined')
                options['convertFieldsToCamelCase'] = ProtoBuf.convertFieldsToCamelCase;
            if (typeof options['populateAccessors'] === 'undefined')
                options['populateAccessors'] = ProtoBuf.populateAccessors;
            return new ProtoBuf.Builder(options);
        };

        /**
         * Loads a .json definition and returns the Builder.
         * @param {!*|string} json JSON definition
         * @param {(ProtoBuf.Builder|string|{root: string, file: string})=} builder Builder to append to. Will create a new one if omitted.
         * @param {(string|{root: string, file: string})=} filename The corresponding file name if known. Must be specified for imports.
         * @return {ProtoBuf.Builder} Builder to create new messages
         * @throws {Error} If the definition cannot be parsed or built
         * @expose
         */
        ProtoBuf.loadJson = function(json, builder, filename) {
            if (typeof builder === 'string' || (builder && typeof builder["file"] === 'string' && typeof builder["root"] === 'string'))
                filename = builder,
                builder = null;
            if (!builder || typeof builder !== 'object')
                builder = ProtoBuf.newBuilder();
            if (typeof json === 'string')
                json = JSON.parse(json);
            builder["import"](json, filename);
            builder.resolveAll();
            return builder;
        };

        /**
         * Loads a .json file and returns the Builder.
         * @param {string|!{root: string, file: string}} filename Path to json file or an object specifying 'file' with
         *  an overridden 'root' path for all imported files.
         * @param {function(?Error, !ProtoBuf.Builder=)=} callback Callback that will receive `null` as the first and
         *  the Builder as its second argument on success, otherwise the error as its first argument. If omitted, the
         *  file will be read synchronously and this function will return the Builder.
         * @param {ProtoBuf.Builder=} builder Builder to append to. Will create a new one if omitted.
         * @return {?ProtoBuf.Builder|undefined} The Builder if synchronous (no callback specified, will be NULL if the
         *   request has failed), else undefined
         * @expose
         */
        ProtoBuf.loadJsonFile = function(filename, callback, builder) {
            if (callback && typeof callback === 'object')
                builder = callback,
                callback = null;
            else if (!callback || typeof callback !== 'function')
                callback = null;
            if (callback)
                return ProtoBuf.Util.fetch(typeof filename === 'string' ? filename : filename["root"]+"/"+filename["file"], function(contents) {
                    if (contents === null) {
                        callback(Error("Failed to fetch file"));
                        return;
                    }
                    try {
                        callback(null, ProtoBuf.loadJson(JSON.parse(contents), builder, filename));
                    } catch (e) {
                        callback(e);
                    }
                });
            var contents = ProtoBuf.Util.fetch(typeof filename === 'object' ? filename["root"]+"/"+filename["file"] : filename);
            return contents === null ? null : ProtoBuf.loadJson(JSON.parse(contents), builder, filename);
        };

        return ProtoBuf;
    });
    });

    var require$$0$1 = (protobuf && typeof protobuf === 'object' && 'default' in protobuf ? protobuf['default'] : protobuf);

    var message = __commonjs(function (module) {
    module.exports = require$$0$1.newBuilder({})['import']({
        "package": "push_server.messages",
        "options": {
            "objc_class_prefix": "AVIM"
        },
        "messages": [{
            "name": "JsonObjectMessage",
            "fields": [{
                "rule": "required",
                "type": "string",
                "name": "data",
                "id": 1
            }]
        }, {
            "name": "UnreadTuple",
            "fields": [{
                "rule": "required",
                "type": "string",
                "name": "cid",
                "id": 1
            }, {
                "rule": "required",
                "type": "int32",
                "name": "unread",
                "id": 2
            }, {
                "rule": "optional",
                "type": "string",
                "name": "mid",
                "id": 3
            }, {
                "rule": "optional",
                "type": "int64",
                "name": "timestamp",
                "id": 4
            }]
        }, {
            "name": "LogItem",
            "fields": [{
                "rule": "optional",
                "type": "string",
                "name": "from",
                "id": 1
            }, {
                "rule": "optional",
                "type": "string",
                "name": "data",
                "id": 2
            }, {
                "rule": "optional",
                "type": "int64",
                "name": "timestamp",
                "id": 3
            }, {
                "rule": "optional",
                "type": "string",
                "name": "msgId",
                "id": 4
            }, {
                "rule": "optional",
                "type": "int64",
                "name": "ackAt",
                "id": 5
            }]
        }, {
            "name": "LoginCommand",
            "fields": []
        }, {
            "name": "DataCommand",
            "fields": [{
                "rule": "repeated",
                "type": "string",
                "name": "ids",
                "id": 1
            }, {
                "rule": "repeated",
                "type": "JsonObjectMessage",
                "name": "msg",
                "id": 2
            }]
        }, {
            "name": "SessionCommand",
            "fields": [{
                "rule": "optional",
                "type": "int64",
                "name": "t",
                "id": 1
            }, {
                "rule": "optional",
                "type": "string",
                "name": "n",
                "id": 2
            }, {
                "rule": "optional",
                "type": "string",
                "name": "s",
                "id": 3
            }, {
                "rule": "optional",
                "type": "string",
                "name": "ua",
                "id": 4
            }, {
                "rule": "optional",
                "type": "bool",
                "name": "r",
                "id": 5
            }, {
                "rule": "optional",
                "type": "string",
                "name": "tag",
                "id": 6
            }, {
                "rule": "optional",
                "type": "string",
                "name": "deviceId",
                "id": 7
            }, {
                "rule": "repeated",
                "type": "string",
                "name": "sessionPeerIds",
                "id": 8
            }, {
                "rule": "repeated",
                "type": "string",
                "name": "onlineSessionPeerIds",
                "id": 9
            }, {
                "rule": "optional",
                "type": "string",
                "name": "st",
                "id": 10
            }, {
                "rule": "optional",
                "type": "int32",
                "name": "stTtl",
                "id": 11
            }, {
                "rule": "optional",
                "type": "int32",
                "name": "code",
                "id": 12
            }, {
                "rule": "optional",
                "type": "string",
                "name": "reason",
                "id": 13
            }, {
                "rule": "optional",
                "type": "string",
                "name": "deviceToken",
                "id": 14
            }, {
                "rule": "optional",
                "type": "bool",
                "name": "sp",
                "id": 15
            }]
        }, {
            "name": "ErrorCommand",
            "fields": [{
                "rule": "required",
                "type": "int32",
                "name": "code",
                "id": 1
            }, {
                "rule": "required",
                "type": "string",
                "name": "reason",
                "id": 2
            }, {
                "rule": "optional",
                "type": "int32",
                "name": "appCode",
                "id": 3
            }, {
                "rule": "optional",
                "type": "string",
                "name": "detail",
                "id": 4
            }]
        }, {
            "name": "DirectCommand",
            "fields": [{
                "rule": "optional",
                "type": "string",
                "name": "msg",
                "id": 1
            }, {
                "rule": "optional",
                "type": "string",
                "name": "uid",
                "id": 2
            }, {
                "rule": "optional",
                "type": "string",
                "name": "fromPeerId",
                "id": 3
            }, {
                "rule": "optional",
                "type": "int64",
                "name": "timestamp",
                "id": 4
            }, {
                "rule": "optional",
                "type": "bool",
                "name": "offline",
                "id": 5
            }, {
                "rule": "optional",
                "type": "bool",
                "name": "hasMore",
                "id": 6
            }, {
                "rule": "repeated",
                "type": "string",
                "name": "toPeerIds",
                "id": 7
            }, {
                "rule": "optional",
                "type": "bool",
                "name": "r",
                "id": 10
            }, {
                "rule": "optional",
                "type": "string",
                "name": "cid",
                "id": 11
            }, {
                "rule": "optional",
                "type": "string",
                "name": "id",
                "id": 12
            }, {
                "rule": "optional",
                "type": "bool",
                "name": "transient",
                "id": 13
            }, {
                "rule": "optional",
                "type": "string",
                "name": "dt",
                "id": 14
            }, {
                "rule": "optional",
                "type": "string",
                "name": "roomId",
                "id": 15
            }]
        }, {
            "name": "AckCommand",
            "fields": [{
                "rule": "optional",
                "type": "int32",
                "name": "code",
                "id": 1
            }, {
                "rule": "optional",
                "type": "string",
                "name": "reason",
                "id": 2
            }, {
                "rule": "optional",
                "type": "string",
                "name": "mid",
                "id": 3
            }, {
                "rule": "optional",
                "type": "string",
                "name": "cid",
                "id": 4
            }, {
                "rule": "optional",
                "type": "int64",
                "name": "t",
                "id": 5
            }, {
                "rule": "optional",
                "type": "string",
                "name": "uid",
                "id": 6
            }, {
                "rule": "optional",
                "type": "int64",
                "name": "fromts",
                "id": 7
            }, {
                "rule": "optional",
                "type": "int64",
                "name": "tots",
                "id": 8
            }, {
                "rule": "optional",
                "type": "string",
                "name": "type",
                "id": 9
            }, {
                "rule": "repeated",
                "type": "string",
                "name": "ids",
                "id": 10
            }, {
                "rule": "optional",
                "type": "int32",
                "name": "appCode",
                "id": 11
            }]
        }, {
            "name": "UnreadCommand",
            "fields": [{
                "rule": "repeated",
                "type": "UnreadTuple",
                "name": "convs",
                "id": 1
            }]
        }, {
            "name": "ConvCommand",
            "fields": [{
                "rule": "repeated",
                "type": "string",
                "name": "m",
                "id": 1
            }, {
                "rule": "optional",
                "type": "bool",
                "name": "transient",
                "id": 2
            }, {
                "rule": "optional",
                "type": "bool",
                "name": "unique",
                "id": 3
            }, {
                "rule": "optional",
                "type": "string",
                "name": "cid",
                "id": 4
            }, {
                "rule": "optional",
                "type": "string",
                "name": "cdate",
                "id": 5
            }, {
                "rule": "optional",
                "type": "string",
                "name": "initBy",
                "id": 6
            }, {
                "rule": "optional",
                "type": "string",
                "name": "sort",
                "id": 7
            }, {
                "rule": "optional",
                "type": "int32",
                "name": "limit",
                "id": 8
            }, {
                "rule": "optional",
                "type": "int32",
                "name": "skip",
                "id": 9
            }, {
                "rule": "optional",
                "type": "int32",
                "name": "flag",
                "id": 10
            }, {
                "rule": "optional",
                "type": "int32",
                "name": "count",
                "id": 11
            }, {
                "rule": "optional",
                "type": "string",
                "name": "udate",
                "id": 12
            }, {
                "rule": "optional",
                "type": "int64",
                "name": "t",
                "id": 13
            }, {
                "rule": "optional",
                "type": "string",
                "name": "n",
                "id": 14
            }, {
                "rule": "optional",
                "type": "string",
                "name": "s",
                "id": 15
            }, {
                "rule": "optional",
                "type": "JsonObjectMessage",
                "name": "results",
                "id": 100
            }, {
                "rule": "optional",
                "type": "JsonObjectMessage",
                "name": "where",
                "id": 101
            }, {
                "rule": "optional",
                "type": "JsonObjectMessage",
                "name": "attr",
                "id": 103
            }]
        }, {
            "name": "RoomCommand",
            "fields": [{
                "rule": "optional",
                "type": "string",
                "name": "roomId",
                "id": 1
            }, {
                "rule": "optional",
                "type": "string",
                "name": "s",
                "id": 2
            }, {
                "rule": "optional",
                "type": "int64",
                "name": "t",
                "id": 3
            }, {
                "rule": "optional",
                "type": "string",
                "name": "n",
                "id": 4
            }, {
                "rule": "optional",
                "type": "bool",
                "name": "transient",
                "id": 5
            }, {
                "rule": "repeated",
                "type": "string",
                "name": "roomPeerIds",
                "id": 6
            }, {
                "rule": "optional",
                "type": "string",
                "name": "byPeerId",
                "id": 7
            }]
        }, {
            "name": "LogsCommand",
            "fields": [{
                "rule": "optional",
                "type": "string",
                "name": "cid",
                "id": 1
            }, {
                "rule": "optional",
                "type": "int32",
                "name": "l",
                "id": 2
            }, {
                "rule": "optional",
                "type": "int32",
                "name": "limit",
                "id": 3
            }, {
                "rule": "optional",
                "type": "int64",
                "name": "t",
                "id": 4
            }, {
                "rule": "optional",
                "type": "int64",
                "name": "tt",
                "id": 5
            }, {
                "rule": "optional",
                "type": "string",
                "name": "tmid",
                "id": 6
            }, {
                "rule": "optional",
                "type": "string",
                "name": "mid",
                "id": 7
            }, {
                "rule": "optional",
                "type": "string",
                "name": "checksum",
                "id": 8
            }, {
                "rule": "optional",
                "type": "bool",
                "name": "stored",
                "id": 9
            }, {
                "rule": "repeated",
                "type": "LogItem",
                "name": "logs",
                "id": 105
            }]
        }, {
            "name": "RcpCommand",
            "fields": [{
                "rule": "optional",
                "type": "string",
                "name": "id",
                "id": 1
            }, {
                "rule": "optional",
                "type": "string",
                "name": "cid",
                "id": 2
            }, {
                "rule": "optional",
                "type": "int64",
                "name": "t",
                "id": 3
            }]
        }, {
            "name": "ReadTuple",
            "fields": [{
                "rule": "required",
                "type": "string",
                "name": "cid",
                "id": 1
            }, {
                "rule": "optional",
                "type": "int64",
                "name": "timestamp",
                "id": 2
            }, {
                "rule": "optional",
                "type": "string",
                "name": "mid",
                "id": 3
            }]
        }, {
            "name": "ReadCommand",
            "fields": [{
                "rule": "optional",
                "type": "string",
                "name": "cid",
                "id": 1
            }, {
                "rule": "repeated",
                "type": "string",
                "name": "cids",
                "id": 2
            }, {
                "rule": "repeated",
                "type": "ReadTuple",
                "name": "convs",
                "id": 3
            }]
        }, {
            "name": "PresenceCommand",
            "fields": [{
                "rule": "optional",
                "type": "StatusType",
                "name": "status",
                "id": 1
            }, {
                "rule": "repeated",
                "type": "string",
                "name": "sessionPeerIds",
                "id": 2
            }]
        }, {
            "name": "ReportCommand",
            "fields": [{
                "rule": "optional",
                "type": "bool",
                "name": "initiative",
                "id": 1
            }, {
                "rule": "optional",
                "type": "string",
                "name": "type",
                "id": 2
            }, {
                "rule": "optional",
                "type": "string",
                "name": "data",
                "id": 3
            }]
        }, {
            "name": "GenericCommand",
            "fields": [{
                "rule": "required",
                "type": "CommandType",
                "name": "cmd",
                "id": 1
            }, {
                "rule": "optional",
                "type": "OpType",
                "name": "op",
                "id": 2
            }, {
                "rule": "optional",
                "type": "string",
                "name": "appId",
                "id": 3
            }, {
                "rule": "optional",
                "type": "string",
                "name": "peerId",
                "id": 4
            }, {
                "rule": "optional",
                "type": "int32",
                "name": "i",
                "id": 5
            }, {
                "rule": "optional",
                "type": "string",
                "name": "installationId",
                "id": 6
            }, {
                "rule": "optional",
                "type": "LoginCommand",
                "name": "loginMessage",
                "id": 100
            }, {
                "rule": "optional",
                "type": "DataCommand",
                "name": "dataMessage",
                "id": 101
            }, {
                "rule": "optional",
                "type": "SessionCommand",
                "name": "sessionMessage",
                "id": 102
            }, {
                "rule": "optional",
                "type": "ErrorCommand",
                "name": "errorMessage",
                "id": 103
            }, {
                "rule": "optional",
                "type": "DirectCommand",
                "name": "directMessage",
                "id": 104
            }, {
                "rule": "optional",
                "type": "AckCommand",
                "name": "ackMessage",
                "id": 105
            }, {
                "rule": "optional",
                "type": "UnreadCommand",
                "name": "unreadMessage",
                "id": 106
            }, {
                "rule": "optional",
                "type": "ReadCommand",
                "name": "readMessage",
                "id": 107
            }, {
                "rule": "optional",
                "type": "RcpCommand",
                "name": "rcpMessage",
                "id": 108
            }, {
                "rule": "optional",
                "type": "LogsCommand",
                "name": "logsMessage",
                "id": 109
            }, {
                "rule": "optional",
                "type": "ConvCommand",
                "name": "convMessage",
                "id": 110
            }, {
                "rule": "optional",
                "type": "RoomCommand",
                "name": "roomMessage",
                "id": 111
            }, {
                "rule": "optional",
                "type": "PresenceCommand",
                "name": "presenceMessage",
                "id": 112
            }, {
                "rule": "optional",
                "type": "ReportCommand",
                "name": "reportMessage",
                "id": 113
            }]
        }],
        "enums": [{
            "name": "CommandType",
            "values": [{
                "name": "session",
                "id": 0
            }, {
                "name": "conv",
                "id": 1
            }, {
                "name": "direct",
                "id": 2
            }, {
                "name": "ack",
                "id": 3
            }, {
                "name": "rcp",
                "id": 4
            }, {
                "name": "unread",
                "id": 5
            }, {
                "name": "logs",
                "id": 6
            }, {
                "name": "error",
                "id": 7
            }, {
                "name": "login",
                "id": 8
            }, {
                "name": "data",
                "id": 9
            }, {
                "name": "room",
                "id": 10
            }, {
                "name": "read",
                "id": 11
            }, {
                "name": "presence",
                "id": 12
            }, {
                "name": "report",
                "id": 13
            }]
        }, {
            "name": "OpType",
            "values": [{
                "name": "open",
                "id": 1
            }, {
                "name": "add",
                "id": 2
            }, {
                "name": "remove",
                "id": 3
            }, {
                "name": "close",
                "id": 4
            }, {
                "name": "opened",
                "id": 5
            }, {
                "name": "closed",
                "id": 6
            }, {
                "name": "query",
                "id": 7
            }, {
                "name": "query_result",
                "id": 8
            }, {
                "name": "conflict",
                "id": 9
            }, {
                "name": "added",
                "id": 10
            }, {
                "name": "removed",
                "id": 11
            }, {
                "name": "start",
                "id": 30
            }, {
                "name": "started",
                "id": 31
            }, {
                "name": "joined",
                "id": 32
            }, {
                "name": "members_joined",
                "id": 33
            }, {
                "name": "left",
                "id": 39
            }, {
                "name": "members_left",
                "id": 40
            }, {
                "name": "results",
                "id": 42
            }, {
                "name": "count",
                "id": 43
            }, {
                "name": "result",
                "id": 44
            }, {
                "name": "update",
                "id": 45
            }, {
                "name": "updated",
                "id": 46
            }, {
                "name": "mute",
                "id": 47
            }, {
                "name": "unmute",
                "id": 48
            }, {
                "name": "join",
                "id": 80
            }, {
                "name": "invite",
                "id": 81
            }, {
                "name": "leave",
                "id": 82
            }, {
                "name": "kick",
                "id": 83
            }, {
                "name": "reject",
                "id": 84
            }, {
                "name": "invited",
                "id": 85
            }, {
                "name": "kicked",
                "id": 86
            }, {
                "name": "upload",
                "id": 100
            }, {
                "name": "uploaded",
                "id": 101
            }]
        }, {
            "name": "StatusType",
            "values": [{
                "name": "on",
                "id": 1
            }, {
                "name": "off",
                "id": 2
            }]
        }]
    }).build();
    });

    var WebSocketMessage = (message && typeof message === 'object' && 'default' in message ? message['default'] : message);

    function objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function isFunction(x) {
      return typeof x === 'function';
    }

    function isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var _isArray;
    if (!Array.isArray) {
      _isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      _isArray = Array.isArray;
    }

    var isArray = _isArray;

    // Date.now is not available in browsers < IE9
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now#Compatibility
    var now = Date.now || function() { return new Date().getTime(); };

    function F() { }

    var o_create = (Object.create || function (o) {
      if (arguments.length > 1) {
        throw new Error('Second argument not supported');
      }
      if (typeof o !== 'object') {
        throw new TypeError('Argument must be an object');
      }
      F.prototype = o;
      return new F();
    });

    function indexOf(callbacks, callback) {
      for (var i=0, l=callbacks.length; i<l; i++) {
        if (callbacks[i] === callback) { return i; }
      }

      return -1;
    }

    function callbacksFor(object) {
      var callbacks = object._promiseCallbacks;

      if (!callbacks) {
        callbacks = object._promiseCallbacks = {};
      }

      return callbacks;
    }

    /**
      @class RSVP.EventTarget
    */
    var EventTarget = {

      /**
        `RSVP.EventTarget.mixin` extends an object with EventTarget methods. For
        Example:

        ```javascript
        var object = {};

        RSVP.EventTarget.mixin(object);

        object.on('finished', function(event) {
          // handle event
        });

        object.trigger('finished', { detail: value });
        ```

        `EventTarget.mixin` also works with prototypes:

        ```javascript
        var Person = function() {};
        RSVP.EventTarget.mixin(Person.prototype);

        var yehuda = new Person();
        var tom = new Person();

        yehuda.on('poke', function(event) {
          console.log('Yehuda says OW');
        });

        tom.on('poke', function(event) {
          console.log('Tom says OW');
        });

        yehuda.trigger('poke');
        tom.trigger('poke');
        ```

        @method mixin
        @for RSVP.EventTarget
        @private
        @param {Object} object object to extend with EventTarget methods
      */
      'mixin': function(object) {
        object['on']      = this['on'];
        object['off']     = this['off'];
        object['trigger'] = this['trigger'];
        object._promiseCallbacks = undefined;
        return object;
      },

      /**
        Registers a callback to be executed when `eventName` is triggered

        ```javascript
        object.on('event', function(eventInfo){
          // handle the event
        });

        object.trigger('event');
        ```

        @method on
        @for RSVP.EventTarget
        @private
        @param {String} eventName name of the event to listen for
        @param {Function} callback function to be called when the event is triggered.
      */
      'on': function(eventName, callback) {
        if (typeof callback !== 'function') {
          throw new TypeError('Callback must be a function');
        }

        var allCallbacks = callbacksFor(this), callbacks;

        callbacks = allCallbacks[eventName];

        if (!callbacks) {
          callbacks = allCallbacks[eventName] = [];
        }

        if (indexOf(callbacks, callback) === -1) {
          callbacks.push(callback);
        }
      },

      /**
        You can use `off` to stop firing a particular callback for an event:

        ```javascript
        function doStuff() { // do stuff! }
        object.on('stuff', doStuff);

        object.trigger('stuff'); // doStuff will be called

        // Unregister ONLY the doStuff callback
        object.off('stuff', doStuff);
        object.trigger('stuff'); // doStuff will NOT be called
        ```

        If you don't pass a `callback` argument to `off`, ALL callbacks for the
        event will not be executed when the event fires. For example:

        ```javascript
        var callback1 = function(){};
        var callback2 = function(){};

        object.on('stuff', callback1);
        object.on('stuff', callback2);

        object.trigger('stuff'); // callback1 and callback2 will be executed.

        object.off('stuff');
        object.trigger('stuff'); // callback1 and callback2 will not be executed!
        ```

        @method off
        @for RSVP.EventTarget
        @private
        @param {String} eventName event to stop listening to
        @param {Function} callback optional argument. If given, only the function
        given will be removed from the event's callback queue. If no `callback`
        argument is given, all callbacks will be removed from the event's callback
        queue.
      */
      'off': function(eventName, callback) {
        var allCallbacks = callbacksFor(this), callbacks, index;

        if (!callback) {
          allCallbacks[eventName] = [];
          return;
        }

        callbacks = allCallbacks[eventName];

        index = indexOf(callbacks, callback);

        if (index !== -1) { callbacks.splice(index, 1); }
      },

      /**
        Use `trigger` to fire custom events. For example:

        ```javascript
        object.on('foo', function(){
          console.log('foo event happened!');
        });
        object.trigger('foo');
        // 'foo event happened!' logged to the console
        ```

        You can also pass a value as a second argument to `trigger` that will be
        passed as an argument to all event listeners for the event:

        ```javascript
        object.on('foo', function(value){
          console.log(value.name);
        });

        object.trigger('foo', { name: 'bar' });
        // 'bar' logged to the console
        ```

        @method trigger
        @for RSVP.EventTarget
        @private
        @param {String} eventName name of the event to be triggered
        @param {*} options optional value to be passed to any event handlers for
        the given `eventName`
      */
      'trigger': function(eventName, options, label) {
        var allCallbacks = callbacksFor(this), callbacks, callback;

        if (callbacks = allCallbacks[eventName]) {
          // Don't cache the callbacks.length since it may grow
          for (var i=0; i<callbacks.length; i++) {
            callback = callbacks[i];

            callback(options, label);
          }
        }
      }
    };

    var config = {
      instrument: false
    };

    EventTarget['mixin'](config);

    function configure(name, value) {
      if (name === 'onerror') {
        // handle for legacy users that expect the actual
        // error to be passed to their function added via
        // `RSVP.configure('onerror', someFunctionHere);`
        config['on']('error', value);
        return;
      }

      if (arguments.length === 2) {
        config[name] = value;
      } else {
        return config[name];
      }
    }

    var queue$1 = [];

    function scheduleFlush$1() {
      setTimeout(function() {
        var entry;
        for (var i = 0; i < queue$1.length; i++) {
          entry = queue$1[i];

          var payload = entry.payload;

          payload.guid = payload.key + payload.id;
          payload.childGuid = payload.key + payload.childId;
          if (payload.error) {
            payload.stack = payload.error.stack;
          }

          config['trigger'](entry.name, entry.payload);
        }
        queue$1.length = 0;
      }, 50);
    }

    function instrument(eventName, promise, child) {
      if (1 === queue$1.push({
        name: eventName,
        payload: {
          key: promise._guidKey,
          id:  promise._id,
          eventName: eventName,
          detail: promise._result,
          childId: child && child._id,
          label: promise._label,
          timeStamp: now(),
          error: config["instrument-with-stack"] ? new Error(promise._label) : null
        }})) {
          scheduleFlush$1();
        }
      }

    function  withOwnPromise() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function noop() {}

    var PENDING   = void 0;
    var FULFILLED = 1;
    var REJECTED  = 2;

    var GET_THEN_ERROR$1 = new ErrorObject();

    function getThen$1(promise) {
      try {
        return promise.then;
      } catch(error) {
        GET_THEN_ERROR$1.error = error;
        return GET_THEN_ERROR$1;
      }
    }

    function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function handleForeignThenable(promise, thenable, then) {
      config.async(function(promise) {
        var sealed = false;
        var error = tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            resolve$1(promise, value);
          } else {
            fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          reject$1(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          reject$1(promise, error);
        }
      }, promise);
    }

    function handleOwnThenable(promise, thenable) {
      if (thenable._state === FULFILLED) {
        fulfill(promise, thenable._result);
      } else if (thenable._state === REJECTED) {
        thenable._onError = null;
        reject$1(promise, thenable._result);
      } else {
        subscribe(thenable, undefined, function(value) {
          if (thenable !== value) {
            resolve$1(promise, value);
          } else {
            fulfill(promise, value);
          }
        }, function(reason) {
          reject$1(promise, reason);
        });
      }
    }

    function handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise.constructor) {
        handleOwnThenable(promise, maybeThenable);
      } else {
        var then = getThen$1(maybeThenable);

        if (then === GET_THEN_ERROR$1) {
          reject$1(promise, GET_THEN_ERROR$1.error);
        } else if (then === undefined) {
          fulfill(promise, maybeThenable);
        } else if (isFunction(then)) {
          handleForeignThenable(promise, maybeThenable, then);
        } else {
          fulfill(promise, maybeThenable);
        }
      }
    }

    function resolve$1(promise, value) {
      if (promise === value) {
        fulfill(promise, value);
      } else if (objectOrFunction(value)) {
        handleMaybeThenable(promise, value);
      } else {
        fulfill(promise, value);
      }
    }

    function publishRejection(promise) {
      if (promise._onError) {
        promise._onError(promise._result);
      }

      publish(promise);
    }

    function fulfill(promise, value) {
      if (promise._state !== PENDING) { return; }

      promise._result = value;
      promise._state = FULFILLED;

      if (promise._subscribers.length === 0) {
        if (config.instrument) {
          instrument('fulfilled', promise);
        }
      } else {
        config.async(publish, promise);
      }
    }

    function reject$1(promise, reason) {
      if (promise._state !== PENDING) { return; }
      promise._state = REJECTED;
      promise._result = reason;
      config.async(publishRejection, promise);
    }

    function subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onError = null;

      subscribers[length] = child;
      subscribers[length + FULFILLED] = onFulfillment;
      subscribers[length + REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        config.async(publish, parent);
      }
    }

    function publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (config.instrument) {
        instrument(settled === FULFILLED ? 'fulfilled' : 'rejected', promise);
      }

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function ErrorObject() {
      this.error = null;
    }

    var TRY_CATCH_ERROR = new ErrorObject();

    function tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        TRY_CATCH_ERROR.error = e;
        return TRY_CATCH_ERROR;
      }
    }

    function invokeCallback(settled, promise, callback, detail) {
      var hasCallback = isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = tryCatch(callback, detail);

        if (value === TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          reject$1(promise, withOwnPromise());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        resolve$1(promise, value);
      } else if (failed) {
        reject$1(promise, error);
      } else if (settled === FULFILLED) {
        fulfill(promise, value);
      } else if (settled === REJECTED) {
        reject$1(promise, value);
      }
    }

    function initializePromise(promise, resolver) {
      var resolved = false;
      try {
        resolver(function resolvePromise(value){
          if (resolved) { return; }
          resolved = true;
          resolve$1(promise, value);
        }, function rejectPromise(reason) {
          if (resolved) { return; }
          resolved = true;
          reject$1(promise, reason);
        });
      } catch(e) {
        reject$1(promise, e);
      }
    }

    /**
      `RSVP.Promise.resolve` returns a promise that will become resolved with the
      passed `value`. It is shorthand for the following:

      ```javascript
      var promise = new RSVP.Promise(function(resolve, reject){
        resolve(1);
      });

      promise.then(function(value){
        // value === 1
      });
      ```

      Instead of writing the above, your code now simply becomes the following:

      ```javascript
      var promise = RSVP.Promise.resolve(1);

      promise.then(function(value){
        // value === 1
      });
      ```

      @method resolve
      @static
      @param {*} object value that the returned promise will be resolved with
      @param {String} label optional string for identifying the returned promise.
      Useful for tooling.
      @return {Promise} a promise that will become fulfilled with the given
      `value`
    */
    function resolve$2(object, label) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(noop, label);
      resolve$1(promise, object);
      return promise;
    }

    function makeSettledResult(state, position, value) {
      if (state === FULFILLED) {
        return {
          state: 'fulfilled',
          value: value
        };
      } else {
         return {
          state: 'rejected',
          reason: value
        };
      }
    }

    function Enumerator(Constructor, input, abortOnReject, label) {
      var enumerator = this;

      enumerator._instanceConstructor = Constructor;
      enumerator.promise = new Constructor(noop, label);
      enumerator._abortOnReject = abortOnReject;

      if (enumerator._validateInput(input)) {
        enumerator._input     = input;
        enumerator.length     = input.length;
        enumerator._remaining = input.length;

        enumerator._init();

        if (enumerator.length === 0) {
          fulfill(enumerator.promise, enumerator._result);
        } else {
          enumerator.length = enumerator.length || 0;
          enumerator._enumerate();
          if (enumerator._remaining === 0) {
            fulfill(enumerator.promise, enumerator._result);
          }
        }
      } else {
        reject$1(enumerator.promise, enumerator._validationError());
      }
    }

    Enumerator.prototype._validateInput = function(input) {
      return isArray(input);
    };

    Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    Enumerator.prototype._enumerate = function() {
      var enumerator = this;
      var length     = enumerator.length;
      var promise    = enumerator.promise;
      var input      = enumerator._input;

      for (var i = 0; promise._state === PENDING && i < length; i++) {
        enumerator._eachEntry(input[i], i);
      }
    };

    Enumerator.prototype._eachEntry = function(entry, i) {
      var enumerator = this;
      var c = enumerator._instanceConstructor;
      if (isMaybeThenable(entry)) {
        if (entry.constructor === c && entry._state !== PENDING) {
          entry._onError = null;
          enumerator._settledAt(entry._state, i, entry._result);
        } else {
          enumerator._willSettleAt(c.resolve(entry), i);
        }
      } else {
        enumerator._remaining--;
        enumerator._result[i] = enumerator._makeResult(FULFILLED, i, entry);
      }
    };

    Enumerator.prototype._settledAt = function(state, i, value) {
      var enumerator = this;
      var promise = enumerator.promise;

      if (promise._state === PENDING) {
        enumerator._remaining--;

        if (enumerator._abortOnReject && state === REJECTED) {
          reject$1(promise, value);
        } else {
          enumerator._result[i] = enumerator._makeResult(state, i, value);
        }
      }

      if (enumerator._remaining === 0) {
        fulfill(promise, enumerator._result);
      }
    };

    Enumerator.prototype._makeResult = function(state, i, value) {
      return value;
    };

    Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      subscribe(promise, undefined, function(value) {
        enumerator._settledAt(FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(REJECTED, i, reason);
      });
    };

    /**
      `RSVP.Promise.all` accepts an array of promises, and returns a new promise which
      is fulfilled with an array of fulfillment values for the passed promises, or
      rejected with the reason of the first passed promise to be rejected. It casts all
      elements of the passed iterable to promises as it runs this algorithm.

      Example:

      ```javascript
      var promise1 = RSVP.resolve(1);
      var promise2 = RSVP.resolve(2);
      var promise3 = RSVP.resolve(3);
      var promises = [ promise1, promise2, promise3 ];

      RSVP.Promise.all(promises).then(function(array){
        // The array here would be [ 1, 2, 3 ];
      });
      ```

      If any of the `promises` given to `RSVP.all` are rejected, the first promise
      that is rejected will be given as an argument to the returned promises's
      rejection handler. For example:

      Example:

      ```javascript
      var promise1 = RSVP.resolve(1);
      var promise2 = RSVP.reject(new Error("2"));
      var promise3 = RSVP.reject(new Error("3"));
      var promises = [ promise1, promise2, promise3 ];

      RSVP.Promise.all(promises).then(function(array){
        // Code here never runs because there are rejected promises!
      }, function(error) {
        // error.message === "2"
      });
      ```

      @method all
      @static
      @param {Array} entries array of promises
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise} promise that is fulfilled when all `promises` have been
      fulfilled, or rejected if any of them become rejected.
      @static
    */
    function all$1(entries, label) {
      return new Enumerator(this, entries, true /* abort on reject */, label).promise;
    }

    /**
      `RSVP.Promise.race` returns a new promise which is settled in the same way as the
      first passed promise to settle.

      Example:

      ```javascript
      var promise1 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          resolve('promise 1');
        }, 200);
      });

      var promise2 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          resolve('promise 2');
        }, 100);
      });

      RSVP.Promise.race([promise1, promise2]).then(function(result){
        // result === 'promise 2' because it was resolved before promise1
        // was resolved.
      });
      ```

      `RSVP.Promise.race` is deterministic in that only the state of the first
      settled promise matters. For example, even if other promises given to the
      `promises` array argument are resolved, but the first settled promise has
      become rejected before the other promises became fulfilled, the returned
      promise will become rejected:

      ```javascript
      var promise1 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          resolve('promise 1');
        }, 200);
      });

      var promise2 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          reject(new Error('promise 2'));
        }, 100);
      });

      RSVP.Promise.race([promise1, promise2]).then(function(result){
        // Code here never runs
      }, function(reason){
        // reason.message === 'promise 2' because promise 2 became rejected before
        // promise 1 became fulfilled
      });
      ```

      An example real-world use case is implementing timeouts:

      ```javascript
      RSVP.Promise.race([ajax('foo.json'), timeout(5000)])
      ```

      @method race
      @static
      @param {Array} entries array of promises to observe
      @param {String} label optional string for describing the promise returned.
      Useful for tooling.
      @return {Promise} a promise which settles in the same way as the first passed
      promise to settle.
    */
    function race$1(entries, label) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor(noop, label);

      if (!isArray(entries)) {
        reject$1(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        resolve$1(promise, value);
      }

      function onRejection(reason) {
        reject$1(promise, reason);
      }

      for (var i = 0; promise._state === PENDING && i < length; i++) {
        subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    }

    /**
      `RSVP.Promise.reject` returns a promise rejected with the passed `reason`.
      It is shorthand for the following:

      ```javascript
      var promise = new RSVP.Promise(function(resolve, reject){
        reject(new Error('WHOOPS'));
      });

      promise.then(function(value){
        // Code here doesn't run because the promise is rejected!
      }, function(reason){
        // reason.message === 'WHOOPS'
      });
      ```

      Instead of writing the above, your code now simply becomes the following:

      ```javascript
      var promise = RSVP.Promise.reject(new Error('WHOOPS'));

      promise.then(function(value){
        // Code here doesn't run because the promise is rejected!
      }, function(reason){
        // reason.message === 'WHOOPS'
      });
      ```

      @method reject
      @static
      @param {*} reason value that the returned promise will be rejected with.
      @param {String} label optional string for identifying the returned promise.
      Useful for tooling.
      @return {Promise} a promise rejected with the given `reason`.
    */
    function reject$2(reason, label) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(noop, label);
      reject$1(promise, reason);
      return promise;
    }

    var guidKey = 'rsvp_' + now() + '-';
    var counter = 0;

    function needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise’s eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class RSVP.Promise
      @param {function} resolver
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @constructor
    */
    function Promise(resolver, label) {
      var promise = this;

      promise._id = counter++;
      promise._label = label;
      promise._state = undefined;
      promise._result = undefined;
      promise._subscribers = [];

      if (config.instrument) {
        instrument('created', promise);
      }

      if (noop !== resolver) {
        if (!isFunction(resolver)) {
          needsResolver();
        }

        if (!(promise instanceof Promise)) {
          needsNew();
        }

        initializePromise(promise, resolver);
      }
    }

    Promise.cast = resolve$2; // deprecated
    Promise.all = all$1;
    Promise.race = race$1;
    Promise.resolve = resolve$2;
    Promise.reject = reject$2;

    Promise.prototype = {
      constructor: Promise,

      _guidKey: guidKey,

      _onError: function (reason) {
        var promise = this;
        config.after(function() {
          if (promise._onError) {
            config['trigger']('error', reason, promise._label);
          }
        });
      },

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfillment
      @param {Function} onRejection
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      then: function(onFulfillment, onRejection, label) {
        var parent = this;
        var state = parent._state;

        if (state === FULFILLED && !onFulfillment || state === REJECTED && !onRejection) {
          if (config.instrument) {
            instrument('chained', parent, parent);
          }
          return parent;
        }

        parent._onError = null;

        var child = new parent.constructor(noop, label);
        var result = parent._result;

        if (config.instrument) {
          instrument('chained', parent, child);
        }

        if (state) {
          var callback = arguments[state - 1];
          config.async(function(){
            invokeCallback(state, child, callback, result);
          });
        } else {
          subscribe(parent, child, onFulfillment, onRejection);
        }

        return child;
      },

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection, label) {
        return this.then(undefined, onRejection, label);
      },

    /**
      `finally` will be invoked regardless of the promise's fate just as native
      try/catch/finally behaves

      Synchronous example:

      ```js
      findAuthor() {
        if (Math.random() > 0.5) {
          throw new Error();
        }
        return new Author();
      }

      try {
        return findAuthor(); // succeed or fail
      } catch(error) {
        return findOtherAuther();
      } finally {
        // always runs
        // doesn't affect the return value
      }
      ```

      Asynchronous example:

      ```js
      findAuthor().catch(function(reason){
        return findOtherAuther();
      }).finally(function(){
        // author was either found, or not
      });
      ```

      @method finally
      @param {Function} callback
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      'finally': function(callback, label) {
        var promise = this;
        var constructor = promise.constructor;

        return promise.then(function(value) {
          return constructor.resolve(callback()).then(function(){
            return value;
          });
        }, function(reason) {
          return constructor.resolve(callback()).then(function(){
            throw reason;
          });
        }, label);
      }
    };

    var index$2 = __commonjs(function (module) {
    /**
     * Reduce `arr` with `fn`.
     *
     * @param {Array} arr
     * @param {Function} fn
     * @param {Mixed} initial
     *
     * TODO: combatible error handling?
     */

    module.exports = function(arr, fn, initial){  
      var idx = 0;
      var len = arr.length;
      var curr = arguments.length == 3
        ? initial
        : arr[idx++];

      while (idx < len) {
        curr = fn.call(null, curr, arr[idx], ++idx, arr);
      }
      
      return curr;
    };
    });

    var require$$0$4 = (index$2 && typeof index$2 === 'object' && 'default' in index$2 ? index$2['default'] : index$2);

    var index$3 = __commonjs(function (module) {
    /**
     * Expose `Emitter`.
     */

    module.exports = Emitter;

    /**
     * Initialize a new `Emitter`.
     *
     * @api public
     */

    function Emitter(obj) {
      if (obj) return mixin(obj);
    };

    /**
     * Mixin the emitter properties.
     *
     * @param {Object} obj
     * @return {Object}
     * @api private
     */

    function mixin(obj) {
      for (var key in Emitter.prototype) {
        obj[key] = Emitter.prototype[key];
      }
      return obj;
    }

    /**
     * Listen on the given `event` with `fn`.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.on =
    Emitter.prototype.addEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};
      (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
        .push(fn);
      return this;
    };

    /**
     * Adds an `event` listener that will be invoked a single
     * time then automatically removed.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.once = function(event, fn){
      function on() {
        this.off(event, on);
        fn.apply(this, arguments);
      }

      on.fn = fn;
      this.on(event, on);
      return this;
    };

    /**
     * Remove the given callback for `event` or all
     * registered callbacks.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.off =
    Emitter.prototype.removeListener =
    Emitter.prototype.removeAllListeners =
    Emitter.prototype.removeEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};

      // all
      if (0 == arguments.length) {
        this._callbacks = {};
        return this;
      }

      // specific event
      var callbacks = this._callbacks['$' + event];
      if (!callbacks) return this;

      // remove all handlers
      if (1 == arguments.length) {
        delete this._callbacks['$' + event];
        return this;
      }

      // remove specific handler
      var cb;
      for (var i = 0; i < callbacks.length; i++) {
        cb = callbacks[i];
        if (cb === fn || cb.fn === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }
      return this;
    };

    /**
     * Emit `event` with the given args.
     *
     * @param {String} event
     * @param {Mixed} ...
     * @return {Emitter}
     */

    Emitter.prototype.emit = function(event){
      this._callbacks = this._callbacks || {};
      var args = [].slice.call(arguments, 1)
        , callbacks = this._callbacks['$' + event];

      if (callbacks) {
        callbacks = callbacks.slice(0);
        for (var i = 0, len = callbacks.length; i < len; ++i) {
          callbacks[i].apply(this, args);
        }
      }

      return this;
    };

    /**
     * Return array of callbacks for `event`.
     *
     * @param {String} event
     * @return {Array}
     * @api public
     */

    Emitter.prototype.listeners = function(event){
      this._callbacks = this._callbacks || {};
      return this._callbacks['$' + event] || [];
    };

    /**
     * Check if this emitter has `event` handlers.
     *
     * @param {String} event
     * @return {Boolean}
     * @api public
     */

    Emitter.prototype.hasListeners = function(event){
      return !! this.listeners(event).length;
    };
    });

    var require$$1$2 = (index$3 && typeof index$3 === 'object' && 'default' in index$3 ? index$3['default'] : index$3);

    var client = __commonjs(function (module, exports, global) {
    /**
     * Module dependencies.
     */

    var Emitter = require$$1$2;
    var reduce = require$$0$4;

    /**
     * Root reference for iframes.
     */

    var root;
    if (typeof window !== 'undefined') { // Browser window
      root = window;
    } else if (typeof self !== 'undefined') { // Web Worker
      root = self;
    } else { // Other environments
      root = __commonjs_global;
    }

    /**
     * Noop.
     */

    function noop(){};

    /**
     * Check if `obj` is a host object,
     * we don't want to serialize these :)
     *
     * TODO: future proof, move to compoent land
     *
     * @param {Object} obj
     * @return {Boolean}
     * @api private
     */

    function isHost(obj) {
      var str = {}.toString.call(obj);

      switch (str) {
        case '[object File]':
        case '[object Blob]':
        case '[object FormData]':
          return true;
        default:
          return false;
      }
    }

    /**
     * Determine XHR.
     */

    request.getXHR = function () {
      if (root.XMLHttpRequest
          && (!root.location || 'file:' != root.location.protocol
              || !root.ActiveXObject)) {
        return new XMLHttpRequest;
      } else {
        try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
        try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
        try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
        try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
      }
      return false;
    };

    /**
     * Removes leading and trailing whitespace, added to support IE.
     *
     * @param {String} s
     * @return {String}
     * @api private
     */

    var trim = ''.trim
      ? function(s) { return s.trim(); }
      : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

    /**
     * Check if `obj` is an object.
     *
     * @param {Object} obj
     * @return {Boolean}
     * @api private
     */

    function isObject(obj) {
      return obj === Object(obj);
    }

    /**
     * Serialize the given `obj`.
     *
     * @param {Object} obj
     * @return {String}
     * @api private
     */

    function serialize(obj) {
      if (!isObject(obj)) return obj;
      var pairs = [];
      for (var key in obj) {
        if (null != obj[key]) {
          pushEncodedKeyValuePair(pairs, key, obj[key]);
            }
          }
      return pairs.join('&');
    }

    /**
     * Helps 'serialize' with serializing arrays.
     * Mutates the pairs array.
     *
     * @param {Array} pairs
     * @param {String} key
     * @param {Mixed} val
     */

    function pushEncodedKeyValuePair(pairs, key, val) {
      if (Array.isArray(val)) {
        return val.forEach(function(v) {
          pushEncodedKeyValuePair(pairs, key, v);
        });
      }
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(val));
    }

    /**
     * Expose serialization method.
     */

     request.serializeObject = serialize;

     /**
      * Parse the given x-www-form-urlencoded `str`.
      *
      * @param {String} str
      * @return {Object}
      * @api private
      */

    function parseString(str) {
      var obj = {};
      var pairs = str.split('&');
      var parts;
      var pair;

      for (var i = 0, len = pairs.length; i < len; ++i) {
        pair = pairs[i];
        parts = pair.split('=');
        obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
      }

      return obj;
    }

    /**
     * Expose parser.
     */

    request.parseString = parseString;

    /**
     * Default MIME type map.
     *
     *     superagent.types.xml = 'application/xml';
     *
     */

    request.types = {
      html: 'text/html',
      json: 'application/json',
      xml: 'application/xml',
      urlencoded: 'application/x-www-form-urlencoded',
      'form': 'application/x-www-form-urlencoded',
      'form-data': 'application/x-www-form-urlencoded'
    };

    /**
     * Default serialization map.
     *
     *     superagent.serialize['application/xml'] = function(obj){
     *       return 'generated xml here';
     *     };
     *
     */

     request.serialize = {
       'application/x-www-form-urlencoded': serialize,
       'application/json': JSON.stringify
     };

     /**
      * Default parsers.
      *
      *     superagent.parse['application/xml'] = function(str){
      *       return { object parsed from str };
      *     };
      *
      */

    request.parse = {
      'application/x-www-form-urlencoded': parseString,
      'application/json': JSON.parse
    };

    /**
     * Parse the given header `str` into
     * an object containing the mapped fields.
     *
     * @param {String} str
     * @return {Object}
     * @api private
     */

    function parseHeader(str) {
      var lines = str.split(/\r?\n/);
      var fields = {};
      var index;
      var line;
      var field;
      var val;

      lines.pop(); // trailing CRLF

      for (var i = 0, len = lines.length; i < len; ++i) {
        line = lines[i];
        index = line.indexOf(':');
        field = line.slice(0, index).toLowerCase();
        val = trim(line.slice(index + 1));
        fields[field] = val;
      }

      return fields;
    }

    /**
     * Check if `mime` is json or has +json structured syntax suffix.
     *
     * @param {String} mime
     * @return {Boolean}
     * @api private
     */

    function isJSON(mime) {
      return /[\/+]json\b/.test(mime);
    }

    /**
     * Return the mime type for the given `str`.
     *
     * @param {String} str
     * @return {String}
     * @api private
     */

    function type(str){
      return str.split(/ *; */).shift();
    };

    /**
     * Return header field parameters.
     *
     * @param {String} str
     * @return {Object}
     * @api private
     */

    function params(str){
      return reduce(str.split(/ *; */), function(obj, str){
        var parts = str.split(/ *= */)
          , key = parts.shift()
          , val = parts.shift();

        if (key && val) obj[key] = val;
        return obj;
      }, {});
    };

    /**
     * Initialize a new `Response` with the given `xhr`.
     *
     *  - set flags (.ok, .error, etc)
     *  - parse header
     *
     * Examples:
     *
     *  Aliasing `superagent` as `request` is nice:
     *
     *      request = superagent;
     *
     *  We can use the promise-like API, or pass callbacks:
     *
     *      request.get('/').end(function(res){});
     *      request.get('/', function(res){});
     *
     *  Sending data can be chained:
     *
     *      request
     *        .post('/user')
     *        .send({ name: 'tj' })
     *        .end(function(res){});
     *
     *  Or passed to `.send()`:
     *
     *      request
     *        .post('/user')
     *        .send({ name: 'tj' }, function(res){});
     *
     *  Or passed to `.post()`:
     *
     *      request
     *        .post('/user', { name: 'tj' })
     *        .end(function(res){});
     *
     * Or further reduced to a single call for simple cases:
     *
     *      request
     *        .post('/user', { name: 'tj' }, function(res){});
     *
     * @param {XMLHTTPRequest} xhr
     * @param {Object} options
     * @api private
     */

    function Response(req, options) {
      options = options || {};
      this.req = req;
      this.xhr = this.req.xhr;
      // responseText is accessible only if responseType is '' or 'text' and on older browsers
      this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
         ? this.xhr.responseText
         : null;
      this.statusText = this.req.xhr.statusText;
      this.setStatusProperties(this.xhr.status);
      this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
      // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
      // getResponseHeader still works. so we get content-type even if getting
      // other headers fails.
      this.header['content-type'] = this.xhr.getResponseHeader('content-type');
      this.setHeaderProperties(this.header);
      this.body = this.req.method != 'HEAD'
        ? this.parseBody(this.text ? this.text : this.xhr.response)
        : null;
    }

    /**
     * Get case-insensitive `field` value.
     *
     * @param {String} field
     * @return {String}
     * @api public
     */

    Response.prototype.get = function(field){
      return this.header[field.toLowerCase()];
    };

    /**
     * Set header related properties:
     *
     *   - `.type` the content type without params
     *
     * A response of "Content-Type: text/plain; charset=utf-8"
     * will provide you with a `.type` of "text/plain".
     *
     * @param {Object} header
     * @api private
     */

    Response.prototype.setHeaderProperties = function(header){
      // content-type
      var ct = this.header['content-type'] || '';
      this.type = type(ct);

      // params
      var obj = params(ct);
      for (var key in obj) this[key] = obj[key];
    };

    /**
     * Parse the given body `str`.
     *
     * Used for auto-parsing of bodies. Parsers
     * are defined on the `superagent.parse` object.
     *
     * @param {String} str
     * @return {Mixed}
     * @api private
     */

    Response.prototype.parseBody = function(str){
      var parse = request.parse[this.type];
      return parse && str && (str.length || str instanceof Object)
        ? parse(str)
        : null;
    };

    /**
     * Set flags such as `.ok` based on `status`.
     *
     * For example a 2xx response will give you a `.ok` of __true__
     * whereas 5xx will be __false__ and `.error` will be __true__. The
     * `.clientError` and `.serverError` are also available to be more
     * specific, and `.statusType` is the class of error ranging from 1..5
     * sometimes useful for mapping respond colors etc.
     *
     * "sugar" properties are also defined for common cases. Currently providing:
     *
     *   - .noContent
     *   - .badRequest
     *   - .unauthorized
     *   - .notAcceptable
     *   - .notFound
     *
     * @param {Number} status
     * @api private
     */

    Response.prototype.setStatusProperties = function(status){
      // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
      if (status === 1223) {
        status = 204;
      }

      var type = status / 100 | 0;

      // status / class
      this.status = this.statusCode = status;
      this.statusType = type;

      // basics
      this.info = 1 == type;
      this.ok = 2 == type;
      this.clientError = 4 == type;
      this.serverError = 5 == type;
      this.error = (4 == type || 5 == type)
        ? this.toError()
        : false;

      // sugar
      this.accepted = 202 == status;
      this.noContent = 204 == status;
      this.badRequest = 400 == status;
      this.unauthorized = 401 == status;
      this.notAcceptable = 406 == status;
      this.notFound = 404 == status;
      this.forbidden = 403 == status;
    };

    /**
     * Return an `Error` representative of this response.
     *
     * @return {Error}
     * @api public
     */

    Response.prototype.toError = function(){
      var req = this.req;
      var method = req.method;
      var url = req.url;

      var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
      var err = new Error(msg);
      err.status = this.status;
      err.method = method;
      err.url = url;

      return err;
    };

    /**
     * Expose `Response`.
     */

    request.Response = Response;

    /**
     * Initialize a new `Request` with the given `method` and `url`.
     *
     * @param {String} method
     * @param {String} url
     * @api public
     */

    function Request(method, url) {
      var self = this;
      Emitter.call(this);
      this._query = this._query || [];
      this.method = method;
      this.url = url;
      this.header = {};
      this._header = {};
      this.on('end', function(){
        var err = null;
        var res = null;

        try {
          res = new Response(self);
        } catch(e) {
          err = new Error('Parser is unable to parse the response');
          err.parse = true;
          err.original = e;
          // issue #675: return the raw response if the response parsing fails
          err.rawResponse = self.xhr && self.xhr.responseText ? self.xhr.responseText : null;
          return self.callback(err);
        }

        self.emit('response', res);

        if (err) {
          return self.callback(err, res);
        }

        if (res.status >= 200 && res.status < 300) {
          return self.callback(err, res);
        }

        var new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
        new_err.original = err;
        new_err.response = res;
        new_err.status = res.status;

        self.callback(new_err, res);
      });
    }

    /**
     * Mixin `Emitter`.
     */

    Emitter(Request.prototype);

    /**
     * Allow for extension
     */

    Request.prototype.use = function(fn) {
      fn(this);
      return this;
    }

    /**
     * Set timeout to `ms`.
     *
     * @param {Number} ms
     * @return {Request} for chaining
     * @api public
     */

    Request.prototype.timeout = function(ms){
      this._timeout = ms;
      return this;
    };

    /**
     * Clear previous timeout.
     *
     * @return {Request} for chaining
     * @api public
     */

    Request.prototype.clearTimeout = function(){
      this._timeout = 0;
      clearTimeout(this._timer);
      return this;
    };

    /**
     * Abort the request, and clear potential timeout.
     *
     * @return {Request}
     * @api public
     */

    Request.prototype.abort = function(){
      if (this.aborted) return;
      this.aborted = true;
      this.xhr.abort();
      this.clearTimeout();
      this.emit('abort');
      return this;
    };

    /**
     * Set header `field` to `val`, or multiple fields with one object.
     *
     * Examples:
     *
     *      req.get('/')
     *        .set('Accept', 'application/json')
     *        .set('X-API-Key', 'foobar')
     *        .end(callback);
     *
     *      req.get('/')
     *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
     *        .end(callback);
     *
     * @param {String|Object} field
     * @param {String} val
     * @return {Request} for chaining
     * @api public
     */

    Request.prototype.set = function(field, val){
      if (isObject(field)) {
        for (var key in field) {
          this.set(key, field[key]);
        }
        return this;
      }
      this._header[field.toLowerCase()] = val;
      this.header[field] = val;
      return this;
    };

    /**
     * Remove header `field`.
     *
     * Example:
     *
     *      req.get('/')
     *        .unset('User-Agent')
     *        .end(callback);
     *
     * @param {String} field
     * @return {Request} for chaining
     * @api public
     */

    Request.prototype.unset = function(field){
      delete this._header[field.toLowerCase()];
      delete this.header[field];
      return this;
    };

    /**
     * Get case-insensitive header `field` value.
     *
     * @param {String} field
     * @return {String}
     * @api private
     */

    Request.prototype.getHeader = function(field){
      return this._header[field.toLowerCase()];
    };

    /**
     * Set Content-Type to `type`, mapping values from `request.types`.
     *
     * Examples:
     *
     *      superagent.types.xml = 'application/xml';
     *
     *      request.post('/')
     *        .type('xml')
     *        .send(xmlstring)
     *        .end(callback);
     *
     *      request.post('/')
     *        .type('application/xml')
     *        .send(xmlstring)
     *        .end(callback);
     *
     * @param {String} type
     * @return {Request} for chaining
     * @api public
     */

    Request.prototype.type = function(type){
      this.set('Content-Type', request.types[type] || type);
      return this;
    };

    /**
     * Force given parser
     *
     * Sets the body parser no matter type.
     *
     * @param {Function}
     * @api public
     */

    Request.prototype.parse = function(fn){
      this._parser = fn;
      return this;
    };

    /**
     * Set Accept to `type`, mapping values from `request.types`.
     *
     * Examples:
     *
     *      superagent.types.json = 'application/json';
     *
     *      request.get('/agent')
     *        .accept('json')
     *        .end(callback);
     *
     *      request.get('/agent')
     *        .accept('application/json')
     *        .end(callback);
     *
     * @param {String} accept
     * @return {Request} for chaining
     * @api public
     */

    Request.prototype.accept = function(type){
      this.set('Accept', request.types[type] || type);
      return this;
    };

    /**
     * Set Authorization field value with `user` and `pass`.
     *
     * @param {String} user
     * @param {String} pass
     * @return {Request} for chaining
     * @api public
     */

    Request.prototype.auth = function(user, pass){
      var str = btoa(user + ':' + pass);
      this.set('Authorization', 'Basic ' + str);
      return this;
    };

    /**
    * Add query-string `val`.
    *
    * Examples:
    *
    *   request.get('/shoes')
    *     .query('size=10')
    *     .query({ color: 'blue' })
    *
    * @param {Object|String} val
    * @return {Request} for chaining
    * @api public
    */

    Request.prototype.query = function(val){
      if ('string' != typeof val) val = serialize(val);
      if (val) this._query.push(val);
      return this;
    };

    /**
     * Write the field `name` and `val` for "multipart/form-data"
     * request bodies.
     *
     * ``` js
     * request.post('/upload')
     *   .field('foo', 'bar')
     *   .end(callback);
     * ```
     *
     * @param {String} name
     * @param {String|Blob|File} val
     * @return {Request} for chaining
     * @api public
     */

    Request.prototype.field = function(name, val){
      if (!this._formData) this._formData = new root.FormData();
      this._formData.append(name, val);
      return this;
    };

    /**
     * Queue the given `file` as an attachment to the specified `field`,
     * with optional `filename`.
     *
     * ``` js
     * request.post('/upload')
     *   .attach(new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
     *   .end(callback);
     * ```
     *
     * @param {String} field
     * @param {Blob|File} file
     * @param {String} filename
     * @return {Request} for chaining
     * @api public
     */

    Request.prototype.attach = function(field, file, filename){
      if (!this._formData) this._formData = new root.FormData();
      this._formData.append(field, file, filename || file.name);
      return this;
    };

    /**
     * Send `data` as the request body, defaulting the `.type()` to "json" when
     * an object is given.
     *
     * Examples:
     *
     *       // manual json
     *       request.post('/user')
     *         .type('json')
     *         .send('{"name":"tj"}')
     *         .end(callback)
     *
     *       // auto json
     *       request.post('/user')
     *         .send({ name: 'tj' })
     *         .end(callback)
     *
     *       // manual x-www-form-urlencoded
     *       request.post('/user')
     *         .type('form')
     *         .send('name=tj')
     *         .end(callback)
     *
     *       // auto x-www-form-urlencoded
     *       request.post('/user')
     *         .type('form')
     *         .send({ name: 'tj' })
     *         .end(callback)
     *
     *       // defaults to x-www-form-urlencoded
      *      request.post('/user')
      *        .send('name=tobi')
      *        .send('species=ferret')
      *        .end(callback)
     *
     * @param {String|Object} data
     * @return {Request} for chaining
     * @api public
     */

    Request.prototype.send = function(data){
      var obj = isObject(data);
      var type = this.getHeader('Content-Type');

      // merge
      if (obj && isObject(this._data)) {
        for (var key in data) {
          this._data[key] = data[key];
        }
      } else if ('string' == typeof data) {
        if (!type) this.type('form');
        type = this.getHeader('Content-Type');
        if ('application/x-www-form-urlencoded' == type) {
          this._data = this._data
            ? this._data + '&' + data
            : data;
        } else {
          this._data = (this._data || '') + data;
        }
      } else {
        this._data = data;
      }

      if (!obj || isHost(data)) return this;
      if (!type) this.type('json');
      return this;
    };

    /**
     * Invoke the callback with `err` and `res`
     * and handle arity check.
     *
     * @param {Error} err
     * @param {Response} res
     * @api private
     */

    Request.prototype.callback = function(err, res){
      var fn = this._callback;
      this.clearTimeout();
      fn(err, res);
    };

    /**
     * Invoke callback with x-domain error.
     *
     * @api private
     */

    Request.prototype.crossDomainError = function(){
      var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
      err.crossDomain = true;

      err.status = this.status;
      err.method = this.method;
      err.url = this.url;

      this.callback(err);
    };

    /**
     * Invoke callback with timeout error.
     *
     * @api private
     */

    Request.prototype.timeoutError = function(){
      var timeout = this._timeout;
      var err = new Error('timeout of ' + timeout + 'ms exceeded');
      err.timeout = timeout;
      this.callback(err);
    };

    /**
     * Enable transmission of cookies with x-domain requests.
     *
     * Note that for this to work the origin must not be
     * using "Access-Control-Allow-Origin" with a wildcard,
     * and also must set "Access-Control-Allow-Credentials"
     * to "true".
     *
     * @api public
     */

    Request.prototype.withCredentials = function(){
      this._withCredentials = true;
      return this;
    };

    /**
     * Initiate request, invoking callback `fn(res)`
     * with an instanceof `Response`.
     *
     * @param {Function} fn
     * @return {Request} for chaining
     * @api public
     */

    Request.prototype.end = function(fn){
      var self = this;
      var xhr = this.xhr = request.getXHR();
      var query = this._query.join('&');
      var timeout = this._timeout;
      var data = this._formData || this._data;

      // store callback
      this._callback = fn || noop;

      // state change
      xhr.onreadystatechange = function(){
        if (4 != xhr.readyState) return;

        // In IE9, reads to any property (e.g. status) off of an aborted XHR will
        // result in the error "Could not complete the operation due to error c00c023f"
        var status;
        try { status = xhr.status } catch(e) { status = 0; }

        if (0 == status) {
          if (self.timedout) return self.timeoutError();
          if (self.aborted) return;
          return self.crossDomainError();
        }
        self.emit('end');
      };

      // progress
      var handleProgress = function(e){
        if (e.total > 0) {
          e.percent = e.loaded / e.total * 100;
        }
        e.direction = 'download';
        self.emit('progress', e);
      };
      if (this.hasListeners('progress')) {
        xhr.onprogress = handleProgress;
      }
      try {
        if (xhr.upload && this.hasListeners('progress')) {
          xhr.upload.onprogress = handleProgress;
        }
      } catch(e) {
        // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
        // Reported here:
        // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
      }

      // timeout
      if (timeout && !this._timer) {
        this._timer = setTimeout(function(){
          self.timedout = true;
          self.abort();
        }, timeout);
      }

      // querystring
      if (query) {
        query = request.serializeObject(query);
        this.url += ~this.url.indexOf('?')
          ? '&' + query
          : '?' + query;
      }

      // initiate request
      xhr.open(this.method, this.url, true);

      // CORS
      if (this._withCredentials) xhr.withCredentials = true;

      // body
      if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
        // serialize stuff
        var contentType = this.getHeader('Content-Type');
        var serialize = this._parser || request.serialize[contentType ? contentType.split(';')[0] : ''];
        if (!serialize && isJSON(contentType)) serialize = request.serialize['application/json'];
        if (serialize) data = serialize(data);
      }

      // set header fields
      for (var field in this.header) {
        if (null == this.header[field]) continue;
        xhr.setRequestHeader(field, this.header[field]);
      }

      // send stuff
      this.emit('request', this);

      // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
      // We need null here if data is undefined
      xhr.send(typeof data !== 'undefined' ? data : null);
      return this;
    };

    /**
     * Faux promise support
     *
     * @param {Function} fulfill
     * @param {Function} reject
     * @return {Request}
     */

    Request.prototype.then = function (fulfill, reject) {
      return this.end(function(err, res) {
        err ? reject(err) : fulfill(res);
      });
    }

    /**
     * Expose `Request`.
     */

    request.Request = Request;

    /**
     * Issue a request:
     *
     * Examples:
     *
     *    request('GET', '/users').end(callback)
     *    request('/users').end(callback)
     *    request('/users', callback)
     *
     * @param {String} method
     * @param {String|Function} url or callback
     * @return {Request}
     * @api public
     */

    function request(method, url) {
      // callback
      if ('function' == typeof url) {
        return new Request('GET', method).end(url);
      }

      // url first
      if (1 == arguments.length) {
        return new Request('GET', method);
      }

      return new Request(method, url);
    }

    /**
     * GET `url` with optional callback `fn(res)`.
     *
     * @param {String} url
     * @param {Mixed|Function} data or fn
     * @param {Function} fn
     * @return {Request}
     * @api public
     */

    request.get = function(url, data, fn){
      var req = request('GET', url);
      if ('function' == typeof data) fn = data, data = null;
      if (data) req.query(data);
      if (fn) req.end(fn);
      return req;
    };

    /**
     * HEAD `url` with optional callback `fn(res)`.
     *
     * @param {String} url
     * @param {Mixed|Function} data or fn
     * @param {Function} fn
     * @return {Request}
     * @api public
     */

    request.head = function(url, data, fn){
      var req = request('HEAD', url);
      if ('function' == typeof data) fn = data, data = null;
      if (data) req.send(data);
      if (fn) req.end(fn);
      return req;
    };

    /**
     * DELETE `url` with optional callback `fn(res)`.
     *
     * @param {String} url
     * @param {Function} fn
     * @return {Request}
     * @api public
     */

    function del(url, fn){
      var req = request('DELETE', url);
      if (fn) req.end(fn);
      return req;
    };

    request['del'] = del;
    request['delete'] = del;

    /**
     * PATCH `url` with optional `data` and callback `fn(res)`.
     *
     * @param {String} url
     * @param {Mixed} data
     * @param {Function} fn
     * @return {Request}
     * @api public
     */

    request.patch = function(url, data, fn){
      var req = request('PATCH', url);
      if ('function' == typeof data) fn = data, data = null;
      if (data) req.send(data);
      if (fn) req.end(fn);
      return req;
    };

    /**
     * POST `url` with optional `data` and callback `fn(res)`.
     *
     * @param {String} url
     * @param {Mixed} data
     * @param {Function} fn
     * @return {Request}
     * @api public
     */

    request.post = function(url, data, fn){
      var req = request('POST', url);
      if ('function' == typeof data) fn = data, data = null;
      if (data) req.send(data);
      if (fn) req.end(fn);
      return req;
    };

    /**
     * PUT `url` with optional `data` and callback `fn(res)`.
     *
     * @param {String} url
     * @param {Mixed|Function} data or fn
     * @param {Function} fn
     * @return {Request}
     * @api public
     */

    request.put = function(url, data, fn){
      var req = request('PUT', url);
      if ('function' == typeof data) fn = data, data = null;
      if (data) req.send(data);
      if (fn) req.end(fn);
      return req;
    };

    /**
     * Expose `request`.
     */

    module.exports = request;
    });

    var superagent = (client && typeof client === 'object' && 'default' in client ? client['default'] : client);

    var index$1 = __commonjs(function (module) {
    /**
     * Promise wrapper for superagent
     */

    function wrap(superagent, Promise) {
      /**
       * Request object similar to superagent.Request, but with end() returning
       * a promise.
       */
      function PromiseRequest() {
        superagent.Request.apply(this, arguments);
      }

      // Inherit form superagent.Request
      PromiseRequest.prototype = Object.create(superagent.Request.prototype);

      /** Send request and get a promise that `end` was emitted */
      PromiseRequest.prototype.end = function(cb) {
        var _end = superagent.Request.prototype.end;
        var self = this;

        return new Promise(function(accept, reject) {
          _end.call(self, function(err, response) {
            if (cb) {
              cb(err, response);
            }

            if (err) {
              err.response = response;
              reject(err);
            } else {
              accept(response);
            }
          });
        });
      };

      /** Provide a more promise-y interface */
      PromiseRequest.prototype.then = function(resolve, reject) {
        var _end = superagent.Request.prototype.end;
        var self = this;

        return new Promise(function(accept, reject) {
          _end.call(self, function(err, response) {
            if (err) {
              err.response = response;
              reject(err);
            } else {
              accept(response);
            }
          });
        }).then(resolve, reject);
      };

      /**
       * Request builder with same interface as superagent.
       * It is convenient to import this as `request` in place of superagent.
       */
      var request = function(method, url) {
        return new PromiseRequest(method, url);
      };

      /** Helper for making an options request */
      request.options = function(url) {
        return request('OPTIONS', url);
      }

      /** Helper for making a head request */
      request.head = function(url, data) {
        var req = request('HEAD', url);
        if (data) {
          req.send(data);
        }
        return req;
      };

      /** Helper for making a get request */
      request.get = function(url, data) {
        var req = request('GET', url);
        if (data) {
          req.query(data);
        }
        return req;
      };

      /** Helper for making a post request */
      request.post = function(url, data) {
        var req = request('POST', url);
        if (data) {
          req.send(data);
        }
        return req;
      };

      /** Helper for making a put request */
      request.put = function(url, data) {
        var req = request('PUT', url);
        if (data) {
          req.send(data);
        }
        return req;
      };

      /** Helper for making a patch request */
      request.patch = function(url, data) {
        var req = request('PATCH', url);
        if (data) {
          req.send(data);
        }
        return req;
      };

      /** Helper for making a delete request */
      request.del = function(url) {
        return request('DELETE', url);
      };

      // Export the request builder
      return request;
    }

    module.exports = wrap;
    });

    var superagentPromise = (index$1 && typeof index$1 === 'object' && 'default' in index$1 ? index$1['default'] : index$1);

    var index$4 = __commonjs(function (module) {
    /**
     * Helpers.
     */

    var s = 1000;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var y = d * 365.25;

    /**
     * Parse or format the given `val`.
     *
     * Options:
     *
     *  - `long` verbose formatting [false]
     *
     * @param {String|Number} val
     * @param {Object} options
     * @return {String|Number}
     * @api public
     */

    module.exports = function(val, options){
      options = options || {};
      if ('string' == typeof val) return parse(val);
      return options.long
        ? long(val)
        : short(val);
    };

    /**
     * Parse the given `str` and return milliseconds.
     *
     * @param {String} str
     * @return {Number}
     * @api private
     */

    function parse(str) {
      str = '' + str;
      if (str.length > 10000) return;
      var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
      if (!match) return;
      var n = parseFloat(match[1]);
      var type = (match[2] || 'ms').toLowerCase();
      switch (type) {
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
          return n * y;
        case 'days':
        case 'day':
        case 'd':
          return n * d;
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
          return n * h;
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
          return n * m;
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
          return n * s;
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
          return n;
      }
    }

    /**
     * Short format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */

    function short(ms) {
      if (ms >= d) return Math.round(ms / d) + 'd';
      if (ms >= h) return Math.round(ms / h) + 'h';
      if (ms >= m) return Math.round(ms / m) + 'm';
      if (ms >= s) return Math.round(ms / s) + 's';
      return ms + 'ms';
    }

    /**
     * Long format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */

    function long(ms) {
      return plural(ms, d, 'day')
        || plural(ms, h, 'hour')
        || plural(ms, m, 'minute')
        || plural(ms, s, 'second')
        || ms + ' ms';
    }

    /**
     * Pluralization helper.
     */

    function plural(ms, n, name) {
      if (ms < n) return;
      if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
      return Math.ceil(ms / n) + ' ' + name + 's';
    }
    });

    var require$$0$5 = (index$4 && typeof index$4 === 'object' && 'default' in index$4 ? index$4['default'] : index$4);

    var debug$2 = __commonjs(function (module, exports) {
    /**
     * This is the common logic for both the Node.js and web browser
     * implementations of `debug()`.
     *
     * Expose `debug()` as the module.
     */

    exports = module.exports = debug;
    exports.coerce = coerce;
    exports.disable = disable;
    exports.enable = enable;
    exports.enabled = enabled;
    exports.humanize = require$$0$5;

    /**
     * The currently active debug mode names, and names to skip.
     */

    exports.names = [];
    exports.skips = [];

    /**
     * Map of special "%n" handling functions, for the debug "format" argument.
     *
     * Valid key names are a single, lowercased letter, i.e. "n".
     */

    exports.formatters = {};

    /**
     * Previously assigned color.
     */

    var prevColor = 0;

    /**
     * Previous log timestamp.
     */

    var prevTime;

    /**
     * Select a color.
     *
     * @return {Number}
     * @api private
     */

    function selectColor() {
      return exports.colors[prevColor++ % exports.colors.length];
    }

    /**
     * Create a debugger with the given `namespace`.
     *
     * @param {String} namespace
     * @return {Function}
     * @api public
     */

    function debug(namespace) {

      // define the `disabled` version
      function disabled() {
      }
      disabled.enabled = false;

      // define the `enabled` version
      function enabled() {

        var self = enabled;

        // set `diff` timestamp
        var curr = +new Date();
        var ms = curr - (prevTime || curr);
        self.diff = ms;
        self.prev = prevTime;
        self.curr = curr;
        prevTime = curr;

        // add the `color` if not set
        if (null == self.useColors) self.useColors = exports.useColors();
        if (null == self.color && self.useColors) self.color = selectColor();

        var args = Array.prototype.slice.call(arguments);

        args[0] = exports.coerce(args[0]);

        if ('string' !== typeof args[0]) {
          // anything else let's inspect with %o
          args = ['%o'].concat(args);
        }

        // apply any `formatters` transformations
        var index = 0;
        args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
          // if we encounter an escaped % then don't increase the array index
          if (match === '%%') return match;
          index++;
          var formatter = exports.formatters[format];
          if ('function' === typeof formatter) {
            var val = args[index];
            match = formatter.call(self, val);

            // now we need to remove `args[index]` since it's inlined in the `format`
            args.splice(index, 1);
            index--;
          }
          return match;
        });

        if ('function' === typeof exports.formatArgs) {
          args = exports.formatArgs.apply(self, args);
        }
        var logFn = enabled.log || exports.log || console.log.bind(console);
        logFn.apply(self, args);
      }
      enabled.enabled = true;

      var fn = exports.enabled(namespace) ? enabled : disabled;

      fn.namespace = namespace;

      return fn;
    }

    /**
     * Enables a debug mode by namespaces. This can include modes
     * separated by a colon and wildcards.
     *
     * @param {String} namespaces
     * @api public
     */

    function enable(namespaces) {
      exports.save(namespaces);

      var split = (namespaces || '').split(/[\s,]+/);
      var len = split.length;

      for (var i = 0; i < len; i++) {
        if (!split[i]) continue; // ignore empty strings
        namespaces = split[i].replace(/\*/g, '.*?');
        if (namespaces[0] === '-') {
          exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
        } else {
          exports.names.push(new RegExp('^' + namespaces + '$'));
        }
      }
    }

    /**
     * Disable debug output.
     *
     * @api public
     */

    function disable() {
      exports.enable('');
    }

    /**
     * Returns true if the given mode name is enabled, false otherwise.
     *
     * @param {String} name
     * @return {Boolean}
     * @api public
     */

    function enabled(name) {
      var i, len;
      for (i = 0, len = exports.skips.length; i < len; i++) {
        if (exports.skips[i].test(name)) {
          return false;
        }
      }
      for (i = 0, len = exports.names.length; i < len; i++) {
        if (exports.names[i].test(name)) {
          return true;
        }
      }
      return false;
    }

    /**
     * Coerce `val`.
     *
     * @param {Mixed} val
     * @return {Mixed}
     * @api private
     */

    function coerce(val) {
      if (val instanceof Error) return val.stack || val.message;
      return val;
    }
    });

    var require$$0 = (debug$2 && typeof debug$2 === 'object' && 'default' in debug$2 ? debug$2['default'] : debug$2);

    var browser = __commonjs(function (module, exports) {
    /**
     * This is the web browser implementation of `debug()`.
     *
     * Expose `debug()` as the module.
     */

    exports = module.exports = require$$0;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = 'undefined' != typeof chrome
                   && 'undefined' != typeof chrome.storage
                      ? chrome.storage.local
                      : localstorage();

    /**
     * Colors.
     */

    exports.colors = [
      'lightseagreen',
      'forestgreen',
      'goldenrod',
      'dodgerblue',
      'darkorchid',
      'crimson'
    ];

    /**
     * Currently only WebKit-based Web Inspectors, Firefox >= v31,
     * and the Firebug extension (any Firefox version) are known
     * to support "%c" CSS customizations.
     *
     * TODO: add a `localStorage` variable to explicitly enable/disable colors
     */

    function useColors() {
      // is webkit? http://stackoverflow.com/a/16459606/376773
      return ('WebkitAppearance' in document.documentElement.style) ||
        // is firebug? http://stackoverflow.com/a/398120/376773
        (window.console && (console.firebug || (console.exception && console.table))) ||
        // is firefox >= v31?
        // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
        (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
    }

    /**
     * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
     */

    exports.formatters.j = function(v) {
      return JSON.stringify(v);
    };


    /**
     * Colorize log arguments if enabled.
     *
     * @api public
     */

    function formatArgs() {
      var args = arguments;
      var useColors = this.useColors;

      args[0] = (useColors ? '%c' : '')
        + this.namespace
        + (useColors ? ' %c' : ' ')
        + args[0]
        + (useColors ? '%c ' : ' ')
        + '+' + exports.humanize(this.diff);

      if (!useColors) return args;

      var c = 'color: ' + this.color;
      args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

      // the final "%c" is somewhat tricky, because there could be other
      // arguments passed either before or after the %c, so we need to
      // figure out the correct index to insert the CSS into
      var index = 0;
      var lastC = 0;
      args[0].replace(/%[a-z%]/g, function(match) {
        if ('%%' === match) return;
        index++;
        if ('%c' === match) {
          // we only are interested in the *last* %c
          // (the user may have provided their own)
          lastC = index;
        }
      });

      args.splice(lastC, 0, c);
      return args;
    }

    /**
     * Invokes `console.log()` when available.
     * No-op when `console.log` is not a "function".
     *
     * @api public
     */

    function log() {
      // this hackery is required for IE8/9, where
      // the `console.log` function doesn't have 'apply'
      return 'object' === typeof console
        && console.log
        && Function.prototype.apply.call(console.log, console, arguments);
    }

    /**
     * Save `namespaces`.
     *
     * @param {String} namespaces
     * @api private
     */

    function save(namespaces) {
      try {
        if (null == namespaces) {
          exports.storage.removeItem('debug');
        } else {
          exports.storage.debug = namespaces;
        }
      } catch(e) {}
    }

    /**
     * Load `namespaces`.
     *
     * @return {String} returns the previously persisted debug modes
     * @api private
     */

    function load() {
      var r;
      try {
        r = exports.storage.debug;
      } catch(e) {}
      return r;
    }

    /**
     * Enable namespaces listed in `localStorage.debug` initially.
     */

    exports.enable(load());

    /**
     * Localstorage attempts to return the localstorage.
     *
     * This is necessary because safari throws
     * when a user disables cookies/localstorage
     * and you attempt to access it.
     *
     * @return {LocalStorage}
     * @api private
     */

    function localstorage(){
      try {
        return window.localStorage;
      } catch (e) {}
    }
    });

    var d = (browser && typeof browser === 'object' && 'default' in browser ? browser['default'] : browser);

    var APP_NOT_AVAILABLE = {
      code: 4100,
      message: 'App not exists or realtime message service is disabled.'
    };
    var INVALID_LOGIN = {
      code: 4103,
      message: 'Malformed clientId.'
    };
    var INVALID_ORIGIN = {
      code: 4110,
      message: 'Access denied by domain whitelist.'
    };

    var len = 0;
    var vertxNext;
    function asap(callback, arg) {
      queue[len] = callback;
      queue[len + 1] = arg;
      len += 2;
      if (len === 2) {
        // If len is 1, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        scheduleFlush();
      }
    }

    var browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var browserGlobal = browserWindow || {};
    var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
    var isNode = typeof self === 'undefined' &&
      typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function useNextTick() {
      var nextTick = process.nextTick;
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // setImmediate should be used instead instead
      var version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
      if (Array.isArray(version) && version[1] === '0' && version[2] === '10') {
        nextTick = setImmediate;
      }
      return function() {
        nextTick(flush);
      };
    }

    // vertx
    function useVertxTimer() {
      return function() {
        vertxNext(flush);
      };
    }

    function useMutationObserver() {
      var iterations = 0;
      var observer = new BrowserMutationObserver(flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function useSetTimeout() {
      return function() {
        setTimeout(flush, 1);
      };
    }

    var queue = new Array(1000);
    function flush() {
      for (var i = 0; i < len; i+=2) {
        var callback = queue[i];
        var arg = queue[i+1];

        callback(arg);

        queue[i] = undefined;
        queue[i+1] = undefined;
      }

      len = 0;
    }

    function attemptVertex() {
      try {
        var r = require;
        var vertx = r('vertx');
        vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return useVertxTimer();
      } catch(e) {
        return useSetTimeout();
      }
    }

    var scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (isNode) {
      scheduleFlush = useNextTick();
    } else if (BrowserMutationObserver) {
      scheduleFlush = useMutationObserver();
    } else if (isWorker) {
      scheduleFlush = useMessageChannel();
    } else if (browserWindow === undefined && typeof require === 'function') {
      scheduleFlush = attemptVertex();
    } else {
      scheduleFlush = useSetTimeout();
    }

    function Result() {
      this.value = undefined;
    }

    var ERROR = new Result();
    var GET_THEN_ERROR = new Result();

    function PromiseHash(Constructor, object, label) {
      this._superConstructor(Constructor, object, true, label);
    }

    PromiseHash.prototype = o_create(Enumerator.prototype);
    PromiseHash.prototype._superConstructor = Enumerator;
    PromiseHash.prototype._init = function() {
      this._result = {};
    };

    PromiseHash.prototype._validateInput = function(input) {
      return input && typeof input === 'object';
    };

    PromiseHash.prototype._validationError = function() {
      return new Error('Promise.hash must be called with an object');
    };

    PromiseHash.prototype._enumerate = function() {
      var enumerator = this;
      var promise    = enumerator.promise;
      var input      = enumerator._input;
      var results    = [];

      for (var key in input) {
        if (promise._state === PENDING && Object.prototype.hasOwnProperty.call(input, key)) {
          results.push({
            position: key,
            entry: input[key]
          });
        }
      }

      var length = results.length;
      enumerator._remaining = length;
      var result;

      for (var i = 0; promise._state === PENDING && i < length; i++) {
        result = results[i];
        enumerator._eachEntry(result.entry, result.position);
      }
    };

    function HashSettled(Constructor, object, label) {
      this._superConstructor(Constructor, object, false, label);
    }

    HashSettled.prototype = o_create(PromiseHash.prototype);
    HashSettled.prototype._superConstructor = Enumerator;
    HashSettled.prototype._makeResult = makeSettledResult;

    HashSettled.prototype._validationError = function() {
      return new Error('hashSettled must be called with an object');
    };

    function AllSettled(Constructor, entries, label) {
      this._superConstructor(Constructor, entries, false /* don't abort on reject */, label);
    }

    AllSettled.prototype = o_create(Enumerator.prototype);
    AllSettled.prototype._superConstructor = Enumerator;
    AllSettled.prototype._makeResult = makeSettledResult;
    AllSettled.prototype._validationError = function() {
      return new Error('allSettled must be called with an array');
    };

    // defaults
    config.async = asap;
    config.after = function(cb) {
      setTimeout(cb, 0);
    };
    function on() {
      config['on'].apply(config, arguments);
    }

    // Set up instrumentation through `window.__PROMISE_INTRUMENTATION__`
    if (typeof window !== 'undefined' && typeof window['__PROMISE_INSTRUMENTATION__'] === 'object') {
      var callbacks = window['__PROMISE_INSTRUMENTATION__'];
      configure('instrument', true);
      for (var eventName in callbacks) {
        if (callbacks.hasOwnProperty(eventName)) {
          on(eventName, callbacks[eventName]);
        }
      }
    }

    var tryAll = function tryAll(promiseConstructors) {
      var promise = new Promise(promiseConstructors[0]);
      if (promiseConstructors.length === 1) {
        return promise;
      }
      return promise.catch(function () {
        return tryAll(promiseConstructors.slice(1));
      });
    };

    var tap = function tap(interceptor) {
      return function (value) {
        return interceptor(value), value;
      };
    };

    var $ = __commonjs(function (module) {
    var $Object = Object;
    module.exports = {
      create:     $Object.create,
      getProto:   $Object.getPrototypeOf,
      isEnum:     {}.propertyIsEnumerable,
      getDesc:    $Object.getOwnPropertyDescriptor,
      setDesc:    $Object.defineProperty,
      setDescs:   $Object.defineProperties,
      getKeys:    $Object.keys,
      getNames:   $Object.getOwnPropertyNames,
      getSymbols: $Object.getOwnPropertySymbols,
      each:       [].forEach
    };
    });

    var require$$2$2 = ($ && typeof $ === 'object' && 'default' in $ ? $['default'] : $);

    var defineProperty$1 = __commonjs(function (module) {
    var $ = require$$2$2;
    module.exports = function defineProperty(it, key, desc){
      return $.setDesc(it, key, desc);
    };
    });

    var require$$0$11 = (defineProperty$1 && typeof defineProperty$1 === 'object' && 'default' in defineProperty$1 ? defineProperty$1['default'] : defineProperty$1);

    var defineProperty = __commonjs(function (module) {
    module.exports = { "default": require$$0$11, __esModule: true };
    });

    var require$$0$3 = (defineProperty && typeof defineProperty === 'object' && 'default' in defineProperty ? defineProperty['default'] : defineProperty);

    var createClass = __commonjs(function (module, exports) {
    "use strict";

    exports.__esModule = true;

    var _defineProperty = require$$0$3;

    var _defineProperty2 = _interopRequireDefault(_defineProperty);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    exports.default = (function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          (0, _defineProperty2.default)(target, descriptor.key, descriptor);
        }
      }

      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    })();
    });

    var _createClass = (createClass && typeof createClass === 'object' && 'default' in createClass ? createClass['default'] : createClass);

    var $_core = __commonjs(function (module) {
    var core = module.exports = {version: '1.2.6'};
    if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
    });

    var require$$1$3 = ($_core && typeof $_core === 'object' && 'default' in $_core ? $_core['default'] : $_core);

    var $_fails = __commonjs(function (module) {
    module.exports = function(exec){
      try {
        return !!exec();
      } catch(e){
        return true;
      }
    };
    });

    var require$$0$17 = ($_fails && typeof $_fails === 'object' && 'default' in $_fails ? $_fails['default'] : $_fails);

    var $_aFunction = __commonjs(function (module) {
    module.exports = function(it){
      if(typeof it != 'function')throw TypeError(it + ' is not a function!');
      return it;
    };
    });

    var require$$0$26 = ($_aFunction && typeof $_aFunction === 'object' && 'default' in $_aFunction ? $_aFunction['default'] : $_aFunction);

    var $_ctx = __commonjs(function (module) {
    // optional / simple context binding
    var aFunction = require$$0$26;
    module.exports = function(fn, that, length){
      aFunction(fn);
      if(that === undefined)return fn;
      switch(length){
        case 1: return function(a){
          return fn.call(that, a);
        };
        case 2: return function(a, b){
          return fn.call(that, a, b);
        };
        case 3: return function(a, b, c){
          return fn.call(that, a, b, c);
        };
      }
      return function(/* ...args */){
        return fn.apply(that, arguments);
      };
    };
    });

    var require$$0$25 = ($_ctx && typeof $_ctx === 'object' && 'default' in $_ctx ? $_ctx['default'] : $_ctx);

    var $_global = __commonjs(function (module) {
    // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
    var global = module.exports = typeof window != 'undefined' && window.Math == Math
      ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
    if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
    });

    var require$$2$5 = ($_global && typeof $_global === 'object' && 'default' in $_global ? $_global['default'] : $_global);

    var $_export = __commonjs(function (module, exports) {
    var global    = require$$2$5
      , core      = require$$1$3
      , ctx       = require$$0$25
      , PROTOTYPE = 'prototype';

    var $export = function(type, name, source){
      var IS_FORCED = type & $export.F
        , IS_GLOBAL = type & $export.G
        , IS_STATIC = type & $export.S
        , IS_PROTO  = type & $export.P
        , IS_BIND   = type & $export.B
        , IS_WRAP   = type & $export.W
        , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
        , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
        , key, own, out;
      if(IS_GLOBAL)source = name;
      for(key in source){
        // contains in native
        own = !IS_FORCED && target && key in target;
        if(own && key in exports)continue;
        // export native or passed
        out = own ? target[key] : source[key];
        // prevent global pollution for namespaces
        exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
        // bind timers to global for call from export context
        : IS_BIND && own ? ctx(out, global)
        // wrap global constructors for prevent change them in library
        : IS_WRAP && target[key] == out ? (function(C){
          var F = function(param){
            return this instanceof C ? new C(param) : C(param);
          };
          F[PROTOTYPE] = C[PROTOTYPE];
          return F;
        // make static versions for prototype methods
        })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
        if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
      }
    };
    // type bitmap
    $export.F = 1;  // forced
    $export.G = 2;  // global
    $export.S = 4;  // static
    $export.P = 8;  // proto
    $export.B = 16; // bind
    $export.W = 32; // wrap
    module.exports = $export;
    });

    var require$$2$4 = ($_export && typeof $_export === 'object' && 'default' in $_export ? $_export['default'] : $_export);

    var $_objectSap = __commonjs(function (module) {
    // most Object methods by ES6 should accept primitives
    var $export = require$$2$4
      , core    = require$$1$3
      , fails   = require$$0$17;
    module.exports = function(KEY, exec){
      var fn  = (core.Object || {})[KEY] || Object[KEY]
        , exp = {};
      exp[KEY] = exec(fn);
      $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
    };
    });

    var require$$0$20 = ($_objectSap && typeof $_objectSap === 'object' && 'default' in $_objectSap ? $_objectSap['default'] : $_objectSap);

    var $_defined = __commonjs(function (module) {
    // 7.2.1 RequireObjectCoercible(argument)
    module.exports = function(it){
      if(it == undefined)throw TypeError("Can't call method on  " + it);
      return it;
    };
    });

    var require$$0$22 = ($_defined && typeof $_defined === 'object' && 'default' in $_defined ? $_defined['default'] : $_defined);

    var $_toObject = __commonjs(function (module) {
    // 7.1.13 ToObject(argument)
    var defined = require$$0$22;
    module.exports = function(it){
      return Object(defined(it));
    };
    });

    var require$$2$6 = ($_toObject && typeof $_toObject === 'object' && 'default' in $_toObject ? $_toObject['default'] : $_toObject);

    var es6_object_getPrototypeOf = __commonjs(function (module) {
    // 19.1.2.9 Object.getPrototypeOf(O)
    var toObject = require$$2$6;

    require$$0$20('getPrototypeOf', function($getPrototypeOf){
      return function getPrototypeOf(it){
        return $getPrototypeOf(toObject(it));
      };
    });
    });

    var getPrototypeOf$1 = __commonjs(function (module) {
    module.exports = require$$1$3.Object.getPrototypeOf;
    });

    var require$$0$10 = (getPrototypeOf$1 && typeof getPrototypeOf$1 === 'object' && 'default' in getPrototypeOf$1 ? getPrototypeOf$1['default'] : getPrototypeOf$1);

    var getPrototypeOf = __commonjs(function (module) {
    module.exports = { "default": require$$0$10, __esModule: true };
    });

    var _Object$getPrototypeOf = (getPrototypeOf && typeof getPrototypeOf === 'object' && 'default' in getPrototypeOf ? getPrototypeOf['default'] : getPrototypeOf);

    var $_library = __commonjs(function (module) {
    module.exports = true;
    });

    var require$$0$14 = ($_library && typeof $_library === 'object' && 'default' in $_library ? $_library['default'] : $_library);

    var $_propertyDesc = __commonjs(function (module) {
    module.exports = function(bitmap, value){
      return {
        enumerable  : !(bitmap & 1),
        configurable: !(bitmap & 2),
        writable    : !(bitmap & 4),
        value       : value
      };
    };
    });

    var require$$1$4 = ($_propertyDesc && typeof $_propertyDesc === 'object' && 'default' in $_propertyDesc ? $_propertyDesc['default'] : $_propertyDesc);

    var $_cof = __commonjs(function (module) {
    var toString = {}.toString;

    module.exports = function(it){
      return toString.call(it).slice(8, -1);
    };
    });

    var require$$0$23 = ($_cof && typeof $_cof === 'object' && 'default' in $_cof ? $_cof['default'] : $_cof);

    var $_iobject = __commonjs(function (module) {
    // fallback for non-array-like ES3 and non-enumerable old V8 strings
    var cof = require$$0$23;
    module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
      return cof(it) == 'String' ? it.split('') : Object(it);
    };
    });

    var require$$1$8 = ($_iobject && typeof $_iobject === 'object' && 'default' in $_iobject ? $_iobject['default'] : $_iobject);

    var $_toIobject = __commonjs(function (module) {
    // to indexed object, toObject with fallback for non-array-like ES3 strings
    var IObject = require$$1$8
      , defined = require$$0$22;
    module.exports = function(it){
      return IObject(defined(it));
    };
    });

    var require$$0$15 = ($_toIobject && typeof $_toIobject === 'object' && 'default' in $_toIobject ? $_toIobject['default'] : $_toIobject);

    var $_isObject = __commonjs(function (module) {
    module.exports = function(it){
      return typeof it === 'object' ? it !== null : typeof it === 'function';
    };
    });

    var require$$2$7 = ($_isObject && typeof $_isObject === 'object' && 'default' in $_isObject ? $_isObject['default'] : $_isObject);

    var $_anObject = __commonjs(function (module) {
    var isObject = require$$2$7;
    module.exports = function(it){
      if(!isObject(it))throw TypeError(it + ' is not an object!');
      return it;
    };
    });

    var require$$1$5 = ($_anObject && typeof $_anObject === 'object' && 'default' in $_anObject ? $_anObject['default'] : $_anObject);

    var $_isArray = __commonjs(function (module) {
    // 7.2.2 IsArray(argument)
    var cof = require$$0$23;
    module.exports = Array.isArray || function(arg){
      return cof(arg) == 'Array';
    };
    });

    var require$$4 = ($_isArray && typeof $_isArray === 'object' && 'default' in $_isArray ? $_isArray['default'] : $_isArray);

    var $_enumKeys = __commonjs(function (module) {
    // all enumerable object keys, includes symbols
    var $ = require$$2$2;
    module.exports = function(it){
      var keys       = $.getKeys(it)
        , getSymbols = $.getSymbols;
      if(getSymbols){
        var symbols = getSymbols(it)
          , isEnum  = $.isEnum
          , i       = 0
          , key;
        while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
      }
      return keys;
    };
    });

    var require$$5 = ($_enumKeys && typeof $_enumKeys === 'object' && 'default' in $_enumKeys ? $_enumKeys['default'] : $_enumKeys);

    var $_getNames = __commonjs(function (module) {
    // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
    var toIObject = require$$0$15
      , getNames  = require$$2$2.getNames
      , toString  = {}.toString;

    var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
      ? Object.getOwnPropertyNames(window) : [];

    var getWindowNames = function(it){
      try {
        return getNames(it);
      } catch(e){
        return windowNames.slice();
      }
    };

    module.exports.get = function getOwnPropertyNames(it){
      if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
      return getNames(toIObject(it));
    };
    });

    var require$$6 = ($_getNames && typeof $_getNames === 'object' && 'default' in $_getNames ? $_getNames['default'] : $_getNames);

    var $_keyof = __commonjs(function (module) {
    var $         = require$$2$2
      , toIObject = require$$0$15;
    module.exports = function(object, el){
      var O      = toIObject(object)
        , keys   = $.getKeys(O)
        , length = keys.length
        , index  = 0
        , key;
      while(length > index)if(O[key = keys[index++]] === el)return key;
    };
    });

    var require$$7 = ($_keyof && typeof $_keyof === 'object' && 'default' in $_keyof ? $_keyof['default'] : $_keyof);

    var $_uid = __commonjs(function (module) {
    var id = 0
      , px = Math.random();
    module.exports = function(key){
      return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
    };
    });

    var require$$1$6 = ($_uid && typeof $_uid === 'object' && 'default' in $_uid ? $_uid['default'] : $_uid);

    var $_shared = __commonjs(function (module) {
    var global = require$$2$5
      , SHARED = '__core-js_shared__'
      , store  = global[SHARED] || (global[SHARED] = {});
    module.exports = function(key){
      return store[key] || (store[key] = {});
    };
    });

    var require$$2$3 = ($_shared && typeof $_shared === 'object' && 'default' in $_shared ? $_shared['default'] : $_shared);

    var $_wks = __commonjs(function (module) {
    var store  = require$$2$3('wks')
      , uid    = require$$1$6
      , Symbol = require$$2$5.Symbol;
    module.exports = function(name){
      return store[name] || (store[name] =
        Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
    };
    });

    var require$$0$16 = ($_wks && typeof $_wks === 'object' && 'default' in $_wks ? $_wks['default'] : $_wks);

    var $_has = __commonjs(function (module) {
    var hasOwnProperty = {}.hasOwnProperty;
    module.exports = function(it, key){
      return hasOwnProperty.call(it, key);
    };
    });

    var require$$1$7 = ($_has && typeof $_has === 'object' && 'default' in $_has ? $_has['default'] : $_has);

    var $_setToStringTag = __commonjs(function (module) {
    var def = require$$2$2.setDesc
      , has = require$$1$7
      , TAG = require$$0$16('toStringTag');

    module.exports = function(it, tag, stat){
      if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
    };
    });

    var require$$10 = ($_setToStringTag && typeof $_setToStringTag === 'object' && 'default' in $_setToStringTag ? $_setToStringTag['default'] : $_setToStringTag);

    var $_descriptors = __commonjs(function (module) {
    // Thank's IE8 for his funny defineProperty
    module.exports = !require$$0$17(function(){
      return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
    });
    });

    var require$$0$18 = ($_descriptors && typeof $_descriptors === 'object' && 'default' in $_descriptors ? $_descriptors['default'] : $_descriptors);

    var $_hide = __commonjs(function (module) {
    var $          = require$$2$2
      , createDesc = require$$1$4;
    module.exports = require$$0$18 ? function(object, key, value){
      return $.setDesc(object, key, createDesc(1, value));
    } : function(object, key, value){
      object[key] = value;
      return object;
    };
    });

    var require$$0$24 = ($_hide && typeof $_hide === 'object' && 'default' in $_hide ? $_hide['default'] : $_hide);

    var $_redefine = __commonjs(function (module) {
    module.exports = require$$0$24;
    });

    var require$$13 = ($_redefine && typeof $_redefine === 'object' && 'default' in $_redefine ? $_redefine['default'] : $_redefine);

    var es6_symbol = __commonjs(function (module, exports, global) {
    'use strict';
    // ECMAScript 6 symbols shim
    var $              = require$$2$2
      , global         = require$$2$5
      , has            = require$$1$7
      , DESCRIPTORS    = require$$0$18
      , $export        = require$$2$4
      , redefine       = require$$13
      , $fails         = require$$0$17
      , shared         = require$$2$3
      , setToStringTag = require$$10
      , uid            = require$$1$6
      , wks            = require$$0$16
      , keyOf          = require$$7
      , $names         = require$$6
      , enumKeys       = require$$5
      , isArray        = require$$4
      , anObject       = require$$1$5
      , toIObject      = require$$0$15
      , createDesc     = require$$1$4
      , getDesc        = $.getDesc
      , setDesc        = $.setDesc
      , _create        = $.create
      , getNames       = $names.get
      , $Symbol        = global.Symbol
      , $JSON          = global.JSON
      , _stringify     = $JSON && $JSON.stringify
      , setter         = false
      , HIDDEN         = wks('_hidden')
      , isEnum         = $.isEnum
      , SymbolRegistry = shared('symbol-registry')
      , AllSymbols     = shared('symbols')
      , useNative      = typeof $Symbol == 'function'
      , ObjectProto    = Object.prototype;

    // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
    var setSymbolDesc = DESCRIPTORS && $fails(function(){
      return _create(setDesc({}, 'a', {
        get: function(){ return setDesc(this, 'a', {value: 7}).a; }
      })).a != 7;
    }) ? function(it, key, D){
      var protoDesc = getDesc(ObjectProto, key);
      if(protoDesc)delete ObjectProto[key];
      setDesc(it, key, D);
      if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
    } : setDesc;

    var wrap = function(tag){
      var sym = AllSymbols[tag] = _create($Symbol.prototype);
      sym._k = tag;
      DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
        configurable: true,
        set: function(value){
          if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
          setSymbolDesc(this, tag, createDesc(1, value));
        }
      });
      return sym;
    };

    var isSymbol = function(it){
      return typeof it == 'symbol';
    };

    var $defineProperty = function defineProperty(it, key, D){
      if(D && has(AllSymbols, key)){
        if(!D.enumerable){
          if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
          it[HIDDEN][key] = true;
        } else {
          if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
          D = _create(D, {enumerable: createDesc(0, false)});
        } return setSymbolDesc(it, key, D);
      } return setDesc(it, key, D);
    };
    var $defineProperties = function defineProperties(it, P){
      anObject(it);
      var keys = enumKeys(P = toIObject(P))
        , i    = 0
        , l = keys.length
        , key;
      while(l > i)$defineProperty(it, key = keys[i++], P[key]);
      return it;
    };
    var $create = function create(it, P){
      return P === undefined ? _create(it) : $defineProperties(_create(it), P);
    };
    var $propertyIsEnumerable = function propertyIsEnumerable(key){
      var E = isEnum.call(this, key);
      return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
        ? E : true;
    };
    var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
      var D = getDesc(it = toIObject(it), key);
      if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
      return D;
    };
    var $getOwnPropertyNames = function getOwnPropertyNames(it){
      var names  = getNames(toIObject(it))
        , result = []
        , i      = 0
        , key;
      while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
      return result;
    };
    var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
      var names  = getNames(toIObject(it))
        , result = []
        , i      = 0
        , key;
      while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
      return result;
    };
    var $stringify = function stringify(it){
      if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
      var args = [it]
        , i    = 1
        , $$   = arguments
        , replacer, $replacer;
      while($$.length > i)args.push($$[i++]);
      replacer = args[1];
      if(typeof replacer == 'function')$replacer = replacer;
      if($replacer || !isArray(replacer))replacer = function(key, value){
        if($replacer)value = $replacer.call(this, key, value);
        if(!isSymbol(value))return value;
      };
      args[1] = replacer;
      return _stringify.apply($JSON, args);
    };
    var buggyJSON = $fails(function(){
      var S = $Symbol();
      // MS Edge converts symbol values to JSON as {}
      // WebKit converts symbol values to JSON as null
      // V8 throws on boxed symbols
      return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
    });

    // 19.4.1.1 Symbol([description])
    if(!useNative){
      $Symbol = function Symbol(){
        if(isSymbol(this))throw TypeError('Symbol is not a constructor');
        return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
      };
      redefine($Symbol.prototype, 'toString', function toString(){
        return this._k;
      });

      isSymbol = function(it){
        return it instanceof $Symbol;
      };

      $.create     = $create;
      $.isEnum     = $propertyIsEnumerable;
      $.getDesc    = $getOwnPropertyDescriptor;
      $.setDesc    = $defineProperty;
      $.setDescs   = $defineProperties;
      $.getNames   = $names.get = $getOwnPropertyNames;
      $.getSymbols = $getOwnPropertySymbols;

      if(DESCRIPTORS && !require$$0$14){
        redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
      }
    }

    var symbolStatics = {
      // 19.4.2.1 Symbol.for(key)
      'for': function(key){
        return has(SymbolRegistry, key += '')
          ? SymbolRegistry[key]
          : SymbolRegistry[key] = $Symbol(key);
      },
      // 19.4.2.5 Symbol.keyFor(sym)
      keyFor: function keyFor(key){
        return keyOf(SymbolRegistry, key);
      },
      useSetter: function(){ setter = true; },
      useSimple: function(){ setter = false; }
    };
    // 19.4.2.2 Symbol.hasInstance
    // 19.4.2.3 Symbol.isConcatSpreadable
    // 19.4.2.4 Symbol.iterator
    // 19.4.2.6 Symbol.match
    // 19.4.2.8 Symbol.replace
    // 19.4.2.9 Symbol.search
    // 19.4.2.10 Symbol.species
    // 19.4.2.11 Symbol.split
    // 19.4.2.12 Symbol.toPrimitive
    // 19.4.2.13 Symbol.toStringTag
    // 19.4.2.14 Symbol.unscopables
    $.each.call((
      'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
      'species,split,toPrimitive,toStringTag,unscopables'
    ).split(','), function(it){
      var sym = wks(it);
      symbolStatics[it] = useNative ? sym : wrap(sym);
    });

    setter = true;

    $export($export.G + $export.W, {Symbol: $Symbol});

    $export($export.S, 'Symbol', symbolStatics);

    $export($export.S + $export.F * !useNative, 'Object', {
      // 19.1.2.2 Object.create(O [, Properties])
      create: $create,
      // 19.1.2.4 Object.defineProperty(O, P, Attributes)
      defineProperty: $defineProperty,
      // 19.1.2.3 Object.defineProperties(O, Properties)
      defineProperties: $defineProperties,
      // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
      getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
      // 19.1.2.7 Object.getOwnPropertyNames(O)
      getOwnPropertyNames: $getOwnPropertyNames,
      // 19.1.2.8 Object.getOwnPropertySymbols(O)
      getOwnPropertySymbols: $getOwnPropertySymbols
    });

    // 24.3.2 JSON.stringify(value [, replacer [, space]])
    $JSON && $export($export.S + $export.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});

    // 19.4.3.5 Symbol.prototype[@@toStringTag]
    setToStringTag($Symbol, 'Symbol');
    // 20.2.1.9 Math[@@toStringTag]
    setToStringTag(Math, 'Math', true);
    // 24.3.3 JSON[@@toStringTag]
    setToStringTag(global.JSON, 'JSON', true);
    });

    var index$5 = __commonjs(function (module) {
    module.exports = require$$1$3.Symbol;
    });

    var require$$0$8 = (index$5 && typeof index$5 === 'object' && 'default' in index$5 ? index$5['default'] : index$5);

    var symbol = __commonjs(function (module) {
    module.exports = { "default": require$$0$8, __esModule: true };
    });

    var require$$0$6 = (symbol && typeof symbol === 'object' && 'default' in symbol ? symbol['default'] : symbol);

    var _typeof = __commonjs(function (module, exports) {
    "use strict";

    exports.__esModule = true;

    var _symbol = require$$0$6;

    var _symbol2 = _interopRequireDefault(_symbol);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    function _typeof(obj) { return obj && typeof _Symbol !== "undefined" && obj.constructor === _Symbol ? "symbol" : typeof obj; }

    exports.default = function (obj) {
      return obj && typeof _symbol2.default !== "undefined" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
    };
    });

    var require$$0$2 = (_typeof && typeof _typeof === 'object' && 'default' in _typeof ? _typeof['default'] : _typeof);

    var possibleConstructorReturn = __commonjs(function (module, exports) {
    "use strict";

    exports.__esModule = true;

    var _typeof2 = require$$0$2;

    var _typeof3 = _interopRequireDefault(_typeof2);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    exports.default = function (self, call) {
      if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
    };
    });

    var _possibleConstructorReturn = (possibleConstructorReturn && typeof possibleConstructorReturn === 'object' && 'default' in possibleConstructorReturn ? possibleConstructorReturn['default'] : possibleConstructorReturn);

    var classCallCheck = __commonjs(function (module, exports) {
    "use strict";

    exports.__esModule = true;

    exports.default = function (instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };
    });

    var _classCallCheck = (classCallCheck && typeof classCallCheck === 'object' && 'default' in classCallCheck ? classCallCheck['default'] : classCallCheck);

    var create$1 = __commonjs(function (module) {
    var $ = require$$2$2;
    module.exports = function create(P, D){
      return $.create(P, D);
    };
    });

    var require$$0$13 = (create$1 && typeof create$1 === 'object' && 'default' in create$1 ? create$1['default'] : create$1);

    var create = __commonjs(function (module) {
    module.exports = { "default": require$$0$13, __esModule: true };
    });

    var require$$1 = (create && typeof create === 'object' && 'default' in create ? create['default'] : create);

    var $_setProto = __commonjs(function (module) {
    // Works with __proto__ only. Old v8 can't work with null proto objects.
    /* eslint-disable no-proto */
    var getDesc  = require$$2$2.getDesc
      , isObject = require$$2$7
      , anObject = require$$1$5;
    var check = function(O, proto){
      anObject(O);
      if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
    };
    module.exports = {
      set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
        function(test, buggy, set){
          try {
            set = require$$0$25(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
            set(test, []);
            buggy = !(test instanceof Array);
          } catch(e){ buggy = true; }
          return function setPrototypeOf(O, proto){
            check(O, proto);
            if(buggy)O.__proto__ = proto;
            else set(O, proto);
            return O;
          };
        }({}, false) : undefined),
      check: check
    };
    });

    var require$$0$21 = ($_setProto && typeof $_setProto === 'object' && 'default' in $_setProto ? $_setProto['default'] : $_setProto);

    var es6_object_setPrototypeOf = __commonjs(function (module) {
    // 19.1.3.19 Object.setPrototypeOf(O, proto)
    var $export = require$$2$4;
    $export($export.S, 'Object', {setPrototypeOf: require$$0$21.set});
    });

    var setPrototypeOf$1 = __commonjs(function (module) {
    module.exports = require$$1$3.Object.setPrototypeOf;
    });

    var require$$0$12 = (setPrototypeOf$1 && typeof setPrototypeOf$1 === 'object' && 'default' in setPrototypeOf$1 ? setPrototypeOf$1['default'] : setPrototypeOf$1);

    var setPrototypeOf = __commonjs(function (module) {
    module.exports = { "default": require$$0$12, __esModule: true };
    });

    var require$$2 = (setPrototypeOf && typeof setPrototypeOf === 'object' && 'default' in setPrototypeOf ? setPrototypeOf['default'] : setPrototypeOf);

    var inherits = __commonjs(function (module, exports) {
    "use strict";

    exports.__esModule = true;

    var _setPrototypeOf = require$$2;

    var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

    var _create = require$$1;

    var _create2 = _interopRequireDefault(_create);

    var _typeof2 = require$$0$2;

    var _typeof3 = _interopRequireDefault(_typeof2);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    exports.default = function (subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
      }

      subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
    };
    });

    var _inherits = (inherits && typeof inherits === 'object' && 'default' in inherits ? inherits['default'] : inherits);

    var index = __commonjs(function (module) {
    'use strict';

    //
    // We store our EE objects in a plain object whose properties are event names.
    // If `Object.create(null)` is not supported we prefix the event names with a
    // `~` to make sure that the built-in object properties are not overridden or
    // used as an attack vector.
    // We also assume that `Object.create(null)` is available when the event name
    // is an ES6 Symbol.
    //
    var prefix = typeof Object.create !== 'function' ? '~' : false;

    /**
     * Representation of a single EventEmitter function.
     *
     * @param {Function} fn Event handler to be called.
     * @param {Mixed} context Context for function execution.
     * @param {Boolean} once Only emit once
     * @api private
     */
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }

    /**
     * Minimal EventEmitter interface that is molded against the Node.js
     * EventEmitter interface.
     *
     * @constructor
     * @api public
     */
    function EventEmitter() { /* Nothing to set */ }

    /**
     * Holds the assigned EventEmitters by name.
     *
     * @type {Object}
     * @private
     */
    EventEmitter.prototype._events = undefined;

    /**
     * Return a list of assigned event listeners.
     *
     * @param {String} event The events that should be listed.
     * @param {Boolean} exists We only need to know if there are listeners.
     * @returns {Array|Boolean}
     * @api public
     */
    EventEmitter.prototype.listeners = function listeners(event, exists) {
      var evt = prefix ? prefix + event : event
        , available = this._events && this._events[evt];

      if (exists) return !!available;
      if (!available) return [];
      if (available.fn) return [available.fn];

      for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
        ee[i] = available[i].fn;
      }

      return ee;
    };

    /**
     * Emit an event to all registered event listeners.
     *
     * @param {String} event The name of the event.
     * @returns {Boolean} Indication if we've emitted an event.
     * @api public
     */
    EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;

      if (!this._events || !this._events[evt]) return false;

      var listeners = this._events[evt]
        , len = arguments.length
        , args
        , i;

      if ('function' === typeof listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

        switch (len) {
          case 1: return listeners.fn.call(listeners.context), true;
          case 2: return listeners.fn.call(listeners.context, a1), true;
          case 3: return listeners.fn.call(listeners.context, a1, a2), true;
          case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }

        for (i = 1, args = new Array(len -1); i < len; i++) {
          args[i - 1] = arguments[i];
        }

        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length
          , j;

        for (i = 0; i < length; i++) {
          if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

          switch (len) {
            case 1: listeners[i].fn.call(listeners[i].context); break;
            case 2: listeners[i].fn.call(listeners[i].context, a1); break;
            case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
            default:
              if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
                args[j - 1] = arguments[j];
              }

              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }

      return true;
    };

    /**
     * Register a new EventListener for the given event.
     *
     * @param {String} event Name of the event.
     * @param {Functon} fn Callback function.
     * @param {Mixed} context The context of the function.
     * @api public
     */
    EventEmitter.prototype.on = function on(event, fn, context) {
      var listener = new EE(fn, context || this)
        , evt = prefix ? prefix + event : event;

      if (!this._events) this._events = prefix ? {} : Object.create(null);
      if (!this._events[evt]) this._events[evt] = listener;
      else {
        if (!this._events[evt].fn) this._events[evt].push(listener);
        else this._events[evt] = [
          this._events[evt], listener
        ];
      }

      return this;
    };

    /**
     * Add an EventListener that's only called once.
     *
     * @param {String} event Name of the event.
     * @param {Function} fn Callback function.
     * @param {Mixed} context The context of the function.
     * @api public
     */
    EventEmitter.prototype.once = function once(event, fn, context) {
      var listener = new EE(fn, context || this, true)
        , evt = prefix ? prefix + event : event;

      if (!this._events) this._events = prefix ? {} : Object.create(null);
      if (!this._events[evt]) this._events[evt] = listener;
      else {
        if (!this._events[evt].fn) this._events[evt].push(listener);
        else this._events[evt] = [
          this._events[evt], listener
        ];
      }

      return this;
    };

    /**
     * Remove event listeners.
     *
     * @param {String} event The event we want to remove.
     * @param {Function} fn The listener that we need to find.
     * @param {Mixed} context Only remove listeners matching this context.
     * @param {Boolean} once Only remove once listeners.
     * @api public
     */
    EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;

      if (!this._events || !this._events[evt]) return this;

      var listeners = this._events[evt]
        , events = [];

      if (fn) {
        if (listeners.fn) {
          if (
               listeners.fn !== fn
            || (once && !listeners.once)
            || (context && listeners.context !== context)
          ) {
            events.push(listeners);
          }
        } else {
          for (var i = 0, length = listeners.length; i < length; i++) {
            if (
                 listeners[i].fn !== fn
              || (once && !listeners[i].once)
              || (context && listeners[i].context !== context)
            ) {
              events.push(listeners[i]);
            }
          }
        }
      }

      //
      // Reset the array, or remove it completely if we have no more listeners.
      //
      if (events.length) {
        this._events[evt] = events.length === 1 ? events[0] : events;
      } else {
        delete this._events[evt];
      }

      return this;
    };

    /**
     * Remove all listeners or only the listeners for the specified event.
     *
     * @param {String} event The event want to remove all listeners for.
     * @api public
     */
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
      if (!this._events) return this;

      if (event) delete this._events[prefix ? prefix + event : event];
      else this._events = prefix ? {} : Object.create(null);

      return this;
    };

    //
    // Alias methods names because people roll like that.
    //
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    EventEmitter.prototype.addListener = EventEmitter.prototype.on;

    //
    // This function doesn't apply anymore.
    //
    EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
      return this;
    };

    //
    // Expose the prefix.
    //
    EventEmitter.prefixed = prefix;

    //
    // Expose the module.
    //
    if ('undefined' !== typeof module) {
      module.exports = EventEmitter;
    }
    });

    var EventEmitter = (index && typeof index === 'object' && 'default' in index ? index['default'] : index);

    var stateMachine = __commonjs(function (module, exports) {
    /*

      Javascript State Machine Library - https://github.com/jakesgordon/javascript-state-machine

      Copyright (c) 2012, 2013, 2014, 2015, Jake Gordon and contributors
      Released under the MIT license - https://github.com/jakesgordon/javascript-state-machine/blob/master/LICENSE

    */

    (function () {

      var StateMachine = {

        //---------------------------------------------------------------------------

        VERSION: "2.3.5",

        //---------------------------------------------------------------------------

        Result: {
          SUCCEEDED:    1, // the event transitioned successfully from one state to another
          NOTRANSITION: 2, // the event was successfull but no state transition was necessary
          CANCELLED:    3, // the event was cancelled by the caller in a beforeEvent callback
          PENDING:      4  // the event is asynchronous and the caller is in control of when the transition occurs
        },

        Error: {
          INVALID_TRANSITION: 100, // caller tried to fire an event that was innapropriate in the current state
          PENDING_TRANSITION: 200, // caller tried to fire an event while an async transition was still pending
          INVALID_CALLBACK:   300 // caller provided callback function threw an exception
        },

        WILDCARD: '*',
        ASYNC: 'async',

        //---------------------------------------------------------------------------

        create: function(cfg, target) {

          var initial      = (typeof cfg.initial == 'string') ? { state: cfg.initial } : cfg.initial; // allow for a simple string, or an object with { state: 'foo', event: 'setup', defer: true|false }
          var terminal     = cfg.terminal || cfg['final'];
          var fsm          = target || cfg.target  || {};
          var events       = cfg.events || [];
          var callbacks    = cfg.callbacks || {};
          var map          = {}; // track state transitions allowed for an event { event: { from: [ to ] } }
          var transitions  = {}; // track events allowed from a state            { state: [ event ] }

          var add = function(e) {
            var from = (e.from instanceof Array) ? e.from : (e.from ? [e.from] : [StateMachine.WILDCARD]); // allow 'wildcard' transition if 'from' is not specified
            map[e.name] = map[e.name] || {};
            for (var n = 0 ; n < from.length ; n++) {
              transitions[from[n]] = transitions[from[n]] || [];
              transitions[from[n]].push(e.name);

              map[e.name][from[n]] = e.to || from[n]; // allow no-op transition if 'to' is not specified
            }
          };

          if (initial) {
            initial.event = initial.event || 'startup';
            add({ name: initial.event, from: 'none', to: initial.state });
          }

          for(var n = 0 ; n < events.length ; n++)
            add(events[n]);

          for(var name in map) {
            if (map.hasOwnProperty(name))
              fsm[name] = StateMachine.buildEvent(name, map[name]);
          }

          for(var name in callbacks) {
            if (callbacks.hasOwnProperty(name))
              fsm[name] = callbacks[name]
          }

          fsm.current     = 'none';
          fsm.is          = function(state) { return (state instanceof Array) ? (state.indexOf(this.current) >= 0) : (this.current === state); };
          fsm.can         = function(event) { return !this.transition && (map[event].hasOwnProperty(this.current) || map[event].hasOwnProperty(StateMachine.WILDCARD)); }
          fsm.cannot      = function(event) { return !this.can(event); };
          fsm.transitions = function()      { return transitions[this.current]; };
          fsm.isFinished  = function()      { return this.is(terminal); };
          fsm.error       = cfg.error || function(name, from, to, args, error, msg, e) { throw e || msg; }; // default behavior when something unexpected happens is to throw an exception, but caller can override this behavior if desired (see github issue #3 and #17)

          if (initial && !initial.defer)
            fsm[initial.event]();

          return fsm;

        },

        //===========================================================================

        doCallback: function(fsm, func, name, from, to, args) {
          if (func) {
            try {
              return func.apply(fsm, [name, from, to].concat(args));
            }
            catch(e) {
              return fsm.error(name, from, to, args, StateMachine.Error.INVALID_CALLBACK, "an exception occurred in a caller-provided callback function", e);
            }
          }
        },

        beforeAnyEvent:  function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onbeforeevent'],                       name, from, to, args); },
        afterAnyEvent:   function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onafterevent'] || fsm['onevent'],      name, from, to, args); },
        leaveAnyState:   function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onleavestate'],                        name, from, to, args); },
        enterAnyState:   function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onenterstate'] || fsm['onstate'],      name, from, to, args); },
        changeState:     function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onchangestate'],                       name, from, to, args); },

        beforeThisEvent: function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onbefore' + name],                     name, from, to, args); },
        afterThisEvent:  function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onafter'  + name] || fsm['on' + name], name, from, to, args); },
        leaveThisState:  function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onleave'  + from],                     name, from, to, args); },
        enterThisState:  function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onenter'  + to]   || fsm['on' + to],   name, from, to, args); },

        beforeEvent: function(fsm, name, from, to, args) {
          if ((false === StateMachine.beforeThisEvent(fsm, name, from, to, args)) ||
              (false === StateMachine.beforeAnyEvent( fsm, name, from, to, args)))
            return false;
        },

        afterEvent: function(fsm, name, from, to, args) {
          StateMachine.afterThisEvent(fsm, name, from, to, args);
          StateMachine.afterAnyEvent( fsm, name, from, to, args);
        },

        leaveState: function(fsm, name, from, to, args) {
          var specific = StateMachine.leaveThisState(fsm, name, from, to, args),
              general  = StateMachine.leaveAnyState( fsm, name, from, to, args);
          if ((false === specific) || (false === general))
            return false;
          else if ((StateMachine.ASYNC === specific) || (StateMachine.ASYNC === general))
            return StateMachine.ASYNC;
        },

        enterState: function(fsm, name, from, to, args) {
          StateMachine.enterThisState(fsm, name, from, to, args);
          StateMachine.enterAnyState( fsm, name, from, to, args);
        },

        //===========================================================================

        buildEvent: function(name, map) {
          return function() {

            var from  = this.current;
            var to    = map[from] || map[StateMachine.WILDCARD] || from;
            var args  = Array.prototype.slice.call(arguments); // turn arguments into pure array

            if (this.transition)
              return this.error(name, from, to, args, StateMachine.Error.PENDING_TRANSITION, "event " + name + " inappropriate because previous transition did not complete");

            if (this.cannot(name))
              return this.error(name, from, to, args, StateMachine.Error.INVALID_TRANSITION, "event " + name + " inappropriate in current state " + this.current);

            if (false === StateMachine.beforeEvent(this, name, from, to, args))
              return StateMachine.Result.CANCELLED;

            if (from === to) {
              StateMachine.afterEvent(this, name, from, to, args);
              return StateMachine.Result.NOTRANSITION;
            }

            // prepare a transition method for use EITHER lower down, or by caller if they want an async transition (indicated by an ASYNC return value from leaveState)
            var fsm = this;
            this.transition = function() {
              fsm.transition = null; // this method should only ever be called once
              fsm.current = to;
              StateMachine.enterState( fsm, name, from, to, args);
              StateMachine.changeState(fsm, name, from, to, args);
              StateMachine.afterEvent( fsm, name, from, to, args);
              return StateMachine.Result.SUCCEEDED;
            };
            this.transition.cancel = function() { // provide a way for caller to cancel async transition if desired (issue #22)
              fsm.transition = null;
              StateMachine.afterEvent(fsm, name, from, to, args);
            }

            var leave = StateMachine.leaveState(this, name, from, to, args);
            if (false === leave) {
              this.transition = null;
              return StateMachine.Result.CANCELLED;
            }
            else if (StateMachine.ASYNC === leave) {
              return StateMachine.Result.PENDING;
            }
            else {
              if (this.transition) // need to check in case user manually called transition() but forgot to return StateMachine.ASYNC
                return this.transition();
            }

          };
        }

      }; // StateMachine

      //===========================================================================

      //======
      // NODE
      //======
      if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
          exports = module.exports = StateMachine;
        }
        exports.StateMachine = StateMachine;
      }
      //============
      // AMD/REQUIRE
      //============
      else if (typeof define === 'function' && define.amd) {
        define(function(require) { return StateMachine; });
      }
      //========
      // BROWSER
      //========
      else if (typeof window !== 'undefined') {
        window.StateMachine = StateMachine;
      }
      //===========
      // WEB WORKER
      //===========
      else if (typeof self !== 'undefined') {
        self.StateMachine = StateMachine;
      }

    }());
    });

    var StateMachine = (stateMachine && typeof stateMachine === 'object' && 'default' in stateMachine ? stateMachine['default'] : stateMachine);

    var debug$1 = d('LC:WebSocketPlus');

    var WebSocket = global.WebSocket || global.MozWebSocket || require('ws');
    var HEARTBEAT_TIME = 60000;
    var TIMEOUT_TIME = 180000;

    var WebSocketPlus = function (_EventEmitter) {
      _inherits(WebSocketPlus, _EventEmitter);

      function WebSocketPlus(getUrls, protocol) {
        _classCallCheck(this, WebSocketPlus);

        debug$1('initializing connection');
        if (typeof WebSocket === 'undefined') {
          throw new Error('WebSocket is undefined. Polyfill is required in this runtime.');
        }

        var _this = _possibleConstructorReturn(this, _Object$getPrototypeOf(WebSocketPlus).call(this));

        if (typeof getUrls !== 'function') {
          _this._getUrls = function () {
            return Promise.resolve(getUrls);
          };
        } else {
          _this._getUrls = getUrls;
        }
        _this._protocol = protocol;
        _this.init();
        _this._createWs(_this._getUrls, _this._protocol).then(function () {
          return _this.open();
        }, function (error) {
          return _this.throw(error);
        });
        return _this;
      }

      _createClass(WebSocketPlus, [{
        key: '_createWs',
        value: function _createWs(getUrls, protocol) {
          var _this2 = this;

          return getUrls().then(function (wsUrls) {
            var urls = wsUrls;
            if (!(urls instanceof Array)) {
              urls = [urls];
            }
            return tryAll(urls.map(function (url) {
              return function (resolve, reject) {
                debug$1('connect [' + url + '] ' + protocol);
                var ws = protocol ? new WebSocket(url, protocol) : new WebSocket(url);
                ws.onopen = function () {
                  return resolve(ws);
                };
                ws.onerror = function (error) {
                  if (error instanceof Error) {
                    return reject(error);
                  }
                  // in browser, error event is useless
                  return reject(new Error('Failed to connect [' + url + ']'));
                };
              };
            })).then(function (ws) {
              _this2._ws = ws;
              _this2._ws.onclose = _this2._handleClose.bind(_this2);
              _this2._ws.onmessage = _this2.handleMessage.bind(_this2);
              return ws;
            });
          });
        }
      }, {
        key: '_destroyWs',
        value: function _destroyWs() {
          var ws = this._ws;
          if (!ws) return;
          ws.onopen = ws.onclose = ws.onerror = ws.onmessage = null;
          this._ws = null;
          ws.close();
        }
      }, {
        key: 'onopen',
        value: function onopen() {
          debug$1('open');
          this.emit('open');
        }
      }, {
        key: 'onconnected',
        value: function onconnected() {
          this._startConnectionKeeper();
        }
      }, {
        key: 'onleaveconnected',
        value: function onleaveconnected() {
          this._stopConnectionKeeper();
        }
      }, {
        key: 'ondisconnect',
        value: function ondisconnect() {
          debug$1('disconnect');
          this._destroyWs();
          this._retryCount = 0;
          this.emit('disconnect');
          this.retry();
        }
      }, {
        key: 'onreconnect',
        value: function onreconnect() {
          debug$1('reconnect');
          this.emit('reconnect');
        }
      }, {
        key: 'onretry',
        value: function onretry() {
          var _this3 = this;

          setTimeout(function () {
            if (_this3.is('disconnected')) {
              _this3._createWs(_this3._getUrls, _this3._protocol).then(function () {
                return _this3.reconnect();
              }, function () {
                return _this3.retry();
              });
              debug$1('retry [' + _this3._retryCount + ']');
              _this3.emit('retry', _this3._retryCount);
            }
          }, this._retryCount * 3000);
          this._retryCount++;
        }
      }, {
        key: 'onclose',
        value: function onclose() {
          debug$1('close');
          this._ws.close();
        }
      }, {
        key: 'onerror',
        value: function onerror(event, from, to, error) {
          debug$1('error', error);
          this.emit('error', error);
        }
      }, {
        key: '_postponeTimers',
        value: function _postponeTimers() {
          var _this4 = this;

          this._clearTimers();
          this._heartbeatTimer = setInterval(function () {
            debug$1('ping');
            _this4._ws.send('{}');
          }, HEARTBEAT_TIME);
          this._timeoutTimer = setTimeout(function () {
            _this4.disconnect();
          }, TIMEOUT_TIME);
        }
      }, {
        key: '_clearTimers',
        value: function _clearTimers() {
          if (this._heartbeatTimer) {
            clearInterval(this._heartbeatTimer);
          }
          if (this._timeoutTimer) {
            clearTimeout(this._timeoutTimer);
          }
        }
      }, {
        key: '_startConnectionKeeper',
        value: function _startConnectionKeeper() {
          debug$1('start connection keeper');
          this._ws.addEventListener('message', this._postponeTimers.bind(this));
          this._postponeTimers();
        }
      }, {
        key: '_stopConnectionKeeper',
        value: function _stopConnectionKeeper() {
          debug$1('stop connection keeper');
          // websockets/ws#489
          var removeListener = this._ws.removeEventListener || this._ws.removeListener;
          removeListener.call(this._ws, 'message', this._postponeTimers);
          this._clearTimers();
        }
      }, {
        key: '_handleClose',
        value: function _handleClose(event) {
          debug$1('ws closed [' + event.code + '] ' + event.reason);
          // socket closed manually, ignore close event.
          if (this.isFinished()) return;
          this.handleClose(event);
        }
      }, {
        key: 'handleClose',
        value: function handleClose() {
          // reconnect
          this.disconnect();
        }
      }, {
        key: 'send',
        value: function send(data) {
          debug$1('send', data);
          this._ws.send(data);
        }
      }, {
        key: 'handleMessage',
        value: function handleMessage(event) {
          debug$1('message', event.data);
          this.emit('message', event.data);
        }
      }]);

      return WebSocketPlus;
    }(EventEmitter);

    StateMachine.create({
      target: WebSocketPlus.prototype,
      initial: {
        state: 'initialized',
        event: 'init',
        defer: true
      },
      terminal: 'closed',
      events: [{
        name: 'open',
        from: 'initialized',
        to: 'connected'
      }, {
        name: 'disconnect',
        from: 'connected',
        to: 'disconnected'
      }, {
        name: 'retry',
        from: 'disconnected',
        to: 'disconnected'
      }, {
        name: 'reconnect',
        from: 'disconnected',
        to: 'connected'
      }, {
        name: 'close',
        from: ['connected', 'disconnected'],
        to: 'closed'
      }, {
        name: 'throw',
        from: '*',
        to: 'error'
      }]
    });

    var $_objectAssign = __commonjs(function (module) {
    // 19.1.2.1 Object.assign(target, source, ...)
    var $        = require$$2$2
      , toObject = require$$2$6
      , IObject  = require$$1$8;

    // should work with symbols and should have deterministic property order (V8 bug)
    module.exports = require$$0$17(function(){
      var a = Object.assign
        , A = {}
        , B = {}
        , S = Symbol()
        , K = 'abcdefghijklmnopqrst';
      A[S] = 7;
      K.split('').forEach(function(k){ B[k] = k; });
      return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
    }) ? function assign(target, source){ // eslint-disable-line no-unused-vars
      var T     = toObject(target)
        , $$    = arguments
        , $$len = $$.length
        , index = 1
        , getKeys    = $.getKeys
        , getSymbols = $.getSymbols
        , isEnum     = $.isEnum;
      while($$len > index){
        var S      = IObject($$[index++])
          , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
          , length = keys.length
          , j      = 0
          , key;
        while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
      }
      return T;
    } : Object.assign;
    });

    var require$$0$19 = ($_objectAssign && typeof $_objectAssign === 'object' && 'default' in $_objectAssign ? $_objectAssign['default'] : $_objectAssign);

    var es6_object_assign = __commonjs(function (module) {
    // 19.1.3.1 Object.assign(target, source)
    var $export = require$$2$4;

    $export($export.S + $export.F, 'Object', {assign: require$$0$19});
    });

    var assign$1 = __commonjs(function (module) {
    module.exports = require$$1$3.Object.assign;
    });

    var require$$0$9 = (assign$1 && typeof assign$1 === 'object' && 'default' in assign$1 ? assign$1['default'] : assign$1);

    var assign = __commonjs(function (module) {
    module.exports = { "default": require$$0$9, __esModule: true };
    });

    var _Object$assign = (assign && typeof assign === 'object' && 'default' in assign ? assign['default'] : assign);

    var m = new WebSocketMessage();
    m.toString();

    var agent = superagentPromise(superagent, Promise);
    var debug = d('LC:Realtime');

    var Realtime = function (_EventEmitter) {
      _inherits(Realtime, _EventEmitter);

      function Realtime(options) {
        _classCallCheck(this, Realtime);

        debug('initializing Realtime');

        var _this = _possibleConstructorReturn(this, _Object$getPrototypeOf(Realtime).call(this));

        if (typeof options.appId !== 'string') {
          throw new TypeError('appId [' + options.appId + '] is not a string');
        }
        if (typeof options.appKey !== 'string') {
          throw new TypeError('appKey is not a string');
        }
        _this._options = _Object$assign({
          appId: undefined,
          appKey: undefined,
          region: 'cn',
          pushUnread: true,
          ssl: true
        }, options);
        _this._cache = {};
        return _this;
      }

      _createClass(Realtime, [{
        key: '_connect',
        value: function _connect() {
          var _this2 = this;

          if (this._promise) return this._promise;

          var protocolsVersion = 1;
          if (this._options.pushUnread) {
            // 不推送离线消息，而是发送对话的未读通知
            protocolsVersion = 3;
          }
          var protocol = 'lc.protobuf.' + protocolsVersion;

          this._promise = new Promise(function (resolve, reject) {
            var ws = new WebSocketPlus(function () {
              return _this2._getEndpoints(_this2._options);
            }, protocol);
            ws.on('open', function () {
              return resolve(_this2);
            });
            ws.on('error', reject);
            // override handleClose
            ws.handleClose = function handleClose(event) {
              var fatalError = [APP_NOT_AVAILABLE, INVALID_LOGIN, INVALID_ORIGIN].find(function (error) {
                return error.code === event.code;
              });
              if (fatalError) {
                // in these cases, SDK should throw.
                var error = new Error('' + (fatalError.message || event.reason));
                error.code = event.code;
                this.throw(error);
              } else {
                // reconnect
                this.disconnect();
              }
            };
          });

          return this._promise;
        }
      }, {
        key: '_getCache',
        value: function _getCache(key) {
          var cache = this._cache[key];
          if (cache) {
            var expired = cache.expiredAt && cache.expiredAt < Date.now();
            if (!expired) {
              return cache.value;
            }
          }
          return null;
        }
      }, {
        key: '_setCache',
        value: function _setCache(key, value, expiredTime) {
          var cache = this._cache[key] = {
            value: value
          };
          if (typeof expiredTime === 'number') {
            cache.expiredAt = Date.now() + expiredTime;
          }
        }
      }, {
        key: '_getEndpoints',
        value: function _getEndpoints(options) {
          var _this3 = this;

          return Promise.resolve(this._getCache('endpoints') || this._fetchEndpointsInfo(options).then(tap(function (info) {
            return _this3._setCache('endpoints', info, info.ttl);
          }))).then(function (info) {
            debug('endpoint info:', info);
            return [info.server, info.secondary];
          });
        }
      }, {
        key: '_fetchEndpointsInfo',
        value: function _fetchEndpointsInfo(options) {
          debug('fetch endpoint info');
          var appId = options.appId;
          var region = options.region;
          var ssl = options.ssl;

          var router = undefined;
          switch (region) {
            case 'cn':
              router = 'router-g0-push.leancloud.cn/v1/route';
              break;
            case 'us':
              router = 'router-a0-push.leancloud.cn/v1/route';
              break;
            default:
              throw new Error('Region [' + region + '] is not supported.');
          }
          var protocol = global.location ? '//' : 'https://';

          return agent.get('' + protocol + router).query({
            appId: appId,
            secure: ssl,
            _t: Date.now()
          }).timeout(20000).then(function (res) {
            return res.body;
          });
        }
      }, {
        key: 'createIMClient',
        value: function createIMClient() {
          return this._connect();
        }
      }, {
        key: 'createPushClient',
        value: function createPushClient() {
          return this._connect();
        }
      }]);

      return Realtime;
    }(EventEmitter);

    return Realtime;

}));
//# sourceMappingURL=bundle.browser.js.map