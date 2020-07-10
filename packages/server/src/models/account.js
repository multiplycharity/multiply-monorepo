import mongoose from 'mongoose'
import { ethers } from 'ethers'

const Schema = mongoose.Schema

const AccountSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    passwordDerivedKeyHash: { type: String, required: true },
    encryptedEncryptionKey: { type: Object, required: true },
    encryptedMnemonic: { type: Object, required: true },
    address: { type: String },
    sessionKey: {
      type: String,
      unique: true,
      default: () => ethers.Wallet.createRandom().privateKey
    }
  },
  {
    timestamps: true
  }
)

const Account = mongoose.model('Account', AccountSchema)

export default Account
