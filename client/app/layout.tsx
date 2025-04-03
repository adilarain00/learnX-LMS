"use client"
import "./globals.css"
import type React from "react"

import { useLoadUserQuery } from "@/redux/features/api/apiSlice"
import { Poppins, Josefin_Sans } from "next/font/google"
import { ThemeProvider } from "./utils/theme-provider"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"
import { Providers } from "./Provider"
import { type FC, useEffect } from "react"

import Loader from "./components/Loader/Loader"
import socketIO from "socket.io-client"
import { useDispatch } from "react-redux";
import { userLoggedIn } from "@/redux/features/auth/authSlice";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || ""
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] })

const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : "";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
})

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
})

const Custom: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useLoadUserQuery({})

  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(userLoggedIn({ accessToken: token, user }));
    }
  }, [dispatch, token, user]);

  useEffect(() => {
    const handleConnection = () => {
      console.log("Socket connected")
    }

    socketId.on("connect", handleConnection)

    return () => {
      socketId.off("connect", handleConnection)
    }
  }, [])

  if (isLoading) return <Loader />
  return <>{children}</>
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${josefin.variable} !bg-white bg-no-repeat dark:bg-gradient-to-b dark:from-gray-900 dark:to-black duration-300`}
      >
        <Providers>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Custom>{children}</Custom>
              <Toaster position="top-center" reverseOrder={false} />
            </ThemeProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  )
}

