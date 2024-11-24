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
      console.log(`Requesting cat image from URL: ${url}`);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "x-api-key": API_KEY,
        },
      });

      if (!response.ok) {
        console.error(`Error fetching data: ${response.statusText}`);
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.length > 0) {
        return data[0].url;
      } else {
        console.error("No cat images found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching cat image:", error);
      return null;
    }
  };

  const getCatBreeds = async () => {
    const url = `https://api.thecatapi.com/v1/breeds`;
    try {
      console.log("Requesting cat breeds");
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "x-api-key": API_KEY,
        },
      });

      if (!response.ok) {
        console.error(`Error fetching data: ${response.statusText}`);
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("API Breeds Response:", data);
      return data;
    } catch (error) {
      console.error("Error fetching cat breeds:", error);
      return [];
    }
  };

  const postFavorite = async (catImage) => {
    console.log("Favorite cat added:", catImage);
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

  const favoriteHandler = async () => {
    const imageUrl = galleryContainer.querySelector("img").src;
    await postFavorite(imageUrl);
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
    await getCatBreeds();
    await updateGallery();
  };

  initGallery();
});
