import { useEffect, useState, useCallback } from "react";
import styles from "./ImageCarousel.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faExpand,
} from "@fortawesome/free-solid-svg-icons";
import AddToWishlist from "@components/common/AddToWishlist/AddToWishlist";
import { ImageCarouselProps } from "src/types";

/* Component 
ImageCarousel:
- Displays main image with prev/next navigation
- Thumbnail navigation
- Fullscreen modal view with keyboard navigation
- Optional "Add to Wishlist" button
 */
function ImageCarousel({
  images,
  isSaved = false,
  onToggleSaved,
}: ImageCarouselProps) {
  // Track current displayed image
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Track fullscreen state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Fallback for no images
  if (!images || images.length === 0) {
    return <div className={styles.modernCarousel}>No images available</div>;
  }

  /* Handlers */
  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const goToImage = useCallback((index: number) => {
    setCurrentImageIndex(index);
  }, []);

  /* Effects */
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setIsFullscreen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, nextImage, prevImage]);

  /* Render */
  return (
    <div className={styles.modernCarousel}>
      {/* Main Image + Controls */}
      <div className={styles.carouselMain}>
        <img
          src={images[currentImageIndex]}
          alt={`Property view ${currentImageIndex + 1}`}
          className={styles.carouselImage}
          loading="lazy"
        />

        {/* Navigation arrows */}
        <button
          className={`${styles.carouselControls} ${styles.carouselPrev}`}
          onClick={prevImage}
          aria-label="Previous image"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <button
          className={`${styles.carouselControls} ${styles.carouselNext}`}
          onClick={nextImage}
          aria-label="Next image"
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>

        {/* Image counter */}
        <div className={styles.imageCounter}>
          {currentImageIndex + 1} / {images.length}
        </div>

        {/* Fullscreen button */}
        <button
          className={styles.fullscreenBtn}
          onClick={() => setIsFullscreen(true)}
          aria-label="Open fullscreen"
        >
          <FontAwesomeIcon icon={faExpand} />
        </button>

        {/* Add To Wishlist */}
        {onToggleSaved && (
          <AddToWishlist isSaved={isSaved} onClick={onToggleSaved} />
        )}
      </div>

      {/* Thumbnail navigation */}
      <div className={styles.thumbnailNav}>
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`${styles.thumbnail} ${
              idx === currentImageIndex ? styles.active : ""
            }`}
            onClick={() => goToImage(idx)}
          >
            <img src={img} alt={`Thumbnail ${idx + 1}`} loading="lazy" />
          </div>
        ))}
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div
          className={styles.fullscreenModal}
          role="dialog"
          aria-label="Image fullscreen view"
          onClick={() => setIsFullscreen(false)}
        >
          <img
            src={images[currentImageIndex]}
            alt="Fullscreen"
            className={styles.fullscreenImage}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className={styles.fullscreenClose}
            onClick={() => setIsFullscreen(false)}
            aria-label="Close fullscreen"
          >
            ×
          </button>

          {/* Prev/Next in fullscreen */}
          <button
            className={`${styles.carouselControls} ${styles.carouselPrev}`}
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
          >
            ‹
          </button>
          <button
            className={`${styles.carouselControls} ${styles.carouselNext}`}
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageCarousel;
