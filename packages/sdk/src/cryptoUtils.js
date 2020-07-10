import crypto from 'crypto'

/**
 * Generates random encryption key of size 64 bytes
 * @return `encryptionKey` Encryption key
 */
export const generateEncryptionKey = () => {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Generates random initializatin vector of size 16 bytes
 * @return `iv` Initialization vector
 */
export const generateIV = () => {
  return crypto.randomBytes(16).toString('hex')
}

/**
 * Encrypts `encryptionKey` using AES-CBC algorithm with password derived key as the secret and 16 random bytes as the IV
 * @param {String} id id
 * @param {String} password Password
 * @param {String} encryptionKey Encryption key
 * @return `{encryptedEncryptionKey, iv}`
 */
export const getEncryptedEncryptionKey = async (
  id,
  password,
  encryptionKey
) => {
  const passwordDerivedKey = await getPasswordDerivedKey(id, password)
  const iv = generateIV()

  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(passwordDerivedKey, 'hex'),
    Buffer.from(iv, 'hex')
  )

  const encryptedEncryptionKey =
    cipher.update(encryptionKey, 'hex', 'hex') + cipher.final('hex')

  return { encryptedEncryptionKey, iv }
}

/**
 * Encrypts `mnemonic` using AES-CBC algorithm with `encryptionKey` as the secret and 16 bytes IV
 * @param {String} mnemonic Mnemonic
 * @return `{encryptedMnemonic, iv}`
 */
export const getEncryptedMnemonic = async (mnemonic, encryptionKey, iv) => {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(encryptionKey, 'hex'),
    Buffer.from(iv, 'hex')
  )

  const encryptedMnemonic =
    cipher.update(mnemonic, 'utf8', 'hex') + cipher.final('hex')

  return { encryptedMnemonic, iv }
}

/**
 * Extracts decrypted encryption key using AES-CBC algorithm with 'passwordDerivedKey` as the key and 16 bytes IV
 * @param {String} encryptedEncryptionKey
 * @param {String} iv
 * @param {String} passwordDerivedKey
 * @return `encryptionKey`
 */
export const extractEncryptionKey = async (
  encryptedEncryptionKey,
  iv,
  passwordDerivedKey
) => {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(passwordDerivedKey, 'hex'),
    Buffer.from(iv, 'hex')
  )
  return (
    decipher.update(encryptedEncryptionKey, 'hex', 'hex') +
    decipher.final('hex')
  )
}

/**
 * Extracts decrypted mnemonic using AES-CBC algorithm with 'encryptionKey` as the key and 16 bytes IV
 * @param {String} encryptedEncryptionKey
 * @param {String} iv
 * @param {String} passwordDerivedKey
 * @return `mnemonic`
 */
export const extractMnemonic = async (encryptedMnemonic, iv, encryptionKey) => {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(encryptionKey, 'hex'),
    Buffer.from(iv, 'hex')
  )
  return (
    decipher.update(encryptedMnemonic, 'hex', 'utf8') + decipher.final('utf8')
  )
}

/**
 * Derives password derived key
 * @param {String} id Id (phone number | email)
 * @param {String} password Password
 * @return `passwordDerivedKey` Password derived key
 */
export const getPasswordDerivedKey = (id, password) => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, id, 2, 32, 'sha256', (err, passwordDerivedKey) => {
      if (err) reject(err)
      return resolve(passwordDerivedKey.toString('hex'))
    })
  })
}

/**
 * Derives password hash
 * @param {String} id id
 * @param {String} password Password
 * @return `passwordHash` Password hash
 */
export const getPasswordHash = async (id, password) => {
  const passwordDerivedKey = await getPasswordDerivedKey(id, password)
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      passwordDerivedKey,
      password,
      1,
      32,
      'sha256',
      (err, passwordHash) => {
        if (err) reject(err)
        return resolve(passwordHash.toString('hex'))
      }
    )
  })
}

/**
 * Hashes password derived key
 * @param {String} id id
 * @param {String} password Password
 * @return `passwordDerivedKeyHash` Password derived key hash
 */
export const getPasswordDerivedKeyHash = async (id, password) => {
  const passwordDerivedKey = await getPasswordDerivedKey(id, password)
  return crypto
    .createHash('sha512')
    .update(passwordDerivedKey)
    .digest('hex')
}
