import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Location.css";

export default function Location() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="location-hero">
        <h1>Lokasi Kami</h1>
        <p>
          Kunjungi A6 Electric untuk mendapatkan produk elektronik
          dan solusi IT terbaik dengan pelayanan profesional.
        </p>
      </section>

      {/* CONTENT */}
      <section className="location-section">
        <div className="location-card">
          <div className="location-info">
            <h2>A6 Electric</h2>
            <p>
              Jl. Contoh Alamat No. 123<br />
              Kota Anda, Indonesia
            </p>

            <p>
              <strong>Jam Operasional:</strong><br />
              Senin – Jumat: 08.00 – 17.00<br />
              Sabtu: 08.00 – 14.00<br />
              Minggu: Tutup
            </p>

            <p>
              <strong>Kontak:</strong><br />
              Telp / WhatsApp: 08xxxxxxxxxx<br />
              Email: info@a6electric.com
            </p>
          </div>

          {/* MAP */}
          <div className="location-map">
            <iframe
              title="A6 Electric Location"
              src="https://www.google.com/maps?q=-6.200000,106.816666&z=15&output=embed"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}