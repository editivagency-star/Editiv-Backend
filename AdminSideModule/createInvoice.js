const Invoice = require("../models/Invoice");

module.exports = async (req, res) => {
  try {
    const {
      invoiceNumber,
      type,
      serviceType,
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
      advancePayment,
      duePayment,
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
    const finalAdvancePayment = advancePayment !== undefined ? Number(advancePayment) || 0 : 0;
    const finalDuePayment = duePayment !== undefined
      ? Number(duePayment) || 0
      : (type === "invoice" ? Math.max(0, finalGrandTotal - finalAdvancePayment) : 0);

    const invoice = await Invoice.create({
      invoiceNumber,
      type,
      serviceType: serviceType || "Social Media Marketing",
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
      advancePayment: finalAdvancePayment,
      duePayment: finalDuePayment,
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
