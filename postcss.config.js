// PostCSS কনফিগারেশন ফাইল (PostCSS Configuration)
// Tailwind CSS এবং ব্রাউজার প্রিফিক্সিংয়ের জন্য Autoprefixer প্লাগইন লোড করে

module.exports = {
  plugins: {
    tailwindcss: {}, // টেলউইন্ড সিএসএস প্রসেসিং
    autoprefixer: {}, // সিএসএস প্রপার্টিতে ব্রাউজার ভেন্ডর প্রিফিক্স অটো-যোগ করে
  },
};
