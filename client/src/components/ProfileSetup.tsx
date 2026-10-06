/** Design reminder — Crimson Pulse: compact, low-friction first-use profile setup. */
import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ProfileSetup({ defaultName, onComplete }: { defaultName: string; onComplete: () => void }) {
  const [displayName, setDisplayName] = useState(defaultName);
  const saveProfile = trpc.profile.save.useMutation({ onSuccess: () => { toast.success("Your MediRisk profile is ready."); onComplete(); } });
  useEffect(() => setDisplayName(defaultName), [defaultName]);
  return <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm px-5 flex items-end sm:items-center justify-center"><div className="w-full max-w-md rounded-t-[28px] sm:rounded-[28px] border border-white/10 bg-[#111] p-6 shadow-2xl"><div className="h-11 w-11 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 flex items-center justify-center"><UserRound size={19} /></div><p className="mt-5 text-[10px] tracking-[.15em] text-red-300/60">FIRST-TIME SETUP</p><h2 className="mt-2 font-display text-xl font-bold text-white">What should MediRisk call you?</h2><p className="mt-2 text-sm leading-relaxed text-white/45">This name appears only in your signed-in dashboard and personal record library.</p><label className="mt-5 block text-xs text-white/55">Display name<input autoFocus value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={100} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-red-500/50" /></label><button disabled={displayName.trim().length < 2 || saveProfile.isPending} onClick={() => saveProfile.mutate({ displayName: displayName.trim() })} className="mt-5 w-full rounded-xl bg-red-600 py-3 text-sm font-semibold disabled:opacity-50">{saveProfile.isPending ? "Saving profile…" : "Continue to MediRisk"}</button>{saveProfile.error && <p className="mt-3 text-xs text-red-300">{saveProfile.error.message}</p>}</div></div>;
}
