import { Link } from "react-router-dom";
import { useUser } from "../../lib/auth";

export function Navbar() {
  const user = useUser();

  return (
    <nav className="py-4 flex">
      <div className="flex flex-col col-span-1 w-72">
        <Link to="/" className="w-max">
          <h1 className="text-2xl font-semibold">Dockeriotor</h1>

          <div className="flex items-center">
            <span className="text-sm ml-auto text-secondary font-medium">
              for
            </span>
            <img className="w-16 h-fit ml-2" src="/logotype.png" />
          </div>
        </Link>
      </div>
      <div className="gap-12 text-sm w-full items-center justify-center md:flex hidden">
        <a
          href="https://github.com/aloshai/dockeriotor/"
          target="_blank"
          className="hover:underline"
        >
          Getting Started
        </a>
        <a
          href="http://docs.dockeriotor.com/"
          target="_blank"
          className="hover:underline"
        >
          Documentation
        </a>
        <a className="hover:underline" href="https://io.net/" target="_blank">
          IO.NET
        </a>
        <a
          className="hover:underline"
          href="https://github.com/aloshai/dockeriotor/"
          target="_blank"
        >
          Github
        </a>
      </div>
      <div className="w-72 flex justify-end">
        {!user.data && (
          <Link
            to={"/"}
            className="text-sm px-8 font-semibold py-2 rounded-full border-2 border-white/20 hover:bg-white hover:text-black transition flex items-center"
          >
            Login
          </Link>
        )}
        {user.data && (
          <Link
            to="/workers"
            className="text-sm px-8 font-semibold py-2 rounded-full border-2 border-white/20 hover:bg-white hover:text-black transition flex items-center"
          >
            Panel
          </Link>
        )}
      </div>
    </nav>
  );
}
