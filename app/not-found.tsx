import Link from "next/link"

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h2 className="mb-2 text-3xl font-semibold">Page not found</h2>
      <p className="mb-6 text-muted-foreground">The page you are looking for doesn&apos;t exist.</p>
      <Link className="text-blue-600 underline hover:text-blue-700" href="/">
        Go back home
      </Link>
    </div>
  )
}
