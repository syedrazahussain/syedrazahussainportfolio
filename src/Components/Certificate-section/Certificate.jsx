import { useEffect, useRef, useState, useCallback } from "react";
import { useInView } from "framer-motion";
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
  const flipLockTimer = useRef(null);
  const touchStart = useRef(null);
  const forceFirstSpreadRef = useRef(false);
  const closingBookRef = useRef(false);
  const [isClosingBook, setIsClosingBook] = useState(false);

  const isInView = useInView(containerRef, { margin: "-100px" });

  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [pageWidth, setPageWidth] = useState(380);

  const [mobileBookHeight, setMobileBookHeight] = useState(560);
  const [mobilePageHeight, setMobilePageHeight] = useState(360);
  const [mobileSpread, setMobileSpread] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const spreadCount = Math.max(1, Math.ceil(items.length / 2));

  // Keep mobile book dimensions based on WIDTH, not changing viewport height.
  // This avoids layout stretching when the mobile browser address bar hides/shows.
  useEffect(() => {
    const updateLayout = () => {
      const viewportWidth = document.documentElement.clientWidth;
      const mobile = window.matchMedia("(max-width: 639px)").matches;

      setIsMobile(mobile);

      const availableWidth = Math.min(viewportWidth - 32, 760);
      setPageWidth(Math.max(280, Math.floor(availableWidth / 2)));

      if (mobile) {
        const stableBookHeight = Math.min(
          Math.max(Math.round(viewportWidth * 1.45), 540),
          700
        );

        const stablePageHeight = Math.max(280, viewportWidth - 28);

        setMobileBookHeight(stableBookHeight);
        setMobilePageHeight(stablePageHeight);
      }
    };

    updateLayout();

    window.addEventListener("resize", updateLayout);

    return () => {
      window.removeEventListener("resize", updateLayout);

      if (flipLockTimer.current) {
        window.clearTimeout(flipLockTimer.current);
      }
    };
  }, []);

  const unlockFlip = useCallback(() => {
    if (flipLockTimer.current) {
      window.clearTimeout(flipLockTimer.current);
      flipLockTimer.current = null;
    }

    setIsFlipping(false);
    setIsPaused(false);
  }, []);

  // Fallback unlock: prevents controls remaining disabled if a flip event is missed.

  const scheduleUnlock = useCallback((delay = 1100) => {
    if (flipLockTimer.current) {
      window.clearTimeout(flipLockTimer.current);
    }

    flipLockTimer.current = window.setTimeout(() => {
      setIsFlipping(false);
      setIsPaused(false);
      flipLockTimer.current = null;
    }, delay);
  }, []);


  // Desktop auto-flip — configuration and behavior preserved.
  useEffect(() => {
    if (isMobile || !isInView || isPaused || items.length < 2) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      const book = bookRef.current?.pageFlip?.();
      if (!book) return;

      const currentPage = book.getCurrentPageIndex();
      const pageCount = book.getPageCount();

      if (currentPage >= pageCount - 2) {
        book.flip(0);
      } else {
        book.flipNext();
      }
    }, 3500);

    return () => window.clearInterval(interval);
  }, [isMobile, isInView, isPaused, items.length]);

  // Shared mobile handler for swipe and buttons.



 const startMobileTurn = useCallback((direction) => {
  const book = bookRef.current?.pageFlip?.();
  if (!book || isFlipping || isClosingBook) return;

  // Allow normal navigation after the closing loop finishes
  forceFirstSpreadRef.current = false;

  const currentPage = book.getCurrentPageIndex();
  const totalPages = book.getPageCount();

  setIsPaused(true);
  setIsFlipping(true);

  if (direction > 0 && currentPage >= totalPages - 2) {
    closingBookRef.current = true;
    setIsClosingBook(true);

    book.flipPrev();
    scheduleUnlock(5000);
    return;
  }

  if (direction < 0 && currentPage <= 0) {
    book.turnToPage(totalPages - 2);
    setMobileSpread(spreadCount - 1);
    unlockFlip();
    return;
  }

  if (direction > 0) {
    book.flipNext();
  } else {
    book.flipPrev();
  }

  scheduleUnlock();
}, [
  isFlipping,
  isClosingBook,
  scheduleUnlock,
  unlockFlip,
  spreadCount,
]);


  // Mobile auto-flip. It uses the same handler as manual interaction.
  useEffect(() => {
    if (
      !isMobile ||
      !isInView ||
      isPaused ||
      isFlipping ||
      spreadCount < 2
    ) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      startMobileTurn(1);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [
    isMobile,
    isInView,
    isPaused,
    isFlipping,
    spreadCount,
    startMobileTurn,
  ]);

  const renderCertificate = (cert, index, className = "page") => {
    if (!cert) return null;

    return (
      <div className={className} key={`${cert.title}-${index}`}>
        <div className="page-content">
          <div className="cert-image-wrapper">
            <img
              src={cert.image}
              alt={`${cert.title} certificate`}
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

            {cert.desc && (
              <p className="cert-description">{cert.desc}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Only the mobile stage handles vertical swipes.
  // This avoids treating button taps as swipe gestures.
  const handleTouchStart = (event) => {
    if (!isMobile || isFlipping || event.touches.length !== 1) return;

    const touch = event.touches[0];

    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
    };

    setIsPaused(true);
  };

  const handleTouchEnd = (event) => {
    if (!isMobile || !touchStart.current) {
      touchStart.current = null;
      return;
    }

    const start = touchStart.current;
    const touch = event.changedTouches[0];

    const deltaX = start.x - touch.clientX;
    const deltaY = start.y - touch.clientY;

    touchStart.current = null;

    // Ignore small movements so taps don't trigger page turns.
    if (Math.abs(deltaY) > 40 && Math.abs(deltaY) > Math.abs(deltaX) * 1.15) {
      startMobileTurn(deltaY > 0 ? 1 : -1);
    } else if (!isFlipping) {
      setIsPaused(false);
    }
  };

  const handleTouchCancel = () => {
    touchStart.current = null;

    if (!isFlipping) {
      setIsPaused(false);
    }
  };





  const handleMobileFlip = useCallback((event) => {
  const pageIndex = Number(event?.data ?? 0);

  // Closing animation: keep moving backwards one page at a time
  if (closingBookRef.current) {
    if (pageIndex > 0) {
      setMobileSpread(
        Math.min(
          Math.floor(pageIndex / 2),
          spreadCount - 1
        )
      );

      bookRef.current?.pageFlip?.()?.flipPrev();
    } else {
      // The first page is now visible
      setMobileSpread(0);

      closingBookRef.current = false;
      forceFirstSpreadRef.current = true;

      setIsClosingBook(false);
      unlockFlip();
    }

    return;
  }

  // Ignore stale events until the user starts another turn
  if (forceFirstSpreadRef.current) {
    return;
  }

  const spread = Math.min(
    Math.max(0, Math.floor(pageIndex / 2)),
    spreadCount - 1
  );

  setMobileSpread(spread);
  unlockFlip();
}, [spreadCount, unlockFlip]);

  return (
    <div
      ref={containerRef}
      className={`certificate-book-container ${isMobile ? "mobile-certificate-view" : "desktop-certificate-view"
        }`}
      onPointerDown={!isMobile ? () => setIsPaused(true) : undefined}
      onPointerUp={!isMobile ? () => setIsPaused(false) : undefined}
      onPointerCancel={!isMobile ? () => setIsPaused(false) : undefined}
      onPointerLeave={!isMobile ? () => setIsPaused(false) : undefined}
    >
      {isMobile ? (
        <div className="mobile-certificate-card">
          <div
            className="mobile-rotated-stage"
            style={{
              width: `${mobilePageHeight}px`,
              height: `${mobileBookHeight}px`,
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
          >
            <div
              className="mobile-rotated-book-rotator"
              style={{
                width: `${mobileBookHeight}px`,
                height: `${mobilePageHeight}px`,
              }}
            >
              <HTMLFlipBook
                ref={bookRef}
                style={{
                  "--rotated-content-width": `${mobilePageHeight}px`,
                  "--rotated-content-height": `${Math.floor(
                    mobileBookHeight / 2
                  )}px`,
                }}
                width={Math.floor(mobileBookHeight / 2)}
                height={mobilePageHeight}
                size="fixed"
                minWidth={280}
                maxWidth={440}
                minHeight={280}
                maxHeight={440}
                className="mobile-rotated-book"
                showCover={false}
                usePortrait={false}
                mobileScrollSupport={false}
                drawShadow={true}
                flippingTime={isClosingBook ? 180 : 700}
                startPage={0}
                useMouseEvents={false}
                swipeDistance={20}
                clickEventForward={false}
                showPageCorners={true}
                disableFlipByClick={true}
                autoSize={false}
                onFlip={handleMobileFlip}
              >
                {items.map((item, index) =>
                  renderCertificate(item, index)
                )}
              </HTMLFlipBook>
            </div>
          </div>

          <div className="mobile-certificate-controls">
            <button
              type="button"
              onClick={() => startMobileTurn(-1)}
              disabled={isFlipping}
              aria-label="Previous certificate spread"
            >
              ↑ Previous
            </button>

            <span>
              {Math.min(mobileSpread + 1, spreadCount)} / {spreadCount}
            </span>

            <button
              type="button"
              onClick={() => startMobileTurn(1)}
              disabled={isFlipping}
              aria-label="Next certificate spread"
            >
              Next ↓
            </button>
          </div>

          <p className="mobile-swipe-hint">
            Swipe up or down to turn the page
          </p>
        </div>
      ) : (
        <HTMLFlipBook
          ref={bookRef}
          width={pageWidth}
          height={Math.round(pageWidth * 1.28)}
          size="fixed"
          minWidth={280}
          maxWidth={380}
          minHeight={360}
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
          {items.map((item, index) => renderCertificate(item, index))}
        </HTMLFlipBook>
      )}
    </div>
  );
}

export default CertificateBook;