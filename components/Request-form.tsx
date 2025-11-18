'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Upload, AlertCircle, CheckCircle, Loader2 } from '@/components/Icons';
import { FormErrors } from '@/lib/types';
import Image from 'next/image';
import {
  mapZodErrors,
  requestSchema,
  type RequestPayload,
} from '@/lib/validate';
import axios from "axios";


type ValidationDetail = { field: keyof FormErrors | string; message: string };

interface RequestFormProps {
  onSuccess?: () => void;
  isSubmitting?: boolean;
}

export function RequestForm({ onSuccess, isSubmitting = false }: RequestFormProps) {
  const [isLoading, setIsLoading] = useState(isSubmitting);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const errorTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [formData, setFormData] = useState<RequestPayload>({
    name: '',
    phone: '',
    title: '',
    image: undefined,
  });
  const [file,setFile] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name = '', value = '' } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image must be less than 5MB' }));
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select an image file' }));
        return;
      }

      setFile(file)
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const validationResult = requestSchema.safeParse(formData);
    if (!validationResult.success) {
      setErrors(mapZodErrors(validationResult.error.issues));
      setIsLoading(false);
      errorTimerRef.current = setTimeout(()=>{
        setErrors({})
      },3000)
      return;
    }
   
    const payload: RequestPayload = {
      ...validationResult.data,
    };

    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(payload)) {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      }

      if(file){
        formData.append("image",file)
      }
      // console.log('formData',formData)

      console.log(`${process.env.NEXT_PUBLIC_SERVER} :  SERVER`)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/requests`,
        formData
      );
      
      const data = response.data;

      if (response.status >= 400) {
        if (Array.isArray(data?.details)) { 
          const fieldErrors: FormErrors = {};
          (data.details as ValidationDetail[]).forEach(({ field, message }) => {
            if (typeof field === 'string') {
              fieldErrors[field as keyof FormErrors] = message;
            }
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ submit: data.error });
        }
        return;
      }

      setSuccess(true);
      setFormData({ name: '', phone: '', title: '', image: undefined });
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setTimeout(() => setSuccess(false), 3000);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to submit request', error);
      setErrors({ submit: 'Failed to submit request. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    return ()=>{
      if(errorTimerRef.current){
        clearTimeout(errorTimerRef.current)
      }
    }
  },[])
  

  return (
    <Card className="w-full max-w-md p-6 border-primary/20 backdrop-blur-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Request Anything</h2>
        <p className="text-sm text-muted-foreground mt-1">We Deliver in 2 Hours</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1 text-foreground">
            Your Name <span className="text-destructive">*</span>
          </label>
          <Input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            disabled={isLoading}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={errors.name ? 'border-destructive focus:ring-destructive' : ''}
          />
          {errors.name && (
            <p id="name-error" className="text-sm text-destructive text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.name}
            </p>
          )}
        </div>

      
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1 text-foreground">
            Phone Number <span className="text-destructive">*</span>
          </label>
          <Input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="10-digit phone number"
            disabled={isLoading}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            className={errors.phone ? 'border-destructive focus:ring-destructive' : ''}
          />
          {errors.phone && (
            <p id="phone-error" className="text-sm text-destructive mt-1 text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.phone}
            </p>
          )}
        </div>

      
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1 text-foreground">
            Request Title <span className="text-destructive">*</span>
          </label>
          <Input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="E.g., RS Agrawal Maths Book"
            disabled={isLoading}
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'title-error' : undefined}
            className={errors.title ? 'border-destructive focus:ring-destructive' : ''}
          />
          {errors.title && (
            <p id="title-error" className="text-sm text-red-500 text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.title}
            </p>
          )}
        </div>

      
        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1 text-foreground">
            Upload Image <span className="text-muted-foreground">(Optional)</span>
          </label>
          <div className="relative">
            <Input
              ref={fileInputRef}
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isLoading}
              className="cursor-pointer file:cursor-pointer file:bg-primary/10 file:text-primary file:border-0 file:px-3 file:py-2"
              aria-describedby={errors.image ? 'image-error' : undefined}
            />
          </div>
          {imagePreview && (
            <div className="mt-2 relative group">
              <Image
                src={imagePreview || "/placeholder.svg"}
                width={250}
                height={250}
                alt="Preview"
                className="w-full max-h-32 object-cover rounded-md border border-primary/20"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setFormData(prev => ({ ...prev, image: undefined }));
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="absolute top-1 right-1 bg-destructive/80 hover:bg-destructive text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          )}
          {errors.image && (
            <p id="image-error" className="text-sm text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.image}
            </p>
          )}
        </div>

        {/* Submit Status Messages */}
        {errors.submit && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors.submit}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200 rounded-md text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Request submitted successfully!</span>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Submit Request
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Your request will be processed immediately
        </p>
      </form>
    </Card>
  );
}

export default RequestForm
