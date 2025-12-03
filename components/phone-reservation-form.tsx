"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { Upload, X, CheckCircle2, Mail, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .refine((email) => email.endsWith("@gmail.com"), {
      message: "Only Gmail accounts are permitted",
    }),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, "Invalid phone number format"),
  country: z.string().min(1, "Please select a country"),
  photo: z
    .instanceof(File, { message: "Photo is required" })
    .refine((file) => file.size <= 1024 * 1024, {
      message: "Photo must be less than 1MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
      {
        message: "Photo must be an image (JPEG, PNG, or WebP)",
      }
    ),
})

type FormData = z.infer<typeof formSchema>

const countries = [
  "Nigeria",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Belgium",
  "Switzerland",
  "Austria",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Poland",
  "Portugal",
  "Greece",
  "Ireland",
  "New Zealand",
  "South Africa",
  "Brazil",
  "Mexico",
  "Argentina",
  "Chile",
  "Colombia",
  "India",
  "China",
  "Japan",
  "South Korea",
  "Singapore",
  "Malaysia",
  "Thailand",
  "Philippines",
  "Indonesia",
  "Vietnam",
  "United Arab Emirates",
  "Saudi Arabia",
  "Egypt",
  "Kenya",
  "Ghana",
  "Other",
]

export function PhoneReservationForm() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "",
    },
  })

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Photo size exceeded", {
          description: "Photo must be less than 1MB. Please choose a smaller file.",
          duration: 4000,
        })
        e.target.value = ""
        return
      }
      if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
        toast.error("Invalid file type", {
          description: "Photo must be an image file (JPEG, PNG, or WebP).",
          duration: 4000,
        })
        e.target.value = ""
        return
      }
      setValue("photo", file, { shouldValidate: true })
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
        toast.success("Photo uploaded", {
          description: "Your photo has been uploaded successfully.",
          duration: 3000,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setPhotoPreview(null)
    setValue("photo", undefined as any)
    toast.info("Photo removed", {
      description: "You can upload a new photo if needed.",
      duration: 3000,
    })
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setVerificationError("")

    try {
      const formData = new FormData()
      formData.append("firstName", data.firstName)
      formData.append("lastName", data.lastName)
      formData.append("email", data.email)
      formData.append("phoneNumber", data.phoneNumber)
      formData.append("country", data.country)
      formData.append("photo", data.photo)

      const response = await fetch("/api/reserve", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit reservation")
      }

      // Show verification step
      setUserEmail(data.email)
      setShowVerification(true)
      setIsSubmitting(false)
    } catch (error: any) {
      console.error("Error submitting form:", error)
      setVerificationError(error.message || "Failed to submit reservation. Please try again.")
      setIsSubmitting(false)
    }
  }

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)
    setVerificationError("")

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          verificationCode: verificationCode,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Verification failed")
      }

      // Show success
      setIsSuccess(true)
      setShowVerification(false)
      reset()
      setPhotoPreview(null)
      setVerificationCode("")
      setUserEmail("")
      toast.success("Verification successful!", {
        description: "Your phone number reservation has been confirmed.",
        duration: 5000,
      })
    } catch (error: any) {
      console.error("Error verifying:", error)
      const errorMessage = error.message || "Invalid verification code. Please try again."
      setVerificationError(errorMessage)
      toast.error("Verification failed", {
        description: errorMessage,
        duration: 5000,
      })
    } finally {
      setIsVerifying(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#479FC8] via-[#479FC8] to-[#00425F] p-4 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-50"></div>
        <Card className="glass-card w-full max-w-md animate-in fade-in-0 zoom-in-95 duration-300 border-0 shadow-2xl relative z-10">
          <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 px-6 sm:px-8">
            <div className="relative mb-4 sm:mb-6">
              <div className="absolute inset-0 bg-[#479FC8]/20 rounded-full blur-2xl"></div>
              <CheckCircle2 className="h-16 w-16 sm:h-20 sm:w-20 text-[#479FC8] relative z-10 animate-in zoom-in-50 duration-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#00425F] mb-2 sm:mb-3 tracking-tight">Reservation Verified!</h2>
            <p className="text-[#00425F]/70 text-center mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
              Your phone number reservation has been verified and confirmed successfully.
            </p>
            <Button
              onClick={() => {
                setIsSuccess(false)
                reset()
                setPhotoPreview(null)
                setVerificationCode("")
                setUserEmail("")
                setShowVerification(false)
                setVerificationError("")
              }}
              className="btn-elegant bg-gradient-to-r from-[#479FC8] to-[#00425F] hover:from-[#3a8fb5] hover:to-[#003a4f] text-white font-bold px-8 sm:px-10 py-5 sm:py-6 text-sm sm:text-base rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showVerification) {
    return (
      <div className="h-screen bg-gradient-to-br from-[#479FC8] via-[#479FC8] to-[#00425F] flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-50"></div>
        <div className="max-w-md w-full relative z-10">
          <Card className="glass-card animate-in fade-in-0 zoom-in-95 duration-300 border-0 shadow-2xl">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#479FC8]/30 rounded-full blur-xl"></div>
                  <div className="relative bg-gradient-to-br from-[#479FC8] to-[#00425F] rounded-full p-4 shadow-lg">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-[#00425F] text-center tracking-tight mb-2">
                Verify Your Email
              </CardTitle>
              <CardDescription className="text-center text-base text-[#00425F]/70">
                We've sent a verification code to <strong className="text-[#00425F]">{userEmail}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerification} className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="verificationCode" className="text-[#00425F] font-semibold text-sm tracking-wide uppercase text-center block">
                    Verification Code
                  </Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                      setVerificationCode(value)
                    }}
                    className="text-center text-4xl font-bold tracking-[0.5em] h-20 border-2 border-gray-200 focus:border-[#479FC8] focus:ring-0 rounded-xl bg-white/50 backdrop-blur-sm input-modern"
                    maxLength={6}
                    required
                  />
                  {verificationError && (
                    <p className="text-sm text-red-500 animate-in fade-in-0">
                      {verificationError}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <Button
                    type="submit"
                    disabled={isVerifying || verificationCode.length !== 6}
                    className="btn-elegant w-full bg-gradient-to-r from-[#479FC8] to-[#00425F] hover:from-[#3a8fb5] hover:to-[#003a4f] text-white font-bold py-7 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isVerifying ? (
                        <>
                          <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                          <span>Verifying...</span>
                        </>
                      ) : (
                        "Verify Code"
                      )}
                    </span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowVerification(false)
                      setVerificationCode("")
                      setVerificationError("")
                    }}
                    className="w-full border-2 border-gray-300 hover:border-[#479FC8] hover:bg-[#479FC8]/5 text-[#00425F] font-semibold py-6 rounded-xl transition-all duration-200"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Form
                  </Button>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-[#00425F]/60 text-center">
                    Didn't receive the code? Check your spam folder or{" "}
                    <a href="mailto:support@quickteller.com" className="text-[#479FC8] hover:text-[#00425F] font-medium transition-colors">
                      contact support
                    </a>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#479FC8] via-[#479FC8] to-[#00425F] flex flex-col w-full max-w-full overflow-x-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 gradient-mesh opacity-50"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#479FC8] rounded-full mix-blend-multiply filter blur-3xl opacity-20 float-animation max-w-full"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00425F] rounded-full mix-blend-multiply filter blur-3xl opacity-20 float-animation max-w-full" style={{ animationDelay: '2s' }}></div>
      
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-full mx-auto px-0 sm:px-3 md:px-4 lg:px-6 py-1 sm:py-4 md:py-6 relative z-10 overflow-y-auto overflow-x-hidden">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl flex flex-col items-center">
          <div className="text-center mb-2 sm:mb-4 md:mb-6 pt-1 sm:pt-2 md:pt-4 animate-in fade-in-0 slide-in-from-top-4 duration-500 flex-shrink-0 px-2 w-full">
            <h1 className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-0.5 sm:mb-1 md:mb-2 tracking-tight">
              Reserve Your
              <span className="block mt-0.5 sm:mt-1 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Phone Number
              </span>
            </h1>
            <p className="text-white/80 text-[10px] sm:text-sm md:text-base font-light tracking-wide">Quickteller Business Campaign</p>
          </div>

          <Card className="glass-card animate-in fade-in-0 slide-in-from-bottom-4 duration-700 border-0 shadow-2xl flex-shrink-0 w-full max-w-full rounded-none sm:rounded-xl overflow-hidden">
          <CardHeader className="pb-1.5 sm:pb-3 md:pb-4 pt-2 sm:pt-4 md:pt-6 px-2 sm:px-4 md:px-6 w-full max-w-full">
            <div className="flex items-center gap-2 sm:gap-3 mb-1">
              <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-[#479FC8] to-[#00425F] rounded-full"></div>
              <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-[#00425F] tracking-tight">
                Reservation Form
              </CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm text-[#00425F]/70 mt-1">
              Please fill in all the required information to reserve your phone number.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-1.5 sm:pt-2 px-2 sm:px-4 md:px-6 pb-2 sm:pb-4 md:pb-6 w-full max-w-full overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5 sm:space-y-4 md:space-y-5 w-full max-w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4 w-full max-w-full">
                <div className="space-y-1 sm:space-y-2 animate-in fade-in-0 slide-in-from-left-4 duration-500 delay-100">
                  <Label htmlFor="firstName" className="text-[#00425F] font-semibold text-[10px] sm:text-xs md:text-sm tracking-wide uppercase">
                    First Name <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    {...register("firstName")}
                    className="input-modern h-9 sm:h-10 md:h-11 border-2 border-gray-200 focus:border-[#479FC8] focus:ring-0 rounded-lg bg-white/50 backdrop-blur-sm text-xs sm:text-sm"
                  />
                   {errors.firstName && (
                     <p className="text-xs sm:text-sm text-red-500 font-medium animate-in fade-in-0 flex items-center gap-1.5 mt-0.5">
                       <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                       </svg>
                       {errors.firstName.message}
                     </p>
                   )}
                </div>

                <div className="space-y-1 sm:space-y-2 animate-in fade-in-0 slide-in-from-right-4 duration-500 delay-150">
                  <Label htmlFor="lastName" className="text-[#00425F] font-semibold text-[10px] sm:text-xs md:text-sm tracking-wide uppercase">
                    Last Name <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    {...register("lastName")}
                    className="input-modern h-9 sm:h-10 md:h-11 border-2 border-gray-200 focus:border-[#479FC8] focus:ring-0 rounded-lg bg-white/50 backdrop-blur-sm text-xs sm:text-sm"
                  />
                   {errors.lastName && (
                     <p className="text-xs sm:text-sm text-red-500 font-medium animate-in fade-in-0 flex items-center gap-1.5 mt-0.5">
                       <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                       </svg>
                       {errors.lastName.message}
                     </p>
                   )}
                </div>
              </div>

              <div className="space-y-1 sm:space-y-2 animate-in fade-in-0 slide-in-from-left-4 duration-500 delay-200">
                <Label htmlFor="email" className="text-[#00425F] font-semibold text-[10px] sm:text-xs md:text-sm tracking-wide uppercase">
                  Email <span className="text-[9px] sm:text-xs font-normal normal-case text-[#00425F]/60">(Gmail only)</span> <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@gmail.com"
                  {...register("email")}
                  className="input-modern h-9 sm:h-10 md:h-11 border-2 border-gray-200 focus:border-[#479FC8] focus:ring-0 rounded-lg bg-white/50 backdrop-blur-sm text-xs sm:text-sm"
                />
                 {errors.email && (
                   <p className="text-xs sm:text-sm text-red-500 font-medium animate-in fade-in-0 flex items-center gap-1.5 mt-0.5">
                     <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                     </svg>
                     {errors.email.message}
                   </p>
                 )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2 animate-in fade-in-0 slide-in-from-right-4 duration-500 delay-250">
                  <Label htmlFor="phoneNumber" className="text-[#00425F] font-semibold text-[10px] sm:text-xs md:text-sm tracking-wide uppercase">
                    Phone Number <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    {...register("phoneNumber")}
                    className="input-modern h-9 sm:h-10 md:h-11 border-2 border-gray-200 focus:border-[#479FC8] focus:ring-0 rounded-lg bg-white/50 backdrop-blur-sm text-xs sm:text-sm"
                  />
                   {errors.phoneNumber && (
                     <p className="text-xs sm:text-sm text-red-500 font-medium animate-in fade-in-0 flex items-center gap-1.5 mt-0.5">
                       <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                       </svg>
                       {errors.phoneNumber.message}
                     </p>
                   )}
                </div>

                <div className="space-y-1 sm:space-y-2 animate-in fade-in-0 slide-in-from-left-4 duration-500 delay-300">
                  <Label htmlFor="country" className="text-[#00425F] font-semibold text-[10px] sm:text-xs md:text-sm tracking-wide uppercase">
                    Country <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Controller
                    name="country"
                    control={control}
                    rules={{ required: "Please select a country" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value)
                          setValue("country", value, { shouldValidate: true })
                        }}
                      >
                        <SelectTrigger className="input-modern h-9 sm:h-10 md:h-11 border-2 border-gray-200 focus:border-[#479FC8] focus:ring-0 rounded-lg bg-white/50 backdrop-blur-sm text-xs sm:text-sm w-full">
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent position="popper" sideOffset={4}>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                   {errors.country && (
                     <p className="text-xs sm:text-sm text-red-500 font-medium animate-in fade-in-0 flex items-center gap-1.5 mt-0.5">
                       <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                       </svg>
                       {errors.country.message}
                     </p>
                   )}
                </div>
              </div>

              <div className="space-y-1 sm:space-y-2 animate-in fade-in-0 slide-in-from-right-4 duration-500 delay-350">
                <Label htmlFor="photo" className="text-[#00425F] font-semibold text-[10px] sm:text-xs md:text-sm tracking-wide uppercase">
                  Photo Upload <span className="text-[9px] sm:text-xs font-normal normal-case text-[#00425F]/60">(Max 1MB)</span> <span className="text-red-500 ml-1">*</span>
                </Label>
                {!photoPreview ? (
                  <div className="relative">
                    <Input
                      id="photo"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="photo"
                      className="flex flex-col items-center justify-center w-full h-24 sm:h-28 md:h-32 border-2 border-dashed border-[#479FC8]/50 rounded-lg cursor-pointer bg-gradient-to-br from-[#F0F9FC] to-white hover:from-[#E0F3F8] hover:to-[#F0F9FC] transition-all duration-300 group hover:border-[#479FC8] hover:shadow-lg py-2"
                    >
                      <div className="bg-[#479FC8]/10 rounded-full p-1.5 sm:p-2 md:p-3 mb-1 sm:mb-2 group-hover:bg-[#479FC8]/20 group-hover:scale-110 transition-all duration-300">
                        <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-[#479FC8] group-hover:text-[#00425F] transition-colors" />
                      </div>
                      <p className="text-[10px] sm:text-xs md:text-sm font-medium text-[#00425F] mb-0.5">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-[9px] sm:text-[10px] md:text-xs text-[#00425F]/60">
                        PNG, JPG, WEBP up to 1MB
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="relative w-full h-28 sm:h-32 md:h-40 rounded-lg overflow-hidden border-2 border-[#479FC8] shadow-lg">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-all duration-200 shadow-xl hover:scale-110"
                      >
                        <X className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </div>
                )}
                 {errors.photo && (
                   <p className="text-xs sm:text-sm text-red-500 font-medium animate-in fade-in-0 flex items-center gap-1.5 mt-0.5">
                     <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                     </svg>
                     {errors.photo.message}
                   </p>
                 )}
              </div>

               {verificationError && !showVerification && (
                 <div className="p-2 sm:p-3 bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-200 rounded-lg animate-in fade-in-0 shadow-sm">
                   <div className="flex items-start gap-2">
                     <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                     </svg>
                     <p className="text-xs sm:text-sm text-red-700 font-medium leading-relaxed">{verificationError}</p>
                   </div>
                 </div>
               )}

              <div className="pt-1.5 sm:pt-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-400">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-elegant w-full bg-gradient-to-r from-[#479FC8] to-[#00425F] hover:from-[#3a8fb5] hover:to-[#003a4f] text-white font-bold py-3.5 sm:py-5 md:py-6 text-xs sm:text-sm md:text-base rounded-lg sm:rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></span>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Reserve Phone Number</span>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}

