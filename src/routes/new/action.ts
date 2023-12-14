import supabase from "$/util/supabase"
import { redirect, type ActionFunction } from "react-router-dom"
import { ZodError, z } from "zod"
import { customAlphabet } from "nanoid"

const genId = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVXYZ", 9)

const action: ActionFunction = async ({ request }) => {
  try {
    const data = z
      .object({
        name: z.string().min(3).max(255),
        description: z.string().max(2047).optional(),
        invite_only: z
          .string()
          .default("off")
          .transform(val => val === "on"),
        owner_id: z.string().uuid()
      })
      .parse(Object.fromEntries(await request.formData()))

    // Create stage
    const { data: stage, error: stageCreationError } = await supabase
      .from("stages")
      .insert({
        id: genId(),
        name: data.name,
        description: data.description,
        invite_only: data.invite_only,
        owner_id: data.owner_id
      })
      .select("id")
      .single()
    if (stageCreationError) {
      console.error({ stageCreationError })
      return { error: stageCreationError.message }
    }

    return redirect("/stage/" + stage.id)
  } catch (e) {
    console.error(e)
    if (e instanceof ZodError) {
      return {
        error: e.errors.map(err => `(\`${err.path}\`): ${err.message}`).join("\n")
      }
    }
    return { error: (e as any).message || "An unexpected error occured." }
  }
}

export default action
