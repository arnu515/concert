import { Input } from "$c/ui/input"
import FormGroup from "$c/FormGroup"
import { Alert, AlertDescription, AlertTitle } from "$c/ui/alert"
import { Button } from "$c/ui/button"
import { useAuth } from "$contexts/AuthContext"
import supabase from "$util/supabase"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useToast } from "$c/ui/use-toast"
import SignupPage from "$r/signup/page"
import { md5 } from "hash-wasm"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "$c/ui/select"

export default function SettingsPage() {
  const auth = useAuth()
  const { toast } = useToast()
  const {
    isPending: isUpdatingUsername,
    mutate: updateUsername,
    error: usernameUpdateError,
    isError: isUsernameUpdateError
  } = useMutation<void, Error, { username: string }>({
    mutationFn: async ({ username }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ username })
        .eq("id", auth!.user!.id)
      if (error) throw error
      auth!.refreshProfile()
      toast({
        title: "Updated username successfully."
      })
    }
  })
  const {
    isPending: isUpdatingAvatar,
    mutate: updateAvatar,
    error: avatarUpdateError,
    isError: isAvatarUpdateError
  } = useMutation<void, Error, { type: "gravatar" | "dicebear" }>({
    mutationFn: async ({ type }) => {
      const avatarUrls = {
        gravatar: `https://gravatar.com/avatar/${await md5(
          auth!.user!.email!
        )}.jpg?d=mp`,
        dicebear: `https://api.dicebear.com/7.x/initials/jpg?seed=${encodeURIComponent(
          auth!.profile!.username
        )}&backgroundType=gradientLinear`
      }

      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrls[type] })
        .eq("id", auth!.user!.id)

      if (error) throw error
      auth!.refreshProfile()
      toast({
        title: "Updated avatar successfully."
      })
    }
  })
  const { isPending: isSigningOut, mutate: signOut } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast({
          title: "Could not sign out",
          description: error.message,
          variant: "destructive"
        })
      }
    }
  })

  if (!auth?.user) return <SignupPage />

  return (
    <div className="mx-auto max-w-screen-lg px-4 py-8">
      <h1 className="mb-4 font-heading text-5xl font-bold">
        <span className="text-sky-600 dark:text-blue-600">Concert</span>Meetings{" "}
        <span className="text-3xl text-gray-400 dark:text-gray-700">:</span>{" "}
        <span className="font-normal">Settings</span>
      </h1>
      <div className="flex max-w-md flex-col gap-4">
        <form
          className="flex flex-col gap-2"
          onSubmit={e => {
            e.preventDefault()
            const username = new FormData(e.currentTarget).get("username") as string
            if (typeof username !== "string" || !username.trim()) {
              toast({
                title: "Username cannot be empty",
                variant: "destructive"
              })
              return null
            }
            updateUsername({ username: username.trim() })
          }}
        >
          {isUsernameUpdateError && (
            <Alert>
              <AlertTitle>Could not update username</AlertTitle>
              <AlertDescription>{usernameUpdateError.message}</AlertDescription>
            </Alert>
          )}
          <FormGroup>
            <label className="font-medium" htmlFor="username">
              Username
            </label>
            <Input
              className="rounded-md border border-gray-300 p-2 dark:border-gray-700"
              id="username"
              name="username"
              defaultValue={auth.profile?.username}
              type="text"
              required
            />
          </FormGroup>
          <Button asChild>
            <button type="submit" disabled={isUpdatingUsername}>
              {isUpdatingUsername && (
                <Loader2 className="mr-1 animate-spin" size={16} />
              )}
              Update username
            </button>
          </Button>
        </form>
        <form
          className="flex flex-col gap-2"
          onSubmit={e => {
            e.preventDefault()
            const avatar = new FormData(e.currentTarget).get("avatar") as string
            if (
              typeof avatar !== "string" ||
              !["gravatar", "dicebear"].includes(avatar)
            ) {
              toast({
                title: "Please select an avatar type",
                variant: "destructive"
              })
              return null
            }
            updateAvatar({ type: avatar as "gravatar" | "dicebear" })
          }}
        >
          {isAvatarUpdateError && (
            <Alert>
              <AlertTitle>Could not update avatar</AlertTitle>
              <AlertDescription>{avatarUpdateError.message}</AlertDescription>
            </Alert>
          )}
          <FormGroup>
            <label className="font-medium" htmlFor="avatar">
              Avatar
            </label>
            <Select name="avatar">
              <SelectTrigger id="avatar">
                <SelectValue placeholder="Select Avatar Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gravatar">Gravatar</SelectItem>
                <SelectItem value="dicebear">Dicebear</SelectItem>
              </SelectContent>
            </Select>
          </FormGroup>
          <Button asChild>
            <button type="submit" disabled={isUpdatingAvatar}>
              {isUpdatingAvatar && <Loader2 className="mr-1 animate-spin" size={16} />}
              Update avatar
            </button>
          </Button>
        </form>
        <form
          className="mt-4 flex items-center justify-between rounded-md border border-red-600 bg-red-300/80 px-4 py-2 dark:bg-red-800/40"
          onSubmit={e => {
            e.preventDefault()
            signOut()
          }}
        >
          <p>Sign out of your account</p>
          <Button variant="destructive" asChild size="sm">
            <button type="submit" disabled={isSigningOut}>
              {isSigningOut && <Loader2 className="mr-1 animate-spin" size={16} />}
              Sign out
            </button>
          </Button>
        </form>
      </div>
    </div>
  )
}
