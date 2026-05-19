const menuData = {
  "Hlavní stránka": "index.html",
  "Prolog": "prolog.html",
  "Tvorba postavy": "tvorba-postavy.html",
  // "Postavy": "postavy.html",
  // "Základní info": "zakladni-info.html"
};

const menuContainer = document.getElementById("side-menu");
const toggleButton = document.getElementById("menu-toggle");

function createLink(label, href) {
  const link = document.createElement("a");
  link.className = "menu-link";
  link.textContent = label;
  link.href = href;

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  if (href === currentPage) {
    link.classList.add("is-active");
  }

  return link;
}

function createSubmenu(items) {
  const submenu = document.createElement("div");
  submenu.className = "submenu";

  const inner = document.createElement("div");
  inner.className = "submenu-inner";

  items.forEach((item) => {
    if (item.url) {
      inner.appendChild(createLink(item.name, item.url));
      return;
    }

    const [label, children] = Object.entries(item)[0];
    const category = document.createElement("button");
    category.className = "menu-category";
    category.type = "button";
    category.textContent = label;

    const nested = createSubmenu(children);
    category.addEventListener("click", () => nested.classList.toggle("visible"));

    inner.appendChild(category);
    inner.appendChild(nested);
  });

  submenu.appendChild(inner);
  return submenu;
}

function buildMenu() {
  if (!menuContainer) return;

  Object.entries(menuData).forEach(([label, value]) => {
    const section = document.createElement("div");
    section.className = "menu-section";

    if (typeof value === "string") {
      section.appendChild(createLink(label, value));
    } else {
      const category = document.createElement("button");
      category.className = "menu-category";
      category.type = "button";
      category.textContent = label;

      const submenu = createSubmenu(value);
      category.addEventListener("click", () => submenu.classList.toggle("visible"));

      section.appendChild(category);
      section.appendChild(submenu);
    }

    menuContainer.appendChild(section);
  });
}

function setMenuVisible(isVisible) {
  menuContainer.classList.toggle("visible", isVisible);
  document.body.classList.toggle("menu-open", isVisible);
  toggleButton.setAttribute("aria-expanded", String(isVisible));
}

if (menuContainer && toggleButton) {
  buildMenu();

  toggleButton.addEventListener("click", () => {
    setMenuVisible(!menuContainer.classList.contains("visible"));
  });

  menuContainer.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setMenuVisible(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuVisible(false);
    }
  });
}
