import { FC, useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import "./eventCountdownRoll.css";

interface Props {
  cutoffDate?: Date;
}

const defaultCutoff = new Date(Date.UTC(2026, 1, 28, 14, 0, 0)); // Feb 28 2026 08:00 CST => 14:00 UTC

const formatNumber = (n: number) => String(n).padStart(2, "0");

function stepsFromTo(prev: number, next: number, maxSteps = 4) {
  const frames = [prev];
  let cur = prev;
  while (frames.length < maxSteps && cur !== next) {
    cur = (cur - 1 + 10) % 10;
    frames.push(cur);
  }
  if (frames[frames.length - 1] !== next) frames.push(next);
  return frames;
}

const DigitRoll: FC<{ char: string }> = ({ char }) => {
  const prevRef = useRef(char);
  const [frames, setFrames] = useState<string[]>([char]);
  const [offset, setOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const heightRef = useRef(40);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // measure frame height on mount
  useEffect(() => {
    const f = containerRef.current?.querySelector(
      ".roll-frame",
    ) as HTMLElement | null;
    if (f) heightRef.current = f.clientHeight || heightRef.current;
  }, []);

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === char) return;
    const p = Number(prev);
    const n = Number(char);
    if (Number.isNaN(p) || Number.isNaN(n)) {
      prevRef.current = char;
      setFrames([char]);
      setOffset(0);
      setIsAnimating(false);
      return;
    }

    const seq = stepsFromTo(p, n, 4).map(String);
    setFrames(seq);
    // start animation
    requestAnimationFrame(() => {
      setIsAnimating(true);
      setOffset(-((seq.length - 1) * heightRef.current));
    });

    const t = setTimeout(() => {
      // disable transition, replace frames with single final frame, reset offset without transition
      setIsAnimating(false);
      prevRef.current = char;
      setFrames([char]);
      setOffset(0);
    }, 620);

    return () => clearTimeout(t);
  }, [char]);

  return (
    <div className="roll-digit" ref={containerRef}>
      <div
        className="roll-stack"
        style={{
          transform: `translateY(${offset}px)`,
          transition: isAnimating
            ? "transform 600ms cubic-bezier(.2,.8,.2,1)"
            : "none",
        }}
      >
        {frames.map((f, i) => (
          <div className="roll-frame" key={i}>
            {f}
          </div>
        ))}
      </div>
    </div>
  );
};

const UnitsGroup: FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="ec-unit me-3">
    <div className="ec-digits">
      {value.split("").map((c, i) => (
        <DigitRoll key={i} char={c} />
      ))}
    </div>
    <div className="ec-label">{label}</div>
  </div>
);

const EventCountdown: FC<Props> = ({ cutoffDate = defaultCutoff }) => {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const msLeft = Math.max(0, cutoffDate.getTime() - now);

  const seconds = Math.floor(msLeft / 1000) % 60;
  const minutes = Math.floor(msLeft / (1000 * 60)) % 60;
  const hours = Math.floor(msLeft / (1000 * 60 * 60)) % 24;
  const days = Math.floor(msLeft / (1000 * 60 * 60 * 24));

  const daysStr = String(days);
  const hrsStr = formatNumber(hours);
  const minStr = formatNumber(minutes);
  const secStr = formatNumber(seconds);

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center h-100 text-white p-4 ec-container">
      <h3 className="mb-3">Event starts in</h3>
      <div className="ec-root">
        <UnitsGroup label="Days" value={daysStr} />
        <UnitsGroup label="Hours" value={hrsStr} />
        <UnitsGroup label="Minutes" value={minStr} />
        <UnitsGroup label="Seconds" value={secStr} />
      </div>
      <small className="mt-3 text-white">
        {cutoffDate.toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}
      </small>
    </Container>
  );
};

export default EventCountdown;
