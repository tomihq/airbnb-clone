'use client';
import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import { useMemo, useState } from "react";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import CountrySelect from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const RentModal = () =>{
  const router = useRouter();
  const rentModal = useRentModal();

  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors
    },
    reset
  } = useForm<FieldValues>({
    defaultValues: {
      category: '',
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: '',
      price: 1,
      title: '',
      description: ''
    }
  })

  const category = watch('category');
  const location = watch('location');
  const guestCount = watch('guestCount');
  const roomCount = watch('roomCount'); 
  const bathroomCount = watch('bathroomCount'); 
  const imageSrc = watch('imageSrc'); 

  //Re-load map dynamically each time we change location
  const Map = useMemo(() => dynamic(() => import('../Map'), {
    ssr: false,
  }), [location])

  const setCustomValue = (id: string, value: any) =>{
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  }

  const onBack = () =>{
    setStep((value) => value - 1);
  }

  const onNext = () =>{
    setStep((value) => value + 1);
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) =>{
      if(step !== STEPS.PRICE){
        return onNext();
      }

      setIsLoading(true);
      axios.post('/api/v1/listings', data)
           .then(() =>{
              toast.success('¡Publicación creada!');
              router.refresh();
              reset();
              setStep(STEPS.CATEGORY);
              rentModal.onClose();
           })
           .catch(() =>{
              toast.error('Algo salió mal');
           })
           .finally(() =>{
              setIsLoading(false);
           })
  }

  const actionLabel = useMemo(() => {
    if(step === STEPS.PRICE){
      return 'Crear';
    }
    return 'Siguiente';

  }, [step])

  const secondaryActionLabel = useMemo(() => {
    if(step === STEPS.CATEGORY){
      return undefined
    }

    return 'Atrás';
  }, [step]);

  

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="¿Cuál de estos describe mejor tu propiedad?"
        subtitle="Seleccione una categoría"
      />
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-3
          max-h-[50vh]
          overflow-y-auto

        "
      >
        { categories.map((item) =>(
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(category) => setCustomValue('category', category)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        )) }
      </div>
    </div>
  )

  if(step === STEPS.LOCATION){
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="¿Dónde está ubicado tu propiedad?"
          subtitle="¡Ayuda a los huéspedes a encontrarte!"
        />
        <CountrySelect
          value={location}
          onChange={(value) => setCustomValue('location', value)}
        />
        <Map
          center={location?.latlng}
        />
      </div>
    )
  }

  if(step === STEPS.INFO){
    bodyContent = (
      <div className="flex flex-col gap-8">
         <Heading
          title="Comparte información básica acerca de tu propiedad"
          subtitle="¿Qué comodidades tienes?"
         />
         <Counter
            title="Cantidad de huéspedes"
            subtitle="¿Cuantos huéspedes admite tu propiedad?"
            value={guestCount}
            onChange={(value) => setCustomValue('guestCount', value)}
         />
         <hr />
         <Counter
            title="Cantidad de habitaciones"
            subtitle="¿Cuantas habitaciones posee tu propiedad?"
            value={roomCount}
            onChange={(value) => setCustomValue('roomCount', value)}
         />
         <hr />
         <Counter
            title="Cantidad de baños"
            subtitle="¿Cuantos baños posee tu propiedad?"
            value={bathroomCount}
            onChange={(value) => setCustomValue('bathroomCount', value)}
         />
      </div>
    )
  }

  if(step === STEPS.IMAGES){
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Añade una foto de tu propiedad"
          subtitle="¡Muéstrale a los huéspedes como luce tu propiedad!"
        />
        <ImageUpload
          value={imageSrc}
          onChange={(value) => setCustomValue('imageSrc', value)}
        />
      </div>
    )
  }

  if(step === STEPS.DESCRIPTION){
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="¿Cómo describirías tu propiedad?"
          subtitle="¡La información corta y concisa funciona mejor!"
        />
        <Input
          id="title"
          label="Título"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="Descripción"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />

      </div>
    )
  }

  if(step === STEPS.PRICE){
    bodyContent = (
      <div className="flex flex-col gap-8">
         <Heading
          title="Ahora, indique el precio"
          subtitle="¿Cuánto es el costo por noche?"
         />

        <Input
          id="price"
          label="Precio"
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />

      </div>
    )
  }
  
  
  return (
    <Modal 
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      title='¡Airbnb tu propiedad!'
      body={bodyContent}
    />
  )
}

export default RentModal;