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
