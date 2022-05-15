import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    creator: String, // app user
    duedate: Date,
    date: Date,
    orderID: String,
    items: [{ desc: String, itemID: String, quant: Number, pricePer: Number, priceTotal: Number }],
    tax: { percent: Number, sum: Number },
    total: Number,
    shipping: Number,
    subTotal: Number,
    status: { type: Boolean, default: false },
    issuer: { businessName: String, email: String, phone: String, adress: String, orgNr: String },
    customer: { name: String, email: String, phone: String, adress: String },
    payment: { pg: String, bg: String, iban: String, bic: String }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      /**
       * Filter document.
       *
       * @param {object} doc - The mongoose model being converted.
       * @param {object} ret - The object representation of the model.
       */
      transform: function (doc, ret) {
        delete ret._id
        delete ret.__v
      }
    }
  }
)

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

export default mongoose.model('Invoice', schema)
