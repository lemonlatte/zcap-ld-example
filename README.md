# ZCAP example for git

This is an example that makes a capability of a git resource.

### Pre-requisite

* node.js (npm)

### Run

```
$ node index.js
signed {
  '@context': 'https://w3id.org/security/v2',
  id: 'urn:uuid:cab83279-c695-4e66-9458-4327de49197a',
  parentCapability: 'https://lemonlatte.github.io/bitmarkd-repo.jsonld',
  invocationTarget: 'https://lemonlatte.github.io/bitmarkd-repo.jsonld',
  invoker: 'did:bitmark:e4CHPviKRu5P6L5YQ15qYL77tfXEGua4U4maPTmzf4YwxCMA9d',
  proof: {
    type: 'Ed25519Signature2018',
    created: '2020-09-07T02:30:12Z',
    capabilityChain: [ 'https://lemonlatte.github.io/bitmarkd-repo.jsonld' ],
    jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..ggwKVBqG_Jj0obRzCXactDYJlrymWxPusjMoxx_ao6vf-LUN-85Bw2QJ9VZMyb_SmzTFapjK8m3KvGH-IjYADw',
    proofPurpose: 'capabilityDelegation',
    verificationMethod: 'did:bitmark:e4CHPviKRu5P6L5YQ15qYL77tfXEGua4U4maPTmzf4YwxCMA9d#key-1'
  }
}
delegation verified
signed2 {
  '@context': 'https://w3id.org/security/v2',
  id: 'urn:uuid:ad86cb2c-e9db-434a-beae-71b82120a8a4',
  parentCapability: 'urn:uuid:cab83279-c695-4e66-9458-4327de49197a',
  invoker: 'did:bitmark:e4CHPviKRu5P6L5YQ15qYL77tfXEGua4U4maPTmzf4YwxCMA9d',
  proof: {
    type: 'Ed25519Signature2018',
    created: '2020-09-07T02:30:12Z',
    capability: 'https://lemonlatte.github.io/bitmarkd-repo.jsonld',
    jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..ddf9BRBj5YArRI944-40nwHBT_Dur6ma_XzjHNA0b8Bm0klr9092dMljCq2yz8d8a0GcD2BADgZJFvMQwZ3IBg',
    proofPurpose: 'capabilityInvocation',
    verificationMethod: 'did:bitmark:e4CHPviKRu5P6L5YQ15qYL77tfXEGua4U4maPTmzf4YwxCMA9d#key-2'
  }
}
invocation verified
```
