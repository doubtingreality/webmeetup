// Web Component clock
//
(function () {

	// Create the custom element template
	var template = function() {
		var div = document.createElement('div');
		div.classList.add('timer');
		div.innerHTML = "";

		return div;
	};

	// Create an object based on the HTML Element prototype
	var componentProto = Object.create(HTMLElement.prototype);

	// Define the callback when element is created (called for every new clock)
	componentProto.createdCallback = function() {
		this.shadowRoot = this.createShadowRoot();

		this.shadowRoot.appendChild(template());

		this.timerDiv = this.shadowRoot.querySelector('div.timer');

		this.updateElement();

		this.updateTimer();

		if (this.showMilliseconds) {
			this.startTimer(100);
		} else {
			this.startTimer(1000);
		}
	};

	// Define custom methods for timer
	componentProto.startTimer = function(interval) {
		this.timerInterval = setInterval(this.updateTimer.bind(this), interval);
	};

	componentProto.stopTimer = function() {
		clearInterval(this.timerInterval);
	};

	componentProto.updateTimer = function() {
		this.time = new Date();
		this.timerDiv.textContent = this.time.getHours() + ':'
		+ this.time.getMinutes() + ':'
		+ this.time.getSeconds();

		if (this.showMilliseconds) {
			this.timerDiv.textContent += ':' + this.time.getMilliseconds();
		}
	};

	// Method for checking each attribute and passing it to updateAttribute
	// Easy way to do all attributes at creation of element
	componentProto.updateElement = function() {
		this.showMilliseconds = false;

		for (index in this.attributes) {
			if (this.attributes.hasOwnProperty(this.attributes[index].name)) {
				var attribute = this.attributes[index];
				this.updateAttribute(attribute.name, '', attribute.value);
			}
		}
	};

	// Define the callback for checking if the attributes have changed
	componentProto.attributeChangedCallback = function(name, oldValue, newValue) {
		this.updateAttribute(name, oldValue, newValue);
	};

	// List of accepted attributes and the functionality that is linked to them
	componentProto.updateAttribute = function(name, oldValue, newValue) {
		if (name === 'border-color') {
			this.style.borderColor = newValue;
		} else if (name === 'showmilliseconds') {
			if (newValue === null) {
				this.showMilliseconds = false;
				this.updateTimer();
				this.stopTimer();
				this.startTimer(1000);
			} else {
				this.showMilliseconds = true;
				this.updateTimer();
				this.stopTimer();
				this.startTimer(100);
			}
		}
	};

	// Register the element to the window
	window.wcClock = document.registerElement('wc-clock', {
		prototype: componentProto
	});
})();
