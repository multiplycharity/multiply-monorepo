import { Account } from '../models'
import logger from '../utils/logger'

class AccountsService {
  async findAccount (id) {
    if (id == null) {
      return
    }
    return Account.findOne({ id })
  }

  async findById (accountId) {
    if (accountId == null) {
      return
    }
    return Account.findOne({
      _id: accountId
    })
  }

  async create ({
    id,
    passwordHash,
    passwordDerivedKeyHash,
    encryptedEncryptionKey,
    encryptedMnemonic,
    address
  }) {
    try {
      const account = new Account({
        id,
        passwordHash,
        passwordDerivedKeyHash,
        encryptedEncryptionKey,
        encryptedMnemonic,
        address
      })

      logger.debug('Creating new account..')
      logger.json(account)

      await account.save()
      logger.info(`Created new account for ${account.id}`)

      return account
    } catch (err) {
      logger.error(err.message)
      throw new Error(err.message)
    }
  }

  async update ({ id, address }) {
    const account = await this.findAccount(id)

    if (address) {
      account.address = address
    }

    logger.debug(`Updating account ${account.id}`)
    await account.save()

    logger.info('Account successfully updated')
    return account
  }
}

export default new AccountsService()
