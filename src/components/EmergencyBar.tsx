import {
  Phone,
  ShieldAlert,
} from "lucide-react";

export default function EmergencyBar() {
  return (
    <section
      aria-label="Emergency services"
      className="
        w-full
        bg-[#0F4C3A]
        border-b
        border-[#D4AF37]/30
        text-white
        shadow-sm
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          py-2.5
        "
      >
        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-3
          "
        >
          {/* LEFT SIDE */}

          <div className="flex items-center gap-3">
            {/* PULSING RED INDICATOR */}

            <span className="relative flex h-3 w-3 shrink-0">
              <span
                className="
                  absolute
                  inline-flex
                  h-full
                  w-full
                  rounded-full
                  bg-red-500
                  opacity-75
                  animate-ping
                "
              />

              <span
                className="
                  relative
                  inline-flex
                  h-3
                  w-3
                  rounded-full
                  bg-red-500
                "
              />
            </span>

            {/* ICON */}

            <ShieldAlert
              className="
                w-6
                h-6
                text-[#D4AF37]
                shrink-0
              "
            />

            {/* TEXT */}

            <div className="min-w-0">
              <p
                className="
                  text-sm
                  sm:text-base
                  font-bold
                  leading-tight
                "
              >
                Rapid Security &amp;
                Distress Dispatch
              </p>

              <p
                className="
                  text-[11px]
                  sm:text-xs
                  text-white/70
                  mt-0.5
                "
              >
                Active threat? Call
                national emergency
                lines directly.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}

          <div
            className="
              flex
              flex-col
              sm:flex-row
              gap-2
              sm:ml-auto
            "
          >
            {/* 112 */}

            <a
              href="tel:112"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                px-4
                py-2
                rounded-full
                bg-[#D4AF37]
                text-[#0F4C3A]
                text-xs
                sm:text-sm
                font-bold
                hover:bg-[#C5A032]
                active:scale-[0.98]
                transition-all
              "
              aria-label="Call emergency services on 112"
            >
              <Phone className="w-4 h-4" />

              Emergency Direct (112)
            </a>

            {/* 199 */}

            <a
              href="tel:199"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                px-4
                py-2
                rounded-full
                bg-white/10
                border
                border-[#D4AF37]/40
                text-white
                text-xs
                sm:text-sm
                font-bold
                hover:bg-white/20
                active:scale-[0.98]
                transition-all
              "
              aria-label="Call police and security on 199"
            >
              <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />

              Police / Security (199)
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}