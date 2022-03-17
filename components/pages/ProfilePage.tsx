import cn from "classnames";
import { SearchIcon } from "@heroicons/react/outline";

import { useUI } from "../../contexts/ui.context";
import { LocationGraph } from "../../lib/intra-fetcher";

import ProfileCards from "../ProfileCards";
import ImageFallback from "../ImageFallback";
import CoalitionBadge from "../CoalitionBadge";
import LogtimeHeatmap from "../LogtimeHeatmap";

export default function ProfilePage({
  profile,
  setProfile,
}: {
  profile: Intra42Profile;
  setProfile: (profile: Intra42Profile | null) => void;
}) {
  const { switchView } = useUI();
  const logtimeInstance = new LocationGraph();

  return (
    <main className="w-full h-full flex flex-col">
      <div className="bg-primary pb-4 shadow-xl max-w-sm relative">
        <div className="w-full h-24 relative">
          <button
            onClick={() => switchView("SEARCH")}
            className="absolute top-2 right-2 p-1.5 rounded-md flex items-center justify-center focus:outline-none bg-primary bg-opacity-50 hover:bg-opacity-70 z-20"
          >
            <SearchIcon className="w-4 h-4 text-white" />
          </button>

          <div className="w-full h-full from-primary to-transparent absolute inset-0 z-10 bg-gradient-to-t" />
          <ImageFallback
            className={cn(
              "w-full h-24 object-cover object-center",
              !profile?.isAvailable && "grayscale"
            )}
            src={profile?.currentCursus?.backgroundImage}
            alt="coalition image"
          />
        </div>
        <div className="pt-14 px-4 relative flex flex-col z-10">
          <ImageFallback
            onClick={() =>
              window.open(
                `https://profile.intra.42.fr/users/${profile.login}`,
                "_blank"
              )
            }
            className="absolute -top-12 left-4 w-24 h-24 rounded-full shadow-md border-2 border-white object-cover object-center cursor-pointer"
            src={profile.avatarUrl}
            alt="profile-picture"
          />
          <CoalitionBadge profile={profile} />
          <p className="w-full text-base font-bold leading-normal text-primary dark:text-gray-100">
            {profile.fullName}
          </p>
          <p className="w-full text-xs leading-normal text-primary dark:text-gray-300">
            {profile.displayName} | {profile.currentCursus?.grade}
          </p>
        </div>

        <ProfileCards profile={profile} setProfile={setProfile} />
        <LogtimeHeatmap profile={profile} logtimeInstance={logtimeInstance} />

        <div className="mt-4 w-full flex px-4 text-gray-600 dark:text-gray-100">
          <div className="w-full h-6 bg-white bg-opacity-10 rounded-md relative overflow-hidden">
            <span className="absolute w-full h-full flex items-center justify-center text-center text-xs shadow-md shadow-primary">
              {profile.currentCursus?.level}
            </span>
            <div
              className="h-full"
              style={{
                width: profile.currentCursus?.progress || "0%",
                backgroundColor:
                  profile.currentCursus?.backgroundColor || "#fff",
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
