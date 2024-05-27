"use client";

import { useState } from "react";

type FormState = {
  address: string;
  amount: string;
};

export default function Home() {
  const initialFormState = { address: "", amount: "0" };

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const startMinting = async () => {
    try {
      setLoading(true);
      await fetch("/api/mint", {
        method: "POST",
        body: JSON.stringify({
          address: formState.address,
          amount: formState.amount,
        }),
      });

      setLoading(false);
    } catch (error) {
      console.error("error: ", error);
      setError("Something went wrong.");
    }
  };

  return (
    <div className="container">
      <h1>Mint Your Item</h1>
      <form id="mintForm">
        <input type="text" id="input1" placeholder="Input Field 1" required />
        <input type="text" id="input2" placeholder="Input Field 2" required />
        <button type="submit" id="mintButton">
          Mint
        </button>
      </form>
      <div id="result" className="result-placeholder">
        Result will be displayed here
      </div>
    </div>
  );
}
