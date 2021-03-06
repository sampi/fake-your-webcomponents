dsp.CoolCatModel = ts.ui.Model.extend({
	/**
	 * Item name
	 * @type {string}
	 */
	item: 'coolcat',

	/**
	 * Animation velocity.
	 * @type {number}
	 */
	velocity: 1,

	/**
	 * Are we animating?
	 * @type {boolean}
	 */
	animating: false,

	/**
	 * Image width.
	 * @type {number}
	 */
	width: 115,

	/**
	 * Image height.
	 * @type {number}
	 */
	height: 115,

	/**
	 * Current transformation of image.
	 * @type {gui.Position}
	 */
	transform: new gui.Position(0, 0)
});
