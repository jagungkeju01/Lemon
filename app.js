(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const expanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    }));
  }

  const homeClock = document.getElementById("home-clock");
  const homeDate = document.getElementById("home-date");
  if (homeClock) {
    const updateHomeClock = () => {
      const now = new Date();
      homeClock.textContent = new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
      }).format(now);
      if (homeDate) homeDate.textContent = new Intl.DateTimeFormat("id-ID", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
      }).format(now);
    };
    updateHomeClock();
    setInterval(updateHomeClock, 1000);
  }
})();