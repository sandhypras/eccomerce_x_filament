import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import homeProducts from "../data/homeProducts";
import "./About.css";

export default function About() {
    // Ambil 3 produk pertama untuk ditampilkan di About
    const showcaseProducts = homeProducts.slice(0, 3);

    return (
        <>
            <Navbar />

            {/* INTRO */}
            <section className="about-hero">
                <p>
                    A6 Electric merupakan penyedia perangkat elektronik dan
                    solusi IT yang fokus pada produk berkualitas untuk kebutuhan
                    personal, bisnis, dan instansi. Kami menghadirkan berbagai
                    produk pilihan yang telah disesuaikan dengan kebutuhan
                    teknologi masa kini.
                </p>
            </section>

            {/* IMAGE SHOWCASE */}
            <section className="about-section">
                <h2 className="section-title">Produk Unggulan Kami</h2>

                <div className="about-image-grid">
                    {showcaseProducts.map((product) => (
                        <div key={product.id} className="about-image-card">
                            <img src={product.image} alt={product.name} />
                            <p>{product.name}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* DESCRIPTION */}
            <section className="about-section">
                <div className="about-card">
                    <h2>Tentang A6 Electric</h2>
                    <p>
                        Kami menyediakan berbagai produk elektronik seperti
                        laptop, printer, perangkat jaringan, CCTV, dan aksesoris
                        pendukung lainnya. Setiap produk dipilih dengan standar
                        kualitas tinggi untuk memastikan performa dan keandalan
                        jangka panjang.
                    </p>

                    <p>
                        Dengan pengalaman dan komitmen yang kuat, A6 Electric
                        terus berupaya menjadi mitra teknologi terpercaya yang
                        mampu mendukung produktivitas dan efisiensi pelanggan.
                    </p>
                </div>
            </section>

            <Footer />
        </>
    );
}
