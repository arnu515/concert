import { useAuth } from "$/contexts/AuthContext"
import { useStageForRooms } from "$/contexts/stageStore"
import Actions from "./Actions"
import Chat from "./Chat"
import JoinRequests from "./JoinRequests"
import ParticipantsView from "./ParticipantsView"

export default function StageView() {
  const { data: stage, isSuccess } = useStageForRooms()
  const auth = useAuth()

  if (!isSuccess || !stage) return null

  return (
    <main className="mx-4 my-4 grid max-w-screen-xl grid-cols-1 gap-6 md:mx-auto md:my-6 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
      <div className="col-span-1 row-start-2 md:col-span-2 md:row-start-auto lg:col-span-3">
        <h1
          className="mb-4 font-heading text-5xl font-bold"
          style={{ letterSpacing: "0.1ch" }}
        >
          <span className="text-3xl text-gray-500">Stage:</span> {stage.name}
        </h1>
        <Actions />
        <ParticipantsView stageOwnerId={stage.owner_id} />
      </div>
      <div className="col-span-1 row-start-1 flex flex-col gap-2 md:row-start-auto">
        {stage.owner_id === auth?.user?.id && (
          <>
            <JoinRequests />
          </>
        )}
        <Chat />
      </div>
    </main>
  )
}
