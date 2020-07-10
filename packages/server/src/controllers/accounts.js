import logger from '../utils/logger'
import boom from '@hapi/boom'
import assert from 'assert-js'
import wrapAsync from '../utils/asyncWrapper'
import accountsService from '../services/accountsService'
import authService from '../services/authService'

export const exists = wrapAsync(async (req, res, next) => {
  try {
    const id = req.params.id
    const account = await accountsService.findAccount(id)
    res.send(!!account)
  } catch (err) {
    next(err)
  }
})

export const register = wrapAsync(async (req, res, next) => {
  try {
    const {
      id,
      passwordHash,
      passwordDerivedKeyHash,
      encryptedEncryptionKey,
      encryptedMnemonic,
      address
    } = req.body

    assert.string(id, 'Id (phone number | id) is required')
    assert.string(passwordHash, 'Password hash is required')
    assert.string(
      passwordDerivedKeyHash,
      'Password derived key hash is required'
    )
    assert.object(
      encryptedEncryptionKey,
      'Encrypted encryption key is required'
    )
    assert.object(encryptedMnemonic, 'Encrypted mnemonic is required')

    let account = await accountsService.findAccount(id)

    if (account) {
      return next(boom.badRequest('Account already exists'))
    }

    account = await accountsService.create({
      id,
      passwordHash,
      passwordDerivedKeyHash,
      encryptedEncryptionKey,
      encryptedMnemonic,
      address
    })

    await _setCookie(account._id, res)
    const sessionKey = await authService.getSessionKey(id)

    // set cookie
    res.json({ account, sessionKey, success: true })
  } catch (err) {
    next(err)
  }
})

const _setCookie = async (accountId, res) => {
  const jwt = await authService.getJWT(accountId)
  const cookieConfig = {
    httpOnly: true, // to disable accessing cookie via client side js
    // secure: true, // to force https (if you use it)
    maxAge: 1000000000, // ttl in ms (remove this option and cookie will die when browser is closed)
    signed: true // if you use the secret with cookieParser
  }

  res.cookie('MULTIPLY_JWT', jwt, cookieConfig)
}

export const login = wrapAsync(async (req, res, next) => {
  try {
    const { id, passwordHash } = req.body

    const account = await accountsService.findAccount(id)

    if (!account) {
      return next(boom.badRequest('No account found'))
    }

    if (account.passwordHash !== passwordHash) {
      return next(boom.badRequest('Invalid password'))
    }

    await _setCookie(account._id, res)
    const sessionKey = await authService.getSessionKey(id)

    res.json({
      encryptedEncryptionKey: account.encryptedEncryptionKey,
      encryptedMnemonic: account.encryptedMnemonic,
      sessionKey,
      success: true
    })
  } catch (err) {
    next(err)
  }
})

export const fetchSessionKey = wrapAsync(async (req, res, next) => {
  try {
    const signedCookies = req.signedCookies // get signed cookies
    if (!signedCookies.MULTIPLY_JWT) {
      return next(boom.badRequest('No JWT token in cookies'))
    }

    try {
      const accountId = await authService.decodeJWT(signedCookies.MULTIPLY_JWT)
      console.log({ accountId })
      const account = await accountsService.findById(accountId)
      return res.json({
        success: true,
        sessionKey: account.sessionKey
      })
    } catch (err) {
      next(boom.badRequest(err.message))
    }

    res.json({
      success: false
    })
  } catch (err) {
    next(err)
  }
})
