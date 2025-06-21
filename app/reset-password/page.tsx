'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

import Heading from '@/app/components/Heading';
import Input from '@/app/components/inputs/Input';
import Button from '@/app/components/Button';

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get('token') || '';

  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!token) {
      toast.error('Invalid or missing token');
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: data.password }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success('Password reset successful!');
        router.push('/');
      } else {
        toast.error(result.message || 'Error resetting password');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow">
      <Heading title="Reset Password" subtitle="Enter a new password" />
      <form className="space-y-4 mt-6" onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="password"
          label="New Password"
          type="password"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <Button label="Reset Password" disabled={isLoading} onClick={() => {}} />
      </form>
    </div>
  );
};

export default ResetPasswordPage;
