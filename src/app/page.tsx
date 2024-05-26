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
    <div className='bg-[url("/gif/background.gif")] w-full h-full bg-no-repeat bg-cover'>
      <div className="flex h-full w-full justify-center items-center">
        <div className="flex flex-col space-y-2 items-center">
          <div className="flex flex-col w-96">
            <label htmlFor="address" className="text-xs py-1 text-white">
              Address
            </label>
            <input
              type="text"
              name="address"
              className="rounded-lg p-2"
              onChange={(e) =>
                setFormState({ ...formState, address: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col w-96">
            <label htmlFor="amount" className="text-xs py-1 text-white">
              Amount
            </label>
            <input
              type="text"
              name="amount"
              className="rounded-lg p-2"
              onChange={(e) =>
                setFormState({ ...formState, amount: e.target.value })
              }
            />
          </div>
          <div className="mt-5">
            <button
              type="button"
              className="bg-violet-800 rounded-lg  w-96 p-2 text-white text-center"
              onClick={startMinting}
            >
              Mint
            </button>
          </div>

          {loading ? "...Loading" : <></>}
          {error ? error : ""}
          {!loading && !error && <div>Success</div>}
        </div>
      </div>
    </div>
  );
}
