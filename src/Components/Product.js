import { useEffect, useMemo, useRef, useState } from "react";
import "../style/Product.css";
import { useCart } from "./CartContext";

export default function Product({
    id,
    image,
    alt = "Product image",
    title = "Orange Wide Leg",
    price,
    basePrice,
    description = "This one-piece swimsuit is crafted from jersey featuring an allover micro Monogram motif in relief.",
    variants = null,
    colors = ["White", "Black"],
    sizes = ["XS", "S", "M", "L", "XL"],
    onViewCart = () => { }, // optional callback for the “View cart” button
}) {
    const { addItem } = useCart?.() ?? { addItem: () => { } };

    const [open, setOpen] = useState(false);
    const dialogRef = useRef(null);

    // ---- normalize colors
    const normColor = (opt) => {
        if (!opt) return { label: "Color", bg: "#000", fg: "#fff" };
        if (typeof opt === "string") {
            const low = opt.toLowerCase();
            if (low === "white") return { label: "White", bg: "#fff", fg: "#111" };
            if (low === "black") return { label: "Black", bg: "#000", fg: "#fff" };
            return { label: opt, bg: opt, fg: "#fff" };
        }
        return { label: opt.label ?? "Color", bg: opt.bg ?? opt.value ?? "#000", fg: opt.fg ?? opt.text ?? "#fff" };
    };

    // ---- build variants (prefer explicit variants)
    const variantList = useMemo(() => {
        if (Array.isArray(variants) && variants.length) {
            return variants.map((v, i) => ({
                id: v.id ?? `${id || title}-${v.color?.label}-${v.size}-${i}`,
                color: normColor(v.color),
                size: v.size,
                price: v.price ?? basePrice ?? price ?? 0,
                stock: v.stock ?? null,
            }));
        }
        // fallback synthesize from colors x sizes
        const cols = colors.map(normColor);
        const list = [];
        cols.forEach((c) =>
            sizes.forEach((s, i) => {
                list.push({
                    id: `${id || title}-${c.label}-${s}-${i}`,
                    color: c,
                    size: s,
                    price: basePrice ?? price ?? 0,
                    stock: null,
                });
            })
        );
        return list;
    }, [variants, colors, sizes, id, title, basePrice, price]);

    // unique colors
    const colorOpts = useMemo(() => {
        const map = new Map();
        variantList.forEach((v) => { if (!map.has(v.color.label)) map.set(v.color.label, v.color); });
        return Array.from(map.values()).slice(0, 2);
    }, [variantList]);

    const sizesForColor = (label) =>
        variantList.filter(v => v.color.label === label && (v.stock == null || v.stock > 0)).map(v => v.size);

    const [selectedColor, setSelectedColor] = useState(colorOpts[0]);
    const [sizeOpen, setSizeOpen] = useState(false);
    const [size, setSize] = useState("");

    useEffect(() => {
        if (selectedColor) {
            const available = sizesForColor(selectedColor.label);
            if (!available.includes(size)) setSize("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedColor]);

    const selectedVariant =
        variantList.find(v => v.color.label === selectedColor?.label && v.size === size) || null;

    const displayPrice = selectedVariant?.price ?? basePrice ?? price ?? "";

    // modal esc + scroll lock
    useEffect(() => {
        const onKey = (e) => open && e.key === "Escape" && setOpen(false);
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
    }, [open]);

    // ------- NEW: “added to cart” toast -------
    const [toastOpen, setToastOpen] = useState(false);
    const [justAdded, setJustAdded] = useState(null); // {image,title,color,size,price}

    useEffect(() => {
        if (!toastOpen) return;
        const t = setTimeout(() => setToastOpen(false), 2500);
        return () => clearTimeout(t);
    }, [toastOpen]);

    function handleAdd() {
        if (!selectedVariant) return;
        const key = `${id || title}-${selectedVariant.color.label}-${selectedVariant.size}`;
        addItem({
            key,
            productId: id || title,
            title,
            image,
            variantId: selectedVariant.id,
            color: selectedVariant.color,
            size: selectedVariant.size,
            price: selectedVariant.price ?? 0,
            qty: 1,
        });
        setOpen(false);
        setJustAdded({
            image,
            title,
            color: selectedVariant.color,
            size: selectedVariant.size,
            price: selectedVariant.price ?? 0,
        });
        setToastOpen(true);
    }

    return (
        <div className="product">
            <img className="product-img" src={image} alt={alt} />

            <button className="fab" type="button" onClick={() => setOpen(true)}>
                <span className="fab-icon" aria-hidden="true">+</span>
            </button>

            {open && (
                <div className="modal" role="presentation">
                    <div className="modal-backdrop" onClick={() => setOpen(false)} />
                    <div className="modal-card" role="dialog" aria-modal="true" ref={dialogRef}>
                        <button className="modal-close" type="button" onClick={() => setOpen(false)} aria-label="Close">×</button>

                        {/* Header */}
                        <div className="modal-head">
                            <img className="modal-thumb" src={image} alt={alt} />
                            <div className="head-text">
                                <div className="p-title">{title}</div>
                                <div className="p-price">{displayPrice}</div>
                                <div className="p-desc">{description}</div>
                            </div>
                        </div>

                        {/* Color segmented with sliding highlight (smooth) */}
                        <label className="form-label">Color</label>
                        {(() => {
                            const activeIdx = colorOpts.findIndex(c => c.label === selectedColor?.label);
                            return (
                                <div className={`segmented ${activeIdx === 1 ? "pos-right" : "pos-left"}`} role="radiogroup" aria-label="Color">
                                    {colorOpts.map((c, i) => {
                                        const active = i === activeIdx;
                                        return (
                                            <button
                                                key={`${c.label}-${i}`}
                                                type="button"
                                                className={`segment ${active ? "active" : ""} ${i === 1 ? "right" : "left"}`}
                                                onClick={() => setSelectedColor(c)}
                                                aria-pressed={active}
                                                style={{ "--stripe": c.bg }}
                                            >
                                                {c.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            );
                        })()}

                        {/* Size dropdown */}
                        <label className="form-label">Size</label>
                        <div className={`size-select ${sizeOpen ? "open" : ""}`}>
                            <button
                                type="button"
                                className="size-trigger"
                                role="combobox"
                                aria-expanded={sizeOpen}
                                aria-haspopup="listbox"
                                onClick={() => setSizeOpen(v => !v)}
                            >
                                <span className={`size-label ${!size ? "placeholder" : ""}`}>{size || "Choose your size"}</span>
                                <span className="size-arrow">
                                    <svg className="chev" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>

                            </button>
                            {sizeOpen && (
                                <ul className="size-menu" role="listbox">
                                    {sizesForColor(selectedColor?.label).map((s) => (
                                        <li
                                            key={s}
                                            role="option"
                                            aria-selected={size === s}
                                            className="size-option"
                                            onClick={() => { setSize(s); setSizeOpen(false); }}
                                        >
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* CTA */}
                        <button className="add-to-cart" type="button" disabled={!selectedVariant} onClick={handleAdd}>
                            ADD TO CART <span className="arrow">→</span>
                        </button>
                    </div>
                </div>
            )}

            {/* ------- NEW: Added-to-cart toast card ------- */}
            {toastOpen && justAdded && (
                <div className="add-toast" role="status" aria-live="polite">
                    <div className="add-toast-card">
                        <button className="toast-close" aria-label="Close" onClick={() => setToastOpen(false)}>×</button>
                        <div className="toast-row">
                            <img className="toast-thumb" src={justAdded.image} alt="" />
                            <div className="toast-meta">
                                <div className="toast-title">Added to cart</div>
                                <div className="toast-desc">
                                    {justAdded.title} · {justAdded.color?.label} · {justAdded.size}
                                </div>
                            </div>
                        </div>
                        <div className="toast-actions">
                            <button className="toast-btn ghost" onClick={() => setToastOpen(false)}>Continue shopping</button>
                            <button className="toast-btn solid" onClick={onViewCart}>View cart</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
