import { FaEnvelope, FaHouse, FaLocationDot, FaPhone } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer>
      <div className="wrap contact-panel">
        <div className="contact-intro">
          <span className="eyebrow">Let&apos;s connect</span>
          <h2>Want to build something useful?</h2>
          <p>I&apos;m open to backend roles, internships and good conversations about products that solve a real problem.</p>
        </div>
        <div className="contact-details">
        <a href="tel:+917307249849"><span className="contact-icon" aria-hidden="true"><FaPhone /></span><span><b>Phone</b>+91 7307249849</span></a>
        <a href="mailto:utkarshgupta2307@gmail.com"><span className="contact-icon" aria-hidden="true"><FaEnvelope /></span><span><b>Email</b>utkarshgupta2307@gmail.com</span></a>
        <div><span className="contact-icon" aria-hidden="true"><FaHouse /></span><span><b>Based in</b>Prayagraj, Uttar Pradesh, India</span></div>
        <div className="location-block"><span className="contact-icon" aria-hidden="true"><FaLocationDot /></span><span><b>Open to work in</b><strong>Noida · Gurgaon · New Delhi · Delhi · Haridwar</strong></span></div>
        </div>
      </div>
      <div className="wrap foot-grid">
        <div>
          <div className="nav-mark">
            Utkarsh<span>.</span>dev
          </div>
          <p className="tag">
            Java and Spring Boot enthusiast, currently learning by building from Prayagraj, India.
          </p>
        </div>
        <ul className="contact-list">
          <li><a href="mailto:utkarshgupta2307@gmail.com">Email</a></li>
          <li><a href="https://github.com/Utkarsh-Gupta-Git-Hub" target="_blank" rel="noreferrer">GitHub</a></li>
          <li><a href="https://linkedin.com/in/utkarsh-gupta-8a1611294" target="_blank" rel="noreferrer">LinkedIn</a></li>
          <li><a href="https://leetcode.com/u/dVLRU9fohL/" target="_blank" rel="noreferrer">LeetCode</a></li>
        </ul>
      </div>
      <div className="wrap fine">
        <span>Utkarsh Gupta - Prayagraj, IN</span>
        <span>© 2026, built with Java on the mind</span>
      </div>
    </footer>
  );
}
