"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-[#00425F] group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg",
          description: "group-[.toast]:text-[#00425F]/70",
          actionButton:
            "group-[.toast]:bg-[#479FC8] group-[.toast]:text-white group-[.toast]:hover:bg-[#3a8fb5]",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-[#00425F]",
          error:
            "group-[.toaster]:bg-red-50 group-[.toaster]:text-red-600 group-[.toaster]:border-red-200",
          success:
            "group-[.toaster]:bg-green-50 group-[.toaster]:text-green-700 group-[.toaster]:border-green-200",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

