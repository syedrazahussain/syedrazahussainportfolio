import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaPhone,
  FaEnvelope,
  FaLinkedin,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { ReactTyped } from "react-typed";
import "./Hero.css";

const INTRO_DURATION = 10;

const timeline = {
  name: 1.2,
  role: 1.8,
  objective: 2.2,
  phone: 3.0,
  email: 3.3,
  linkedin: 3.6,
  github: 3.9,
  projects: 4.2,
  contactButton: 4.5,
};

function WordByWord({
  text = "",
  time = 0,
  start = 1,
  stagger = 0.1,
  duration = 0.3,
  className = "",
  as = "div",
}) {
  const words = String(text).trim().split(/\s+/).filter(Boolean);

  const Tag =
    as === "h1"
      ? motion.h1
      : as === "p"
        ? motion.p
        : as === "span"
          ? motion.span
          : motion.div;

  return (
    <Tag className={className}>
      {words.map((word, index) => {
        const visible = time >= start + index * stagger;

        return (
          <motion.span
            key={`${index}-${word}`}
            initial={false}
            animate={{
              opacity: visible ? 1 : 0,
              y: visible ? 0 : 12,
              filter: visible ? "blur(0px)" : "blur(5px)",
            }}
            transition={{
              duration,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              display: "inline-block",
              marginRight: "0.28em",
              whiteSpace: "pre",
              visibility: visible ? "visible" : "hidden",
            }}
            aria-hidden={!visible}
          >
            {word}
          </motion.span>
        );
      })}
    </Tag>
  );
}

function SyncSection({ time, start, children }) {
  const visible = time >= start;

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 18,
      }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        visibility: visible ? "visible" : "hidden",
        pointerEvents: visible ? "auto" : "none",
      }}
      aria-hidden={!visible}
    >
      {children}
    </motion.div>
  );
}

