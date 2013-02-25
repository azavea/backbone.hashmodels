Backbone.HashModels = (function(Backbone, _, $){
    "use strict";

    /************************************************************
     Utilities
    ************************************************************/

    // Via http://www.webtoolkit.info/javascript-base64.html
    // Free for use: http://www.webtoolkit.info/licence.html
    // UTF-8 encoding
    var encodeUtf8 = function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = '', n;

        for (n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    };

    // Via http://www.webtoolkit.info/javascript-base64.html
    // Free for use: http://www.webtoolkit.info/licence.html
    // UTF-8 decoding
    var decodeUtf8 = function (utftext) {
        var string = '';
        var i = 0;
        var c = 0,
            c1 = 0,
            c2 = 0,
            c3 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    };

    // Via http://www.webtoolkit.info/javascript-base64.html
    // Free for use: http://www.webtoolkit.info/licence.html
    // Base64 encoding
    var _base64Key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var encodeBase64 = function (input) {
        var output = '';
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = encodeUtf8(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                _base64Key.charAt(enc1) + _base64Key.charAt(enc2) +
                _base64Key.charAt(enc3) + _base64Key.charAt(enc4);
        }

        return output;
    };

    // Via http://www.webtoolkit.info/javascript-base64.html
    // Free for use: http://www.webtoolkit.info/licence.html
    // Base64 decoding
    var decodeBase64 = function (input) {
        var output = '';
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

        while (i < input.length) {

            enc1 = _base64Key.indexOf(input.charAt(i++));
            enc2 = _base64Key.indexOf(input.charAt(i++));
            enc3 = _base64Key.indexOf(input.charAt(i++));
            enc4 = _base64Key.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 !== 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = decodeUtf8(output);

        return output;

    };

    // Via http://jsolait.net/browser/trunk/jsolait/lib/codecs.js (LGPL)
    // LZW-compress a string
    var compressLzw = function(s) {
        var dict = {};
        var data = (s + "").split("");
        var out = [];
        var currChar;
        var phrase = data[0];
        var code = 256;
        var i;

        for (i=1; i<data.length; i++) {
            currChar=data[i];
            if (dict[phrase + currChar]) {
                phrase += currChar;
            }
            else {
                out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
                dict[phrase + currChar] = code;
                code++;
                phrase=currChar;
            }
        }
        out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
        for (i=0; i<out.length; i++) {
            out[i] = String.fromCharCode(out[i]);
        }
        return out.join("");
    };

    // Via http://jsolait.net/browser/trunk/jsolait/lib/codecs.js (LGPL)
    // Decompress an LZW-encoded string
    var decompressLzw = function(s) {
        var dict = {};
        var data = (s + "").split("");
        var currChar = data[0];
        var oldPhrase = currChar;
        var out = [currChar];
        var code = 256;
        var phrase;
        var i;

        for (i=1; i<data.length; i++) {
            var currCode = data[i].charCodeAt(0);
            if (currCode < 256) {
                phrase = data[i];
            }
            else {
               phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
            }
            out.push(phrase);
            currChar = phrase.charAt(0);
            dict[code] = oldPhrase + currChar;
            code++;
            oldPhrase = phrase;
        }
        return out.join("");
    };

    /************************************************************
     Private members
    ************************************************************/

    var models = [];
    var watchedModelAttributes = [];
    var initialModelStates = [];
    var state = [];
    var stateString = '';

    var validdateEncodedCompressesStateString = function (s) {
        if (!s) {
            throw { name: 'ArgumentFalsey', message: 'Cannot convert falsey string to an object.' };
        } else {
            return s;
        }
    };

    var decodeStateObject = _.compose(
        JSON.parse,
        decompressLzw,
        decodeBase64,
        validdateEncodedCompressesStateString
    );

    var encodeStateObject = _.compose(
        encodeBase64,
        compressLzw,
        JSON.stringify
    );

    var defaultHashUpdateFunction = function(hash) {
        $.history.load(hash);
    };
    var updateHash = defaultHashUpdateFunction;

    var setupDefaultHashMonitorCallback = function(cb) {
        $.history.init(cb);
    };

    var handleModelChanged = function (model) {
        // backup the state in case there is an error changing it.
        var oldState = _.extend([], state);
        var oldStateString = stateString;
        var modelIndex = _.indexOf(models, model);
        var newValues;
        try {
           if (model.getState) {
                newValues = model.getState();
            } else {
                if (watchedModelAttributes[modelIndex]) {
                    newValues = _.pick(model.attributes, watchedModelAttributes[modelIndex]);
                } else {
                    newValues = model.attributes;
                }
            }
            state[modelIndex] = newValues;
            stateString = encodeStateObject(state);
            updateHash(stateString);
        } catch (err) {
            // Unable to parse the new state; reset to old state
            state = oldState;
            stateString = oldStateString;
        }
    };

    var handleHashChanged = function (hash) {
        var newState = [];
        var newStateString = '';
        if (hash === stateString) {
            return;
        }
        if (hash) {
            newStateString = hash;
            newState = decodeStateObject(hash);
            _.each(newState, function(value, index) {
                if (models[index] && value) {
                    if (models[index].setState) {
                        models[index].setState(value);
                    } else {
                        models[index].set(value);
                    }
                } else if (models[index]) {
                    if (models[index].setState) {
                        models[index].setState(initialModelStates[index]);
                    } else {
                        models[index].set(initialModelStates[index]);
                    }
                }
            });
        } else {
            _.each(models, function resetToInitialState(model, index) {
                if (model.setState) {
                    model.setState(initialModelStates[index]);
                } else {
                    model.set(initialModelStates[index]);
                }
            });
        }
        state = newState;
        stateString = newStateString;
    };

    /************************************************************
     Public Interface
     ************************************************************/
    var HashModels =  {
        init: function(hashUpdateCallback, setupHashMonitorCallback) {
            models = [];
            watchedModelAttributes = [];
            initialModelStates = [];
            state = [];
            stateString = '';

            updateHash = hashUpdateCallback || defaultHashUpdateFunction;

            if (setupHashMonitorCallback) {
                setupHashMonitorCallback(handleHashChanged);
            } else {
                setupDefaultHashMonitorCallback(handleHashChanged);
            }
            return this;
        },

        addModel: function(model, watchedAttributes) {
            var eventsToWatch = 'change';
            var modelIndex = models.length;
            var initialState;

            models.push(model);

            if (model.getState) {
                initialState = model.getState();
            } else {
                if (watchedAttributes && watchedAttributes.length) {
                    initialState = _.pick(model.attributes, watchedAttributes);
                } else {
                    initialState = _.extend({}, model.attributes);
                }
            }
            initialModelStates.push(initialState);

            if (watchedAttributes && watchedAttributes.length) {
                watchedModelAttributes.push(watchedAttributes);
                eventsToWatch = _.map(watchedAttributes, function(name) {
                    return 'change:' + name;
                }).join(' ');
            } else {
                watchedModelAttributes.push(null);
            }

            // If you load the page with a initial hash string, sync the
            // model object to with the hash state
            if (state[modelIndex]) {
                if (model.setState) {
                    model.setState(state[modelIndex]);
                } else {
                    model.set(state[modelIndex]);
                }
            }

            model.on(eventsToWatch, handleModelChanged, model);
        }
    };

    return HashModels;
})(Backbone, _, jQuery);