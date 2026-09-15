import { useState } from "react";
import { Pencil } from "lucide-react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

import BarberForm from "./BarberForm";

import { useUpdateBarber } from "../hooks/useUpdateBarber";

const EditBarberModal = ({ barber }) => {
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useUpdateBarber();

  const handleSubmit = (values) => {
    const payload = {
      isActive: values.isActive,
      displayName: values.displayName,
      chairNumber: values.chairNumber,
      phone: values.phone,
      experience: values.experience,
      specialization: values.specialization,
    };

    mutate(
      {
        id: barber._id,
        payload,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  return (
    <>
      {/* Edit Button */}
      <Button
        variant="outline"
        size="sm"
        aria-label={`Edit ${barber.displayName}`}
        onClick={() => setOpen(true)}
      >
        <Pencil size={16} />
      </Button>

      {/* Modal */}
      <Modal
        open={open}
        title="Edit Barber"
        onClose={() => setOpen(false)}
      >
        <BarberForm
          isEdit
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          defaultValues={{
            isActive: barber.isActive,
            name: barber.user?.name || "",
            email: barber.user?.email || "",
            displayName: barber.displayName,
            chairNumber: barber.chairNumber,
            phone: barber.phone,
            experience: barber.experience,
            specialization: barber.specialization,
          }}
        />
      </Modal>
    </>
  );
};

export default EditBarberModal;