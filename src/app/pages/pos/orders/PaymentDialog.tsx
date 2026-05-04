import { X } from "lucide-react";
import { useThemeClasses } from "../theme-context";

interface PaymentDialogProps {
  totalUsd: number;
  totalKrw: number;
  checkNumber: string;
  onClose: () => void;
}

export function PaymentDialog({ totalUsd, totalKrw, checkNumber, onClose }: PaymentDialogProps) {
  const tc = useThemeClasses();

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${tc.overlay} backdrop-blur-sm`}
      onClick={onClose}
    >
      <div
        className={`${tc.card} rounded-2xl p-6 sm:p-8 w-[90%] max-w-sm shadow-2xl animate-[slideUp_0.3s_ease-out]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className={`${tc.heading} text-[1.125rem]`}>Scan to Pay</h3>
          <button onClick={onClose} className={`${tc.subtext} hover:${tc.heading} transition-colors`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center">
          <div className="bg-white rounded-xl p-4 mb-4">
            <img
              src="https://images.unsplash.com/photo-1550482768-88b710a445fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxRUiUyMGNvZGUlMjBwYXltZW50JTIwc3F1YXJlJTIwYmxhY2slMjB3aGl0ZXxlbnwxfHx8fDE3NzYzNjA0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="QR Code"
              className="w-48 h-48 object-cover rounded-lg"
            />
          </div>

          {/* Order Number */}
          <p className={`${tc.subtext} text-[0.8125rem] mb-1`}>Order {checkNumber}</p>

          {/* Total Amount — two independent pools */}
          <div className="flex flex-col items-center mb-1">
            <p className={`${tc.heading} text-[1.25rem]`}>₩{Math.round(totalKrw).toLocaleString()}</p>
            <p className={`${tc.heading} text-[1.25rem]`}>${totalUsd.toFixed(2)}</p>
          </div>

          {/* Breakdown */}
          <div className={`w-full ${tc.borderHalf} space-y-1.5`}>
            <div className={`flex justify-between text-[0.8125rem] pt-1.5 border-t ${tc.borderHalf}`}>
              <span className={tc.text2}>Domestic</span>
              <span className={tc.heading}>₩{Math.round(totalKrw).toLocaleString()}</span>
            </div>
            <div className={`flex justify-between text-[0.8125rem]`}>
              <span className={tc.text2}>Foreign</span>
              <span className={tc.heading}>${totalUsd.toFixed(2)}</span>
            </div>
          </div>

          {/* Close Button */}
          <button
            className="w-full mt-6 px-4 py-2.5 text-[0.8125rem] rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
