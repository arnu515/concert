import { VercelRequest, VercelResponse } from "@vercel/node"
import { RoomServiceClient } from "livekit-server-sdk"
import { jwtVerify } from "jose"

const { LIVEKIT_API_URL, LIVEKIT_API_KEY, LIVEKIT_SECRET_KEY } = process.env

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log({ LIVEKIT_API_KEY, LIVEKIT_API_URL, LIVEKIT_SECRET_KEY, hi: true })
  if (!req.url) return res.status(400)

  const { stageId, participantId, isSpeaker } = req.body
  if (typeof stageId !== "string" || !stageId) {
    return res.status(400).json({
      message: "Invalid request body. Please send `stageId`"
    })
  }
  if (typeof participantId !== "string" || !participantId) {
    return res.status(400).json({
      message: "Invalid request body. Please send `participantId`"
    })
  }
  if (typeof isSpeaker !== "boolean") {
    return res.status(400).json({
      message: "Invalid request body. Please send `isSpeaker`"
    })
  }

  const jwt = req.headers.authorization?.split(" ")[1]
  if (!jwt) {
    return res.status(401).json({
      message: "Invalid token"
    })
  }

  try {
    const { payload } = await jwtVerify(
      jwt,
      new TextEncoder().encode(LIVEKIT_SECRET_KEY!),
      { issuer: LIVEKIT_API_KEY! }
    )
    if (!(payload?.video as any)?.roomAdmin) {
      return res.status(401).json({
        message: "You are not allowed to perform this action."
      })
    }

    const client = new RoomServiceClient(
      LIVEKIT_API_URL!,
      LIVEKIT_API_KEY!,
      LIVEKIT_SECRET_KEY!
    )
    await client.updateParticipant(`stage-${stageId}`, participantId, undefined, {
      canSubscribe: true,
      canPublish: !isSpeaker,
      canPublishSources: !isSpeaker ? [2] : [],
      canPublishData: true
    })

    return res.status(200).json({
      message: `Made this participant a ${!isSpeaker ? "speaker" : "listener"}.`
    })
  } catch (e) {
    console.error(e)
    return res.status(401).json({
      message: (e as any)?.message || "Invalid token"
    })
  }
}
