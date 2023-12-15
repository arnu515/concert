import { TrackSource } from "livekit";
import { createClient } from "supabase";
import { cors, res } from "u";
import { Database } from "dbTypes";
import { generate } from "token";

const API_KEY = Deno.env.get("LIVEKIT_API_KEY")!;
const SECRET_KEY = Deno.env.get("LIVEKIT_API_SECRET")!;
const URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors() });
  }

  if (
    req.method !== "POST" ||
    req.headers.get("content-type") !== "application/json"
  ) {
    return res({
      message: "Invalid request body. Please send a POST JSON body",
      status: 400,
    });
  }

  const supabase = createClient<Database>(
    URL,
    ANON_KEY,
    {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    },
  );
  const { data: { user }, error: getUserError } = await supabase.auth.getUser();
  if (!user || getUserError) {
    return res({
      message: getUserError?.message || "Unauthorized",
      status: getUserError ? 500 : 401,
    });
  }

  // fetch user profile
  const { data: profile, error: fetchProfileError } = await supabase.from(
    "profiles",
  ).select("*").eq("id", user.id).single();
  if (fetchProfileError || !profile) {
    return res({
      message: fetchProfileError?.message || "Unauthorized",
      status: fetchProfileError ? 500 : 401,
    });
  }

  const { stageId } = await req.json() as { stageId: string };
  if (typeof stageId !== "string" || !stageId) {
    return res({
      message: "Invalid request body. Please send `stageId`",
      status: 400,
    });
  }

  // fetch the stage
  const { data: stage, error: getStageError } = await supabase.from("stages")
    .select("id, invite_only, owner_id").eq("id", stageId).maybeSingle();
  if (getStageError || !stage) {
    return res({
      message: getStageError?.message || "Stage not found",
      status: getStageError ? 500 : 404,
    });
  }
  const isOwner = stage.owner_id === user.id;

  if (stage.invite_only && !isOwner) {
    // fetch stage invites
    const { count, error: getInvitesCountError } = await supabase.from(
      "stage_invites",
    ).select("id", { count: "exact", head: true }).eq("to_id", user.id).eq(
      "stage_id",
      stage.id,
    );
    if (getInvitesCountError || count === 0) {
      return res({
        message: getInvitesCountError?.message ||
          "This stage is invite-only and you are not invited to this stage.",
        status: getStageError ? 500 : 403,
      });
    }
  }

  console.log({ API_KEY, SECRET_KEY });

  // Create access token
  const token = await generate({
    userId: user.id,
    username: profile.username,
    metadata: JSON.stringify({ profile }),
    apiKey: API_KEY,
    secretKey: SECRET_KEY,
    grants: ({
      roomJoin: true,
      room: `stage-${stageId}`,
      roomAdmin: isOwner,
      canSubscribe: true,
      canPublish: isOwner,
      canPublishSources: isOwner ? [TrackSource.MICROPHONE] : [],
      canPublishData: true,
    }),
  });

  return res({ message: "Access granted", data: { token: token } });
});
