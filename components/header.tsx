import Image from "next/image"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#479FC8]/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-2 sm:py-2.5 md:py-3 gap-3 sm:gap-4 md:gap-5">
          <Image
            src="/quickteller.png"
            alt="Quickteller Business Logo"
            width={180}
            height={60}
            className="h-8 sm:h-10 md:h-12 w-auto drop-shadow-sm"
            priority
          />
          <div className="h-8 sm:h-10 md:h-12 w-px bg-[#479FC8]/30"></div>
          <p className="text-[#00425F] text-[10px] sm:text-xs md:text-sm font-medium tracking-wide leading-tight whitespace-nowrap">
            Quickteller Business Campaign
          </p>
        </div>
      </div>
    </header>
  )
}

