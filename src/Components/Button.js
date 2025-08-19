import { useState } from "react";
import "../style/Button.css";

/**
 * Props:
 * - label: text on the button
 * - onClick: click handler
 * - baseBg: background color (default state)
 * - hoverBg: background color on hover (wipe)
 * - baseColor: text color (default state)
 * - hoverColor: text color on hover (final state)
 */
export default function Button({
  label = "CHOOSE GIFT",
  onClick,
  baseBg = "#fff544",
  hoverBg = "#000000",
  baseColor = "#000000",
  hoverColor = "#ffffff",
}) {
  const [hover, setHover] = useState(false);

  // Pass colors via CSS custom properties used in Button.css
  const styleVars = {
    "--base-bg": baseBg,
    "--hover-bg": hoverBg,
    "--base-color": baseColor,
    "--hover-color": hoverColor,
  };

  return (
    <button
      className={`shop-btn ${hover ? "hovered" : ""}`}
      style={styleVars}
      data-text={`${label} →`}    // used by ::after overlay
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      type="button"
    >
      <span className="btn-content">
        {label} <span className="arrow">→</span>
      </span>
    </button>
  );
}
