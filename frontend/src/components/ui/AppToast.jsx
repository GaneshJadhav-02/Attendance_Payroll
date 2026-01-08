import * as Toast from "@radix-ui/react-toast";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import clsx from "clsx";
import { useEffect } from "react";

const variantStyles = {
  success: "border-l-4 border-green-500",
  error: "border-l-4 border-red-500",
  info: "border-l-4 border-blue-500",
};

const icons = {
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  error: <AlertCircle className="h-5 w-5 text-red-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
};

export default function AppToast({
  open,
  onOpenChange,
  title,
  description,
  variant = "info",
  duration = 4000,
}) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => onOpenChange(false), duration);
    return () => clearTimeout(timer);
  }, [open, duration, onOpenChange]);

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        open={open}
        onOpenChange={onOpenChange}
        className={clsx(
          "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg bg-white p-4 shadow-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-bottom-4",
          "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
          "data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=end]:transition-transform",
          variantStyles[variant]
        )}
      >
        {icons[variant]}

        <div className="flex-1">
          <Toast.Title className="text-sm font-semibold text-gray-900">
            {title}
          </Toast.Title>

          {description && (
            <Toast.Description className="mt-1 text-sm text-gray-600">
              {description}
            </Toast.Description>
          )}
        </div>

        <Toast.Close className="rounded-md p-1 text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300">
          <X className="h-4 w-4" />
        </Toast.Close>
      </Toast.Root>

      <Toast.Viewport className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 outline-none" />
    </Toast.Provider>
  );
}
