import { useEffect, useRef, useState, useCallback } from "react";
import { useInView, motion } from "framer-motion";
import HTMLFlipBook from "react-pageflip";
import "./Certificate.css";

export const certs = [
  {
    title: "MERN Stack Advanced",
    subtitle: "Infosys",
    desc: "Advanced MERN concepts and project work.",
    image: "/Infosys_certified_mern_stack-1.png",
  },
  {
    title: "Python Programming",
    subtitle: "Kaggle",
    desc: "Hands-on notebooks and challenges.",
    image: "/kaggle_python.png",
  },
  {
    title: "SQL",
    subtitle: "LetsUpgrade",
    desc: "Relational queries & optimization basics.",
    image: "/SQL_bootcamp_certificate-1.png",
  },
  {
    title: "Introduction To Generative AI",
    subtitle: "SimpliLearn (Google Cloud)",
    desc: "Overview of AI, algorithms, and concepts.",
    image: "/google_cloud-1.png",
  },
  {
    title: "Postman API Fundamentals",
    subtitle: "Postman",
    desc: "API design, testing, and collections.",
    image: "/postman_api_certificate-1.png",
  },
  {
    title: "Full Stack Development",
    subtitle: "Udemy",
    desc: "Web development, Web3, and advanced topics.",
    image: "/udemy_full_stack_certificate.jpg",
  },
  {
    title: "Databases for Developers",
    subtitle: "Oracle Dev Gym",
    desc: "PL/SQL and database design patterns.",
    image: "/Oracle_database_for_developers-1.png",
  },
  {
    title: "MERN Stack Fundamentals",
    subtitle: "Great Learning",
    desc: "Covered the basic MERN fundamentals.",
    image: "/Great_learning_mern_certificate_1.png",
  },
  {
    title: "Node JS",
    subtitle: "LetsUpgrade",
    desc: "Creating servers, HTTP, and REST APIs.",
    image: "/Nodejs_certificate-1.png",
  },
  {
    title: "Typing Speed",
    subtitle: "TypeDojo",
    desc: "Typing speed: 68 WPM with 93% accuracy.",
    image: "/Type_Dojo_User_Certificate-1.png",
  },
];

