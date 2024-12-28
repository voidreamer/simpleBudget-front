import React from 'react';
import { useForm } from '../../../hooks/useForm';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';

const TransactionForm = ({ onSubmit, initialValues = {} }) => {
  const { values, handleChange, reset } = useForm({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    ...initialValues
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      description: values.description,
      amount: parseFloat(values.amount),
      date: new Date(values.date).toISOString()
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          name="description"
          placeholder="Description"
          value={values.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <Input
          name="amount"
          type="number"
          placeholder="Amount"
          value={values.amount}
          onChange={handleChange}
        />
      </div>
      <div>
        <Input
          name="date"
          type="date"
          value={values.date}
          onChange={handleChange}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

export default TransactionForm;