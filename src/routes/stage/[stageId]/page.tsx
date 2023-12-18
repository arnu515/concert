import { Badge } from "$/components/ui/badge"
import { Button } from "$/components/ui/button"
import { useAuth } from "$/contexts/AuthContext"
import { Loader2 } from "lucide-react"
import { useParams } from "react-router-dom"
import RequestToJoin from "$/components/RequestToJoin"
import Auth from "$/components/Auth"
import MicTest from "./MicTest"
import Checks from "./Checks"
import { useStore } from "@nanostores/react"
import { tokenStore, useGetToken } from "$/contexts/tokenStore"
import { Alert, AlertDescription, AlertTitle } from "$/components/ui/alert"
import Stage from "$/components/stage/Stage"
import { useIsInvitedToStage, useStage } from "$/contexts/stageStore"
import { Database } from "$/util/dbTypes"

function Loading() {
	return (
		<div className="m-4 mx-auto mt-20 max-w-sm">
			<Loader2 className="animate-spin duration-300" size={24} />
		</div>
	)
}

function StageStageIdContent({
	stage
}: {
	stage: Database["public"]["Tables"]["stages"]["Row"]
}) {
	const { data: isInvited, isPending: isInviteCheckPending } =
		useIsInvitedToStage(stage)
	const auth = useAuth()

	const token = useStore(tokenStore)
	const {
		isPending: isGetTokenPending,
		isError: isGetTokenError,
		error: getTokenError,
		mutate
	} = useGetToken()

	if (stage?.invite_only && auth?.user?.id !== stage.owner_id && isInviteCheckPending) {
		return <Loading />
	}

	if (token) {
		return <Stage token={token} stage={stage} />
	}

	return (
		<div className="mx-4 my-4 grid max-w-screen-xl grid-cols-1 gap-6 md:mx-auto md:my-6 md:grid-cols-3 md:gap-4">
			<main className="col-span-1 md:col-span-2">
				<h1 className="mb-2 text-3xl font-bold">
					Joining stage{" "}
					<span className="text-gray-700 dark:text-gray-400">{stage.name}</span>
				</h1>
				<p className="mb-2 text-xl">
					Description:{" "}
					<code className="text-gray-700 dark:text-gray-400">{stage.description}</code>
				</p>
				<div className="flex items-center gap-2">
					{auth?.user?.id === stage.owner_id && <Badge>You are the owner</Badge>}
					{stage.invite_only && <Badge variant="destructive">Invite-Only</Badge>}
				</div>
				<div className="my-4">
					{stage.invite_only && auth?.user?.id !== stage.owner_id && !isInvited ? (
						<div className="max-w-screen-md">
							<RequestToJoin stageId={stage.id} />
						</div>
					) : (
						<>
							{isGetTokenError && (
								<Alert className="my-2" variant="destructive">
									<AlertTitle>Could not join room</AlertTitle>
									<AlertDescription>{getTokenError.message}</AlertDescription>
								</Alert>
							)}
							<Button size="lg" asChild>
								<button
									disabled={isGetTokenPending}
									onClick={() => mutate({ stageId: stage.id })}
								>
									{isGetTokenPending && (
										<Loader2 className="mr-1 animate-spin duration-300" size={24} />
									)}
									Join{isGetTokenPending && "ing"} Stage
								</button>
							</Button>
						</>
					)}
				</div>
			</main>
			<aside className="max-w-sm">
				<Checks />
				<MicTest />
			</aside>
		</div>
	)
}

export default function StageStageIdPage() {
	const { stageId } = useParams() as { stageId: string }
	const { data: stage, error, isPending, isError } = useStage(stageId)

	const auth = useAuth()

	if (!auth) {
		return (
			<div className="m-4 mt-10">
				<h1 className="mb-2 text-3xl font-bold">Not authenticated</h1>
				<p className="mb-2 text-xl">
					You must sign up / sign in before joining a stage.
				</p>
				<div className="max-w-sm">
					<Auth />
				</div>
			</div>
		)
	}

	if (isPending) {
		return <Loading />
	}

	if (isError) {
		throw error
	}

	if (!stage) {
		throw new Error("404")
	}

	return <StageStageIdContent stage={stage} />
}
