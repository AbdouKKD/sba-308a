document.addEventListener("DOMContentLoaded", () => {
  const API_KEY =
    "live_dzxCJGndM0bVhK4WKaNkbI7HQAtBB0EVTY42oWAdWNhqmfnTWBySZIEXnzKav5lE";
  const exoticBreeds = ["exotic", "sibe", "pers", "beng", "raga"];
  let currentPage = 1;
  let breed = "";
  const galleryContainer = document.getElementById("gallery");
  const searchInput = document.getElementById("search");
  const nextButton = document.getElementById("next");
  const prevButton = document.getElementById("prev");
  const favoriteButton = document.getElementById("favorite-btn");

  const getCatImage = async (breed = "") => {
    const url = breed
      ? `https://api.thecatapi.com/v1/images/search?breed_ids=${breed}`
      : `https://api.thecatapi.com/v1/images/search`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "x-api-key": API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data.length > 0) {
        return data[0].url;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  const updateGallery = async () => {
    galleryContainer.innerHTML = "";
    const catImages = [];

    for (let i = 0; i < 5; i++) {
      const randomBreed =
        exoticBreeds[Math.floor(Math.random() * exoticBreeds.length)];
      const imageUrl = await getCatImage(randomBreed);
      if (imageUrl) catImages.push(imageUrl);
    }

    if (catImages.length === 0) {
      galleryContainer.innerHTML = "No cats available at the moment.";
    } else {
      catImages.forEach((url) => {
        const img = document.createElement("img");
        img.src = url;
        img.alt = `Exotic Cat ${catImages.indexOf(url) + 1}`;
        galleryContainer.appendChild(img);
      });
    }

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = false;
  };

  const searchHandler = async () => {
    breed = searchInput.value.trim().toLowerCase();
    await updateGallery();
  };

  const addToFavorites = (catImageUrl) => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.includes(catImageUrl)) {
      favorites.push(catImageUrl);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert("Cat added to favorites!");
    } else {
      alert("This cat is already in your favorites.");
    }
  };

  const favoriteHandler = async () => {
    const imgElement = galleryContainer.querySelector("img");
    if (imgElement) {
      const imageUrl = imgElement.src;
      addToFavorites(imageUrl);
    } else {
      alert("No cat image to add to favorites.");
    }
  };

  nextButton.addEventListener("click", async () => {
    currentPage++;
    await updateGallery();
  });

  prevButton.addEventListener("click", async () => {
    currentPage--;
    await updateGallery();
  });

  searchInput.addEventListener("input", searchHandler);

  favoriteButton.addEventListener("click", favoriteHandler);

  const initGallery = async () => {
    await updateGallery();
  };

  initGallery();
});
