import "../style/MiniBar.css";

export default function MiniBar({
  text = "SUSTAINABLE, ETHICALLY MADE CLOTHES IN SIZES XXS TO 6XL",
  bg = "#F5F5F5",
  color = "#111111",
}) {
  return (
    <div className="mini-bar" style={{ "--mini-bg": bg, "--mini-color": color }}>
      <div className="mini-bar__inner">{text}</div>
    </div>
  );
}
