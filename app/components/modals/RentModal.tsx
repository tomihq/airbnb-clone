'use client';
import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import { useMemo, useState } from "react";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, useForm } from "react-hook-form";
import CountrySelect from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const RentModal = () =>{
  const rentModal = useRentModal();

  const [step, setStep] = useState(STEPS.CATEGORY);

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
  
  
  return (
    <Modal 
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={onNext}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      title='Airbnb your home!'
      body={bodyContent}
    />
  )
}

export default RentModal;