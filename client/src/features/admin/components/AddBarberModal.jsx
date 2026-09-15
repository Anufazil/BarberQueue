import { useState } from "react";


import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

import BarberForm from "./BarberForm";

import { useCreateBarber } from "../hooks/useCreateBarber";

const AddBarberModal = () => {
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useCreateBarber();

  const handleSubmit = (values) => {
    mutate(values, {
      onSuccess: () => {

        setOpen(false);
      },
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Add Barber
      </Button>

      <Modal
        open={open}
        title="Create New Barber"
        onClose={() => setOpen(false)}
      >
        <BarberForm
          onSubmit={handleSubmit}
          isSubmitting={isPending}
        />
      </Modal>
    </>
  );
};

export default AddBarberModal;