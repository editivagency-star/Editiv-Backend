const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["invoice", "quote"],
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    serviceType: {
      type: String,
      default: "Social Media Marketing",
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      default: null,
    },
    clientName: {
      type: String,
      required: true,
    },
    clientAddress: {
      type: String,
    },
    clientEmail: {
      type: String,
    },
    clientPhone: {
      type: String,
    },
    senderName: {
      type: String,
      default: "Editiv Agency",
    },
    senderAddress: {
      type: String,
      default: "Ramnagar 08, Agartala (W) Tripura - 799002",
    },
    senderContact: {
      type: String,
      default: "+91 70854 19358",
    },
    senderEmail: {
      type: String,
      default: "editivagency@gmail.com",
    },
    items: [
      {
        qty: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        duration: {
          type: String,
          default: "",
        },
        price: {
          type: Number,
          required: true,
        },
        subtotal: {
          type: Number,
          required: true,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      default: "50% of the total service fee must be paid before the work starts.\nOne dedicated social media manager will handle and manage your social media accounts.\nRegular monitoring and optimization of Meta (Facebook & Instagram) ad campaigns will be done.\nThe advertising budget is not included in the service fee and must be paid separately by the client.",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
