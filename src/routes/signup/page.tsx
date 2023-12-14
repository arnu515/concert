import Auth from "$/components/Auth"
import type { ViewType } from "@supabase/auth-ui-shared"

export default function SignupPage({ view = "sign_up" }: { view?: ViewType }) {
  return (
    <div className="m-4 mx-auto mt-10 max-w-md">
      <Auth view={view} />
    </div>
  )
}
