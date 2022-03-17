import cn from "classnames";
import {
  AcademicCapIcon,
  CashIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/outline";
import { useUI } from "../contexts/ui.context";
import { loadCoalitionByCursusId } from "../lib/intra-fetcher";

export default function ProfileCards({
  profile,
  setProfile,
}: {
  profile: Intra42Profile;
  setProfile: (profile: Intra42Profile | null) => void;
}) {
  const { handleLoading } = useUI();

  function getBHColor(singularity: number) {
    if (singularity <= 14) return "#EE6173";
    else if (singularity <= 42) return "#DF9539";
    else return "#53D27A";
  }

  function getBHIcon(singularity: number) {
    if (singularity <= 14) return "icon-sad";
    else if (singularity <= 42) return "icon-smiley-surprise";
    else return "icon-smiley-relax";
  }

  function loadCoalition(id: string) {
    handleLoading(true);
    loadCoalitionByCursusId(id, profile)
      .then(setProfile)
      .finally(() => handleLoading(false));
  }

  return (
    <div className="mt-4 w-full grid grid-cols-3 gap-2 px-4 text-gray-600 dark:text-gray-100">
      <div className="w-full h-full flex flex-col items-center justify-center px-2 py-3 rounded-md bg-gray-50 bg-opacity-10">
        <CashIcon className="w-5 h-5" />
        <p
          className="text-[0.6rem] leading-none mt-2"
          style={{ color: profile.currentCursus?.backgroundColor }}
        >
          Wallet
        </p>
        <p className="text-xs font-bold leading-none text-gray-700 dark:text-gray-100 mt-1">
          {profile.wallet}
        </p>
      </div>
      <div className="w-full h-full flex flex-col items-center justify-center px-2 py-3 rounded-md bg-gray-50 bg-opacity-10">
        <PresentationChartLineIcon className="w-5 h-5" />
        <p
          className="text-[0.6rem] leading-none mt-2"
          style={{ color: profile.currentCursus?.backgroundColor }}
        >
          Evaluation points
        </p>
        <p className="text-xs font-bold leading-none text-gray-700 dark:text-gray-100 mt-1">
          {profile.evaluationPoints}
        </p>
      </div>
      <div className="w-full h-full flex flex-col items-center justify-center px-2 py-3 rounded-md bg-gray-50 bg-opacity-10">
        <AcademicCapIcon className="w-5 h-5" />
        <p
          className="text-[0.6rem] leading-none mt-2"
          style={{ color: profile.currentCursus?.backgroundColor }}
        >
          Cursus
        </p>
        <select
          className="w-full bg-transparent focus:outline-none text-xs font-bold leading-none text-gray-700 dark:text-gray-100"
          defaultValue={profile.currentCursus?.id}
          onChange={(e) => loadCoalition(e.target.value)}
        >
          {profile.availableCursus.map((cursus) => (
            <option key={cursus.id} value={cursus.id}>
              {cursus.name}
            </option>
          ))}
        </select>
      </div>

      {profile.currentCursus?.singularity !== undefined && (
        <div className="w-full h-full flex flex-row items-center justify-center px-2 py-3 rounded-md bg-gray-50 bg-opacity-10 col-span-2">
          <span
            className={cn(
              "text-[1.75rem] inline-flex mr-3",
              getBHIcon(profile.currentCursus?.singularity)
            )}
            id="bh-emote"
          />
          <div className="flex flex-col">
            <p
              className="text-[0.6rem] leading-none"
              style={{ color: profile.currentCursus?.backgroundColor }}
            >
              Black Hole absorption
            </p>
            <p
              className="text-xs font-bold leading-none mt-1"
              style={{
                color: getBHColor(profile.currentCursus?.singularity),
              }}
            >
              {profile.currentCursus?.singularity < 0
                ? "You've been absorbed by the Black Hole."
                : profile.currentCursus?.singularity === 0
                ? "A few hours left"
                : `${profile.currentCursus?.singularity} days left`}
            </p>
          </div>
        </div>
      )}
      <div
        className={cn(
          "w-full h-full flex flex-row items-center px-2 py-3 rounded-md bg-gray-50 bg-opacity-10",
          profile.currentCursus?.singularity === undefined && "col-span-3"
        )}
      >
        <div className="w-full flex flex-col items-center">
          <p
            className="text-[0.6rem] leading-none"
            style={{ color: profile.currentCursus?.backgroundColor }}
          >
            {profile.isAvailable ? "Available" : "Unavailable"}
          </p>
          <p className="text-xs font-bold leading-none text-gray-700 dark:text-gray-100 mt-1">
            {profile.availableAt || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
