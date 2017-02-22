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
