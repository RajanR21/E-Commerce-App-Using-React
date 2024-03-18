import React from "react";
import { useForm } from "react-hook-form";

function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select {...register("selectField")} defaultValue="">
        <option value="" disabled>
          Select an option
        </option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select>
      {errors.selectField && <span>This field is required</span>}

      <button type="submit">Submit</button>
    </form>
  );
}

export default MyForm;
