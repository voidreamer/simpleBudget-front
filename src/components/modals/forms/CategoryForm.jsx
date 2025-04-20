import React from 'react';
import { useForm } from '../../../hooks/useForm';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';

const CategoryForm = ({ onSubmit, initialValues = {}, type = 'category' }) => {
  const { values, handleChange, reset } = useForm({
    name: '',
    amount: '',
    ...initialValues
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(
      type === 'category'
        ? { name: values.name,
            budget: 0 }          // categories: *only* the name
        : {                              // sub‑categories keep their amount
            name: values.name,
            allotted: parseFloat(values.amount)
          }
    );
    reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          name="name"
          placeholder="Name"
          value={values.name}
          onChange={handleChange}
        />
      </div>
      {/*<div>
        <Input
          name="amount"
          type="number"
          placeholder={type === 'category' ? 'Budget Amount' : 'Allotted Amount'}
          value={values.amount}
          onChange={handleChange}
        />
      </div>*/}
      {type !== 'category' && (
        <div>
          <Input
            name="amount"
            type="number"
            placeholder="Allotted Amount"
            value={values.amount}
            onChange={handleChange}
          />
        </div>
      )}
      <div className="flex justify-end space-x-2">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

export default CategoryForm;