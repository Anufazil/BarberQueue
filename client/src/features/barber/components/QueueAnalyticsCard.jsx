import {
  TimerReset,
  Clock4,
  BarChart3,
  TrendingUp,
} from "lucide-react";

import { motion } from "framer-motion";

const QueueAnalyticsCard = ({ analytics }) => {
  const cards = [
    {
      title: "Average Service Time",
      value: `${analytics?.averageServiceTime ?? 0} min`,
      description: "Average time spent per customer",
      icon: TimerReset,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      accent: "bg-indigo-500",
    },
    {
      title: "Estimated Wait",
      value: `${analytics?.estimatedWait ?? 0} min`,
      description: "Expected waiting time",
      icon: Clock4,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      accent: "bg-emerald-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Header */}
      <div className="border-b border-slate-100 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
            <BarChart3
              size={20}
              className="text-indigo-600"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Queue Analytics
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Live queue insights
            </p>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="flex-1 space-y-4 p-6">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.title}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.08,
                duration: 0.3,
              }}
              whileHover={{
                y: -3,
              }}
              className="group relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-5 transition-all duration-300 hover:border-slate-200 hover:bg-white hover:shadow-md"
            >
              {/* Accent */}
              <div
                className={`absolute left-0 top-0 h-full w-1 ${card.accent}`}
              />

              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {card.title}
                  </p>

                  <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                    {card.value}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    {card.description}
                  </p>
                </div>

                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${card.iconBg}`}
                >
                  <Icon
                    size={27}
                    strokeWidth={2}
                    className={card.iconColor}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-3">
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
          <TrendingUp
            size={14}
            className="text-indigo-500"
          />

          <span>
            Analytics update automatically with the queue
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default QueueAnalyticsCard;