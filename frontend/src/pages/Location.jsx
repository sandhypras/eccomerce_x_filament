import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./StaticPages.css";

export default function Location() {
    return (
        <>
            <Navbar />

            {/* HERO */}
            <section className="page-hero">
                <h1>Our Location</h1>
                <p>Kunjungi toko A6 Electric secara langsung</p>
            </section>

            {/* INFO TOKO */}
            <section className="page-content">
                <div className="grid-3">
                    <div className="info-card">
                        <h3>📍 Alamat Toko</h3>
                        <p>Jl. Bhayangkara, Tipes, Serengan, Surakarta</p>
                    </div>

                    <div className="info-card">
                        <h3>⏰ Jam Operasional</h3>
                        <p>Senin – Sabtu</p>
                        <p>08.00 – 17.00 WIB</p>
                    </div>

                    <div className="info-card">
                        <h3>📞 Kontak</h3>
                        <p>0813-2674-1297</p>
                        <p>a6electric@gmail.com</p>
                    </div>
                </div>
            </section>

            {/* HIGHLIGHT */}
            <section className="page-content">
                <div className="grid-3">
                    <div className="info-card">
                        <h3>🚗 Akses Mudah</h3>
                        <p>
                            Lokasi strategis dan mudah dijangkau kendaraan
                            pribadi maupun umum.
                        </p>
                    </div>

                    <div className="info-card">
                        <h3>🅿️ Area Parkir</h3>
                        <p>
                            Tersedia area parkir yang luas dan aman untuk
                            pelanggan.
                        </p>
                    </div>

                    <div className="info-card">
                        <h3>🛠️ Layanan Langsung</h3>
                        <p>
                            Konsultasi produk dan layanan teknis langsung di
                            toko.
                        </p>
                    </div>
                </div>
            </section>

            {/* MAP */}
            <section className="page-content">
                <div className="info-card">
                    <h3>📌 Temukan Kami di Peta</h3>

                    <div className="map">
                        <iframe
                            title="map"
                            src="https://maps.google.com/maps?q=Surakarta&t=&z=14&ie=UTF8&iwloc=&output=embed"
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="page-content" style={{ textAlign: "center" }}>
                <h2>Siap Berkunjung ke A6 Electric?</h2>
                <p style={{ marginTop: "10px" }}>
                    Kami siap membantu kebutuhan elektronik dan IT Anda.
                </p>
            </section>

            <Footer />
        </>
    );
}
