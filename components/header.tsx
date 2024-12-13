"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full   border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center ">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              KhizarJamshaidIqbal
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className={pathname === "/" ? "text-foreground" : "text-foreground/60"}>
              Home
            </Link>
            <Link href="#about" className="text-foreground/60">
              About
            </Link>
            <Link href="#skills" className="text-foreground/60">
              Skills
            </Link>
            <Link href="#projects" className="text-foreground/60">
              Projects
            </Link>
            <Link href="#contact" className="text-foreground/60">
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button asChild className="inline-flex items-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
              <a href="#contact" className='bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500'>
                Hire Me
              </a>
            </Button>
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

