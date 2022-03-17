import Head from "next/head";
import { useEffect, useState } from "react";

import { useUI } from "../contexts/ui.context";
import { init42IntraProfile } from "../lib/intra-fetcher";

import LoginPage from "../components/pages/LoginPage";
import ProfilePage from "../components/pages/ProfilePage";
import SearchPage from "../components/pages/SearchPage";
import OtherProfilePage from "../components/pages/OtherProfilePage";

export default function ExtensionContainer() {
  const { view, isLoading, handleLoading } = useUI();

  const [login, setLogin] = useState("");
  const [profile, setProfile] = useState<Intra42Profile | null>(null);

  useEffect(() => {
    handleLoading(true);
    init42IntraProfile().then((data) => {
      setProfile(data);
      handleLoading(false);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (["PROFILE", "OTHER_PROFILE"].includes(view)) {
      handleLoading(true);
      init42IntraProfile(view !== "PROFILE" ? login : undefined).then(
        (data) => {
          setProfile(data);
          handleLoading(false);
        }
      );
    }
  }, [login, view]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Head>
        <title>42Assistant</title>
        <meta
          name="description"
          content="An unofficial extention for the 42 Network intra, developed by Abdessamad El Bahri"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full h-full flex flex-col">
        {!isLoading &&
          view === "PROFILE" &&
          (profile ? (
            <ProfilePage profile={profile} setProfile={setProfile} />
          ) : (
            <LoginPage />
          ))}

        {!isLoading && view === "SEARCH" && (
          <SearchPage login={login} setLogin={setLogin} />
        )}

        {!isLoading &&
          view === "OTHER_PROFILE" &&
          (profile ? (
            <OtherProfilePage profile={profile} setProfile={setProfile} />
          ) : (
            <LoginPage />
          ))}

        <style global jsx>{`
          :root {
            --coalition-color-primary: ${profile?.currentCursus
              ?.backgroundColor || "#fff"};
          }
        `}</style>
      </div>
    </>
  );
}
