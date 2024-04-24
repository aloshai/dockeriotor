import { useTelegramLogin } from "../../hooks/use-telegram-login";

const gradientClasses = {
  featured: "from-lime-500 to-yellow-500",
  primary: "from-purple-500 to-pink-500",
  secondary: "from-green-500 to-blue-500",
  third: "from-blue-500 to-indigo-500",
  fourth: "from-yellow-500 to-red-500",
};

export function Head() {
  const telegramLogin = useTelegramLogin();

  return (
    <>
      <div className="flex flex-col items-center my-32 before:w-96 before:h-96 before:z-0 before:rounded-full before:left-1/2 before:top-1/2 before:absolute before:bg-blue-500 before:blur-[250px] before:-translate-y-1/2 before:-translate-x-1/2 before:pointer-events-none">
        <div className="py-2 px-8 border border-white/20 rounded-full mb-8 z-10 relative">
          <span className="text-secondary">
            Easily manage your Workers via Discord, Telegram and Web!
          </span>
        </div>
        <h1 className="text-5xl font-semibold text-center">
          Remote Worker Management Tool
        </h1>
        <p className="text-center lg:w-1/2 mt-8 text-sm text-white/80">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae
          quibusdam quis repellat eum veniam, vel nostrum deleniti voluptatibus,
          cupiditate porro sapiente dolore nulla autem fugit?
        </p>

        <div className="flex md:flex-row flex-col items-center gap-4 md:gap-8 mt-12">
          <a
            href="https://discord.com/oauth2/authorize?client_id=1228183759183020096&response_type=code&redirect_uri=https%3A%2F%2Fdockeriotor.com%2Fdiscord%2Fcallback&scope=identify"
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

      <h4 className="text-center text-2xl mb-4 mt-32 font-semibold">
        Dockeriotor Features
      </h4>
      <p className="text-center mb-10">
        You can learn about the features of Dockeriotor below!
      </p>

      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center before:w-96 before:h-96 before:z-0 before:rounded-full before:left-1/2 before:top-1/2 before:absolute before:bg-indigo-500 before:blur-[250px] before:-translate-y-1/2 before:-translate-x-1/2 before:pointer-events-none">
        <FeatureCard
          title="Discord Service"
          extra="Dockerioter#7909"
          description="With our Discord bot, you can manage and monitor your Workers by messaging with the bot via Discord"
          tag={
            <Tag title="Integrated" gradientClasses={gradientClasses.third} />
          }
          redirect="https://discord.com/users/1228183759183020096"
        />
        <FeatureCard
          title="Web Interface"
          description="You can manage your workers and monitor their resources through our web interface. Any new content we add in the near future will be web-first!"
          tag={
            <Tag title="Avaiable" gradientClasses={gradientClasses.secondary} />
          }
        />

        <FeatureCard
          title="Telegram Service"
          extra="@dockeriotor_bot"
          description="You can get information about your Workers through the Telegram bot, either on Telegram Web or through the app using our bot"
          tag={
            <Tag title="Integrated" gradientClasses={gradientClasses.third} />
          }
          redirect="https://t.me/dockeriotor_bot"
        />

        <FeatureCard
          title="Dockeriotor API"
          description="Thanks to Dockeriotor's modular API, you can develop your own application, produce new content or add new services."
          tag={
            <Tag title="Included" gradientClasses={gradientClasses.featured} />
          }
          redirect="https://github.com/aloshai/dockeriotor/tree/main/dockeriotor-backend"
        />

        <FeatureCard
          title="Remote Shell"
          description="You can send remote commands to the device where Dockeriotor is running"
          tag={<Tag title="TBA" gradientClasses={gradientClasses.secondary} />}
        />
        <FeatureCard
          title="SDK"
          description="SDK for IO.NET API for developers. You can easily integrate your applications using IO.NET API and save time! You can easily use the SDKs we ported on many different platforms."
          tag={<Tag title="TBA" gradientClasses={gradientClasses.third} />}
        />
        <FeatureCard
          title="Worker Grouping"
          description="By grouping multiple Workers, you can give them batch operations, get their logs or do monitoring."
          tag={<Tag title="TBA" gradientClasses={gradientClasses.secondary} />}
        />
        <FeatureCard
          title="Logging and monitoring"
          description="You can track connection issues on your worker device, worker job status, resource consumption, container details and more"
          tag={<Tag title="TBA" gradientClasses={gradientClasses.primary} />}
        />
        <FeatureCard
          title="CLI"
          description="A CLI that will contain a lot of content you need to install Dockeriotor more easily and run your Workers quickly with a single command via IO.NET"
          tag={<Tag title="TBA" gradientClasses={gradientClasses.fourth} />}
        />
        <FeatureCard
          title="Self-hosting"
          description="Without being connected to Dockeriotor Cloud, you can run Dockeriotor in your own companies or groups and create your own private space just by closing it to the outside"
          tag={<Tag title="TBA" gradientClasses={gradientClasses.primary} />}
        />
      </div>
    </>
  );
}

export function Tag({ title, gradientClasses }) {
  return (
    <div
      className={`bg-gradient-to-r ${gradientClasses} text-white px-4 py-2 rounded-full text-xs inline-block`}
    >
      {title}
    </div>
  );
}

export function FeatureCard({ title, description, extra, redirect, tag }: any) {
  return (
    <a
      href={redirect}
      target="_blank"
      className="border-gray-black bg-black/50 border rounded-xl p-8 z-20 hover:scale-105 transition cursor-pointer"
    >
      <div className="flex flex-col gap-4 items-center justify-center">
        {tag}

        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      {extra && <h6 className="text-secondary mt-4">Dockerioter#7909</h6>}

      <hr className="my-4 border-gray-black" />
      <p className="mt-4 text-secondary">{description}</p>
    </a>
  );
}
