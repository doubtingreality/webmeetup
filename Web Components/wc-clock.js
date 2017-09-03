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

		this.startTimer();
	};

	// Define custom methods for timer
	componentProto.startTimer = function(interval) {
		if (typeof interval == 'undefined') {
			if (this.showMilliseconds) {
				interval = 17;
			} else {
				interval = 1000;
			}
		}

		this.timerInterval = setInterval(this.updateTimer.bind(this), interval);
	};

	componentProto.stopTimer = function() {
		clearInterval(this.timerInterval);
	};

	componentProto.updateTimer = function() {
		this.time = new Date();
		this.timerDiv.textContent = 
		this.leftPad('0', 2, this.time.getHours()) + ':'
		+ this.leftPad('0', 2, this.time.getMinutes()) + ':'
		+ this.leftPad('0', 2, this.time.getSeconds());

		if (this.showMilliseconds) {
			this.timerDiv.textContent += ':' + this.leftPad('0', 3, this.time.getMilliseconds());
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
				this.startTimer();
			} else {
				this.showMilliseconds = true;
				this.updateTimer();
				this.stopTimer();
				this.startTimer();
			}
		}
	};

	// Extra utility method for leftpadding numbers with zeroes
	componentProto.leftPad = function(character, length, string) {
		string = string.toString();

		if (string.length < length) {
			var safety = 50;

			while (string.length < length) {
				string = character + string;

				safety--;

				if (safety == 0) {
					console.log('break');
					break;
				}
			}
		}

		return string;
	};

	// Register the element to the window
	window.wcClock = document.registerElement('wc-clock', {
		prototype: componentProto
	});
})();
