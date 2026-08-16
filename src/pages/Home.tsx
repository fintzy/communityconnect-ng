import { motion, type Variants } from "framer-motion";

import { Link } from "react-router-dom";
import {
  MapPin,  FileText,  TrendingUp,  Shield,  Star,  Users,  ArrowRight,  Sparkles,  Leaf,  CircleCheck,} from "lucide-react";
import { store } from "../services/store";

const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 40,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const FEATURES = [
  {
    icon: FileText,
    title: "Report Issues",
    description:
      "Report infrastructure problems like potholes, burst pipes, or power outages in your community with just a few taps.",
    color: "text-[#D4AF37]",
    bg: "bg-[#D4AF37]/10",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description:
      "Follow the status of your reports from submission through review to resolution with full transparency.",
    color: "text-[#0F4C3A] dark:text-[#D4AF37]",
    bg: "bg-[#0F4C3A]/10 dark:bg-[#D4AF37]/10",
  },
  {
    icon: Users,
    title: "Community Voices",
    description:
      "Upvote and comment on reports from fellow residents. Amplify the issues that matter most to your neighborhood.",
    color: "text-[#D4AF37]",
    bg: "bg-[#D4AF37]/10",
  },
  {
    icon: MapPin,
    title: "Localized Impact",
    description:
      "Reports are organized by ward and LGA, ensuring the right authorities see issues from their jurisdiction.",
    color: "text-[#0F4C3A] dark:text-[#D4AF37]",
    bg: "bg-[#0F4C3A]/10 dark:bg-[#D4AF37]/10",
  },
  {
    icon: Shield,
    title: "Admin Oversight",
    description:
      "Trusted administrators review, categorize, and resolve reports with official responses and resolution notes.",
    color: "text-[#D4AF37]",
    bg: "bg-[#D4AF37]/10",
  },
  {
    icon: Star,
    title: "Civic Engagement",
    description:
      "Stay informed with announcements, town hall updates, and direct communication from local government.",
    color: "text-[#0F4C3A] dark:text-[#D4AF37]",
    bg: "bg-[#0F4C3A]/10 dark:bg-[#D4AF37]/10",
  },
];

const stats = [
  {
    label: "Reports Filed",
    icon: FileText,
    value: store.getStats().totalReports,
  },
  {
    label: "Resolved",
    icon: CircleCheck,
    value: store.getStats().resolved,
  },
  {
    label: "Resolution Rate",
    icon: TrendingUp,
    value: `${store.getStats().resolutionRate}%`,
  },
  {
    label: "Active Users",
    icon: Users,
    value: store.getStats().totalUsers,
  },
];

export default function Home() {
  return (
    <div className="bg-[#FDFBF7] dark:bg-[#06110D] text-gray-900 dark:text-white transition-colors duration-300">

      {/* ==================================================
          HERO SECTION
          ================================================== */}

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F4C3A] via-[#0F4C3A] to-[#0a3a2c]" />

        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />

        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#D4AF37]/3 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32">

          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="max-w-3xl mx-auto text-center"
          >

            {/* BADGE */}

            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />

              <span className="text-xs font-medium text-[#D4AF37]">
                Civic Tech for Nigerian Communities
              </span>
            </motion.div>

            {/* HEADING */}

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight"
            >
              Your Voice,{" "}
              <span className="text-[#D4AF37]">
                Our Community
              </span>

              <br />

              <span className="text-white/80">
                Collective Progress
              </span>
            </motion.h1>

            {/* DESCRIPTION */}

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
            >
              CommunityConnect NG empowers Nigerian citizens
              to report infrastructure issues, track government
              responses, and collaborate with neighbors for
              meaningful change.
            </motion.p>

            {/* BUTTONS */}

            <motion.div
              variants={fadeInUp}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/dashboard"
                className="px-8 py-3.5 bg-[#D4AF37] text-[#0F4C3A] font-semibold rounded-xl hover:bg-[#C5A032] transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2 group"
              >
                Explore Dashboard

                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                to="/auth"
                className="px-8 py-3.5 border border-white/20 text-white/80 font-medium rounded-xl hover:bg-white/5 hover:text-white transition-all"
              >
                Sign In
              </Link>
            </motion.div>

            {/* STATS */}

            <motion.div
              variants={fadeInUp}
              className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <stat.icon className="w-5 h-5 text-[#D4AF37] mx-auto mb-2" />

                  <p className="text-2xl font-bold text-white">
                    {stat.value}
                  </p>

                  <p className="text-xs text-white/50 mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ==================================================
          FEATURES SECTION
          ================================================== */}

      <section className="py-20 sm:py-28 bg-[#FDFBF7] dark:bg-[#06110D] transition-colors duration-300">

        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true,
              margin: "-100px",
            }}
            variants={stagger}
            className="text-center mb-16"
          >

            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl font-bold text-[#0F4C3A] dark:text-white"
            >
              How It Works
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="mt-4 text-lg text-gray-500 dark:text-white/60 max-w-xl mx-auto"
            >
              A transparent platform connecting citizens
              with local authorities for efficient issue
              resolution.
            </motion.p>

          </motion.div>

          {/* FEATURE CARDS */}

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true,
              margin: "-100px",
            }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >

            {FEATURES.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="group p-6 rounded-2xl bg-white dark:bg-[#0B2119] border border-gray-100 dark:border-white/10 hover:border-[#D4AF37]/30 hover:shadow-lg hover:shadow-[#D4AF37]/5 transition-all duration-300"
              >

                {/* ICON */}

                <div
                  className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}
                >
                  <feature.icon
                    className={`w-6 h-6 ${feature.color}`}
                  />
                </div>

                {/* TITLE */}

                <h3 className="text-lg font-semibold text-[#0F4C3A] dark:text-white mb-2">
                  {feature.title}
                </h3>

                {/* DESCRIPTION */}

                <p className="text-sm text-gray-500 dark:text-white/60 leading-relaxed">
                  {feature.description}
                </p>

              </motion.div>
            ))}

          </motion.div>
        </div>
      </section>

      {/* ==================================================
          CTA SECTION
          ================================================== */}

      <section className="relative overflow-hidden bg-[#0F4C3A] py-20">

        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />

        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/3 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.5,
            }}
          >

            <Leaf className="w-10 h-10 text-[#D4AF37] mx-auto mb-4" />

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Make a Difference?
            </h2>

            <p className="text-lg text-white/60 max-w-xl mx-auto mb-8">
              Join thousands of Nigerian citizens using
              CommunityConnect to improve their neighborhoods.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

              <Link
                to="/auth"
                className="px-8 py-3.5 bg-[#D4AF37] text-[#0F4C3A] font-semibold rounded-xl hover:bg-[#C5A032] transition-all shadow-lg shadow-[#D4AF37]/20"
              >
                Get Started Free
              </Link>

              <Link
                to="/devconsole"
                className="px-8 py-3.5 border border-white/20 text-white/70 font-medium rounded-xl hover:bg-white/5 hover:text-white transition-all"
              >
                View Dev Console
              </Link>

            </div>

          </motion.div>
        </div>
      </section>

    </div>
  );
}