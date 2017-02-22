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
