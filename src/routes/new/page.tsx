import FormGroup from "$/components/FormGroup"
import { Input } from "$/components/ui/input"
import { Label } from "$/components/ui/label"
import { Textarea } from "$/components/ui/textarea"
import { Switch } from "$/components/ui/switch"
import { Button } from "$/components/ui/button"
import { useContext } from "react"
import { AuthContext } from "$/contexts/AuthContext"
import { useFetcher } from "react-router-dom"
import { Alert, AlertDescription, AlertTitle } from "$/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

export default function NewPage() {
  const auth = useContext(AuthContext)
  const fetcher = useFetcher<{ error: string }>()

  if (!auth?.user) return null

  return (
    <div className="mx-auto max-w-md">
      <main className="m-4 mt-10 flex flex-col justify-center gap-4 border border-gray-400 bg-gray-200 px-6 py-3 text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
        <h1 className="font-heading text-4xl font-bold">Create a Stage</h1>
        {fetcher.data?.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>An unknown error occured!</AlertTitle>
            <AlertDescription>{fetcher.data?.error}</AlertDescription>
          </Alert>
        )}
        <fetcher.Form
          method="post"
          action="/new"
          className="flex flex-col justify-center gap-2"
        >
          <FormGroup>
            <label htmlFor="name" className="text-sm">
              Stage Name
            </label>
            <Input
              id="name"
              name="name"
              placeholder="Enter stage name"
              required
              minLength={3}
              maxLength={255}
              type="text"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="desc" className="text-sm">
              Stage Description
            </label>
            <Textarea
              maxLength={2047}
              id="desc"
              name="description"
              placeholder="Enter stage description"
            />
          </FormGroup>
          <FormGroup className="flex-row items-center justify-between space-x-2">
            <Label htmlFor="invite-only" className="text-sm">
              Make stage invite only
            </Label>
            <Switch id="invite-only" name="invite_only" />
          </FormGroup>
          <input type="hidden" name="owner_id" value={auth.user.id} />
          <Button type="submit" className="mt-4" disabled={fetcher.state !== "idle"}>
            {fetcher.state !== "idle" && <Loader2 className="mr-1 animate-spin" />}{" "}
            Creat{fetcher.state !== "idle" ? "ing" : "e"} Stage
          </Button>
        </fetcher.Form>
      </main>
    </div>
  )
}
