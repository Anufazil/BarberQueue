import { useState } from "react";

import { Trash2 } from "lucide-react";

import Modal from "@/components/ui/Modal";

import Button from "@/components/ui/Button";

import { useDeleteBarber } from "../hooks/useDeleteBarber";
import { usePermanentlyDeleteBarber } from "../hooks/usePermanentlyDeleteBarber";

const DeleteBarberModal = ({ barber }) => {
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useDeleteBarber();

  const {
    mutate: permanentlyDelete,
    isPending: isPermanentlyDeleting,
  } = usePermanentlyDeleteBarber();

  const handleDelete = () => {
    mutate(barber._id, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  const handlePermanentDelete = () => {
    permanentlyDelete(barber._id, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  const isProcessing = isPending || isPermanentlyDeleting;

  return (
    <>
      <Button
        variant="danger"
        size="sm"
        aria-label={`Deactivate ${barber.displayName}`}
        onClick={() => setOpen(true)}
      >
        <Trash2 size={16} />
      </Button>

      <Modal
        open={open}
        title="Deactivate Barber"
        onClose={() => !isProcessing && setOpen(false)}
      >
        <div className="space-y-6">
          <p className="text-slate-600">
            Are you sure you want to deactivate
            <span className="font-semibold">
              {" "}
              {barber.displayName}
            </span>
            ?
          </p>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={isProcessing}
            >
              {isPending ? "Deactivating..." : "Deactivate"}
            </Button>
          </div>

          <div className="border-t pt-5">
            <p className="text-sm font-semibold text-red-700">
              Permanent deletion
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Permanently removes this barber account and profile.
              This is only allowed when the barber has no queue
              history.
            </p>

            <div className="mt-4 flex justify-end">
              <Button
                variant="danger"
                onClick={handlePermanentDelete}
                disabled={isProcessing}
              >
                {isPermanentlyDeleting
                  ? "Deleting..."
                  : "Delete Permanently"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeleteBarberModal;