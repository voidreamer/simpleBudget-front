import React from 'react';
import { useForm } from '../../../hooks/useForm';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { TransactionIconSelect } from '../../budget/TransactionIconSelect';

const TransactionForm = ({ onSubmit, initialValues = {} }) => {
  const { values, handleChange, reset, setValue } = useForm({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    icon: 'ShoppingBag',
    ...initialValues
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      description: values.description,
      amount: parseFloat(values.amount),
      date: new Date(values.date).toISOString(),
      icon: values.icon
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        <TransactionIconSelect
          selectedIcon={values.icon}
          onSelectIcon={(icon) => setValue('icon', icon)} 
        />
        <Input
          name="description"
          placeholder="Description"
          value={values.description}
          onChange={handleChange}
          className="flex-1"
        />
      </div>
      <div>
        <Input
          name="amount"
          type="number"
          step="0.01"
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