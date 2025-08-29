"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { PlaceholderCircleIcon } from "@/components/feature-icons"
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="grid items-center gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Recover Smarter. Heal Safer.
          </h1>
          <p className="text-pretty text-muted-foreground">
            A modern, secure, and patient‑centric platform for tracking post‑surgery recovery with insights for you and
            your care team.
          </p>
          <div className="flex gap-3">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-lg border p-6"
        >
          <div className="mb-4 overflow-hidden rounded-xl shadow-sm ring-1 ring-black/5">
            <div className="h-56 w-full md:h-64 relative rounded-lg overflow-hidden shadow">
              <Image
                src="https://educationpost.in/_next/image?url=https%3A%2F%2Fapi.educationpost.in%2Fs3-images%2F1707287209044-Delving-into-Doctor-Patient-Ratio.jpg&w=3840&q=75"   // put your image in the /public/images folder
                alt="Patient recovery illustration"
                fill                     // makes the image cover the entire div
                className="object-cover"
                priority                 // loads fast for hero images
              />
            </div>
          </div>

          <ul className="grid gap-4">
            <li className="flex items-start gap-3">
              <div className="relative h-10 w-10 flex-shrink-0">
                <Image
                  src="https://health-e.in/wp-content/uploads/2022/12/phr-apps.webp" // save this inside /public/images/
                  alt="Track Recovery"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-medium">Track Recovery</p>
                <p className="text-sm text-muted-foreground">
                  Daily pain, mobility, and medications in one place.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="relative h-10 w-10 flex-shrink-0">
                <Image
                  src="https://etimg.etb2bimg.com/photo/103022025.cms" // save this inside /public/images/
                  alt="Track Recovery"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-medium">AI Alerts</p>
                <p className="text-sm text-muted-foreground">Smart signals for delayed healing and complications.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="relative h-10 w-10 flex-shrink-0">
                <Image
                  src="https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=1200:*" // save this inside /public/images/
                  alt="Track Recovery"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-medium">Doctor Dashboard</p>
                <p className="text-sm text-muted-foreground">Monitor patients and chat in real time (mock).</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="relative h-10 w-10 flex-shrink-0">
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/8001/8001332.png" // save this inside /public/images/
                  alt="Track Recovery"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-medium">Secure Sharing</p>
                <p className="text-sm text-muted-foreground">Role-based access to protect your information.</p>
              </div>
            </li>
          </ul>
        </motion.div>
      </section>

      <footer className="mt-16 border-t py-6 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Post‑Surgery Recovery Tracker</p>
          <nav className="flex gap-4">
            <Link href="#" className="hover:text-foreground">
              About
            </Link>
            <Link href="#" className="hover:text-foreground">
              Contact
            </Link>
            <Link href="#" className="hover:text-foreground">
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
