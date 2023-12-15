/**
 * Checks to see if all WebRTC features are supported
 */
import { isBrowserSupported } from "livekit-client"
export default function Checks() {
  if (!isBrowserSupported()) {
    throw new Error("Your browser does not support WebRTC!")
  }

  return null
}
