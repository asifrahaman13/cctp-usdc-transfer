'use client';

import axios from 'axios';
import React, { useState } from 'react';

const backendUrl = 'http://127.0.0.1:5000';

type FormState = {
  senderWalletId: string;
  recipientAddress: string;
  amount: string;
};

export default function Home() {
  const [form, setForm] = useState<FormState>({
    senderWalletId: '',
    recipientAddress: '',
    amount: '',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | Record<string, string>>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await axios.post(`${backendUrl}/api/transaction`, form);

      if (response.status === 200) {
        setResult(response.data);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          USDC Bridge
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sender Wallet ID
            </label>
            <input
              type="text"
              name="senderWalletId"
              value={form.senderWalletId}
              onChange={handleChange}
              placeholder='84abt70e-157b-5144-988c-f1f66033679f'
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Address
            </label>
            <input
              type="text"
              name="recipientAddress"
              value={form.recipientAddress}
              onChange={handleChange}
              required
              placeholder='0x74a3b217359b9d8861a0f909824a93f9c3d777d4'
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (USDC)
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
              min={0}
              step="0.000001"
              placeholder='0.1'
              inputMode="decimal"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center cursor-pointer"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            ) : null}
            {loading ? 'Processing...' : 'Bridge'}
          </button>
        </form>
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-700 shadow">
              <div className="font-semibold">Approval Transaction</div>
              <div className="break-all text-sm">{result.approvalTx}</div>
            </div>

            <div className="p-3 rounded-lg bg-yellow-100 text-yellow-700 shadow">
              <div className="font-semibold">Burn Transaction</div>
              <div className="break-all text-sm">{result.burnTx}</div>
            </div>

            <div className="p-3 rounded-lg bg-green-100 text-green-700 shadow">
              <div className="font-semibold">Mint Transaction</div>
              <div className="break-all text-sm">{result.mintTx}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
