document.addEventListener("DOMContentLoaded", function () {
    let currentPhotoIndex = 0;
    const photos = document.querySelectorAll('.photo');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    function showPhoto(index) {
        photos.forEach((photo, i) => {
            if (i === index) {
                photo.classList.add('active');
            } else {
                photo.classList.remove('active');
            }
        });
    }

    function showNextPhoto() {
        currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
        showPhoto(currentPhotoIndex);
    }

    function showPrevPhoto() {
        currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
        showPhoto(currentPhotoIndex);
    }

    prevButton.addEventListener('click', showPrevPhoto);
    nextButton.addEventListener('click', showNextPhoto);
    
    showPhoto(currentPhotoIndex);
});
