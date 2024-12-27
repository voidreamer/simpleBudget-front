import React, { useState, useEffect } from 'react';
import Dialog, { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog.jsx';
import Button from '../ui/button.jsx';
import Input from '../ui/input.jsx';

const EditTransactionModal = ({ isOpen, onClose, transaction, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount || '');
      setDescription(transaction.description || '');
      // Format date for input type="date"
      if (transaction.date) {
        const formattedDate = new Date(transaction.date).toISOString().split('T')[0];
        setDate(formattedDate);
      }
    }
  }, [transaction]);

  const handleSubmit = () => {
    onSubmit({
      id: transaction?.id,
      amount: parseFloat(amount),
      description,
      date: new Date(date).toISOString()
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionModal;