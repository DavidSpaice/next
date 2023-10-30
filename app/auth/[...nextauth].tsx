import NextAuth from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
    providers: [
        CredentialsProvider({
            // The name to display on the sign-in form
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
                if (credentials?.username === 'yourUsername' && credentials.password === 'yourPassword') {
                    return Promise.resolve({ id: "1", name: 'User' })
                } else {
                    return Promise.resolve(null)
                }
            },
        }),
    ],
    pages: {
        signIn: '/auth/signin', // Customize the sign-in page URL
    },
    callbacks: {
        session: async (params) => {
            const user = params.user;
            // Update the user object if needed
            user.id = user.id.toString(); // Convert the id to a string

            // Forward additional user data to the client, if necessary
            const newSession = { ...params.session, user };

            return Promise.resolve(newSession);
        },
    },

    jwt: {
        secret: 'your-secret-key-here'
    }
})
