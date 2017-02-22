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
