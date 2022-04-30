import Razorpay from "razorpay";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method == "POST") {
    try {
      const { amount } = req.body;
      const instance = new Razorpay({
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
      const options = {
        amount: amount * 100, // amount in smallest currency unit
        currency: "INR",
      };
      const order = await instance.orders.create(options);
      console.log(order);
      res.status(200).json(order);
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(400).json({ status: 400, message: "INVALID REQUEST" });
  }
}
