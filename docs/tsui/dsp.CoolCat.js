(function(window) {
	'use strict';

	window.dsp = gui.namespace('dsp');

	dsp.CoolCatModel = ts.ui.Model.extend({
		item: 'coolcat',
		velocity: 1,
		animating: false,
		width: 337,
		height: 323,
		transform: new gui.Position(0, 0)
	});

	(function() {
		var model = null;
		dsp.CoolCat = {
			velocity: init(function(velocity) {
				if (!arguments.length) {
					return model.velocity;
				} else {
					model.velocity = velocity;
				}
			}),
			animating: init(function(animating) {
				if (!arguments.length) {
					return model.animating;
				} else {
					model.animating = animating;
				}
			}),
			transform: init(function(transform) {
				if (!arguments.length) {
					return model.transform;
				} else {
					model.transform = transform;
				}
			}),
			$getmodel: init(function() {
				return model;
			})
		};
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
		x: function(x) {
			if (arguments.length) {
				this._model.transform = new gui.Position(x, this._model.transform.y);
			} else {
				return this._model.transform.x;
			}
		},
		y: function(y) {
			if (arguments.length) {
				this._model.transform = new gui.Position(this._model.transform.x, y);
			} else {
				return this._model.transform.y;
			}
		},
		width: function(width) {
			if (arguments.length) {
				this._model.width = width;
			} else {
				return this._model.width;
			}
		},
		height: function(height) {
			if (arguments.length) {
				this._model.width = height;
			} else {
				return this._model.height;
			}
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
			this._model.transform = new gui.Position(
			(0.5 + 0.5 * Math.sin(progress / 10000 * this.velocity())) * max.x,
			(0.5 + 0.5 * Math.cos(progress / 10000 * this.velocity())) * max.y
		);
			this.$doAnimation(true);
		}
	});
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
