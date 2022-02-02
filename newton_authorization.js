console.log("Veririficando token...");

const sdk = require('postman-collection');
const JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;
const currentToken = pm.globals.get('token');

let expired = true;

if (currentToken && currentToken.length > 0) {
    const parsed = jwsDecode(currentToken, null);
    expired = isTokenExpired(parsed.payload.exp);
}

if (expired) {
    requestNewToken();
} else {
    console.log('Token is still valid');
}

function requestNewToken() {

    const path = pm.globals.get('access_token_url');
    const client_id = pm.globals.get('client_id');
    const client_secret = pm.globals.get('client_secret');
    const scope = pm.globals.get('scope');

    // Create request
    const tokenRequest = new sdk.Request({
        url: path,
        method: 'POST',
        header: {
        'Content-Type': 'multipart/form-data',
          },
      body: {
          mode: 'formdata',
          formdata: [
            { key: "client_id", value: client_id },
            { key: "client_secret", value: client_secret },
            { key: "scope", value: scope },
            { key: "grant_type", value: "client_credentials" },            
        ]
      }
    });

    pm.sendRequest(tokenRequest, function(err, response) {
      
      if (err) {
          console.log("Error al obtener el token: " + err);
          return;
      }

      const json = response.json();
      pm.expect(json).to.an('object');
    
      pm.test('response json has needed properties', function() {
    
        pm.expect(json).to.have.own.property('access_token');
        pm.expect(json).to.have.own.property('expires_in');
        pm.expect(json).to.have.own.property('token_type');
    
        const accessToken = json.access_token;
        
        console.log(`Nuevo token: ${accessToken}`);
    
        pm.globals.set('token', accessToken);

      });
    });
}

function padString(input) {
    let segmentLength = 4;
    let stringLength = input.length;
    let diff = stringLength % segmentLength;

    if (!diff) {
        return input;
    }

    let position = stringLength;
    let padLength = segmentLength - diff;
    let paddedStringLength = stringLength + padLength;
    let buffer = new Buffer(paddedStringLength);

    buffer.write(input);

    while (padLength--) {
        buffer.write("=", position++);
    }

    return buffer.toString();
}

function decode(base64url, encoding = "utf8") {
    return new Buffer(toBase64(base64url), "base64").toString(encoding);
}

function toBase64(base64url) {
    base64url = base64url.toString();
    return padString(base64url)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");
}

function isObject(thing) {
    return Object.prototype.toString.call(thing) === '[object Object]';
}

function safeJsonParse(thing) {
    if (isObject(thing))
        return thing;
    try { return JSON.parse(thing); } catch (e) { return undefined; }
}

function headerFromJWS(jwsSig) {
    var encodedHeader = jwsSig.split('.', 1)[0];
    return safeJsonParse(decode(encodedHeader, 'binary'));
}

function isValidJws(string) {
    return JWS_REGEX.test(string) && !!headerFromJWS(string);
}

function payloadFromJWS(jwsSig, encoding) {
    encoding = encoding || 'utf8';
    var payload = jwsSig.split('.')[1];
    return decode(payload, encoding);
}

function signatureFromJWS(jwsSig) {
    return jwsSig.split('.')[2];
}

function jwsDecode(jwsSig, opts) {
    
    opts = opts || {};

    if (!isValidJws(jwsSig))
        return null;

    var header = headerFromJWS(jwsSig);

    if (!header)
        return null;

    var payload = payloadFromJWS(jwsSig);
    if (header.typ === 'JWT' || opts.json)
        payload = JSON.parse(payload, opts.encoding);

    return {
        header: header,
        payload: payload,
        signature: signatureFromJWS(jwsSig)
    };
}

function isTokenExpired(exp) {
    try {
        return ((Date.now() / 1000) > exp);
    } catch (error) {
        return true;
    }
}
