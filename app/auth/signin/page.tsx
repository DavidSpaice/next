"use client"
import React from 'react';
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

const SignIn = () => {
    const router = useRouter()

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()

        const result = await signIn('credentials', {
            username: 'yourUsername', // Replace with your actual username
            password: 'yourPassword', // Replace with your actual password
            callbackUrl: '/warranty-management', // Redirect after sign-in
        })

        if (!result?.error) {
            router.push('/warranty-management')
        }
    }

    return (
        <form onSubmit={handleSignIn}>
            <label>
                Username:
                <input type="text" name="username" />
            </label>
            <label>
                Password:
                <input type="password" name="password" />
            </label>
            <button type="submit">Sign In</button>
        </form>
    )
}

export default SignIn
