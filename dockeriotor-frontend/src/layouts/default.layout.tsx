import { Outlet } from "react-router-dom";
import { Footer } from "../components/layout/footer";
import { Navbar } from "../components/layout/navbar";
import { motion } from "framer-motion";

export function DefaultLayout() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-screen-xl w-full mx-auto flex flex-col min-h-screen md:px-0 px-4"
    >
      <Navbar />
      <Outlet />
      <Footer />
    </motion.div>
  );
}
