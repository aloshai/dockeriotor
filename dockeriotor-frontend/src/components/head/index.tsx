import { useTelegramLogin } from "../../hooks/use-telegram-login";

export function Head() {
  const telegramLogin = useTelegramLogin();

  return (
    <div className="flex flex-col items-center my-auto before:w-96 before:h-96 before:z-0 before:rounded-full before:left-1/2 before:top-1/2 before:absolute before:bg-blue-500 before:blur-[250px] before:-translate-y-1/2 before:-translate-x-1/2 before:pointer-events-none">
      <div className="py-2 px-8 border border-white/20 rounded-full mb-8 z-10 relative">
        <span className="text-secondary">
          Easily manage your Workers via Discord, Telegram and Web!
        </span>
      </div>
      <h1 className="text-5xl font-semibold text-center">
        Remote Worker Management Tool
      </h1>
      <p className="text-center lg:w-1/2 mt-8 text-sm text-white/80">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae quibusdam
        quis repellat eum veniam, vel nostrum deleniti voluptatibus, cupiditate
        porro sapiente dolore nulla autem fugit?
      </p>

      <div className="flex md:flex-row flex-col items-center gap-4 md:gap-8 mt-12">
        <a
          href="https://discord.com/oauth2/authorize?client_id=1228183759183020096&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fdiscord%2Fcallback&scope=identify"
          className="px-8 py-2 rounded-full border hover:bg-white hover:text-black transition"
        >
          Start with Discord
        </a>
        <span className="my-auto text-white/50 text-sm">or</span>
        <button
          onClick={telegramLogin}
          className="px-8 py-2 rounded-full border hover:bg-white hover:text-black transition"
        >
          Start with Telegram
        </button>
      </div>
    </div>
  );
}
