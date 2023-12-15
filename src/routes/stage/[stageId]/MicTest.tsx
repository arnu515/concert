import FormGroup from "$/components/FormGroup"
import { Button } from "$/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "$/components/ui/select"
import { Skeleton } from "$/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import { RefreshCw } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function MicTest() {
  const { data: hasPermission } = useQuery({
    queryKey: ["local", "mediaDevices", "getPermission"],
    retry: false,
    queryFn: async () => {
      try {
        const st = await navigator.mediaDevices.getUserMedia({ audio: true })
        st.getTracks().forEach(t => t.stop())
        return true
      } catch (e) {
        console.error(e)
        return false
      }
    }
  })

  const {
    isPending,
    data: devices,
    error,
    isError,
    refetch,
    isRefetching
  } = useQuery({
    enabled: hasPermission,
    queryKey: ["local", "mediaDevices", "microphones"],
    queryFn: async () => {
      return (await navigator.mediaDevices.enumerateDevices()).filter(
        ({ kind }) => kind === "audioinput"
      )
    }
  })

  if (isError) {
    throw error
  }

  const [stream, setStream] = useState<MediaStream | null>(null)
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>()
  const audioRef = useRef<HTMLAudioElement>(null)

  async function toggleTesting() {
    if (stream) {
      stream.getTracks().forEach(t => t.stop())
      setStream(null)
      return
    }

    const st = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: selectedDeviceId,
        echoCancellation: true,
        noiseSuppression: true
      }
    })
    setStream(st)
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (!stream) {
      audio.srcObject = null
      audio.pause()
      return
    }

    audio.srcObject = stream
    audio.play()

    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop())
      audio.srcObject = null
      audio.pause()
    }
  }, [stream])

  return (
    <div className="flex flex-col justify-center rounded-md border border-gray-700 bg-gray-100 px-4 py-2 dark:border-gray-300 dark:bg-gray-800">
      <h3 className="text-2xl font-semibold">Check your Microphone</h3>
      <p className="my-2 text-sm text-gray-500 dark:text-gray-400">
        Use this widget to select and check your microphone before joining. Audio from
        your mic will be played back to you.
      </p>
      {!hasPermission ? (
        <p className="text-red-500">
          Please allow us to access your microphone. Reload this page to ask for
          permission again.
        </p>
      ) : (
        <>
          <FormGroup>
            <label className="sr-only" htmlFor="microphone">
              Select a microphone
            </label>
            {isPending ? (
              <Skeleton className="h-4 w-full" />
            ) : (
              <div className="flex items-center gap-1">
                <Select onValueChange={setSelectedDeviceId} value={selectedDeviceId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your mic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {devices.map(d => (
                        <SelectItem value={d.deviceId || "a"} key={d.deviceId}>
                          {d.label || "Unknown"}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" asChild>
                  <button
                    title="Refresh"
                    aria-label="Refresh"
                    onClick={() => refetch()}
                    disabled={isRefetching}
                  >
                    <RefreshCw size={16} />
                  </button>
                </Button>
              </div>
            )}
          </FormGroup>
          <Button
            className="mt-2"
            variant={stream ? "default" : "secondary"}
            onClick={toggleTesting}
          >
            {stream ? "Stop testing" : "Test Microphone"}
          </Button>
          <audio className="hidden" autoPlay ref={audioRef} />
        </>
      )}
    </div>
  )
}
