import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
    return (
        <header className="navbar">
            <div className="navbar-left">LOGO</div>

            <nav className="navbar-menu">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/about">About Us</NavLink>
                <NavLink to="/product/1">Product</NavLink>
                <NavLink to="/contact">Contact</NavLink>
            </nav>
        </header>
    );
}
