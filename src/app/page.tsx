"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NutritionPublic() {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#ffffff] via-[#f9fff9] to-[#e8ffe8] text-gray-900 flex flex-col items-center justify-center p-10 relative overflow-hidden font-sans">
      {/* background decorations */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
        className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-[#0fa650]/15 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 90, ease: "linear" }}
        className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-[#0fa650]/10 rounded-full blur-2xl"
      />

      {/* main content */}
      <div className="relative z-10 text-center max-w-3xl">
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl sm:text-7xl font-black text-[#0fa650] drop-shadow-md tracking-tight"
        >
          🥬 NUTRITION <span className="text-black">&</span> ALLERGENS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-lg sm:text-xl text-gray-700"
        >
          Because transparency tastes as good as our burgers 🍔✨
        </motion.p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <motion.a
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.96 }}
            href="/api/simons-nutrition-table"
            target="_blank"
            rel="noreferrer"
            className="bg-[#0fa650] hover:bg-[#0c8e45] text-white font-semibold text-lg px-10 py-3 rounded-full shadow-lg transition-all"
          >
            📄 Open Full PDF
          </motion.a>

          <motion.button
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowPreview((s) => !s)}
            className="border-2 border-[#0fa650] text-[#0fa650] hover:bg-[#0fa650]/10 font-semibold text-lg px-10 py-3 rounded-full shadow-md transition-all"
          >
            {showPreview ? "Hide Preview 🫥" : "Quick Peek 👀"}
          </motion.button>
        </div>

        <AnimatePresence>
          {showPreview && (
            <motion.div
              key="pdf-preview"
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ duration: 0.6 }}
              className="mt-20 relative"
            >
              <iframe
                src="/api/simons-nutrition-table"
                className="w-[90vw] max-w-4xl h-[75vh] border-8 border-[#0fa650] rounded-3xl shadow-2xl"
              />
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-10 left-1/2 -translate-x-1/2 text-sm text-[#0fa650] font-semibold"
              >
                👇 scroll & zoom to drool responsibly
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-sm text-gray-500"
        >
          Updated every time we change ANYTHING 🔥 Stay tasty, stay informed.
        </motion.p>
      </div>
    </main>
  );
}
