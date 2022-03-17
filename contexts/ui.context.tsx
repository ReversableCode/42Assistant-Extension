import { createContext, useState, useMemo, useContext, FC } from "react";

import ImageFallback from "../components/ImageFallback";

export const UiContext = createContext<any>({});

UiContext.displayName = "UiContext";

export const UiProvider: FC = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState("PROFILE");

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);
  };
  const switchView = (view: string) => {
    setView(view);
  };

  const value = useMemo(
    () => ({
      view,
      isLoading,

      switchView,
      handleLoading,
    }),
    [view, isLoading] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <UiContext.Provider value={value}>
      {isLoading && (
        <div
          className="w-full h-full flex justify-center items-center bg-primary relative"
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
      {props.children}
    </UiContext.Provider>
  );
};

export const useUI = () => {
  const context: {
    view: 'PROFILE' | 'SEARCH' | 'OTHER_PROFILE';
    isLoading: boolean;
    switchView: (view: 'PROFILE' | 'SEARCH' | 'OTHER_PROFILE') => void;
    handleLoading: (loading: boolean) => void;
  } = useContext(UiContext);
  if (context === undefined) {
    throw new Error(`useUI must be used within a UiProvider`);
  }
  return context;
};
