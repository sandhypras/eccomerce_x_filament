import "./Navbar.css";

export default function Navbar() {
    return (
        <header className="navbar">
            <div className="navbar-left">LOGO</div>

            <nav className="navbar-menu">
                <a href="#">Home</a>
                <a href="#">About Us</a>
                <a href="#">Product</a>
                <a href="#">Location</a>
                <a href="/contact">Contact</a>
                <a href ="/cart">Cart</a>
            </nav>
        </header>
    );
}
