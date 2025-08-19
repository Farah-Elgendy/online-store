import { useEffect, useMemo, useRef, useState } from "react";
import "../style/Product.css";
import { useCart } from "./CartContext";

/**
 * Props:
 * - id, title, image, basePrice (or price), description
 * - variants: [{ id, color:{label,bg,fg}, size, price?, stock? }, ...]
 *   -> colors/sizes are derived from variants so they always stay in sync.
 * Fallback:
 * - If variants not provided, you can still pass `colors` and `sizes`.
 */
export default function Product({
    id,
    image,
    alt = "Product image",
    title = "Orange Wide Leg",
    price,                 // optional base price
    basePrice,             // same as price (either one)
    description = "This one-piece swimsuit is crafted from jersey featuring an allover micro Monogram motif in relief.",
    variants = null,       // preferred
    colors = ["White", "Black"], // fallback if variants=null
    sizes = ["XS", "S", "M", "L", "XL"], // fallback
}) {
    const { addItem } = useCart();

    const [open, setOpen] = useState(false);
    const dialogRef = useRef(null);

    // ---- Normalize a color to {label,bg,fg}
    const normColor = (opt) => {
        if (!opt) return { label: "Color", bg: "#000", fg: "#fff" };
        if (typeof opt === "string") {
            const low = opt.toLowerCase();
            if (low === "white") return { label: "White", bg: "#ffffff", fg: "#111111" };
            if (low === "black") return { label: "Black", bg: "#000000", fg: "#ffffff" };
            return { label: opt, bg: opt, fg: "#ffffff" };
        }
        return { label: opt.label ?? "Color", bg: opt.bg ?? opt.value ?? "#000", fg: opt.fg ?? opt.text ?? "#fff" };
    };

    // ---- Build a variant list (prefer `variants` prop; else synthesize from colors x sizes)
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
        // Fallback synthetic variants
        const col = colors.map(normColor);
        const list = [];
        col.forEach((c) =>
            sizes.forEach((s, i) =>
                list.push({
                    id: `${id || title}-${c.label}-${s}-${i}`,
                    color: c,
                    size: s,
                    price: basePrice ?? price ?? 0,
                    stock: null,
                })
            )
        );
        return list;
    }, [variants, colors, sizes, id, title, basePrice, price]);

    // ---- Unique color list from variants
    const colorOpts = useMemo(() => {
        const map = new Map();
        variantList.forEach((v) => {
            if (!map.has(v.color.label)) map.set(v.color.label, v.color);
        });
        return Array.from(map.values()).slice(0, 2); // your UI shows 2
    }, [variantList]);

    // ---- Sizes available for a given color (consider stock if provided)
    const sizesForColor = (label) =>
        variantList
            .filter((v) => v.color.label === label && (v.stock == null || v.stock > 0))
            .map((v) => v.size);

    const [selectedColor, setSelectedColor] = useState(colorOpts[0]);
    const [sizeOpen, setSizeOpen] = useState(false);
    const [size, setSize] = useState("");

    // When color changes, reset size if not available
    useEffect(() => {
        if (selectedColor) {
            const available = sizesForColor(selectedColor.label);
            if (!available.includes(size)) setSize("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedColor]);

    // Selected variant (color + size)
    const selectedVariant = useMemo(
        () =>
            variantList.find(
                (v) => v.color.label === selectedColor?.label && v.size === size
            ) || null,
        [variantList, selectedColor, size]
    );

    // Price to show (variant overrides base)
    const displayPrice = selectedVariant?.price ?? basePrice ?? price ?? "";

    // ESC to close + lock scroll while modal open
    useEffect(() => {
        const onKey = (e) => open && e.key === "Escape" && setOpen(false);
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open]);

    // Close size menu on outside click
    useEffect(() => {
        function onDoc(e) {
            if (sizeOpen && dialogRef.current && !dialogRef.current.contains(e.target)) {
                setSizeOpen(false);
            }
        }
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, [sizeOpen]);

    // ---- Add to cart
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
    }

    return (
        <div className="product">
            <img className="product-img" src={image} alt={alt} />

            {/* small white + to open */}
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

                        {/* Color segmented */}
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

                        {/* Size (options from variants for the chosen color) */}
                        <label className="form-label">Size</label>
                        <div className={`size-select ${sizeOpen ? "open" : ""}`}>
                            <button
                                type="button"
                                className="size-trigger"
                                role="combobox"
                                aria-expanded={sizeOpen}
                                aria-haspopup="listbox"
                                onClick={() => setSizeOpen((v) => !v)}
                            >
                                <span className={`size-label ${!size ? "placeholder" : ""}`}>
                                    {size || "Choose your size"}
                                </span>
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
                        <button
                            className="add-to-cart"
                            type="button"
                            disabled={!selectedVariant}
                            onClick={handleAdd}
                        >
                            ADD TO CART <span className="arrow">→</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
