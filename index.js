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

const rootID = "https://lemonlatte.github.io/bitmarkd-repo.jsonld"

const {
  privateKeyBase58,
  privateKeyBase58Invoke,
} = require("./constants");

const {
  publicKey,
  invokeKey,
  didBitmark,
} = require("./controllers");

const ActionCaveat = require('./caveat.js');

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

  new ActionCaveat({
    action: 'read'
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
        caveat: [new ExpirationCaveat(), new ActionCaveat()]
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
      caveat: [new ExpirationCaveat(), new ActionCaveat()],
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
      caveat: [new ExpirationCaveat(), new ActionCaveat()],
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
