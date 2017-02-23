/**
 * CoolCat Custom Element
 */
class CoolCat extends HTMLElement {
	/**
	 * The constructor.
	 * Sets some defaults and fires up the shadowDOM
	 */
	constructor() {
		super();

		const shadowRoot = this.attachShadow({
			mode: 'open'
		});
		const t = document.querySelector('#x-cool-cat');
		const instance = t.content.cloneNode(true);
		shadowRoot.appendChild(instance);

		this.catStyle = shadowRoot.querySelector('.cool-cat').style;
	}

	/**
	 * Once we're connected, listen to clicks.
	 */
	connectedCallback() {
		this._startTime = null;

		this.width = 124;
		this.height = 124;
		this.x = 0;
		this.y = 0;
		this.addEventListener('click', this);
	}

	/**
	 * These attributes should be observed.
	 * @method observedAttributes
	 * @return {array} List of attributes to observe.
	 */
	static get observedAttributes() {
		return ['velocity', 'animating', 'x', 'y', 'width', 'height'];
	}

	/**
	 * When one of the observed attributes change, this is called.
	 */
	attributeChangedCallback(attrName, oldVal, newVal) {
		switch (attrName) {
			case 'width':
				this.catStyle.width = this.width + 'px';
				break;
			case 'height':
				this.catStyle.height = this.height + 'px';
				break;
			case 'x':
			case 'y':
				this.catStyle.transform = `translate(${this.x}px, ${this.y}px)`;
				break;
			case 'animating':
				if (this.animating) {
					window.requestAnimationFrame(this.$doAnimate.bind(this));
				}
				break;
		}
	}

	/**
	 * Handle events, only click so far.
	 */
	handleEvent(e) {
		switch (e.type) {
			case 'click':
				this.animating = !this.animating;
				break;
		}
	}

	get velocity() {
		return this.getAttribute('velocity');
	}
	set velocity(velocity = 1) {
		this.setAttribute('velocity', velocity);
	}

	get animating() {
		return this.hasAttribute('animating');
	}
	set animating(isAnimating) {
		if (isAnimating) {
			this.setAttribute('animating', '');
		} else {
			this.removeAttribute('animating');
		}
	}

	get x() {
		return this.getAttribute('x');
	}
	set x(x = 0) {
		this.setAttribute('x', x);
	}

	get y() {
		return this.getAttribute('y');
	}
	set y(y = 0) {
		this.setAttribute('y', y);
	}

	get width() {
		return this.getAttribute('width');
	}
	set width(width = 124) {
		this.setAttribute('width', width);
	}

	get height() {
		return this.getAttribute('height');
	}
	set height(height = 124) {
		this.setAttribute('height', height);
	}

	$doAnimate(timestamp) {
		if (!this.animating) {
			return;
		}
		if (!this._startTime) {
			this._startTime = timestamp;
		}

		const progress = timestamp - this._startTime;

		const max = {
			x: window.innerWidth - this.width - 320,
			y: window.innerHeight - this.height
		};
		this.x = (0.5 + 0.5 * Math.sin(progress / 10000 * this.velocity)) * max.x;
		this.y = (0.5 + 0.5 * Math.cos(progress / 10000 * this.velocity)) * max.y;
		window.requestAnimationFrame(this.$doAnimate.bind(this));
	}
}
