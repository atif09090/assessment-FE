'use client'

import Link from 'next/link'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Register } from '@/services/authService'
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

interface RegisterFormInputs {
  email: string
  password: string
}

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>()
  const router = useRouter();
  const handleGoogle = async () => {
    try {
      // Trigger Google sign-in with the provider "google"
      const result = await signIn("google");
      if (result?.error) {
        console.error("Google login failed:", result.error);
      } else {
        router.push('/dashboard')
        // console.log("Google login successful!");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };
  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      const response = await Register(JSON.stringify(data))
      if (response) {
        router.push('/')
      }

    } catch (error) {
      console.error(error)
      alert('Registration failed. Please try again.')
    }
  }

  return (
    <div className="px-8 flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
        <svg className='mx-auto h-6 w-6' xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="30" height="30">
            <path d="M23.27,16.245c.469,.469,.714,1.143,.73,1.755-.015,.612-.257,1.282-.723,1.747l-2.578,2.522c-.194,.19-.447,.285-.699,.285-.26,0-.519-.101-.715-.301-.386-.395-.379-1.027,.016-1.414l1.881-1.84h-2.181c-1.654,0-3,1.346-3,3v1c0,.553-.447,1-1,1s-1-.447-1-1v-1c0-2.757,2.243-5,5-5h2.181l-1.881-1.84c-.395-.387-.401-1.02-.016-1.414,.388-.395,1.021-.401,1.414-.016l2.57,2.515ZM15,2c-1.103,0-2,.897-2,2v14.5c0,3.032-2.468,5.5-5.5,5.5-2.422,0-4.515-1.556-5.233-3.835-1.408-.921-2.267-2.479-2.267-4.165,0-.886,.235-1.737,.686-2.5-.45-.763-.686-1.614-.686-2.5,0-1.568,.752-3.04,2-3.979v-.021c0-1.897,1.327-3.489,3.102-3.898,.409-1.774,2.002-3.102,3.898-3.102,1.194,0,2.267,.526,3,1.357,.733-.832,1.806-1.357,3-1.357,1.896,0,3.489,1.327,3.898,3.102,1.774,.409,3.102,2.001,3.102,3.898v.021c1.248,.939,2,2.41,2,3.979,0,.425-.056,.848-.165,1.257-.119,.448-.523,.743-.965,.743-.086,0-.172-.011-.259-.034-.533-.142-.851-.69-.708-1.224,.064-.242,.097-.492,.097-.743,0-1.07-.591-2.067-1.543-2.603-.37-.208-.568-.627-.494-1.045,.02-.115,.037-.231,.037-.352,0-1.103-.897-2-2-2-.553,0-1-.448-1-1,0-1.103-.897-2-2-2Zm-4,2c0-1.103-.897-2-2-2s-2,.897-2,2c0,.552-.447,1-1,1-1.103,0-2,.897-2,2,0,.121,.018,.237,.037,.352,.074,.418-.124,.837-.494,1.045-.952,.535-1.543,1.533-1.543,2.603,0,.675,.234,1.322,.679,1.872,.296,.367,.296,.89,0,1.257-.444,.549-.679,1.196-.679,1.871,0,1.096,.611,2.104,1.597,2.631,.254,.137,.437,.376,.502,.657,.368,1.597,1.768,2.712,3.401,2.712,1.93,0,3.5-1.57,3.5-3.5V4Z" />
          </svg>
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to create your account
          </p>
        </div>
        <div className="grid gap-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters long',
                    },
                  })}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>
              <Button type="submit">Sign Up</Button>
            </div>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <Button variant="outline" type="button" onClick={handleGoogle}>
            Continue with Google Account
          </Button>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-brand underline underline-offset-4">
            Already have an account? Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
