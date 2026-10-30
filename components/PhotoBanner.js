// Dark photo banner used at the top of the scout / translate pages. Falls back to a plain gradient without the photo.
export default function PhotoBanner({ photo, eyebrow, title, children, position = "center 30%" }) {
  return (
    <div className="photo-banner" style={photo ? { "--banner-img": `url(${photo.src})`, "--banner-pos": position } : undefined}>
      <div className="photo-banner-text">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {children}
      </div>
      {photo && <span className="photo-credit">📷 {photo.credit}</span>}
    </div>
  );
}
