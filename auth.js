"use strict";
const jsigs = require("jsonld-signatures")

const {
  PublicKeyProofPurpose
} = jsigs.purposes;

const {
  Ed25519Signature2018
} = jsigs.suites;

const {
  Ed25519KeyPair
} = require('crypto-ld');

const {
  privateKeyBase58,
} = require("./constants");

const {
  publicKey,
  controller,
  didBitmark,
} = require("./controllers");

const customLoader = async (url, options) => {
  if (url.startsWith('did:bitmark') && url in didBitmark) {
    return {
      contextUrl: "https://w3id.org/security/v2", // this is for a context via a link header
      document: didBitmark[url], // this is the actual document that was loaded
      documentUrl: url // this is the actual context URL after redirects
    };
  }
  // call the default documentLoader
  return nodeDocumentLoader(url);
};

(async function main() {
  const doc = {
    '@context': jsigs.SECURITY_CONTEXT_URL,
    nonce: (+new Date()).toString()
  };
  const signature = await jsigs.sign(doc, {
    suite: new Ed25519Signature2018({
      key: new Ed25519KeyPair({
        ...publicKey,
        privateKeyBase58
      }),
    }),
    purpose: new PublicKeyProofPurpose({
      controller: controller,
    })
  })
  console.log(signature)

  const result = await jsigs.verify(signature, {
    documentLoader: customLoader,
    suite: new Ed25519Signature2018(),
    purpose: new PublicKeyProofPurpose({
      controller: controller,
      date: new Date(parseInt(signature.nonce) - 500), // set date to the time a doc is created
      maxTimestampDelta: 1
    })
  })

  if (result.verified) {
    console.log("public key proofed")
  } else {
    console.log(result.error)
  }
})()
