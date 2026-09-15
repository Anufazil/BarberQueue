import {
  Clock3,
  Scissors,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { motion } from "framer-motion";

const BarberSummaryCards = ({ summary }) => {
  const cards = [
    {
      title: "Waiting",
      value: summary.waiting,
      icon: Clock3,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      border: "bg-amber-500",
    },
    {
      title: "Serving",
      value: summary.serving,
      icon: Scissors,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      border: "bg-indigo-600",
    },
    {
      title: "Completed",
      value: summary.completed,
      icon: CheckCircle2,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      border: "bg-emerald-500",
    },
    {
      title: "Cancelled",
      value: summary.cancelled,
      icon: XCircle,
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
      border: "bg-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.08,
              duration: 0.35,
            }}
            whileHover={{
              y: -6,
            }}
            className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white text-center shadow-sm transition-all duration-300 hover:shadow-xl"
          >
            {/* Top Accent */}
            <div className={`h-1 w-full ${card.border}`} />

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center px-6 py-5">
              {/* Heading */}
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                {card.title}
              </p>

              {/* Value */}
              <h2 className="mt-2 text-4xl font-bold leading-none text-slate-900">
                {card.value}
              </h2>

              {/* Icon */}
              <div
                className={`mt-4 rounded-2xl ${card.iconBg} p-4 ${card.iconColor}`}
              >
                <Icon size={30} strokeWidth={2.2} />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 text-center">
              <p className="text-xs font-medium text-slate-500">
                Live queue statistics
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default BarberSummaryCards;