import ImageFallback from "../ImageFallback";

export default function LoginPage() {
  return (
    <div
      className="w-full h-full flex flex-col justify-center items-center bg-primary relative"
      style={{ minHeight: "32rem" }}
    >
      <div className="w-24 h-24 flex justify-center items-center relative rounded-full bg-white bg-opacity-20 mb-6">
        <ImageFallback
          src="/images/chrome/icon128.png"
          alt="42Assistant"
          className="w-12 h-12 bg-cover bg-center mb-1"
        />
      </div>
      <span className="w-full leading-none text-center text-2xl text-white mb-3">
        Welcome to 42Assistant
      </span>
      <span className="w-full leading-none text-center text-xs text-gray-300 mb-12">
        Please sign in to 42 intra before using the extension!
      </span>
      <a
        target="_blank"
        rel="noreferrer"
        href="https://signin.intra.42.fr/users/sign_in"
        className="w-44 h-10 text-sm text-white flex justify-center items-center bg-[#00babc] hover:bg-[#00b0b2]"
      >
        SIGN IN
      </a>
    </div>
  );
}
