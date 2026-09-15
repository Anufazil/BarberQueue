import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { barberSchema, editBarberSchema } from "../schemas/barberSchema";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const BarberForm = ({
  onSubmit,
  isSubmitting,
  defaultValues,
  isEdit = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isEdit ? editBarberSchema : barberSchema),

    defaultValues:
      defaultValues ?? {
        name: "",
        email: "",
        password: "",
        displayName: "",
        chairNumber: 1,
        phone: "",
        experience: 0,
        specialization: "",
      },
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <Input
        label="Full Name"
        disabled={isEdit}
        {...register("name")}
        error={errors.name?.message}
      />

      <Input
        label="Email"
        type="email"
        disabled={isEdit}
        {...register("email")}
        error={errors.email?.message}
      />

      {!isEdit && (
        <Input
          label="Password"
          type="password"
          {...register("password")}
          error={errors.password?.message}
        />
      )}

      <Input
        label="Display Name"
        {...register("displayName")}
        error={errors.displayName?.message}
      />

      <Input
        label="Chair Number"
        type="number"
        {...register("chairNumber")}
        error={errors.chairNumber?.message}
      />

      <Input
        label="Phone"
        {...register("phone")}
        error={errors.phone?.message}
      />

      <Input
        label="Experience"
        type="number"
        {...register("experience")}
        error={errors.experience?.message}
      />

      <Input
        label="Specialization"
        {...register("specialization")}
        error={errors.specialization?.message}
      />

      {isEdit && <label className="flex gap-2"><input type="checkbox" {...register('isActive')} />Active account</label>}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? isEdit
              ? "Saving..."
              : "Creating..."
            : isEdit
            ? "Save Changes"
            : "Create Barber"}
        </Button>
      </div>
    </form>
  );
};

export default BarberForm;