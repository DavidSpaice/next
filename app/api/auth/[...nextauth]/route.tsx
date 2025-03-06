import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user" | "super" | "guest";
}

const users: User[] = [
  {
    id: "1",
    name: "Saagar",
    email: "admin@example.com",
    password: "saagarpass",
    role: "admin",
  },
  {
    id: "2",
    name: "Staff User",
    email: "user@example.com",
    password: "userpass",
    role: "user",
  },
  {
    id: "3",
    name: "Stanley",
    email: "stanley@example.com",
    password: "stanley2024",
    role: "user",
  },
  {
    id: "4",
    name: "Gaganpreet",
    email: "gaganpreet@example.com",
    password: "userpass",
    role: "user",
  },
  {
    id: "5",
    name: "Cary",
    email: "caryhe0804@gmail.com",
    password: "carypass2024",
    role: "super",
  },
  {
    id: "6",
    name: "IT",
    email: "it@example.com",
    password: "adminpass2024",
    role: "super",
  },
  {
    id: "7",
    name: "Lilian",
    email: "lilian@example.com",
    password: "lilianpass2024",
    role: "super",
  },
  {
    id: "8",
    name: "Guest",
    email: "guest@example.com",
    password: "pass2024guest",
    role: "guest",
  },
];

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET, // Add this line
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        // Find user from "database"
        const user = users.find(
          (u) =>
            u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          // Return user object with properties expected by NextAuth
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role, // "admin" | "user"
          };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.name = user.name; // <-- add this
        token.email = user.email; // <-- add this
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.name = token.name; // <-- add this
        session.user.email = token.email; // <-- add this
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
