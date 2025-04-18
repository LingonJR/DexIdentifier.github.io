fetch("../assets/jsons/Ballsdex.json")
    .then((response) => response.json())
    .then((data) => {
        const ballsList = document.getElementById("balls-list");
        const loading = document.getElementById("loading");
        const loadingProgress = document.getElementById("loading-progress");
        const sortOptions = document.getElementById("sort-options");
        const imagePromises = [];
        const totalImages = Object.keys(data).length;
        let loadedImages = 0;

        let ballsData = Object.entries(data);

        function renderBalls() {
            ballsList.innerHTML = "";
            ballsData.forEach(([name, details]) => {
                const ballDiv = document.createElement("div");
                ballDiv.className = "ball-container";

                const nameElement = document.createElement("h2");
                nameElement.textContent = name;
                ballDiv.appendChild(nameElement);

                const imgElement = document.createElement("img");
                imgElement.src = `../assets/BallsdexCompressed/${name}.webp`;
                imgElement.alt = name;

                const imgPromise = new Promise((resolve, reject) => {
                    imgElement.onload = () => {
                        loadedImages++;
                        const progress = Math.round((loadedImages / totalImages) * 100);
                        loadingProgress.textContent = `${progress}%`;
                        resolve();
                    };
                    imgElement.onerror = reject;
                });
                imagePromises.push(imgPromise);

                ballDiv.appendChild(imgElement);

                const detailsElement = document.createElement("p");
                detailsElement.textContent = `Rarity: #${details.rarity} | Artist: ${details.artist}`;
                ballDiv.appendChild(detailsElement);

                ballDiv.addEventListener("click", () => {
                    checkArtsExist(name);
                });

                ballsList.appendChild(ballDiv);
            });
        }

        sortOptions.addEventListener("change", () => {
            const sortBy = sortOptions.value;
            if (sortBy === "rarity") {
                ballsData.sort((a, b) => a[1].rarity - b[1].rarity);
            } else if (sortBy === "alphabetically") {
                ballsData.sort((a, b) => a[0].localeCompare(b[0]));
            }
            renderBalls();
        });

        Promise.all(imagePromises)
            .then(() => {
                loading.style.display = "none";
                ballsList.style.display = "flex";
                renderBalls();
            })
            .catch((error) => console.error("Error loading images:", error));
    })
    .catch((error) => console.error("Error loading Ballsdex.json:", error));

function checkArtsExist(ballName) {
    fetch("../assets/bd-previous-arts/arts.json")
        .then((response) => response.json())
        .then((artsData) => {
            if (artsData[ballName]) {
                showPopup(ballName, artsData[ballName]);
            } else {
                showNotification();
            }
        })
        .catch((error) => console.error("Error loading arts.json:", error));
}

function showPopup(ballName, arts) {
    const popup = document.getElementById("popup");
    const popupHeader = document.getElementById("popup-header");
    const popupContent = document.getElementById("popup-content");
    const overlay = document.getElementById("overlay");

    popupContent.innerHTML = "";
    popupHeader.textContent = `Previous Arts for ${ballName}`;

    arts.forEach((art) => {
        const artContainer = document.createElement("div");
        artContainer.className = "popup-art-container";

        const artImage = document.createElement("img");
        artImage.src = `../assets/bd-previous-arts/${ballName}/${art.file}`;
        artImage.alt = `${ballName} art`;
        artImage.loading = "lazy";

        const artistInfo = document.createElement("p");
        artistInfo.textContent = `Artist: ${art.artist}`;

        const untilInfo = document.createElement("p");
        untilInfo.textContent = `Until: ${art.until}`;

        artContainer.appendChild(artImage);
        artContainer.appendChild(artistInfo);
        artContainer.appendChild(untilInfo);
        popupContent.appendChild(artContainer);
    });

    overlay.style.display = "block";
    popup.style.display = "block";
}

document.getElementById("popup-close").addEventListener("click", () => {
    document.getElementById("popup").style.display = "none";
    document.getElementById("overlay").style.display = "none";
});

function showNotification() {
    const notification = document.getElementById("notification");
    notification.classList.add("show");
    setTimeout(() => {
        notification.classList.remove("show");
    }, 1800);
}
