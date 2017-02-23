module.exports = function(grunt) {
	'use strict';

	/**
	 * All tasks required to build generated sources
	 */
	var buildTasks = [
		'edbml',
		'concat:coolcat',
		'guibundles',
		'comments:js',
		'exec:eslint'
	];

	// Load all grunt tasks needed
	require('load-grunt-tasks')(grunt);

	grunt.file.defaultEncoding = 'utf8';

	grunt.initConfig({
		/**
		 * Parse TSML/EDBML to JS
		 * @see https://www.npmjs.com/package/grunt-spiritual-edbml
		 */
		edbml: {
			outline: {
				options: {},
				files: {
					'temp/dsp.CoolCatSpirit.edbml.js': ['src/tsui/dsp.CoolCatSpirit.edbml']
				}
			}
		},
		/**
		 * Concatenate all files in the correct order
		 * @see https://www.npmjs.com/package/grunt-contrib-concat
		 */
		concat: {
			coolcat: {
				options: [],
				files: {
					'temp/dsp.CoolCat.js': [
						'src/tsui/dsp.js',
						'src/tsui/dsp.CoolCatModel.js',
						'src/tsui/dsp.CoolCat.js',
						'src/tsui/dsp.CoolCatSpirit.js',
						'temp/dsp.CoolCatSpirit.edbml.js',
						'src/tsui/module.js'
					],
					// This is just a copy operation, this file is used by the next step
					'temp/build.json': ['src/tsui/build.json']
				}
			}
		},
		/**
		 * Convert `this.super.xxx()` to `SuperClass.prototype.xxx.call(this);`
		 * @see https://www.npmjs.com/package/grunt-spiritual-build
		 */
		guibundles: {
			spiritualgui: {
				options: {
					min: false
				},
				files: {
					'docs/tsui/dsp.CoolCat.min.js': ['temp/build.json']
				}
			}
		},
		/**
		 * Strip comments from the generated file
		 * @see https://www.npmjs.com/package/grunt-stripcomments
		 */
		comments: {
			js: {
				options: {
					singleline: true,
					multiline: true
				},
				src: ['docs/tsui/dsp.CoolCat.min.js']
			}
		},
		/**
		 * Run ESLint
		 * @see https://www.npmjs.com/package/grunt-exec
		 * @see https://www.npmjs.com/package/eslint-config-tradeshift
		 *
		 */
		exec: {
			eslint: 'npm run lint'
		},
		/**
		 * Watch for file changes and regenerate everything
		 * @see https://www.npmjs.com/package/grunt-contrib-watch
		 */
		watch: {
			edbml: {
				tasks: buildTasks,
				files: 'src/tsui/*',
				options: {
					interval: 5000
				}
			}
		},
		/**
		 * HTTP server without caching
		 * @see https://www.npmjs.com/package/grunt-devserver
		 */
		devserver: {
			server: {},
			options: {
				base: './docs',
				port: 42069
			}
		},
		/**
		 * Start the HTTP server and the watch at the same time
		 * @see https://www.npmjs.com/package/grunt-concurrent
		 */
		concurrent: {
			serve_and_watch: ['devserver', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		}
	});

	/**
	 * Build all files and watch for changes
	 */
	grunt.registerTask('default', buildTasks.concat(['concurrent']));

	/**
	 * Build files and exit
	 */
	grunt.registerTask('dist', buildTasks);
};
