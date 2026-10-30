// Theyyam photos in public/theyyam/, each shown with its photographer's credit.
export const PHOTOS = {
  fire: { src: "/theyyam/fire.jpg", alt: "Theyyam performer ringed by flaming torches at night", credit: "Rijith Thenhipalam Photography" },
  crown: { src: "/theyyam/crown.jpg", alt: "Theyyam with silver crown and red flower headdress", credit: "Sreejish Photography" },
  face: { src: "/theyyam/face.jpg", alt: "Close-up of a Theyyam face painted black and white", credit: "Vyshakh Ravi Photography" },
};

export const photo = (name) => PHOTOS[name] || null;
