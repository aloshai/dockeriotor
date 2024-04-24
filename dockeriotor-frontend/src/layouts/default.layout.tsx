import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "../components/layout/footer";
import { Navbar } from "../components/layout/navbar";
import { AnimatePresence, motion } from "framer-motion";

export function DefaultLayout() {
  const location = useLocation();

  return (
    <div className="max-w-screen-xl w-full mx-auto flex flex-col min-h-screen md:px-0 px-4">
      <Navbar />
      <AnimatePresence mode="wait" initial presenceAffectsLayout>
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0 } }}
          className="flex flex-col flex-1"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
