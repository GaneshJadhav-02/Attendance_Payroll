import { Loader2, X } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";

const AdvancePaymentModal = ({ employee, onClose, onSubmit, isLoading }) => {
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-foreground/50" onClick={onClose} />
      <div className="relative bg-card rounded-2xl p-6 w-full max-w-md shadow-xl animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            Advance Payment – {employee.name}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Amount
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value;

                  if (value === "") {
                    setAmount("");
                    return;
                  }

                  if (Number(value) >= 0) {
                    setAmount(value);
                  }
                }}
                className="input-styled"
                required
                placeholder="Enter amount"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Remarks
            </label>
            <div className="relative">
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="input-styled min-h-[80px]"
                placeholder="Optional remarks"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 border border-muted-foreground rounded-lg px-4 py-2 hover:bg-muted transition"
            >
              Close
            </button>
            <button
              onClick={() =>
                onSubmit({
                  employee_id: employee.id,
                  amount,
                  paid_on: moment().format("YYYY-MM-DD"),
                  remarks,
                })
              }
              disabled={!amount}
              className={`flex-1 btn-gradient py-3 justify-center flex items-center gap-2 font-medium ${
                !amount ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Pay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancePaymentModal;
