const links = ["about", "stack", "work", "process", "experience", "contact"];

export default function Navigation() {
  return (
    <nav>
      <div className="wrap">
        <div className="nav-mark">
          Utkarsh<span>.</span>dev
        </div>
        <ul className="nav-links">
          {links.map((item) => (
            <li key={item}>
              <a href={`#${item}`}>{item}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
