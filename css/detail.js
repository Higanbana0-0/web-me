const defaultGalleryItems = [
  "Kagurabachi.jpg",
  "Koutsugou Semi-Friend.jpg",
  "She's Likely Aiming for My Older Brother.jpg",
  "Tonari no Neko to Koi Shirazu.jpg",
  "[ R ] เพราะว่ารักเธอมันเจ็บ - Kimi Ni Aisarete Itakatta.jpg",
  "กางเขนสีชาด - JUUJIKA NO ROKUNIN「十字架のろくにん」.jpg",
  "ก่อนที่เธอจะกลายเป็นอสูรกาย.jpg",
  "คบชู้ ถูกกฏหมาย (Koushiki Furin).jpg",
  "มนต์รักตู้กดน้ำ (by ผู้อ่านทางบ้าน).jpg",
  "รุ่นพี่ไฮมิยะน่ากลัวแต่น่ารัก.jpg",
  "สกรีนช็อต 2026-05-28 202932.png",
  "สาบานรัก ราชันจอมเวท (Ousama no Propose).jpg",
  "เที่ยวไปกับสาวเกมเมอร์.jpg",
];

const STORAGE_KEY = "mangaGalleryItems";
const galleryRoot = document.getElementById("image-gallery");
const modal = document.getElementById("productModal");
const closeBtn = document.querySelector(".close-btn");
const modalTitle = document.getElementById("modal-title");
const modalImage = document.getElementById("modal-image");
const modalPrice = document.getElementById("modal-price");
const modalViewLink = document.getElementById("modal-view-link");
const backToTopBtn = document.getElementById("backToTopBtn");

function getDisplayName(fileName) {
  const cleaned = String(fileName || "").replace(/\.[^/.]+$/, "");
  return cleaned
    .replace(/[-_]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim() || "Image";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function toSlug(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getGalleryItems() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultGalleryItems.map((fileName) => ({
        title: getDisplayName(fileName),
        image: `img/${fileName}`,
        slug: toSlug(getDisplayName(fileName)),
        description: "เรื่องราวที่น่าติดตามในทุกตอน",
      }));
    }

    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item) => ({
        title: item.title || getDisplayName(item.image || "Image"),
        image: item.image || item.img || "",
        slug: item.slug || toSlug(item.title || getDisplayName(item.image || "Image")),
        description: item.description || "เรื่องราวที่น่าติดตามในทุกตอน",
      }));
    }
  } catch (error) {
    console.warn("Unable to read gallery items from localStorage:", error);
  }

  return defaultGalleryItems.map((fileName) => ({
    title: getDisplayName(fileName),
    image: `img/${fileName}`,
    slug: toSlug(getDisplayName(fileName)),
    description: "เรื่องราวที่น่าติดตามในทุกตอน",
  }));
}

if (galleryRoot) {
  const items = getGalleryItems();
  galleryRoot.innerHTML = items
    .map(
      (item) => `
        <article class="gallery-card" data-title="${escapeHtml(item.title)}" data-img="${escapeHtml(item.image)}" data-slug="${escapeHtml(item.slug)}">
          <div class="gallery-image">
            <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" />
          </div>
          <div class="gallery-meta">
            <h3>${escapeHtml(item.title)}</h3>
            <span>View</span>
          </div>
        </article>
      `
    )
    .join("");
}

document.querySelectorAll(".gallery-card").forEach((card) => {
  card.addEventListener("click", () => {
    const slug = card.getAttribute("data-slug") || toSlug(card.getAttribute("data-title") || "manga");
    window.location.href = `reader.html?manga=${encodeURIComponent(slug)}`;
  });
});

if (closeBtn && modal) {
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

if (modal) {
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
}

if (backToTopBtn) {
  const toggleBackToTop = () => {
    if (window.scrollY > 180) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  };

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  toggleBackToTop();
}

window.addEventListener("message", (event) => {
  if (event.data && event.data.type === "set-menu-height") {
    const frame = document.getElementById("menuFrame");
    if (frame) {
      frame.style.height = `${Math.max(60, Number(event.data.height) || 60)}px`;
    }
  }
});
