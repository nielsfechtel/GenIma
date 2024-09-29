import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer
      className="max-h-fit border-t bg-background w-full flex justify-between flex-wrap p-4
        items-center">
      <div className="flex items-center gap-4">
        <Image
          src="/images/logos/TEMP_L1a.png"
          alt="Logo"
          width={24}
          height={24}
          className="dark:invert rounded-sm"
        />
        <p className="text-xs text-muted-foreground hover:text-foreground">
          © {new Date().getFullYear()} GenIma. All rights reserved.
        </p>
      </div>
      <nav className="flex gap-4 sm:gap-6">
        <Link
          href="#"
          className="text-xs text-muted-foreground hover:text-foreground hover:underline
            underline-offset-4">
          Contact
        </Link>
        <Link
          href="#"
          className="text-xs text-muted-foreground hover:text-foreground hover:underline
            underline-offset-4">
          Newsletter
        </Link>
        <Link
          href="#"
          className="text-xs text-muted-foreground hover:text-foreground hover:underline
            underline-offset-4">
          Terms
        </Link>
        <Link
          href="#"
          className="text-xs text-muted-foreground hover:text-foreground hover:underline
            underline-offset-4">
          Privacy
        </Link>
      </nav>
    </footer>
  )
}
