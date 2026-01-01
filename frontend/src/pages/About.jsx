import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./About.css";

export default function About() {
    return (
        <>
            <Navbar />

            <div className="page-wrapper">
                <section className="page-hero">
                    <h1>About A6 Electric</h1>
                    <p>
                        Solusi Elektronik & Teknologi Terpercaya untuk Bisnis dan
                        Personal
                    </p>
                </section>

                <section className="page-content">
                    <div className="grid-3">
                        <div className="info-card">
                            <h3>Profil</h3>
                            <p>
                                A6 Electric adalah penyedia produk elektronik dan IT
                                yang berfokus pada kualitas produk dan layanan
                                profesional.
                            </p>
                        </div>

                        <div className="info-card">
                            <h3>Visi</h3>
                            <p>
                                Menjadi toko elektronik terpercaya dengan solusi
                                teknologi modern dan inovatif.
                            </p>
                        </div>

                        <div className="info-card">
                            <h3>Misi</h3>
                            <ul>
                                <li>Produk original & bergaransi resmi</li>
                                <li>Harga kompetitif & transparan</li>
                                <li>Dukungan teknis profesional</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="page-content">
                    <div className="grid-3">
                        <div className="info-card">
                            <h3>💻 Produk Berkualitas</h3>
                            <p>
                                Laptop, CCTV, smartphone, printer, dan aksesoris IT
                                dari brand terpercaya.
                            </p>
                        </div>

                        <div className="info-card">
                            <h3>⚙️ Layanan Profesional</h3>
                            <p>
                                Instalasi, konsultasi, dan after-sales service oleh
                                tim berpengalaman.
                            </p>
                        </div>

                        <div className="info-card">
                            <h3>🚚 Pengiriman Cepat</h3>
                            <p>
                                Pengiriman aman dan cepat ke berbagai wilayah
                                Indonesia.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="page-content">
                    <div className="grid-3 stats">
                        <div className="stat-card">
                            <h2>500+</h2>
                            <p>Produk Elektronik</p>
                        </div>
                        <div className="stat-card">
                            <h2>1.000+</h2>
                            <p>Pelanggan Puas</p>
                        </div>
                        <div className="stat-card">
                            <h2>5 Tahun+</h2>
                            <p>Pengalaman</p>
                        </div>
                    </div>
                </section>

                <section className="page-content center">
                    <h2>Siap Menjadi Partner Teknologi Anda?</h2>
                    <p style={{ marginTop: "10px" }}>
                        Hubungi kami atau kunjungi toko A6 Electric sekarang.
                    </p>
                </section>
            </div>

            <Footer />
        </>
    );
}
