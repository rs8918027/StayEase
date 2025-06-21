'use client';

import { useState } from 'react';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import Modal from './Modal';
import Input from '../inputs/Input';
import Heading from '../Heading';
import useForgotPasswordModal from '@/app/hooks/useForgotPasswordModal';

const ForgotPasswordModal = () => {
  const forgotPasswordModal = useForgotPasswordModal();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    fetch('/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    .then((res) => res.json())
    .then(() => {
      toast.success('Reset link sent if email exists');
      forgotPasswordModal.onClose();
    })
    .catch(() => toast.error('Something went wrong'))
    .finally(() => setIsLoading(false));
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Forgot Password" subtitle="We'll email you a reset link" />
      <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required />
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={forgotPasswordModal.isOpen}
      title="Forgot Password"
      actionLabel="Send Reset Link"
      onClose={forgotPasswordModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
    />
  );
};

export default ForgotPasswordModal;
