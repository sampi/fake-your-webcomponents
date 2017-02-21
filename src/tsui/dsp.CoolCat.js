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
		transform: chained(confirmed('(object)')(
			init((transform) => {
				if (!arguments.length || !(transform instanceof gui.Position)) {
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
