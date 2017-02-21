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
	velocity: null,

	/**
	 * Are we animating?
	 * @type {Boolean}
	 */
	animating: false,

	/**
	 * Image width.
	 * @type {numbe}
	 */
	width: null,

	/**
	 * Image height.
	 * @type {numbe}
	 */
	height: null,

	/**
	 * Current transformation of image.
	 * @type {gui.Position}
	 */
	transform: null,

	/**
	 * Constructor to set some defaults.
	 * @method onconstruct
	 */
	onconstruct: function() {
		ts.ui.Model.prototype.onconstruct.call(this);
		this.velocity = this.velocity || 1;
		this.animating = this.animating || false;
		this.width = this.width || 337;
		this.height = this.height || 323;
		this.transform = this.transform || new gui.Position(0, 0);
	},

	/**
	 * Let's render the cool cat!
	 * @method render
	 * @return {[type]} [description]
	 */
	render: function() {
		console.log(dsp.CoolCat.edbml(this));
		console.log(typeof dsp.CoolCat.edbml(this));
		return dsp.CoolCat.edbml(this);
	}
});

/**
 * CoolCat API.
 */
dsp.CoolCat = {
	/**
	 * Get or set velocity.
	 * @method velocity
	 * @param {number} [velocity] Animation velocity.
	 * @return {dsp.CoolCat}
	 */
	velocity: (velocity) => {},

	/**
	 * Get or set if we're animating
	 * @method animating
	 * @param {boolean} [animating] Are we animating
	 * @return {dsp.CoolCat}
	 */
	animating: (animating) => {},
	toString: () => '[object dsp.CoolCat]'
};

// Implementation ..............................................................

/**
 * @using {gui.Combo#chained} chained
 * @using {ts.ui.Greenfield#api} api
 * @using {gui.Arguments#confirmed} confirmed
 */
/**
 * Actual implementation of the CoolCat API.
 * @param {gui.Combo.chained} chained
 * @param {gui.Arguments.confirmed} confirmed
 */
(function using(chained, confirmed) {
	/**
	 * Data model
	 * @type {dsp.CoolCatModel}
	 */
	let model = null;

	/**
	 * Setup to initialize model whenever any method is called upon it.
	 * @method init
	 * @param {function} base Base function.
	 * @return {function} Applied function.
	 */
	const init = function(base) {
		return function() {
			model = model || new dsp.CoolCatModel();
			return base.apply(null, arguments);
		};
	};

	gui.Object.extend(dsp.CoolCat, {
		/**
		 * Get or set velocity.
		 * @method velocity
		 * @param {number} [velocity] Animation velocity.
		 * @return {dsp.CoolCat}
		 */
		velocity: chained(confirmed('(number)')(
			init((velocity) => {
				if (!arguments.length) {
					return model.velocity;
				} else {
					model.velocity = velocity;
				}
			})
		)),

		/**
		 * Get or set if we're animating.
		 * @method animating
		 * @param {boolean} [animating] Are we animating.
		 * @return {dsp.CoolCat}
		 */
		animating: chained(confirmed('(boolean)')(
			init((animating) => {
				if (!arguments.length) {
					return model.animating;
				} else {
					model.animating = animating;
				}
			})
		)),

		/**
		 * Get or set CSS transformation coordinates.
		 * @param {gui.Position} [transform] Transform coordinates.
		 * @return {dsp.CoolCat}
		 */
		transform: chained(confirmed('(gui.Position)')(
			init((transform) => {
				if (!arguments.length) {
					return model.transform;
				} else {
					model.transform = transform;
				}
			})
		)),

		// Privileged ..............................................................
		/**
		 * Get the model.
		 * @see {dsp.CoolCatSpirit#onconfigure}
		 * @type {dsp.CoolCatModel}
		 */
		$getmodel: init(function() {
			return model;
		})
	});
})(
	gui.Combo.chained,
	gui.Arguments.confirmed
);

