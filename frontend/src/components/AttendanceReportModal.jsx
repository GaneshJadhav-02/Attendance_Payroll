import { Calendar, Loader2, X } from "lucide-react";
import { useState } from "react";

const AttendanceReportModal = ({
  employee,
  onClose,
  downloadPDF,
  downloadCSV,
  pdfLoading,
  excelLoading,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const isValid = startDate && endDate;
  const today = new Date().toISOString().split("T")[0];
  const minDate = employee?.created_at;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-foreground/50" onClick={onClose} />
      <div className="relative bg-card rounded-2xl p-6 w-full max-w-md shadow-xl animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            Attendance Report – {employee.name}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={today}
                min={minDate}
                className="input-styled pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              End Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                max={today}
                min={minDate}
                className="input-styled pl-10"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() =>
                downloadPDF({
                  from_date: startDate,
                  to_date: endDate,
                })
              }
              className={`flex-1 btn-gradient py-3 justify-center flex items-center gap-2 font-medium ${
                !isValid ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!isValid}
            >
              {pdfLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Download PDF"
              )}
            </button>
            <button
              onClick={() =>
                downloadCSV({
                  from_date: startDate,
                  to_date: endDate,
                })
              }
              className={`flex-1 btn-gradient py-3 justify-center flex items-center gap-2 font-medium ${
                !isValid ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!isValid}
            >
              {excelLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Download CSV"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReportModal;