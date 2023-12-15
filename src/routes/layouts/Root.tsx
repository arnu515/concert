import Navbar from "$/components/Navbar"
import { Toaster } from "$/components/ui/toaster"
import AuthProvider from "$contexts/AuthContext"
import { Outlet } from "react-router-dom"

export default function RootLayout() {
  return (
    <>
      <AuthProvider>
        <Navbar />
        <Outlet />
        <Toaster />
      </AuthProvider>
    </>
  )
}
