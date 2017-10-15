// Web Component Gallery
// This component puts images in a nice grid
// Clicking on an image shows it in a lightbox

// Wrap everything in parenthesis and an anonymous function to
// disallow user manipulation of variables
(function() {
	// Use strict mode for writing safer code
	'use strict';

	// Create the custom element template
	let template = () => {
		let div = document.createElement('div');
		div.classList.add('gallery');
		div.innerHTML = `<div class="gallery__images"></div>
		<div class="gallery__lightbox"><img></div>`;

		return div;
	};

	// Style function to create <style> tag with component styles in it
	let style = () => {
		let style = document.createElement('style');
		style.textContent = `
		.gallery {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-wrap: wrap;
			padding-left: 0;
			margin-bottom: 5rem;
		}

		.gallery__images {
			max-width: 49rem;
		}

		.gallery__image {
			display: inline-block;
			vertical-align: top;
			width: 15rem;
			height: 15rem;
			border-radius: 5px;
			background-color: #f0f0f0;
			background-size: cover;
			background-position: center;
			margin: 1rem 0 0 1rem;
			cursor: pointer;
		}

		.gallery__image:hover {
			filter: brightness(.75);
		}

		.gallery__lightbox {
			position: fixed;
			display: flex;
			align-items: center;
			justify-content: center;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, .65);
			visibility: hidden;
			opacity: 0;
			transform: translate3D(0,0,0);
			transition: visibility 300ms, opacity 300ms;
		}

		.gallery__lightbox.is-visible {
			z-index: 10;
			visibility: visible;
			opacity: 1;
		}

		.gallery__lightbox img {
			transform: scale(.85);
			opacity: 0;
			transition: transform 300ms, opacity 300ms;
			transition-delay: 200ms;
			max-height: calc(100% - 4rem);
			max-width: calc(100% - 4rem);
		}

		.gallery__lightbox.is-visible img {
			opacity: 1;
			transform: scale(1);
		}

		@media screen and (max-width: 49rem) {
			.gallery__images {
				display: flex;
				flex-wrap: wrap;
				align-items: space-between;
				justify-content: space-between;
				max-width: 100%;
				padding: 1rem 1rem 0 1rem;
			}

			.gallery__image {
				margin: 0 0 1rem 0;
				max-width: calc(33vw - 1.34rem);
				max-height: calc(33vw - 1.34rem);
			}
		}
		`;

		return style;
	};

	// Create an object based on the HTML Element prototype
	let componentProto = Object.create(HTMLElement.prototype);

	// Define the 'createdCallback' method of the component
	componentProto.createdCallback = function() {
		this.attachShadow({
			mode: 'open'
		});

		// Append the style tag and template HTML to shadowRoot
		this.shadowRoot.appendChild(style());
		this.shadowRoot.appendChild(template());

		// Pre-select the elements needed for later
		this.gallery = this.shadowRoot.querySelector('.gallery');
		this.galleryImages = this.gallery.querySelector('.gallery__images');
		this.lightbox = this.gallery.querySelector('.gallery__lightbox');
		this.lightboxImage = this.lightbox.querySelector('img');

		// Loop through each img tag that's found in the component
		this.querySelectorAll('img').forEach(imgElement => {
			// Create a new div element for each img
			const imgWrapper = document.createElement('div');
			imgWrapper.classList.add('gallery__image');

			// Apply the img src to the background of the div
			imgWrapper.style.backgroundImage = `url('${imgElement.src}')`;

			// Add the eventListener for click on the image element
			imgWrapper.addEventListener('click',
				this.imageClickHandler.bind(this, imgElement));

			// Append the new div to the images div
			this.galleryImages.appendChild(imgWrapper);
		});

		// Add the eventListener for click on
		// the lightbox element (close the lightbox)
		this.lightbox.addEventListener('click',
			this.lightboxClickHandler.bind(this));
	};

	// Define the handler for clicking on an image
	componentProto.imageClickHandler = function(image, event) {
		this.lightbox.classList.add('is-visible');

		const imageSrc = image.src;
		// Force img element to remove previous image
		this.lightboxImage.src = '';
		this.lightboxImage.src = imageSrc;
	};

	// Define the handler for clicking on the lightbox
	componentProto.lightboxClickHandler = function(event) {
		this.lightbox.classList.remove('is-visible');
	};

	// Register the element in the document and window
	window.wcGallery = document.registerElement('wc-gallery', {
		prototype: componentProto
	});
})();
