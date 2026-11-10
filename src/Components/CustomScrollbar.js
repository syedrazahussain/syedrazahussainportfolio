import React, { useEffect, useRef } from "react";

export default function CustomScrollbar() {
  const trackRef = useRef(null);
  const thumbRef = useRef(null);
  const dragRef = useRef({
    active: false,
    startY: 0,
    startScroll: 0,
  });

  useEffect(() => {
    const track = trackRef.current;
    const thumb = thumbRef.current;

    if (!track || !thumb) return;

    let frameId;

    const updateScrollbar = () => {
      cancelAnimationFrame(frameId);

      frameId = requestAnimationFrame(() => {
        const viewportHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const maxScroll = Math.max(
          0,
          documentHeight - viewportHeight
        );

        const trackHeight = track.clientHeight;

        if (maxScroll <= 0 || trackHeight <= 0) {
          track.style.display = "none";
          return;
        }

        track.style.display = "block";

        const thumbHeight = Math.min(
          trackHeight,
          Math.max(38, (viewportHeight / documentHeight) * trackHeight)
        );

        const maxThumbTop = trackHeight - thumbHeight;
        const thumbTop =
          maxScroll > 0
            ? (window.scrollY / maxScroll) * maxThumbTop
            : 0;

        thumb.style.height = `${thumbHeight}px`;
        thumb.style.transform = `translateY(${thumbTop}px)`;
      });
    };

    const handlePointerDown = (event) => {
      dragRef.current = {
        active: true,
        startY: event.clientY,
        startScroll: window.scrollY,
      };

      thumb.setPointerCapture(event.pointerId);
      event.preventDefault();
    };

    const handlePointerMove = (event) => {
      if (!dragRef.current.active) return;

      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = Math.max(0, documentHeight - viewportHeight);

      const trackHeight = track.clientHeight;
      const thumbHeight = thumb.offsetHeight;
      const maxThumbTop = trackHeight - thumbHeight;

      if (maxThumbTop <= 0) return;

      const deltaY = event.clientY - dragRef.current.startY;
      const scrollDelta = (deltaY / maxThumbTop) * maxScroll;

      window.scrollTo({
        top: Math.max(
          0,
          Math.min(
            maxScroll,
            dragRef.current.startScroll + scrollDelta
          )
        ),
        behavior: "auto",
      });
    };

    const handlePointerUp = () => {
      dragRef.current.active = false;
    };

    const handleTrackClick = (event) => {
      if (event.target !== track) return;

      const rect = track.getBoundingClientRect();
      const clickPosition = event.clientY - rect.top;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = Math.max(0, documentHeight - viewportHeight);

      const thumbHeight = thumb.offsetHeight;
      const maxThumbTop = track.clientHeight - thumbHeight;

      if (maxThumbTop <= 0) return;

      const targetScroll =
        ((clickPosition - thumbHeight / 2) / maxThumbTop) * maxScroll;

      window.scrollTo({
        top: Math.max(0, Math.min(maxScroll, targetScroll)),
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth",
      });
    };

    thumb.addEventListener("pointerdown", handlePointerDown);
    thumb.addEventListener("pointermove", handlePointerMove);
    thumb.addEventListener("pointerup", handlePointerUp);
    thumb.addEventListener("pointercancel", handlePointerUp);
    thumb.addEventListener("lostpointercapture", handlePointerUp);
    track.addEventListener("click", handleTrackClick);

    window.addEventListener("scroll", updateScrollbar, {
      passive: true,
    });
    window.addEventListener("resize", updateScrollbar, {
      passive: true,
    });

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateScrollbar)
        : null;

    resizeObserver?.observe(document.documentElement);

    updateScrollbar();

    return () => {
      cancelAnimationFrame(frameId);

      thumb.removeEventListener("pointerdown", handlePointerDown);
      thumb.removeEventListener("pointermove", handlePointerMove);
      thumb.removeEventListener("pointerup", handlePointerUp);
      thumb.removeEventListener("pointercancel", handlePointerUp);
      thumb.removeEventListener(
        "lostpointercapture",
        handlePointerUp
      );
      track.removeEventListener("click", handleTrackClick);

      window.removeEventListener("scroll", updateScrollbar);
      window.removeEventListener("resize", updateScrollbar);

      resizeObserver?.disconnect();
    };
  }, []);

  return (
    <div
      ref={trackRef}
      className="theme-scrollbar"
      aria-hidden="true"
    >
      <div
        ref={thumbRef}
        className="theme-scrollbar-thumb"
      />
    </div>
  );
}




