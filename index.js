"use strict";
const jsigs = require("jsonld-signatures")

const {
  Ed25519Signature2018
} = jsigs.suites;

const {
  Ed25519KeyPair
} = require('crypto-ld');

const {
  CapabilityInvocation,
  CapabilityDelegation,
  ExpirationCaveat,
} = require("ocapld");

const jsonld = require('jsonld');

// grab the built-in Node.js doc loader
const nodeDocumentLoader = jsonld.documentLoaders.node();
// or grab the XHR one: jsonld.documentLoaders.xhr()

// change the default document loader
const customLoader = async (url, options) => {
  if (url.startsWith('did:bitmark') && url in didBitmark) {
    return {
      contextUrl: "https://w3id.org/security/v2", // this is for a context via a link header
      document: didBitmark[url], // this is the actual document that was loaded
      documentUrl: url // this is the actual context URL after redirects
    };
  } else if (url.startsWith('urn:uuid') && url in capDB) {
    return {
      contextUrl: "https://w3id.org/security/v2", // this is for a context via a link header
      document: capDB[url], // this is the actual document that was loaded
      documentUrl: url // this is the actual context URL after redirects
    };
  }
  // call the default documentLoader
  return nodeDocumentLoader(url);
};

const privateKeyBase58 = "4KFqAQAtzE2UySaEjkTKGNqxz8dAaWthD6yUeeqQPiFYJgTh5UFNENkksPWooPxL7kPM8NaJ5GfEJdkZRVDgYfjU"
const publicKeyBase58 = "25VanJqXPwpDzzqTai7U2PiDRmMZhsKiS32WrFsP7x2z"


const privateKeyBase58Invoke = "qoCG1mMQA3vRNzdgrL3XWp9k1CWs8V4hNnu1fxiyFTRH3MHJyvoVG4z6j1QGTUgGjjnFnFSf1m5frThsZT33kQL"
const publicKeyBase58Invoke = "kdUPZ5qnh5hRRVUgDaDUeHexGyDmzyrBBXX2ShbQ13S"


const rootID = "https://lemonlatte.github.io/bitmarkd-repo.jsonld"

const publicKey = {
  '@context': jsigs.SECURITY_CONTEXT_URL,
  type: 'Ed25519VerificationKey2018',
  id: 'did:bitmark:e4CHPviKRu5P6L5YQ15qYL77tfXEGua4U4maPTmzf4YwxCMA9d#key-1',
  controller: 'did:bitmark:e4CHPviKRu5P6L5YQ15qYL77tfXEGua4U4maPTmzf4YwxCMA9d',
  publicKeyBase58
};

const invokeKey = {
  '@context': jsigs.SECURITY_CONTEXT_URL,
  type: 'Ed25519VerificationKey2018',
  id: 'did:bitmark:e4CHPviKRu5P6L5YQ15qYL77tfXEGua4U4maPTmzf4YwxCMA9d#key-2',
  controller: 'did:bitmark:e4CHPviKRu5P6L5YQ15qYL77tfXEGua4U4maPTmzf4YwxCMA9d',
  publicKeyBase58: publicKeyBase58Invoke
}

const controller = {
  '@context': jsigs.SECURITY_CONTEXT_URL,
  id: 'did:bitmark:e4CHPviKRu5P6L5YQ15qYL77tfXEGua4U4maPTmzf4YwxCMA9d',
  publicKey: [publicKey],
  authentication: [publicKey],
  capabilityDelegation: [publicKey],
  capabilityInvocation: [invokeKey],
};

const didBitmark = {
  [controller.id]: controller,
  [publicKey.id]: publicKey,
  [invokeKey.id]: invokeKey,
};


const capDB = {};

(async function main() {
  const mycap = {
    "@context": "https://w3id.org/security/v2",
    "id": "urn:uuid:cab83279-c695-4e66-9458-4327de49197a",
    "parentCapability": rootID,
    "invocationTarget": rootID,
    "invoker": "did:bitmark:e4CHPviKRu5P6L5YQ15qYL77tfXEGua4U4maPTmzf4YwxCMA9d"
  }

  const expires = new Date()
  expires.setSeconds(expires.getSeconds() + 3, 0)

  new ExpirationCaveat({
    expires
  }).update(mycap);

  console.log("========== Delegation ==========")
  let delegationCap;
  try {
    console.log("Sign delegation capability…")
    delegationCap = await jsigs.sign(mycap, {
      suite: new Ed25519Signature2018({
        key: new Ed25519KeyPair({
          ...publicKey,
          privateKeyBase58
        }),
      }),
      purpose: new CapabilityDelegation({
        capabilityChain: [rootID],
        caveat: new ExpirationCaveat()
      })
    });
    console.log("Signed capability: ", delegationCap)

    capDB[delegationCap.id] = delegationCap
  } catch (errors) {
    console.log(errors)
  }

  console.log("Verify delegation capability…")
  const result = await jsigs.verify(delegationCap, {
    suite: new Ed25519Signature2018(),
    purpose: new CapabilityDelegation({
      caveat: new ExpirationCaveat(),
    }),
    documentLoader: customLoader,
  })

  if (result.verified) {
    console.log("Delegation capability verified")
  } else {
    console.log("Verification error", result.error.errors)
  }

  const mycap2 = {
    "@context": "https://w3id.org/security/v2",
    "id": "urn:uuid:ad86cb2c-e9db-434a-beae-71b82120a8a4"
  }

  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })

  console.log("========== Invocation ==========")
  let invocationCap;
  try {
    console.log("Sign invocation capability…")
    invocationCap = await jsigs.sign(mycap2, {
      suite: new Ed25519Signature2018({
        key: new Ed25519KeyPair({
          ...invokeKey,
          privateKeyBase58: privateKeyBase58Invoke
        }),
      }),
      purpose: new CapabilityInvocation({
        capability: delegationCap.id
      })
    });
    capDB[invocationCap.id] = invocationCap
    console.log("Signed capability:", invocationCap)
  } catch (errors) {
    console.log(errors)
  }

  console.log("Verify invocation capability…")
  const result2 = await jsigs.verify(invocationCap, {
    suite: new Ed25519Signature2018(),
    purpose: new CapabilityInvocation({
      suite: new Ed25519Signature2018(),
      caveat: new ExpirationCaveat(),
      expectedTarget: rootID
    }),
    documentLoader: customLoader
  });

  if (result2.verified) {
    console.log("Invocation capability verified")
  } else {
    console.log("Verification error", result2.error.errors)
  }
})()
