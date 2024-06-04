import "./Footer.css";


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} SOIL. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
