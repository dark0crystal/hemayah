'use client'
import { SubmitHandler, useForm } from "react-hook-form";
import { useState, useEffect, useCallback, useRef } from "react";


type FormFields ={
 
}

export default function UploadForm(){
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<FormFields>();

    return(
        <div>
            <form >

            </form>
        </div>
    )
}

