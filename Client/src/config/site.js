// Central place for brand + contact details used across the UI.
// Contact email / phone are optional: set them in Client/.env and they appear in the footer.
export const SITE = {
  name: "Aatmanirbhar Nari",
  tagline: "Dream. Learn. Earn. Grow.",
  location: "Maharashtra, India",
  email: import.meta.env.VITE_CONTACT_EMAIL || "",
  phone: import.meta.env.VITE_CONTACT_PHONE || "",
};
