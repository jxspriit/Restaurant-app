import { AnimatePresence, motion } from "framer-motion";

const ConfirmDialog = ({ open, title, description, confirmLabel = "Confirm", danger = false, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-card bg-white p-6 shadow-xl"
          >
            <h3 className="font-display text-lg font-semibold">{title}</h3>
            {description && <p className="mt-2 text-sm text-ink/60">{description}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={onCancel} className="btn-secondary !px-4 !py-2">Cancel</button>
              <button
                onClick={onConfirm}
                className={`!px-4 !py-2 ${danger ? "rounded-card bg-red-600 text-white hover:bg-red-700 inline-flex items-center" : "btn-primary"}`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
