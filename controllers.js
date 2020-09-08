"use strict";
const jsigs = require("jsonld-signatures")

const {
  publicKeyBase58,
  publicKeyBase58Invoke,
} = require("./constants");

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

module.exports = {
  didBitmark,
  controller,
  publicKey,
  invokeKey,
}
