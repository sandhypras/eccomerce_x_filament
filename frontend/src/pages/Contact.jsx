import "./Contact.css";

function Contact() {
    return (
        <div className="contact-page">
            <h1>Contact Us</h1>
            <p className="contact-desc">
                Jika Anda memiliki pertanyaan atau membutuhkan informasi lebih
                lanjut, silakan hubungi kami melalui kontak di bawah ini.
            </p>

            <div className="contact-info">
                <div className="contact-card">
                    <h3>Alamat</h3>
                    <p>Jl. Bhayangkara, Tipes, Serengan Surakarta</p>
                </div>

                <div className="contact-card">
                    <h3>Email</h3>
                    <p>a6electric@gmail.com</p>
                </div>

                <div className="contact-card">
                    <h3>Telepon</h3>
                    <p>0813-2674-1297</p>
                </div>

                <div className="contact-card">
                    <h3>Jam Operasional</h3>
                    <p>
                        Senin – Sabtu
                        <br />
                        08.00 – 17.00
                    </p>
                </div>
            </div>

            <div className="contact-map">
                <iframe
                    title="map"
                    src="https://maps.google.com/maps?q=Surakarta&t=&z=14&ie=UTF8&iwloc=&output=embed"
                    loading="lazy"
                />
            </div>
        </div>
    );
}

export default Contact;
