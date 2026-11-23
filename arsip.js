(() => {
  const search = document.getElementById("archive-search");
  const cards = [...document.querySelectorAll(".archive-card")];
  const filters = [...document.querySelectorAll(".filter-chip")];
  const empty = document.getElementById("archive-empty");
  if (!search || !cards.length) return;
  let activeFilter = "semua";
  const apply = () => {
    const query = search.value.trim().toLocaleLowerCase("id");
    let shown = 0;
    cards.forEach(card => {
      const matchesTopic = activeFilter === "semua" || card.dataset.topic === activeFilter;
      const matchesSearch = !query || (card.dataset.search + " " + card.innerText).toLocaleLowerCase("id").includes(query);
      const visible = matchesTopic && matchesSearch;
      card.hidden = !visible;
      if (visible) shown++;
    });
    if (empty) empty.hidden = shown > 0;
  };
  search.addEventListener("input", apply);
  filters.forEach(button => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filters.forEach(item => item.classList.toggle("active", item === button));
    apply();
  }));
})();