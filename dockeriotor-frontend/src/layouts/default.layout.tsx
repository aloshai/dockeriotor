import { Outlet } from "react-router-dom";
import { Footer } from "../components/layout/footer";
import { Navbar } from "../components/layout/navbar";

export function DefaultLayout() {
  return (
    <div className="max-w-screen-xl w-full mx-auto flex flex-col min-h-screen md:px-0 px-4">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
