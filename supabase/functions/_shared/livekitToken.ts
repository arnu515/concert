import { SignJWT } from "jose";
import type { VideoGrant } from "livekit";

export interface GenerateOpts {
  username: string;
  userId: string;
  metadata?: string;
  secretKey: string;
  apiKey: string;
  grants: VideoGrant;
}

export async function generate(
  { grants, metadata, userId, username, secretKey, apiKey }: GenerateOpts,
) {
  const secret = new TextEncoder().encode(secretKey);
  const jwt = await new SignJWT({
    iss: apiKey,
    sub: userId, // identity of the user
    metadata,
    name: username,
    video: grants,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setNotBefore(Math.floor(Date.now() / 1000))
    .setExpirationTime("12h")
    .sign(secret);

  return jwt;
}
