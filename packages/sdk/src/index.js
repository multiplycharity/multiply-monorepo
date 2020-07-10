export default class WalletSDK {
  constructor ({ apiHost = `` }) {
    this.apiHost = apiHost
  }

  /**
   * Registers new account in database
   * @param {String} id Id (phone number | email)
   * @param {String} password Password
   */
  async register (id, password) {
    const wallet = ethers.Wallet.createRandom()

    return register({
      id,
      password,
      apiHost: this.apiHost,
      wallet
    })
  }

  /**
   * Logs existing account into system
   * @param {String} id Id (phone number | email)
   * @param {String} password Password
   */
  async login (id, password) {
    return login({ id, password, apiHost: this.apiHost })
  }

  /**
   * Fetches session key from server, decrypts session keystore and returns private key
   * @param {Object} sessionKeyStore Encrypted session key store
   * @return `{success, privateKey, error}`
   */
  async extractPrivateKeyFromSession (sessionKeyStore) {
    return extractPrivateKeyFromSession({
      sessionKeyStore,
      apiHost: this.apiHost
    })
  }
}
