import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {cn} from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "./components/user-auth-form"



export default function AuthenticationPage() {
  return (
    <>
      <div className="md:hidden container">
        <img
          src="https://res.cloudinary.com/dtsuvx8dz/image/upload/v1729578216/yzqddqsqyqxrdivm8wqk.svg"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />
        <img
          src="https://res.cloudinary.com/dtsuvx8dz/image/upload/v1729578474/zovuxh6cbtgwmbbqryns.svg"
          width={1280}
          height={843}
          alt="Authentication"
          className="hidden dark:block"
        />
      </div>
       <div className="container relative h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 px-12 lg:px-0">
      <div className="relative hidden h-full flex-col  border-4 p-10 text-primary lg:flex ">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm p-2"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/dtsuvx8dz/image/upload/v1729578216/yzqddqsqyqxrdivm8wqk.svg')`,
          }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden dark:block p-2 "
            style={{
              backgroundImage: `url('https://res.cloudinary.com/dtsuvx8dz/image/upload/v1729578474/zovuxh6cbtgwmbbqryns.svg')`,
            }}
          />
        </div>
        
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Pandora
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This library has saved me countless hours of work and
              helped me deliver stunning designs to my clients faster than
              ever before.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to Create your account
            </p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
    </>
  )
}