function CertificateBook({ items = certs }) {
  const bookRef = useRef(null);
  const containerRef = useRef(null);
  const touchStartY = useRef(null);
  const touchStartX = useRef(null);

  const isInView = useInView(containerRef, {
    margin: "-100px",
  });

  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [pageWidth, setPageWidth] = useState(180);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [mobileDirection, setMobileDirection] = useState(1);
  const [pendingMobileIndex, setPendingMobileIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [mobilePageStep, setMobilePageStep] = useState(442);

  useEffect(() => {
    const updateLayout = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);

      const availableWidth = Math.min(
        window.innerWidth - 32,
        mobile ? 440 : 760
      );

      setPageWidth(Math.floor(availableWidth / 2));
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);

    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  // Desktop: preserve the existing horizontal flipbook auto-flip.
  useEffect(() => {
    if (isMobile || !isInView || isPaused || items.length < 2) {
      return undefined;
    }

    const interval = setInterval(() => {
      const book = bookRef.current?.pageFlip?.();
      if (!book) return;

      const currentPage = book.getCurrentPageIndex();
      const pageCount = book.getPageCount();

      if (currentPage >= pageCount - 1) {
        book.flip(0);
      } else {
        book.flipNext();
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isMobile, isInView, isPaused, items.length]);



  const handleTouchStart = (event) => {
    if (!isMobile) return;

    touchStartY.current = event.touches[0].clientY;
    touchStartX.current = event.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (event) => {
    if (!isMobile || touchStartY.current === null) {
      setIsPaused(false);
      return;
    }

    const deltaY = touchStartY.current - event.changedTouches[0].clientY;
    const deltaX = touchStartX.current - event.changedTouches[0].clientX;
    const threshold = 40;

    // Swipe up: next certificate.
    // Swipe down: previous certificate.
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > threshold) {
      if (deltaY > 0) {
        startMobileTurn(1);
      } else {
        startMobileTurn(-1);
      }
    }

    touchStartY.current = null;
    touchStartX.current = null;
    setIsPaused(false);
  };

  const handlePointerDown = () => setIsPaused(true);
  const handlePointerUp = () => setIsPaused(false);



  const startMobileTurn = useCallback(
    (direction) => {
      if (isFlipping || items.length < 2) return;

      const nextIndex =
        (mobileIndex + direction + items.length) % items.length;

      setMobileDirection(direction);
      setPendingMobileIndex(nextIndex);
      setIsFlipping(true);
    },
    [isFlipping, items.length, mobileIndex]
  );

  const finishMobileTurn = useCallback(() => {
    setMobileIndex(pendingMobileIndex);
    setIsFlipping(false);
  }, [pendingMobileIndex]);

  // Mobile: automatically advance to the next certificate vertically.
  useEffect(() => {
    if (
      !isMobile ||
      !isInView ||
      isPaused ||
      isFlipping ||
      items.length < 2
    ) {
      return undefined;
    }

    const interval = setInterval(() => {
      startMobileTurn(1);
    }, 3500);

    return () => clearInterval(interval);
  }, [
    isMobile,
    isInView,
    isPaused,
    isFlipping,
    items.length,
    startMobileTurn,
  ]);

  useEffect(() => {
    const updateMobilePageStep = () => {
      // 390px page + 12px gap on very small phones
      setMobilePageStep(window.innerWidth <= 360 ? 402 : 442);
    };

    updateMobilePageStep();
    window.addEventListener("resize", updateMobilePageStep);

    return () => {
      window.removeEventListener("resize", updateMobilePageStep);
    };
  }, []);


  const renderCertificate = (cert, index) => (
    <div className="page" key={`${cert.title}-${index}`}>
      <div className="page-content">
        <div className="cert-image-wrapper">
          <img
            src={cert.image}
            alt={cert.title}
            className="certImg"
            loading="lazy"
            draggable={false}
          />
        </div>

        <div className="cert-details">
          <h4>{cert.title}</h4>
          {cert.subtitle && (
            <p className="cert-subtitle">{cert.subtitle}</p>
          )}
          <p className="cert-description">{cert.desc}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`certificate-book-container ${isMobile ? "mobile-certificate-view" : "desktop-certificate-view"
        }`}
      onPointerDown={!isMobile ? handlePointerDown : undefined}
      onPointerUp={!isMobile ? handlePointerUp : undefined}
      onPointerCancel={!isMobile ? handlePointerUp : undefined}
      onPointerLeave={!isMobile ? handlePointerUp : undefined}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {isMobile ? (
        <div className="mobile-certificate-card">
          <div className="mobile-book-window" onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}>
            {/* Normal pages underneath the turning page */}
            <div className="mobile-book-pages">
              {items.length > 0 &&
                renderCertificate(items[mobileIndex], mobileIndex)}

              {items.length > 1 &&
                renderCertificate(
                  items[(mobileIndex + 1) % items.length],
                  (mobileIndex + 1) % items.length
                )}
            </div>

            {/* Only this page rotates and moves upward */}
            {isFlipping && items.length > 1 && (
              <motion.div
                key={`turn-${mobileIndex}-${mobileDirection}`}
                className="mobile-turn-overlay"
                style={{
                  top: mobileDirection > 0 ? mobilePageStep : 0,
                  transformOrigin:
                    mobileDirection > 0 ? "top center" : "bottom center",
                }}
                initial={{
                  y: 0,
                  rotateX: 0,
                }}
                animate={{
                  y:
                    mobileDirection > 0
                      ? -mobilePageStep
                      : mobilePageStep,
                  rotateX: mobileDirection > 0 ? -180 : 180,
                }}
                transition={{
                  duration: 0.9,
                  ease: [0.45, 0, 0.2, 1],
                }}
                onAnimationComplete={finishMobileTurn}
              >
                {/* Front of the turning page */}
                <div className="mobile-turn-face mobile-turn-front">
                  {renderCertificate(
                    items[
                    mobileDirection > 0
                      ? (mobileIndex + 1) % items.length
                      : pendingMobileIndex
                    ],
                    pendingMobileIndex
                  )}
                </div>

                {/* Backside of the physical page */}
                <div className="mobile-turn-face mobile-turn-back">
                  <div className="mobile-turn-back-paper" />
                </div>
              </motion.div>
            )}
          </div>

          <div className="mobile-certificate-controls">
            <button
              type="button"
              disabled={isFlipping}
              onClick={() => startMobileTurn(-1)}
              aria-label="Previous certificate"
            >
              ↑ Previous
            </button>

            <span>
              {mobileIndex + 1} / {items.length}
            </span>

            <button
              type="button"
              disabled={isFlipping}
              onClick={() => startMobileTurn(1)}
              aria-label="Next certificate"
            >
              Next ↓
            </button>
          </div>

          <p className="mobile-swipe-hint">
            Swipe up to see the next certificate
          </p>
        </div>
      ) : (
        // Keep your existing HTMLFlipBook JSX here, unchanged.
        <HTMLFlipBook
          ref={bookRef}
          width={pageWidth}
          height={Math.round(pageWidth * 1.28)}
          size="fixed"
          minWidth={130}
          maxWidth={380}
          minHeight={166}
          maxHeight={490}
          className="demo-book"
          showCover={false}
          usePortrait={false}
          mobileScrollSupport={true}
          drawShadow={true}
          flippingTime={700}
          startPage={0}
          useMouseEvents={true}
          swipeDistance={20}
          clickEventForward={true}
          showPageCorners={true}
          disableFlipByClick={false}
          autoSize={false}
        >
          {items.map(renderCertificate)}
        </HTMLFlipBook>
      )}
    </div>
  );
}

export default CertificateBook;
