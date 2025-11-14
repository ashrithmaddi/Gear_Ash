const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

exports.createOrder = async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // INR in paise
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: "Order creation failed" });
  }
};

exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, student, course } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
                                  .update(body)
                                  .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // Enroll the student after payment success
    const Enrollment = require("../models/Enrollment");
    const existing = await Enrollment.findOne({ student, course });
    if (!existing) {
      await Enrollment.create({ student, course });
    }

    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false, error: "Invalid signature" });
  }
};
