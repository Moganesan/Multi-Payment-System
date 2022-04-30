import { useState, useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import axios from "axios";
import styles from "../styles/Home.module.css";

type Amount = number;

const Home: NextPage = () => {
  const [amount, setAmount] = useState<Amount>(100);

  const googlePay = (): any => {
    const supportedInstruments = [
      {
        supportedMethods: ["https://tez.google.com/pay"],
        data: {
          pa: "merchant-vpa@xxx",
          pn: "Merchant Name",
          tr: "1234ABCD", // your custom transaction reference ID
          url: "http://url/of/the/order/in/your/website",
          mc: "1234", // your merchant category code
          tn: "Purchase in Merchant",
          gstBrkUp: "GST:16.90|CGST:08.45|SGST:08.45", // GST value break up
          invoiceNo: "BillRef123", // your invoice number
          invoiceDate: "2019-06-11T13:21:50+05:30", // your invoice date and time
          gstIn: "29ABCDE1234F2Z5", // your GSTIN
        },
      },
    ];
  };

  function loadScript(src: any) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay() {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const result: any = await axios
      .post("/api/razorpay/orders", { amount: amount })
      .catch((err: any) => err.response.status);

    const { id: order_id, currency } = result.data;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      order_id: order_id,
      handler: async function (response: any) {
        // const data = {
        //   orderCreationId: order_id,
        //   razorpayPaymentId: response.razorpay_payment_id,
        //   razorpayOrderId: response.razorpay_order_id,
        //   razorpaySignature: response.razorpay_signature,
        // };
      },
      // prefill: {
      //   email,
      //   name,
      // },
      notes: {},
      theme: {
        color: "#6366f1",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  const changeAmount = (amount: any): void => {
    setAmount(amount);

    console.log(amount);
  };

  return (
    <div className="grid place-items-center">
      <div className="w-96 mt-16 flex flex-col justify-center items-center p-10 bg-containerBackground rounded-sm shadow-sm">
        <input
          value={amount}
          onChange={(e) => changeAmount(e.target.value)}
          type={"number"}
          className="w-64 h-12 pl-10 outline-none rounded-md font-bold text-xl"
          placeholder="Enter Amount"
        />
        <div className="mt-10 grid grid-flow-row grid-cols-2 gap-9">
          <button
            onClick={displayRazorpay}
            className="text-white font-bold p-5 py-3 bg-razorpay  rounded-sm duration-500 active:scale-90"
          >
            <span>Checkout With Razorpay</span>
          </button>
          <button className="text-white font-bold p-5 py-3 bg-phonepay  rounded-sm duration-500 active:scale-90">
            <span>Checkout With Phonepay</span>
          </button>
          <button className="text-white font-bold p-5 py-3 bg-gpay  rounded-sm duration-500 active:scale-90">
            <span>Checkout With Gpay</span>
          </button>
          <button className="text-white font-bold p-5 py-3 bg-paytm  rounded-sm duration-500 active:scale-90">
            <span>Checkout With Paytm</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