dsp.CoolCatSpirit = (function using(chained, confirmed) {
	return ts.ui.Spirit.extend('dsp.CoolCatSpirit', {
		_startTime: null,

		onconstruct: function() {
			ts.ui.Spirit.prototype.onconstruct.call(this);
			console.log('onconstruct');

			this._model = dsp.CoolCat.$getmodel();
			this.script.load(dsp.CoolCatSpirit.edbml);
			this.script.input(this._model);
			this._model.addObserver(this);
		},
		// onconfigure: function() {
		// 	ts.ui.Spirit.prototype.onconfigure.call(this);
		// 	console.log('onconfigure');
		// },
		// onenter: function() {
		// 	ts.ui.Spirit.prototype.onenter.call(this);
		// 	console.log('onenter');
		// },
		// onattach: function() {
		// 	ts.ui.Spirit.prototype.onattach.call(this);
		// 	console.log('onattach');
		// },
		onready: function() {
			ts.ui.Spirit.prototype.onready.call(this);
			console.log('onready');
			this.event.add('click');
		},
		onasync: function() {
			ts.ui.Spirit.prototype.onasync.call(this);
			console.log('onasync');
		},
		// ondetach: function() {
		// 	ts.ui.Spirit.prototype.ondetach.call(this);
		// 	console.log('ondetach');
		// },
		ondestruct: function() {
			ts.ui.Spirit.prototype.ondestruct.call(this);
			console.log('ondestruct');
			this.event.remove('click');
			this.model().removeObserver(this);
		},

		// onrender: function() {
		// 	ts.ui.Spirit.prototype.onrender.call(this);
		// 	console.log('onrender');
		// },
		onchange: function(changes) {
			ts.ui.Spirit.prototype.onchange.call(this, changes);
			changes.forEach(function(c) {
				switch (c.name) {
					case 'animating':
						this.$doAnimation(c.newValue);
						break;
					case 'velocity':
						this.velocity(c.newValue);
						break;
				}
			}, this);
		},

		velocity: confirmed('(number)')(
			chained(function(opt_number) {
				if (arguments.length) {
					this._model.velocity = opt_number;
				} else {
					return this._model.velocity;
				}
			})
		),

		animating: confirmed('(boolean)')(
			chained(function(opt_bool) {
				if (arguments.length) {
					this._model.animating = opt_bool;
				} else {
					return this._model.animating;
				}
			})
		),

		transform: confirmed('(object)')(
			chained(function(opt_pos) {
				if (arguments.length || !(opt_pos instanceof gui.Position)) {
					this._model.transform = opt_pos;
				} else {
					return this._model.transform;
				}
			})
		),

		width: chained(function() {
			return this._model.width;
		}),
		height: chained(function() {
			return this._model.height;
		}),

		onevent: function(e) {
			ts.ui.Spirit.prototype.onevent.call(this, e);
			switch (e.type) {
				case 'click':
					this.animating(!this.animating());
					break;
			}
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

			const progress = timestamp - this._startTime;

			const max = {
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
})(
	gui.Combo.chained,
	gui.Arguments.confirmed
);

// src/tsui/dsp.CoolCatSpirit.edbml
edbml.declare("dsp.CoolCatSpirit.edbml").as(function $edbml(
/**/){
  'use strict';
  var out = $edbml.$out,
    $att = $edbml.$att,
    coolcat = $edbml.$input(dsp.CoolCatModel);
  $att['id'] = 'cool-cat-' + coolcat.$instanceid;
  $att['class'] = 'cool-cat';
  $att['width'] = coolcat.width;
  $att['height'] = coolcat.height;
  $att['src'] = '/assets/retardio.png';
  $att['style'] = getTransform(coolcat.transform);
  function getTransform(pos) {
    return 'transform: translate(' + pos.x + 'px,' + pos.y + 'px' + ');';
  }
  out.html += '<img ' + $att.$('id') + ' ' + $att.$('class') + ' ' + $att.$('width') + ' ' + $att.$('height') + ' ' + $att.$('src') + ' ' + $att.$('style') + ' />';
  return out.write();
}).withInstructions([{
    input : {
      name : "coolcat",
      type : "dsp.CoolCatModel"
    }
  }]);
gui.module('coolcat@dsp.tradeshift.com', {
	channels: [
		['[is=coolcat]', dsp.CoolCatSpirit]
	]
});
