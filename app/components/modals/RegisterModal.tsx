'use client';

import axios from 'axios';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useCallback, useState } from 'react';
import {
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form';

import toast from 'react-hot-toast';

import useRegisterModal from '@/app/hooks/useRegisterModal';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import Button from '../Button';
import { signIn } from 'next-auth/react';

const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: {
        errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
        name: '',
        email: '',
        password: ''
    }
  })

  const onSubmit: SubmitHandler<FieldValues> = data =>{
    setIsLoading(true);
    axios.post('/api/v1/register', data)
        .then(() =>{
            registerModal.onClose()
        })
        .catch((err) =>{
            toast.error('Oops, algo salió mal');
        })
        .finally(() =>{
            setIsLoading(false);
        })
  }

  const bodyContent = (
    <div className='flex flex-col gap-4'>
      <Heading
        title='Bienvenido a Airbnb'
        subtitle='¡Creá tu cuenta!'
      />
      <Input 
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      <Input 
        id="name"
        label="Nombre"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      <Input 
        id="password"
        type="password"
        label="Contraseña"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className=' flex flex-col gap-4 mt-3'>
      <hr />
      <Button
        outline
        label='Continuar con Google'
        icon={FcGoogle}
        onClick={() => {}}
      />

      <Button
        outline
        label='Continuar con GitHub'
        icon={AiFillGithub}
        onClick={() => signIn('github')}
      />

      <div 
        className='
          text-neutral-500
          text-center
          mt-4
          font-light
        '
      >
        <div className='justify-center flex flex-row items-center gap-2'>
          <div>
            ¿Ya tienes una cuenta?
          </div>

          <div 
            onClick={registerModal.onClose}
            className="
              text-neutral-800
              cursor-pointer
              hover:underline
            "
          >
            Iniciar sesión
          </div>
          
        </div>
      </div>
    </div>
  )

  return (
    <Modal 
        disabled={isLoading}
        isOpen={registerModal.isOpen}
        title="Registrarse"
        actionLabel='Continuar'
        onClose={registerModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        body={bodyContent}
        footer={footerContent}
    />
  )
}

export default RegisterModal