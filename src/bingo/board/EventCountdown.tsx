import { FC, useEffect, useState } from "react";
import { Container } from "react-bootstrap";

interface Props {
  cutoffDate?: Date;
}

const defaultCutoff = new Date(Date.UTC(2026, 1, 28, 14, 0, 0)); // Feb 28 2026 08:00 CST => 14:00 UTC

const formatNumber = (n: number) => String(n).padStart(2, "0");

const EventCountdown: FC<Props> = ({ cutoffDate = defaultCutoff }) => {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const id = setInterval(tick, 1000);

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        // reload the page to fully resync animations and state
        window.location.reload();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const msLeft = Math.max(0, cutoffDate.getTime() - now);

  const seconds = Math.floor(msLeft / 1000) % 60;
  const minutes = Math.floor(msLeft / (1000 * 60)) % 60;
  const hours = Math.floor(msLeft / (1000 * 60 * 60)) % 24;
  const days = Math.floor(msLeft / (1000 * 60 * 60 * 24));

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center h-100 text-white p-4">
      <h3 className="mb-3">Event starts in</h3>
      <div style={{ fontSize: 28, fontFamily: "monospace" }}>
        {days}d {formatNumber(hours)}:{formatNumber(minutes)}:
        {formatNumber(seconds)}
      </div>
      <small className="mt-3" style={{ color: "#fff" }}>
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
