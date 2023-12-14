import Navbar from "$/components/Navbar"
import AuthProvider from "$contexts/AuthContext"
import { Outlet } from "react-router-dom"

export default function RootLayout() {
  return (
    <>
      <AuthProvider>
        <Navbar />
        <Outlet />
      </AuthProvider>
    </>
  )
}
