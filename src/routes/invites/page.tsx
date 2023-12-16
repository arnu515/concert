import FullPageError from "$/components/FullPageError"
import { Button } from "$/components/ui/button"
import { Skeleton } from "$/components/ui/skeleton"
import { Check, Loader2, X } from "lucide-react"
import { Link } from "react-router-dom"
import {
	useAcceptInvite,
	useInvitesCount,
	useInvites,
	useRejectInvite
} from "./invites"
import { useToast } from "$/components/ui/use-toast"
import { ToastAction } from "@radix-ui/react-toast"

export default function InvitesPage() {
	const { data: invites, isPending, isError, error } = useInvites()
	const { data: count } = useInvitesCount(true)
	const { isPending: isAcceptPending, mutate: acceptInvite } = useAcceptInvite()
	const { isPending: isRejectPending, mutate: rejectInvite } = useRejectInvite()
	const { toast } = useToast()

	if (isError) {
		return (
			<FullPageError
				className="m-4 mt-10"
				message="Could not fetch invites."
				friendlyMessage={error.message}
			/>
		)
	}

	return (
		<div className="mx-auto max-w-md">
			<main className="m-4 mt-10 flex flex-col justify-center gap-4 border border-gray-400 bg-gray-200 px-6 py-3 text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white">
				<h1 className="font-heading text-4xl font-bold">Stage Invites</h1>
				{isPending ? (
					<Skeleton className="w-30 h-16" />
				) : invites.length > 0 ? (
					invites.map(invite => (
						<div className="flex items-center gap-2" key={invite.id}>
							<Link to={`/stage/${invite.stage!.id}`} className="font-medium underline">
								{invite.stage!.name}
							</Link>
							<div className="ml-auto flex items-center gap-1">
								<Button size="icon" asChild>
									<button
										title="Accept"
										aria-label="Accept invite"
										disabled={isAcceptPending}
										onClick={() => {
											acceptInvite({ inviteId: invite.id })
											toast({
												title: "Would you like to join this stage?",
												description:
													"You have accepted the invite to join this stage. Click on the button to join it. You may join it at any time.",
												action: (
													<ToastAction altText="Join the stage" asChild>
														<Link
															to={`/stage/${invite.stage!.id}`}
															className="font-medium underline"
														>
															Join Stage
														</Link>
													</ToastAction>
												)
											})
										}}
									>
										{isAcceptPending ? (
											<Loader2 size={16} className="animate-spin" />
										) : (
											<Check size={16} />
										)}
									</button>
								</Button>
								<Button size="icon" variant="destructive" asChild>
									<button
										title="Reject"
										aria-label="Reject invite"
										onClick={() => rejectInvite({ inviteId: invite.id })}
									>
										{isRejectPending ? (
											<Loader2 size={16} className="animate-spin" />
										) : (
											<X size={16} />
										)}
									</button>
								</Button>
							</div>
						</div>
					))
				) : (
					<p className="text-xl">You have no invites.</p>
				)}
				{(count || 0) > 0 && (
					<p className="mt-2 text-sm text-muted-foreground">
						You have accepted {count} invite{(count || 0) !== 1 && "s"}
					</p>
				)}
			</main>
		</div>
	)
}
