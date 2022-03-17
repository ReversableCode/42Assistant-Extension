import { useEffect } from "react";
import { LocationGraph } from "../lib/intra-fetcher";

export default function LogtimeHeatmap({
  profile,
  logtimeInstance,
}: {
  profile: Intra42Profile;
  logtimeInstance: LocationGraph;
}) {
  useEffect(() => {
    logtimeInstance.fetchDataAndDraw(
      profile.currentCursus?.backgroundColor,
      profile.login
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mt-2 w-full flex px-4 text-gray-600 dark:text-gray-100">
      <div className="w-full h-full flex flex-col px-4 py-3 rounded-md bg-gray-50 bg-opacity-10">
        <div className="w-full flex flex-row justify-between items-center uppercase text-xs tracking-wide mb-2">
          <span className="font-bold uppercase text-white">LOGTIME</span>

          {logtimeInstance && (
            <span
              id="logtime-instance"
              style={{ color: profile.currentCursus?.backgroundColor }}
            >
              <span className="uppercase bg-white bg-opacity-20 font-bold text-white hidden">
                <span className="underline decoration-dotted lowercase italic font-bold hidden" />
              </span>
            </span>
          )}
        </div>
        <div
          id="tooltip"
          className="absolute hidden bg-primary text-center w-12 py-1 text-xs text-white border"
          style={{
            borderColor: profile.currentCursus?.backgroundColor,
          }}
        />
        <svg
          id="user-locations"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="162 0 415 160"
          preserveAspectRatio="xMinYMin meet"
          onMouseMove={(evt) => {
            if (
              (evt.target as Element).getAttribute("data-toggle") === "tooltip"
            ) {
              const tooltip = document.getElementById("tooltip");
              if (tooltip) {
                tooltip.innerHTML =
                  (evt.target as Element).getAttribute("data-original-title") ||
                  "0h00";
                tooltip.style.display = "block";
                const rr = (evt.target as Element).getBoundingClientRect();
                tooltip.style.left = `${rr.left + rr.width / 2 - 24}px`;
                tooltip.style.top = `${rr.top - rr.height - 16}px`;
              }
            }
          }}
          onMouseOut={() => {
            const tooltip = document.getElementById("tooltip");
            if (tooltip) {
              tooltip.style.display = "none";
            }
          }}
        />
      </div>
    </div>
  );
}
