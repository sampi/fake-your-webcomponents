(function(window) {
	'use strict';

	window.dsp = gui.namespace('dsp');

	dsp.CoolCatModel = ts.ui.Model.extend({
	/**
	 * Item name
	 * @type {String}
	 */
		item: 'coolcat',

	/**
	 * Animation velocity.
	 * @type {number}
	 */
		velocity: 1,

	/**
	 * Are we animating?
	 * @type {Boolean}
	 */
		animating: false,

	/**
	 * Image width.
	 * @type {numbe}
	 */
		width: 337,

	/**
	 * Image height.
	 * @type {numbe}
	 */
		height: 323,

	/**
	 * Current transformation of image.
	 * @type {gui.Position}
	 */
		transform: new gui.Position(0, 0)
	});

	(function() {
	/**
	 * Data model
	 * @type {dsp.CoolCatModel}
	 */
		var model = null;

	/**
	 * CoolCat API.
	 */
		dsp.CoolCat = {
		/**
		 * Get or set velocity.
		 * @method velocity
		 * @param {number} [velocity] Animation velocity.
		 */
			velocity: init(function(velocity) {
				if (!arguments.length) {
					return model.velocity;
				} else {
					model.velocity = velocity;
				}
			}),

		/**
		 * Get or set if we're animating
		 * @method animating
		 * @param {boolean} [animating] Are we animating?
		 */
			animating: init(function(animating) {
				if (!arguments.length) {
					return model.animating;
				} else {
					model.animating = animating;
				}
			}),

		/**
		 * Get or set CSS transformation coordinates.
		 * @param {gui.Position} [transform] Transform coordinates.
		 */
			transform: init(function(transform) {
				if (!arguments.length) {
					return model.transform;
				} else {
					model.transform = transform;
				}
			}),
		// Privileged ..............................................................

		/**
		 * Get the model.
		 * @see {dsp.CoolCatSpirit#onconfigure}
		 * @type {dsp.CoolCatModel}
		 */
			$getmodel: init(function() {
				return model;
			})
		};

	/**
	 * Setup to initialize model whenever any method is called upon it.
	 * @method init
	 * @param {function} base Base function.
	 * @return {function} Applied function.
	 */
		function init(base) {
			return function() {
				model = model || new dsp.CoolCatModel();
				return base.apply(null, arguments);
			};
		};
	})();

	dsp.CoolCatSpirit = ts.ui.Spirit.extend('dsp.CoolCatSpirit', {
		_startTime: null,

		onconstruct: function() {
			ts.ui.Spirit.prototype.onconstruct.call(this);

			this._model = dsp.CoolCat.$getmodel();
			this.script.load(dsp.CoolCatSpirit.edbml);
			this.script.input(this._model);
			this._model.addObserver(this);
		},
		onready: function() {
			ts.ui.Spirit.prototype.onready.call(this);
			this.event.add('click');
		},
		onchange: function(changes) {
			ts.ui.Spirit.prototype.onchange.call(this, changes);
			changes.forEach(function(c) {
				if (c.name === 'animating') {
					this.$doAnimation(c.newValue);
				}
			}, this);
		},

		velocity: function(velocity) {
			if (arguments.length) {
				this._model.velocity = velocity;
			} else {
				return this._model.velocity;
			}
		},

		animating: function(animating) {
			if (arguments.length) {
				this._model.animating = animating;
			} else {
				return this._model.animating;
			}
		},

		transform: function(transform) {
			if (arguments.length || !(transform instanceof gui.Position)) {
				this._model.transform = transform;
			} else {
				return this._model.transform;
			}
		},

		width: function() {
			return this._model.width;
		},
		height: function() {
			return this._model.height;
		},

		onevent: function(e) {
			ts.ui.Spirit.prototype.onevent.call(this, e);
			switch (e.type) {
				case 'click':
					this.animating(!this.animating());
					break;
			}
		},

		_getTransform: function(p) {
			return 'transform: translate( ' + p.x + 'px, ' + p.y + 'px);';
		},

		$doAnimation: function(doStart) {
			if (doStart) {
				window.requestAnimationFrame(this.$animateFrame.bind(this));
			}
		},

		$animateFrame: function(timestamp) {
			if (!this.animating()) {
				return;
			}
			if (!this._startTime) {
				this._startTime = timestamp;
			}

			var progress = timestamp - this._startTime;

			var max = {
				x: window.innerWidth - this.width(),
				y: window.innerHeight - this.height()
			};
			this.transform(new gui.Position(
			(0.5 + 0.5 * Math.sin(progress / 10000 * this.velocity())) * max.x,
			(0.5 + 0.5 * Math.cos(progress / 10000 * this.velocity())) * max.y
		));
			this.$doAnimation(true);
		}
	});

// src/tsui/dsp.CoolCatSpirit.edbml
	edbml.declare('dsp.CoolCatSpirit.edbml').as(function $edbml(
/**/) {
		'use strict';
		var out = $edbml.$out,
			$att = $edbml.$att,
			coolcat = $edbml.$input(dsp.CoolCatModel);
		$att.id = 'cool-cat-' + coolcat.$instanceid;
		$att.class = 'cool-cat';
		$att.width = coolcat.width;
		$att.height = coolcat.height;
		$att.src = '../assets/retardio.png';
		$att.style = this._getTransform(coolcat.transform);
		out.html += '<img ' + $att.$('id') + ' ' + $att.$('class') + ' ' + $att.$('width') + ' ' + $att.$('height') + ' ' + $att.$('src') + ' ' + $att.$('style') + ' />';
		return out.write();
	}).withInstructions([{
		input: {
			name: 'coolcat',
			type: 'dsp.CoolCatModel'
		}
	}]);
	gui.module('cool-cat@dsp.tradeshift.com', {
		channel: [
		['cool-cat', dsp.CoolCatSpirit]
		]
	});
}(self));
