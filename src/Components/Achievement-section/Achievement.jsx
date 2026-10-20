import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
} from "framer-motion";


export const achievements = [
    { title: "2nd place – Code Debugging (Utkarsh 2K25)", desc: "Among participants from 30+ colleges.", image: '/debuggingprize.jpg' },
    { title: "Finalist – Tech Quiz (Enlight Degree College)", desc: "Tested on DBMS, Web, C, and Python.", image: '/enlightprize.jpg' },
    { title: "Participant – AWSome Day Online Conference", desc: "Explored AWS cloud services & infrastructure.", image: '/awsbackground_image.jpg' },
  ];

export default function CardGrid({ items }) {
  const [popupItem, setPopupItem] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const touchStartRef = useRef({ x: 0, y: 0 });

  const hoverTimeout = useRef(null);
  const sectionRef = useRef(null);

  // responsive mobile check for in-view thresholds
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // tuned thresholds for mobile vs desktop
  const isInView = useInView(sectionRef, {
    margin: isMobile ? "-30px 0px -30px 0px" : "-100px 0px -100px 0px",
    amount: isMobile ? 0.15 : 0.6,
  });

  useEffect(() => {
    return () => clearTimeout(hoverTimeout.current);
  }, []);

  const popupImages = [
    "/newspaper.jpg",
    "/enlight_certificate.jpg",
    "/Awsomeonlineconferencecertificate.png",
  ];

  const descriptionforpopup = [
    "I came in the newspaper for excellent debugging skills and won 2nd prize. Over 30+ colleges participated in this competition.",
    "Participated in the Enlight Degree College quiz competition and showcased problem-solving and analytical skills.",
    "Successfully completed the AWS Awesome Online Conference 2025, gaining hands-on experience and deepening cloud computing knowledge.",
  ];

  useEffect(() => {
    let scrollTimeout;
    const onScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setIsScrolling(false), 150); // 150ms after stop
    };
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const handleMouseEnter = (item, index) => {
    if (isScrolling) return; // 🚫 don't trigger popup while scrolling
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => {
      setPopupItem({
        ...item,
        image: popupImages[index],
        desc: descriptionforpopup[index],
      });
    }, 1200); // optional: make it faster than 3s
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout.current);
  };
  const handleClick = (item, index) => {
    clearTimeout(hoverTimeout.current);
    setPopupItem({
      ...item,
      image: popupImages[index],
      desc: descriptionforpopup[index],
    });
  };

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e, item, index) => {
    const t = e.changedTouches[0];
    const dx = Math.abs(t.clientX - touchStartRef.current.x);
    const dy = Math.abs(t.clientY - touchStartRef.current.y);

    // treat as tap only if finger didn’t move much
    if (dx < 10 && dy < 10) {
      setPopupItem({
        ...item,
        image: popupImages[index],
        desc: descriptionforpopup[index],
      });
    }
  };

  return (
    <div ref={sectionRef} className="relative flex flex-col items-center w-full">
      {/* Horizontal Stick */}
      <div className="relative w-full mb-12">
        <div className="relative h-[15px] w-full rounded-full overflow-hidden">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(90deg, var(--brand) 0%, var(--brand2) 50%, var(--accent) 100%)`,
              boxShadow: `inset 0 1px 3px rgba(255,255,255,0.25),
                          inset 0 -2px 4px rgba(0,0,0,0.6),
                          var(--shadow)`,
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.25), rgba(255,255,255,0))",
              mixBlendMode: "overlay",
            }}
          />
          <div
            className="absolute -left-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
            style={{
              background: "radial-gradient(circle at 30% 30%, white, var(--brand))",
              boxShadow: "0 0 15px var(--brand)",
            }}
          />
          <div
            className="absolute -right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
            style={{
              background: "radial-gradient(circle at 70% 70%, white, var(--brand2))",
              boxShadow: "0 0 15px var(--brand2)",
            }}
          />
          <div
            className="absolute -bottom-3 left-4 right-4 h-4 blur-xl rounded-full"
            style={{
              background: "radial-gradient(ellipse, var(--brand2), transparent 70%)",
              opacity: 0.5,
            }}
          />

          {/* shimmer - remount on isInView for reliable stop */}
          <motion.div
            key={`shimmer-${isInView ? "run" : "stop"}`}
            className="absolute inset-y-0 w-1/3 pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
              mixBlendMode: "screen",
            }}
            initial={{ x: "-35%" }}
            animate={isInView ? { x: ["-35%", "135%"] } : { x: "-35%" }}
            transition={{
              duration: isInView ? 3 : 0,
              repeat: isInView ? Infinity : 0,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full px-8 relative">
        {items.map((it, i) => (
          <motion.div
            key={i}
            className="relative flex flex-col items-center w-full cursor-pointer"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.15 }}
            viewport={{ once: true }}
            onMouseEnter={() => handleMouseEnter(it, i)}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={(e) => handleTouchEnd(e, it, i)}
            onClick={() => handleClick(it, i)} // desktop clicks
          >

            <div className="relative flex flex-col items-center">
              {/* Chain (behind card) */}
              <div className="absolute -top-20 flex flex-col items-center pointer-events-none z-0">
                <div
                  className="w-4 h-4 rounded-full mb-[-2px]"
                  style={{
                    background: "radial-gradient(circle, var(--brand), white)",
                    boxShadow: "0 0 8px var(--brand)",
                  }}
                />
                <div className="flex flex-col items-center space-y-[-18px]">
                  {[...Array(10)].map((_, idx) => (
                    <motion.div
                      key={`link-${idx}-${isInView ? "run" : "stop"}`}
                      className="relative w-6 h-10 rounded-full overflow-hidden"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, #fff, #d1d5db 25%, #a1a1aa 60%, #3f3f46 100%)`,
                        boxShadow: `inset -2px -2px 4px rgba(255,255,255,0.7),
                                    inset 3px 3px 6px rgba(0,0,0,0.8),
                                    0 0 15px rgba(255,255,255,0.6)`,
                        transform: `rotate(${idx % 2 === 0 ? "90deg" : "0deg"})`,
                      }}
                      initial={{ y: 0 }}
                      animate={isInView ? { y: [0, 2, -2, 0] } : { y: 0 }}
                      transition={{
                        duration: isInView ? 3 : 0,
                        repeat: isInView ? Infinity : 0,
                        ease: "easeInOut",
                        delay: isInView ? idx * 0.08 : 0,
                      }}
                    >
                      <div
                        className="absolute inset-1 rounded-full"
                        style={{
                          background: "var(--bg)",
                          boxShadow: "inset 0 0 6px rgba(0,0,0,0.8)",
                        }}
                      />
                      <motion.div
                        key={`shine-${idx}-${isInView ? "run" : "stop"}`}
                        className="absolute inset-0 rounded-full"
                        style={{
                          background:
                            "linear-gradient(120deg, rgba(255,255,255,0.9), transparent 70%)",
                          mixBlendMode: "overlay",
                        }}
                        initial={{ x: "-100%" }}
                        animate={isInView ? { x: ["-100%", "100%"] } : { x: "-100%" }}
                        transition={{
                          duration: isInView ? 2.2 : 0,
                          repeat: isInView ? Infinity : 0,
                          ease: "linear",
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Polygon Card (in front) */}
              <motion.div
                key={`poly-wrap-${isInView ? "run" : "stop"}`}
                animate={
                  isInView
                    ? { y: [0, -12, 0, 12, 0], rotateY: [-6, 6, -6] }
                    : { y: 0, rotateY: 0 }
                }
                transition={{
                  duration: isInView ? 4 : 0,
                  repeat: isInView ? Infinity : 0,
                  ease: "easeInOut",
                }}
                whileHover={{
                  scale: 1.06,
                  rotate: 1,
                  // ✅ restore glowing white effect
                  filter: "drop-shadow(0 0 20px white) drop-shadow(0 0 40px white)",
                }}
                style={{ perspective: "1000px", zIndex: 10 }}
              >
                <motion.div
                  key={`poly-inner-${isInView ? "run" : "stop"}-${i}`}
                  animate={isInView ? { rotateY: [-5, 5, -5] } : { rotateY: 0 }}
                  transition={{
                    duration: isInView ? 2 : 0,
                    repeat: isInView ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                  className="relative flex flex-col items-center justify-center text-center p-4 sm:p-6 overflow-hidden"
                  style={{
                    clipPath:
                      "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                    width: "100%",
                    aspectRatio: "1 / 1",
                    maxWidth: "450px",
                    backgroundColor: "black",
                    zIndex: 10,
                  }}
                >
                  {/* blurred background image */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${it.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "blur(20px) brightness(0.6)",
                      transform: "scale(1.2)",
                    }}
                  />
                  {/* centered clear image */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${it.image})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                    }}
                  />
                  {/* dark overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath:
                        "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                      background: "rgba(0,0,0,0.44)",
                    }}
                  />
                  <div className="relative z-20 flex flex-col items-center text-white px-6">
                    <h4 className="font-bold text-2xl mb-2 drop-shadow-lg">{it.title}</h4>
                    <p className="text-base opacity-90">{it.desc}</p>
                  </div>
                </motion.div>
              </motion.div>

            </div>
          </motion.div>
        ))}
      </div>

      {/* Popup */}
      <AnimatePresence>
        {popupItem && (
          <motion.div
            key="popup"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPopupItem(null)}
          >
            <motion.div
              className="bg-black rounded-xl shadow-2xl p-3 sm:p-6 w-full max-w-full sm:max-w-2xl flex flex-col items-center space-y-3 sm:space-y-6 overflow-y-auto max-h-[90vh]"
              style={{ maxWidth: "100vw" }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={popupItem.image}
                alt={popupItem.title}
                className="w-full max-h-[40vh] sm:max-h-[60vh] object-contain rounded-lg"
              />
              <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-white mt-2 text-center break-words">
                {popupItem.title}
              </h3>
              <p className="text-white/90 text-sm sm:text-base md:text-lg text-center px-2 break-words">
                {popupItem.desc}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}