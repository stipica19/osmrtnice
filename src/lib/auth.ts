import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/login",
	},
	providers: [
		CredentialsProvider({
			name: "Admin Login",
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const username = credentials?.username?.trim() || "";
				const password = credentials?.password || "";

				if (!username || !password) {
					return null;
				}

				const user = await prisma.user.findUnique({
					where: { username },
				});

				if (!user) return null;

				const isValid = await compare(password, user.passwordHash);
				if (!isValid) return null;

				return {
					id: user.id,
					name: user.username,
					email: user.email || undefined,
				};
			},
		}),
	],
};

export function auth() {
	return getServerSession(authOptions);
}
