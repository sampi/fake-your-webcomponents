(function() {
	var SIDEBAR_WIDTH = 320;

	dsp.CoolCatSpirit = ts.ui.Spirit.extend('dsp.CoolCatSpirit', {
		/**
		 * StartTime for requestAnimationFrame
		 */
		_startTime: null,

		/**
		 * CoolCat is constructed.
		 * @method onconstruct
		 */
		onconstruct: function() {
			this.super.onconstruct();
			this._model = dsp.CoolCat.$getmodel();
			this.script.load(dsp.CoolCatSpirit.edbml);
			this.script.input(this._model);
			this._model.addObserver(this);
		},

		/**
		 * CoolCat is ready and in the DOM.
		 * @method onready
		 */
		onready: function() {
			this.super.onready();
			this.event.add('click');
		},

		/**
		 * The Model has changed.
		 * @method onchange
		 */
		onchange: function(changes) {
			this.super.onchange(changes);
			changes.forEach(function(c) {
				if (c.name === 'animating') {
					this.$doAnimation(c.newValue);
				}
			}, this);
		},

		/**
		 * The data-ts.velocity HTML attribute changed.
		 * @method velocity
		 */
		velocity: function(velocity) {
			if (arguments.length) {
				this._model.velocity = velocity;
			} else {
				return this._model.velocity;
			}
		},

		/**
		 * The data-ts.animating HTML attribute changed.
		 * @method animating
		 */
		animating: function(animating) {
			if (arguments.length) {
				this._model.animating = animating;
			} else {
				return this._model.animating;
			}
		},

		/**
		 * Get or set CSS transformation coordinates.
		 * @param {gui.Position} [transform] Transform coordinates.
		 */
		transform: function(transform) {
			if (arguments.length) {
				this._model.transform = transform;
			} else {
				return this._model.transform;
			}
		},

		/**
		 * The data-ts.x HTML attribute changed.
		 * @method x
		 */
		x: function(x) {
			if (arguments.length) {
				this._model.transform = new gui.Position(x, this._model.transform.y);
			} else {
				return this._model.transform.x;
			}
		},

		/**
		 * The data-ts.y HTML attribute changed.
		 * @method y
		 */
		y: function(y) {
			if (arguments.length) {
				this._model.transform = new gui.Position(this._model.transform.x, y);
			} else {
				return this._model.transform.y;
			}
		},

		/**
		 * The data-ts.width HTML attribute changed.
		 * @method width
		 */
		width: function(width) {
			if (arguments.length) {
				this._model.width = width;
			} else {
				return this._model.width;
			}
		},

		/**
		 * The data-ts.height HTML attribute changed.
		 * @method height
		 */
		height: function(height) {
			if (arguments.length) {
				this._model.height = height;
			} else {
				return this._model.height;
			}
		},

		/**
		 * Handle DOM events
		 * @method onevent
		 */
		onevent: function(e) {
			this.super.onevent(e);
			switch (e.type) {
				case 'click':
					this.animating(!this.animating());
					break;
			}
		},

		/**
		 * Continue or start the animation
		 * @method $doAnimation
		 * @param {boolean} doStart
		 */
		$doAnimation: function(doStart) {
			if (doStart) {
				window.requestAnimationFrame(this.$animateFrame.bind(this));
			}
		},

		/**
		 * Animate the CoolCat, for each frame
		 * @method $animateFrame
		 */
		$animateFrame: function(timestamp) {
			if (!this.animating()) {
				return;
			}
			if (!this._startTime) {
				this._startTime = timestamp;
			}

			var progress = timestamp - this._startTime;

			var max = {
				x: window.innerWidth - this.width() - SIDEBAR_WIDTH,
				y: window.innerHeight - this.height()
			};
			this._model.transform = new gui.Position(
				(0.5 + 0.5 * Math.sin(progress / 10000 * this.velocity())) * max.x,
				(0.5 + 0.5 * Math.cos(progress / 10000 * this.velocity())) * max.y
			);
			this.$doAnimation(true);
		}
	});
})();
