import './Home.css'

function Home() {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Selamat Datang</h1>
        <p>Aplikasi React sederhana</p>
      </header>

      <section className="home-content">
        <h2>Tentang Kami</h2>
        <p>
          Ini adalah halaman home sederhana menggunakan React dan CSS.
          Cocok untuk latihan atau project awal.
        </p>

        <button className="home-button">
          Mulai
        </button>
      </section>
    </div>
  )
}

export default Home
