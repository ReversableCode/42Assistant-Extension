import { useEffect, useState } from "react";
import { SparklesIcon } from "@heroicons/react/outline";
import { ChevronDoubleUpIcon } from "@heroicons/react/solid";

export default function CoalitionBadge({
  profile,
}: {
  profile: Intra42Profile;
}) {
  const [coalitionLogo, setCoalitionLogo] = useState<string | null>(null);

  useEffect(() => {
    if (profile.currentCursus?.coalitionLogo)
      fetch(profile.currentCursus.coalitionLogo)
        .then((response) => response.text())
        .then((text) => {
          const customSVG = document.createElement("div");
          customSVG.innerHTML = text;
          customSVG.children[0].classList.add("coalition-flag--icon");

          setCoalitionLogo(customSVG.innerHTML);
        });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!profile.currentCursus?.coalition) return <></>;

  return (
    <div className="absolute right-4 top-0 flex flex-row gap-4">
      <span className="coalition-name inline-block mt-1">
        <div className="flex flex-col items-end">
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://profile.intra.42.fr/${profile.currentCursus.coalitionURL}`}
            className="coalition-span text-sm hover:underline"
            style={{ color: profile.currentCursus?.backgroundColor }}
          >
            {profile.currentCursus?.coalition}
          </a>
          <div className="inline-block text-white text-sm mt-1">
            <span
              className="inline-flex flex-row gap-1 mr-4"
              id="coalition-score"
            >
              <SparklesIcon className="w-5 h-5" />
              <span className="coalition-score-value">
                {profile.currentCursus?.score}
              </span>
            </span>
            <span className="inline-flex flex-row gap-1" id="coalition-rank">
              <ChevronDoubleUpIcon className="w-5 h-5" />
              <span className="coalition-rank-value">
                {profile.currentCursus?.rank}
              </span>
            </span>
          </div>
        </div>
      </span>

      <a
        target="_blank"
        rel="noreferrer"
        href={`https://profile.intra.42.fr/${profile.currentCursus.coalitionURL}`}
      >
        <div className="coalition-flag-mini">
          <svg
            viewBox="0 0 68 104"
            style={{ fill: profile.currentCursus.backgroundColor }}
            className="coalition-flag--flag"
          >
            <g id="banner-content">
              <g
                id="UI-Intranet-banner-content"
                transform="translate(-96.000000, -60.000000)"
              >
                <g
                  id="banner-content-g-1"
                  transform="translate(96.000000, 60.000000)"
                >
                  <polygon
                    id="banner-content-polygon-1"
                    points="0,0 0,80.5 34.3,104 68,80.5 68,0"
                  />
                </g>
              </g>
            </g>
          </svg>

          {coalitionLogo && (
            <div
              dangerouslySetInnerHTML={{ __html: coalitionLogo }}
              className="inline-block"
            />
          )}
        </div>
      </a>
    </div>
  );
}
