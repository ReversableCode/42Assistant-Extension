import { useState } from "react";
import { ArrowLeftIcon, SearchIcon } from "@heroicons/react/outline";

import { getHTML } from "../../lib/fetch.helper";
import { useUI } from "../../contexts/ui.context";

import ImageFallback from "../ImageFallback";

export default function SearchPage({
  login,
  setLogin,
}: {
  login: string;
  setLogin: (login: string) => void;
}) {
  const { switchView } = useUI();
  const [loading, setLoading] = useState(false);

  async function onSearch() {
    const searchContainer = document.querySelector(
      "#search-items"
    ) as HTMLDivElement;

    try {
      setLoading(true);
      searchContainer.innerHTML = "";

      const data = await getHTML(
        "https://profile.intra.42.fr/searches/search.html?query=" + login
      );

      data.querySelectorAll(".search-item.search-user-item").forEach((item) => {
        const new_btn = document.createElement("button");
        new_btn.innerHTML = item.innerHTML;
        new_btn.className = "search-item search-user-item";
        new_btn.style.backgroundImage = (
          item as HTMLAnchorElement
        ).style.backgroundImage;
        new_btn.setAttribute(
          "data-login",
          (item.querySelector(".search-item-title")?.textContent || "").trim()
        );

        new_btn.addEventListener("click", () => {
          setLogin((new_btn.getAttribute("data-login") || "").trim());
          switchView("OTHER_PROFILE");
        });
        searchContainer.appendChild(new_btn);
      });
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  return (
    <main
      className="w-full h-full flex flex-col bg-primary"
      style={{ minHeight: "32rem" }}
    >
      <div className="pb-4 shadow-xl max-w-sm relative">
        <div className="w-full h-10 relative">
          <div className="relative mx-auto text-gray-600 bg-white">
          <button
              type="button"
              onClick={() => switchView("PROFILE")}
              className="absolute left-0 top-0 h-10 w-10 flex items-center justify-center border-r border-primary/20"
            >
              <ArrowLeftIcon className="text-gray-600 h-4 w-4" />
            </button>
            <input
              className="bg-white h-10 w-full px-14 pr-12 text-sm focus:outline-none"
              type="search"
              name="search"
              placeholder="Search"
              onChange={(e) => setLogin(e.target.value)}
              onKeyDown={(e) => (e.key === 'Enter') && onSearch()}
            />
            <button
              type="button"
              onClick={onSearch}
              className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center border-l border-primary/20"
            >
              <SearchIcon className="text-gray-600 h-4 w-4" />
            </button>
          </div>
        </div>
        <div
          id="search-items"
          className="pt-4 px-4 relative grid grid-cols-3 gap-4 z-10 w-full h-full"
        >
          {loading && (
            <div
              className="w-full h-full flex justify-center items-center bg-primary absolute inset-0"
              style={{ minHeight: "32rem" }}
            >
              <div className="w-24 h-24 flex justify-center items-center relative rounded-full bg-white bg-opacity-20">
                <svg
                  fill="none"
                  className="w-48 h-48 animate-spin absolute opacity-50"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
                    fill="white"
                    fillRule="evenodd"
                  />
                </svg>

                <ImageFallback
                  src="/images/chrome/icon128.png"
                  alt="42Assistant"
                  className="w-12 h-12 bg-cover bg-center mb-1"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
