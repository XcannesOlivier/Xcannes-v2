import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info", duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Container des toasts */}
      <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              px-6 py-4 rounded-lg shadow-2xl backdrop-blur-sm
              animate-fade-in font-montserrat font-[400]
              border-l-4 flex items-start gap-3
              ${
                toast.type === "success"
                  ? "bg-green-900/90 border-green-500 text-green-100"
                  : toast.type === "error"
                  ? "bg-red-900/90 border-red-500 text-red-100"
                  : toast.type === "warning"
                  ? "bg-yellow-900/90 border-yellow-500 text-yellow-100"
                  : "bg-blue-900/90 border-blue-500 text-blue-100"
              }
            `}
          >
            <span className="text-lg font-semibold">
              {toast.type === "success" && "●"}
              {toast.type === "error" && "●"}
              {toast.type === "warning" && "●"}
              {toast.type === "info" && "●"}
            </span>
            <div className="flex-1">
              <p className="text-sm leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white transition text-lg leading-none"
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};
