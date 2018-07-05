import { Connect, SimpleSigner } from 'uport-connect'

const uport = new Connect('DChallenge', {
  clientId: '2ofZ72oCq4DjZzgNVckMpDTHN4eJyjFC1y6',
  network: 'rinkeby',
  signer: SimpleSigner('930b8aa140aafa4d5ed37bff26da288e973ac31f4199a497f607bf5cd08a94be')
})

export default uport;
