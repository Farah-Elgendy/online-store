import "../style/MainPage.css";
import TaskBar from "../Components/TaskBar";
import Button from "../Components/Button";
import heroImg from "../Images/image.png";
import MiniBar from "../Components/Minibar";
import image1 from "../Images/image1.png";
import image2 from "../Images/image2.png";
import image3 from "../Images/image3.png";
import image4 from "../Images/image4.png";
import image5 from "../Images/image5.png";
import image6 from "../Images/image6.png";
import Product from "../Components/Product";

export default function MainPage() {
    const products = [
        {
            id: 1,
            image: image1,
            title: "Orange Wide Leg",
            price: "980,00€",
            description: "This one-piece swimsuit is crafted from jersey featuring an allover micro Monogram motif in relief.",
            colors: [
                { label: "White", bg: "#ffffff", fg: "#111111" },
                { label: "Black", bg: "#000000", fg: "#ffffff" },
            ],
        },
        {
            id: 2,
            image: image2,
            title: "Tailored Jacket",
            price: "980,00€",
            description: "This one-piece swimsuit is crafted from jersey featuring an allover micro Monogram motif in relief.",
            colors: [
                { label: "Blue", bg: "#0D499F", fg: "#111111" },
                { label: "Black", bg: "#000000", fg: "#ffffff" },
            ],
        },
        {
            id: 3,
            image: image3,
            title: "Accordion Pleated Dress",
            price: "980,00€",
            description: "This one-piece swimsuit is crafted from jersey featuring an allover micro Monogram motif in relief.",
            colors: [
                { label: "Red", bg: "#B20F36", fg: "#111111" },
                { label: "Grey", bg: "#AFAFB7", fg: "#ffffff" },
            ],
        },
        {
            id: 4,
            image: image4,
            title: "Green Trench Coat",
            price: "980,00€",
            description: "This one-piece swimsuit is crafted from jersey featuring an allover micro Monogram motif in relief.",
            colors: [
                { label: "White", bg: "#ffffff", fg: "#111111" },
                { label: "Black", bg: "#000000", fg: "#ffffff" },
            ],
        },
        {
            id: 5,
            image: image5,
            title: "Tennis Blue T-Shirt",
            price: "980,00€",
            description: "This one-piece swimsuit is crafted from jersey featuring an allover micro Monogram motif in relief.",
            colors: [
                { label: "Grey", bg: "#AFAFB7", fg: "#111111" },
                { label: "Black", bg: "#000000", fg: "#ffffff" },
            ],
        },
        {
            id: 6,
            image: image6,
            title: "Long Sleeve Tennis Top",
            price: "980,00€",
            description: "This one-piece swimsuit is crafted from jersey featuring an allover micro Monogram motif in relief.",
            colors: [
                { label: "Blue", bg: "#0D499F", fg: "#111111" },
                { label: "Black", bg: "#000000", fg: "#ffffff" },
            ],
        }
    ];
    return (
        <div className="page">
            <TaskBar />

            {/* UPPER: full-viewport hero below the taskbar */}
            <section className="top-hero" style={{ "--hero-img": `url(${heroImg})` }} />

            {/* LOWER: white area + same image bottom-right */}
            <section className="lower-stage" style={{ "--hero-img": `url(${heroImg})` }}>
                <div className="lower-stage__wrap">
                    <div className="left-block">
                        <h1 className="hero-title">The Gift Guide</h1>
                        <p className="hero-text">
                            Discover Joy: Your Ultimate Holiday Gift Destination. Explore our curated
                            selection and find the perfect gifts to delight your loved ones this holiday season.
                        </p>
                        <Button
                            label="SHOP NOW"
                            baseBg="#000000"
                            baseColor="#ffffff"
                            hoverBg="#fff544"
                            hoverColor="#000000"
                            onClick={() => { }}
                        />
                    </div>

                    {/* Same image again, fixed 890 x 402 at bottom-right */}
                    <div className="bottom-right-img" />
                </div>
            </section>
            <MiniBar text="SUSTAINABLE, ETHICALLY MADE CLOTHES IN SIZES XXS TO 6XL" bg="#F5F5F5" color="#111" />
            {/* Product grid (6 items) */}

            <section className="product-section">
                <h2 className="grid-title">Tisso vison in the wild</h2>

                <div className="product-grid">
                    {products.map(p => <Product key={p.id} {...p} />)}
                </div>
            </section>
        </div>
    );
}
