import { useEffect, useRef, useState } from "react";
import "./ImageCarousel.css";

const imageBaseUrl = "https://image.tmdb.org/t/p/w1280";
const originalImageBaseUrl = "https://image.tmdb.org/t/p/original";

function ImageCarousel({ images = [], title = "Movie" }) {
	const [activeIndex, setActiveIndex] = useState(0);
	const [isHovered, setIsHovered] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const thumbnailRefs = useRef([]);
	const validImages = images.filter((image) => image.file_path);
	const normalizedIndex = validImages.length ? activeIndex % validImages.length : 0;

	useEffect(() => {
		if (validImages.length < 2 || isHovered || isFocused) {
			return;
		}

		const intervalId = window.setInterval(() => {
			setActiveIndex((index) => (index + 1) % validImages.length);
		}, 5000);

		return () => window.clearInterval(intervalId);
	}, [isFocused, isHovered, validImages.length]);

	if (validImages.length === 0) {
		return null;
	}

	const activeImage = validImages[normalizedIndex];
	const showPrevious = () => {
		const previousIndex = (normalizedIndex - 1 + validImages.length) % validImages.length;
		setActiveIndex(previousIndex);
		thumbnailRefs.current[previousIndex]?.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
			inline: "center",
		});
	};
	const showNext = () => {
		const nextIndex = (normalizedIndex + 1) % validImages.length;
		setActiveIndex(nextIndex);
		thumbnailRefs.current[nextIndex]?.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
			inline: "center",
		});
	};

	return (
		<section
			className="image-carousel"
			aria-label={`${title} images`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onFocusCapture={() => setIsFocused(true)}
			onBlurCapture={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget)) {
					setIsFocused(false);
				}
			}}
		>
			<div
				className="image-carousel-viewer"
				style={{
					aspectRatio:
						activeImage.aspect_ratio > 0
							? activeImage.aspect_ratio
							: "16 / 9",
				}}
			>
				<a
					className="image-carousel-open-image"
					href={`${originalImageBaseUrl}${activeImage.file_path}`}
					target="_blank"
					rel="noreferrer"
					aria-label={`Open full-size ${title} still in a new tab`}
				>
					<img
						className="image-carousel-image"
						src={`${imageBaseUrl}${activeImage.file_path}`}
						alt={`${title} still ${normalizedIndex + 1} of ${validImages.length}`}
					/>
				</a>
				{validImages.length > 1 && (
					<>
						<button
							className="image-carousel-control image-carousel-previous"
							type="button"
							onClick={showPrevious}
							aria-label="Show previous image"
						>
							&#8249;
						</button>
						<button
							className="image-carousel-control image-carousel-next"
							type="button"
							onClick={showNext}
							aria-label="Show next image"
						>
							&#8250;
						</button>
						<p className="image-carousel-count" aria-live="polite">
							{normalizedIndex + 1} / {validImages.length}
						</p>
					</>
				)}
			</div>
			{validImages.length > 1 && (
				<div className="image-carousel-thumbnails" role="group" aria-label="Choose an image">
					{validImages.map((image, index) => (
						<button
							key={`${image.file_path}-${index}`}
							ref={(element) => {
								thumbnailRefs.current[index] = element;
							}}
							className={`image-carousel-thumbnail${index === normalizedIndex ? " is-active" : ""}`}
							type="button"
							onClick={() => setActiveIndex(index)}
							aria-label={`Show image ${index + 1} of ${validImages.length}`}
							aria-pressed={index === normalizedIndex}
						>
							<img src={`${imageBaseUrl}${image.file_path}`} alt="" loading="lazy" />
						</button>
					))}
				</div>
			)}
		</section>
	);
}

export default ImageCarousel;
