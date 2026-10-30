"use client";

// Lets the user pick/take a photo and shrinks it (default max 1600px, enough to read poster text) so uploads stay small.
export default function ImagePicker({ value, onChange, label = "Add a photo (optional)", maxSize = 1600 }) {
  async function handle(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange(await resize(file, maxSize));
  }

  return (
    <div className="image-picker">
      <label className="btn btn-ghost">
        📷 {label}
        <input type="file" accept="image/*" onChange={handle} hidden />
      </label>
      {value && (
        <div className="preview">
          <img src={value} alt="Selected" />
          <button type="button" className="link" onClick={() => onChange(null)}>Remove</button>
        </div>
      )}
    </div>
  );
}

function resize(file, max) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(img.src);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