export default function Hero({
  contact = {},
  objective =
  "Building modern, responsive web experiences with clean code and thoughtful design.",
}) {
  const [videoTime, setVideoTime] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Detect mobile on the first render to prevent a flash of the text.
  const [isMobileView, setIsMobileView] = useState(() => {
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 760px)").matches
    );
  });

  // Separate timer used only for the mobile text animation after the video.
  const [mobileAnimationTime, setMobileAnimationTime] = useState(0);

  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const audioEnabledRef = useRef(false);

  // Keep the mobile/desktop breakpoint updated if the viewport changes.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 760px)");

    const handleViewportChange = (event) => {
      setIsMobileView(event.matches);
    };

    setIsMobileView(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleViewportChange);

    return () => {
      mediaQuery.removeEventListener("change", handleViewportChange);
    };
  }, []);

  // Start the text timeline from zero after the video ends on mobile.
  // Desktop continues to use the original video timeline.
  useEffect(() => {
    if (!isMobileView || !videoEnded) return;

    let animationFrame;
    let startTimestamp = null;

    const tick = (timestamp) => {
      if (startTimestamp === null) {
        startTimestamp = timestamp;
      }

      const elapsed = (timestamp - startTimestamp) / 1000;

      setMobileAnimationTime(
        Math.min(elapsed, INTRO_DURATION)
      );

      if (elapsed < INTRO_DURATION) {
        animationFrame = requestAnimationFrame(tick);
      }
    };

    animationFrame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isMobileView, videoEnded]);

  // Preserve the original video-based timeline on desktop.
  const contentTime = isMobileView
    ? videoEnded
      ? mobileAnimationTime
      : 0
    : videoTime;

  // Audio toggle and video/audio synchronization.
  useEffect(() => {
    audioEnabledRef.current = audioEnabled;

    const audio = audioRef.current;
    const video = videoRef.current;

    if (!audio) return;

    audio.muted = !audioEnabled;

    if (audioEnabled && video) {
      audio.currentTime = video.currentTime;

      if (!video.paused && !video.ended) {
        audio.play().catch(() => {
          audioEnabledRef.current = false;
          setAudioEnabled(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [audioEnabled]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (!video) return;

    const time = video.currentTime;
    setVideoTime(time);

    if (audio && audioEnabledRef.current) {
      if (Math.abs(audio.currentTime - time) > 0.2) {
        audio.currentTime = time;
      }

      if (video.paused || video.ended) {
        audio.pause();
      } else if (audio.paused) {
        audio.play().catch(() => { });
      }
    }
  };

  const handleVideoPlay = () => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (!video || !audio || !audioEnabledRef.current) return;

    audio.currentTime = video.currentTime;
    audio.play().catch(() => { });
  };

  const handleVideoEnded = () => {
    setVideoEnded(true);
    setVideoTime(INTRO_DURATION);

    // Reset the mobile text animation so it starts after the video.
    setMobileAnimationTime(0);

    audioRef.current?.pause();
  };

  const toggleAudio = () => {
    const audio = audioRef.current;
    const video = videoRef.current;

    if (!audio || !video) return;

    if (!audioEnabled) {
      audio.currentTime = video.currentTime;
      audio.muted = false;

      audio
        .play()
        .then(() => {
          audioEnabledRef.current = true;
          setAudioEnabled(true);
        })
        .catch(() => {
          audio.muted = true;
          audioEnabledRef.current = false;
          setAudioEnabled(false);
        });
    } else {
      audio.pause();
      audio.muted = true;
      audioEnabledRef.current = false;
      setAudioEnabled(false);
    }
  };

  const contactItems = [
    {
      key: "phone",
      icon: <FaPhone />,
      label: "Phone",
      value: contact.phone || "",
      href: contact.phone ? `tel:${contact.phone}` : "#contact",
    },
    {
      key: "email",
      icon: <FaEnvelope />,
      label: "Email",
      value: contact.email || "",
      href: contact.email ? `mailto:${contact.email}` : "#contact",
    },
    {
      key: "linkedin",
      icon: <FaLinkedin />,
      label: "LinkedIn",
      value: "/syedrazahussain1512",
      href: contact.linkedin || "#",
    },
    {
      key: "github",
      icon: <FaGithub />,
      label: "GitHub",
      value: "/syedrazahussain",
      href: contact.github || "#",
    },
  ];

  return (
    <header
      className={`heroSection${videoEnded ? " heroVideoEnded" : ""}`}
      id="home"
    >
      {/* Animated background — unchanged */}
      <div className="heroBackground" aria-hidden="true">
        <div className="heroGrid" />
        <div className="heroGlow heroGlowBlue" />
        <div className="heroGlow heroGlowViolet" />
        <div className="heroGlow heroGlowEmerald" />
        <div className="heroLightBeam" />

        <div className="heroOrb heroOrbOne" />
        <div className="heroOrb heroOrbTwo" />
        <div className="heroOrb heroOrbThree" />

        <div className="heroParticles">
          {Array.from({ length: 28 }, (_, index) => (
            <span
              className="heroParticle"
              key={index}
              style={{
                "--i": index,
                "--x": `${(index * 37 + 11) % 100}%`,
                "--delay": `${(index % 9) * -1.7}s`,
                "--duration": `${12 + (index % 8) * 2}s`,
                "--size": `${2 + (index % 3)}px`,
              }}
            />
          ))}
        </div>

        <div className="heroNoise" />
      </div>

      {/* Intro video */}
      <video
        ref={videoRef}
        className="heroVideoBackground"
        src="/assets/video/my_intro_port_video.webm"
        autoPlay
        muted
        playsInline
        preload="auto"
        loop={false}
        onTimeUpdate={handleTimeUpdate}
        onPlay={handleVideoPlay}
        onEnded={handleVideoEnded}
      />

      {/* Voice track */}
      <audio
        ref={audioRef}
        src="/assets/audio/my_intro_port_audio.mp3"
        preload="auto"
        muted
      />

      {/* Audio toggle */}
      {(!isMobileView || !videoEnded) && (
        <button
          type="button"
          className="heroAudioToggle"
          onClick={toggleAudio}
          aria-label={
            audioEnabled ? "Mute introduction voice" : "Unmute introduction voice"
          }
          aria-pressed={audioEnabled}
          title={audioEnabled ? "Mute voice" : "Unmute voice"}
        >
          {audioEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
        </button>
      )}

      <div className="heroOverlay" aria-hidden="true" />

      <div className="heroContainer">
        {/*
          Mobile: do not mount the text until the video ends.
          Desktop: render immediately, preserving its existing timing.
        */}
        {(!isMobileView || videoEnded) && (
          <motion.div
            className="heroContent"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{
              x:
                contentTime < 1
                  ? "-100%"
                  : contentTime >= 4
                    ? "0%"
                    : `${-100 + ((contentTime - 1) / 3) * 100}%`,
              opacity: contentTime < 1 ? 0 : 1,
            }}
            transition={{ duration: 0.1, ease: "linear" }}
          >
            <motion.h1 className="heroTitle">
              Hi, I'm{" "}
              <WordByWord
                as="span"
                text={contact.name || "Raza Hussain"}
                time={contentTime}
                start={timeline.name}
                stagger={0.13}
                duration={0.35}
                className="animated-gradient-text"
              />
            </motion.h1>

            <SyncSection time={contentTime} start={timeline.role}>
              <div className="heroRole">
                <ReactTyped
                  strings={[
                    '<span style="color:var(--brand2)">Software Developer</span>',
                    '<span style="color:var(--brand)">Full-Stack Developer</span>',
                    '<span style="color:var(--accent)">Web Developer</span>',
                    '<span style="color:pink">MERN-Stack Developer</span>',
                    '<span style="color:var(--text)">Problem Solver 🚀</span>',
                  ]}
                  typeSpeed={60}
                  backSpeed={40}
                  backDelay={1500}
                  loop
                  smartBackspace
                  contentType="html"
                />
              </div>
            </SyncSection>

            <WordByWord
              as="p"
              text={objective}
              time={contentTime}
              start={timeline.objective}
              stagger={0.055}
              duration={0.28}
              className="heroObjective"
            />

            <div className="contactGrid">
              {contactItems.map((item) => {
                const visible = contentTime >= timeline[item.key];
                const external = item.href.startsWith("https://");

                return (
                  <motion.a
                    key={item.key}
                    href={item.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="contactCard"
                    initial={false}
                    animate={{
                      opacity: visible ? 1 : 0,
                      y: visible ? 0 : 18,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      visibility: visible ? "visible" : "hidden",
                      pointerEvents: visible ? "auto" : "none",
                    }}
                    tabIndex={visible ? 0 : -1}
                    aria-hidden={!visible}
                  >
                    <span className="contactIcon">{item.icon}</span>

                    <span className="contactCardContent">
                      <span className="contactLabel">{item.label}</span>
                      <span className="contactValue">
                        {item.value || item.label}
                      </span>
                    </span>

                    <span className="contactArrow" aria-hidden="true">
                      ↗
                    </span>
                  </motion.a>
                );
              })}
            </div>

            <div className="heroButtons">
              <SyncSection time={contentTime} start={timeline.projects}>
                <a href="#projects" className="heroPrimaryButton">
                  View Projects <span aria-hidden="true">↗</span>
                </a>
              </SyncSection>

              <SyncSection time={contentTime} start={timeline.contactButton}>
                <a href="#contact" className="heroSecondaryButton">
                  Contact Me
                </a>
              </SyncSection>
            </div>

            {videoEnded && (
              <span className="srOnly">Introduction video finished.</span>
            )}
          </motion.div>
        )}

        {/* Mobile-only profile image after the video ends */}
        {/* Mobile-only profile image after the video ends */}
        {isMobileView && videoEnded && contact.image && (
          <motion.div
            className="mobileProfileImage"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 3,
              ease: "linear",
              delay: 0,
            }}
          >
            <div className="mobileProfileImageWrapper">
              <div className="mobileProfileImageGlow" />

              <img
                src={contact.image}
                alt={contact.name || "Profile"}
                className="mobileProfilePhoto"
                loading="eager"
              />
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}