'use client'

import { signIn } from 'next-auth/react'
import { AiFillGithub } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import { useCallback, useState } from 'react'
import {
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form'

import Button from '../Button'

import useLoginModal from '@/app/hooks/useLoginModal'
import Modal from './Modal'
import Heading from '../Heading'
import Input from '../inputs/Input'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import useRegisterModal from '@/app/hooks/useRegisterModal'
import useForgotPasswordModal from '@/app/hooks/useForgotPasswordModal';

const LoginModal = () => {
    const router = useRouter()

    const loginModal = useLoginModal()
    const registerModal = useRegisterModal()
    const forgotPasswordModal = useForgotPasswordModal();

    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: {
            errors
        }
    } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true)

        signIn('credentials', {
            ...data,
            redirect: false,
        })
            .then((callback) => {
                setIsLoading(false)

                if (callback?.ok) {
                    toast.success('Logged In')
                    router.refresh()
                    loginModal.onClose()
                }

                if (callback?.error) {
                    toast.error(callback.error)
                }
            })
    }

    const toggle = useCallback(() => {
        loginModal.onClose()
        registerModal.onOpen()
    }, [loginModal, registerModal])

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading title="Welcome back" subtitle="Login to your account!" />
            <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required />
            <Input id="password" label="Password" type="password" disabled={isLoading} register={register} errors={errors} required />

            <div className='text-right text-sm'>
                <span
                    className='text-blue-500 hover:underline cursor-pointer'
                    onClick={() => {
                        loginModal.onClose();
                        forgotPasswordModal.onOpen();
                    }}
                >
                    Forgot password?
                </span>
            </div>
        </div>
    );

    const footerContent = (
        <div className='flex flex-col gap-4 mt-3'>
            <hr />
            <Button outline label="Continue with Google" icon={FcGoogle} onClick={() => signIn('google')} />

            <Button outline label="Continue with Github" icon={AiFillGithub} onClick={() => signIn('github')} />

            <div className='text-neutral-500 text-center mt-4 font-light'>
                <div className='justify-center flex flex-row items-center gap-2'>
                    <div>First time using Airbnb?</div>

                    <div onClick={toggle} className='text-neutral-800 cursor-pointer hover:underline'>
                        Create an account
                    </div>
                </div>
            </div>

        </div>
    )
    return (
        <Modal disabled={isLoading} isOpen={loginModal.isOpen} title="Login" actionLabel='Continue' onClose={loginModal.onClose} onSubmit={handleSubmit(onSubmit)} body={bodyContent} footer={footerContent} />
    )
}

export default LoginModal
