# ZCAP example for git

This is an example that makes a capability of a git resource.

### Pre-requisite

* node.js (npm)

### Run

```
$ node index.js
========== Delegation ==========
Sign delegation capability…
Signed capability:  {
  '@context': 'https://w3id.org/security/v2',
  id: 'urn:uuid:cab83279-c695-4e66-9458-4327de49197a',
  parentCapability: 'https://lemonlatte.github.io/bitmarkd-repo.jsonld',
  invocationTarget: 'https://lemonlatte.github.io/bitmarkd-repo.jsonld',
  invoker: 'did:bitmark:e4CHPviKRu5P6L5YQ15qYL77tfXEGua4U4maPTmzf4YwxCMA9d',
  caveat: { type: 'sec:ExpirationCaveat', expires: '2020-09-07T07:25:36Z' },
  proof: {
    type: 'Ed25519Signature2018',
    created: '2020-09-07T07:25:33Z',
    capabilityChain: [ 'https://lemonlatte.github.io/bitmarkd-repo.jsonld' ],
    jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..BgZ8riTeWpjwTfPUoYSb8idY9nHL_9kKEZXBwIGcHcTQmPG6BJEJ92uW-VtIHwQTn4igA5MR58ERr9YP87gzAQ',
    proofPurpose: 'capabilityDelegation',
    verificationMethod: 'did:bitmark:e4CHPviKRu5P6L5YQ15qYL77tfXEGua4U4maPTmzf4YwxCMA9d#key-1'
  }
}
Verify delegation capability…
Delegation capability verified
========== Invocation ==========
Sign invocation capability…
Signed capability: {
  '@context': 'https://w3id.org/security/v2',
  id: 'urn:uuid:ad86cb2c-e9db-434a-beae-71b82120a8a4',
  proof: {
    type: 'Ed25519Signature2018',
    created: '2020-09-07T07:25:35Z',
    capability: 'urn:uuid:cab83279-c695-4e66-9458-4327de49197a',
    jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..njqpwKhTzB_rgNyGcfOng-VqvoYo-vgcMin7YGHAbn5zVWKxTMMb0ozbIL0Dyq_nyLRCGTAvlQAnOMLeXZhFCQ',
    proofPurpose: 'capabilityInvocation',
    verificationMethod: 'did:bitmark:e4CHPviKRu5P6L5YQ15qYL77tfXEGua4U4maPTmzf4YwxCMA9d#key-2'
  }
}
Verify invocation capability…
Invocation capability verified
```
