import {
	AudioTrack,
	ParticipantContextIfNeeded,
	useIsSpeaking,
	useLocalParticipant,
	useRoomInfo,
} from "@livekit/components-react";
import { LocalParticipant, RemoteParticipant, Track } from "livekit-client";
import Avatar from "../Avatar";
import { Database } from "$/util/dbTypes";
import { Badge } from "$c/ui/badge";
import {
	useIsLocalASpeaker,
	useListeners,
	useSpeakers,
} from "$/contexts/participants";
import { Mic, MicOff } from "lucide-react";
import { cn } from "$/util/ui";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "$c/ui/context-menu";
import RemoveParticipantButton from "./RemoveParticipantButton";
import MakeSpeakerOrListenerButton from "./MakeSpeakerOrListenerButton";

export function ParticipantInfo({
	isSpeaker,
	p,
}: {
	isSpeaker: boolean;
	p: LocalParticipant | RemoteParticipant;
}) {
	const { profile } = JSON.parse(p.metadata!) as {
		profile: Database["public"]["Tables"]["profiles"]["Row"];
	};
	const isSpeaking = useIsSpeaking(p);

	return (
		<>
			<Avatar
				src={profile.avatar_url}
				alt={`${profile.username}'s avatar`}
				className={cn(
					"mx-auto my-2 flex justify-center ring-2 ring-offset-2 transition-all duration-300",
					isSpeaking
						? "ring-sky-600 ring-offset-sky-500"
						: "ring-transparent ring-offset-transparent",
				)}
				h="4rem"
				w="4rem"
				fb={profile.username.charAt(0)}
			/>
			<p className="flex items-center gap-1 font-medium">
				{profile.username}
				{isSpeaker && (
					<>
						<span className="sr-only">
							Microphone {p.isMicrophoneEnabled ? "muted" : "unMuted"}
						</span>{" "}
						{p.isMicrophoneEnabled ? <Mic /> : <MicOff />}
					</>
				)}
			</p>
		</>
	);
}

export function ParticipantTile({
	p,
	isOwner,
	isLocalOwner,
	isSpeaker = false,
}: {
	p: LocalParticipant | RemoteParticipant;
	isOwner: boolean;
	isLocalOwner: boolean;
	isSpeaker?: boolean;
}) {
	const { name } = useRoomInfo();

	return (
		<ParticipantContextIfNeeded participant={p}>
			<div className="flex flex-col items-center justify-center gap-2 p-4">
				{isLocalOwner && !isOwner
					? (
						<ContextMenu>
							<ContextMenuTrigger>
								<ParticipantInfo p={p} isSpeaker={isSpeaker} />
							</ContextMenuTrigger>
							<ContextMenuContent>
								{!p.isLocal && isLocalOwner && (
									<ContextMenuItem asChild>
										<MakeSpeakerOrListenerButton
											isSpeaker={!!isSpeaker}
											participantId={p.identity}
											stageId={name.replace("stage-", "")}
										/>
									</ContextMenuItem>
								)}
								<ContextMenuSeparator />
								{!p.isLocal && isLocalOwner && (
									<ContextMenuItem asChild>
										<RemoveParticipantButton
											participantId={p.identity}
											stageId={name.replace("stage-", "")}
										/>
									</ContextMenuItem>
								)}
							</ContextMenuContent>
						</ContextMenu>
					)
					: <ParticipantInfo p={p} isSpeaker={isSpeaker} />}
				{isOwner && (
					<div className="text-sm">
						<Badge>Owner</Badge>
					</div>
				)}
				{isSpeaker && <AudioTrack source={Track.Source.Microphone} />}
			</div>
		</ParticipantContextIfNeeded>
	);
}

export default function ParticipantsView(
	{ stageOwnerId }: { stageOwnerId: string },
) {
	const { localParticipant } = useLocalParticipant();
	const isLocalASpeaker = useIsLocalASpeaker();
	const speakers = useSpeakers();
	const listeners = useListeners();

	return (
		<div className="rounded-md border border-gray-700 bg-gray-100 px-4 py-6 dark:border-gray-300 dark:bg-gray-800">
			<h3 className="text-2xl font-semibold">Speakers</h3>
			{stageOwnerId === localParticipant.identity && (
				<p className="my-4 text-gray-700 dark:text-gray-500">
					Right-Click on a participant to perform actions on them.
				</p>
			)}
			<div className="grid grid-cols-2 items-center gap-x-2 gap-y-4 md:grid-cols-4 lg:grid-cols-6">
				{isLocalASpeaker && (
					<ParticipantTile
						p={localParticipant}
						isLocalOwner={stageOwnerId === localParticipant.identity}
						isOwner={stageOwnerId === localParticipant.identity}
						isSpeaker
					/>
				)}
				{speakers.map((r) => (
					<ParticipantTile
						p={r}
						key={r.identity}
						isLocalOwner={stageOwnerId === localParticipant.identity}
						isOwner={stageOwnerId === r.identity}
						isSpeaker
					/>
				))}
			</div>
			<h3 className="text-2xl font-semibold">Listeners</h3>
			<div className="grid grid-cols-2 items-center gap-x-2 gap-y-4 md:grid-cols-4 lg:grid-cols-6">
				{!isLocalASpeaker && (
					<ParticipantTile
						p={localParticipant}
						isLocalOwner={stageOwnerId === localParticipant.identity}
						isOwner={stageOwnerId === localParticipant.identity}
					/>
				)}
				{listeners.map((r) => (
					<ParticipantTile
						p={r}
						key={r.identity}
						isLocalOwner={stageOwnerId === localParticipant.identity}
						isOwner={stageOwnerId === r.identity}
					/>
				))}
			</div>
		</div>
	);
}
