import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';
import Button from '../ui/button.jsx';
import Input from '../ui/input.jsx';

const TransactionModal = ({ isOpen, onClose, subcategory, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    onSubmit({
      amount: parseFloat(amount),
      description,
      subcategory_id: subcategory.id,
      date: new Date().toISOString()
    });
    onClose();
  };
  const handleClose = () => {
    setAmount('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>Add Transaction</DialogHeader>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={() => {
            onSubmit({
              amount: parseFloat(amount),
              description,
              subcategory_id: subcategory?.id
            });
            handleClose();
          }}>
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default TransactionModal;
