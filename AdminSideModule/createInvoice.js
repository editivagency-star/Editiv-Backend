const Invoice = require("../models/Invoice");

module.exports = async (req, res) => {
  try {
    const {
      invoiceNumber,
      type,
      date,
      client,
      clientName,
      clientAddress,
      clientEmail,
      clientPhone,
      senderName,
      senderAddress,
      senderContact,
      senderEmail,
      items,
      subtotal,
      tax,
      grandTotal,
      notes,
    } = req.body;

    if (!invoiceNumber || !type || !clientName || !items || !items.length) {
      return res.status(400).json({
        message: "Invoice number, type, client name, and items are required.",
      });
    }

    // Check unique invoice number
    const exists = await Invoice.findOne({ invoiceNumber });
    if (exists) {
      return res.status(400).json({
        message: `An invoice/quote with number ${invoiceNumber} already exists.`,
      });
    }

    // Validate calculations
    let computedSubtotal = 0;
    const mappedItems = items.map((item) => {
      const itemSubtotal = (item.qty || 0) * (item.price || 0);
      computedSubtotal += itemSubtotal;
      return {
        qty: item.qty,
        description: item.description,
        duration: item.duration || "",
        price: item.price,
        subtotal: itemSubtotal,
      };
    });

    const finalSubtotal = subtotal !== undefined ? subtotal : computedSubtotal;
    const finalTax = tax !== undefined ? tax : 0;
    const finalGrandTotal = grandTotal !== undefined ? grandTotal : (finalSubtotal + finalTax);

    const invoice = await Invoice.create({
      invoiceNumber,
      type,
      date: date || new Date(),
      client: client || null,
      clientName,
      clientAddress,
      clientEmail,
      clientPhone,
      senderName,
      senderAddress,
      senderContact,
      senderEmail,
      items: mappedItems,
      subtotal: finalSubtotal,
      tax: finalTax,
      grandTotal: finalGrandTotal,
      notes,
      createdBy: req.admin?.id || null,
    });

    res.status(201).json({
      message: "Invoice/Quote saved successfully.",
      invoice,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
