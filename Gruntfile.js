module.exports = function(grunt) {
	'use strict';

	require('load-grunt-tasks')(grunt);

	grunt.file.defaultEncoding = 'utf8';

	const getAllFiles = () => [
		'src/tsui/dsp.js',
		'src/tsui/dsp.CoolCatModel.js',
		'src/tsui/dsp.CoolCat.js',
		'src/tsui/dsp.CoolCatSpirit.js',
		'temp/dsp.CoolCatSpirit.edbml.js',
		'src/tsui/module.js'
	];

	grunt.initConfig({
		edbml: {
			outline: {
				options: {},
				files: {
					'temp/dsp.CoolCatSpirit.edbml.js': ['src/tsui/dsp.CoolCatSpirit.edbml']
				}
			}
		},
		concat: {
			coolcat: {
				options: [],
				files: {
					'temp/dsp.CoolCat.js': getAllFiles(),
					'temp/build.json': ['src/tsui/build.json']
				}
			}
		},
		guibundles: {
			spiritualgui: {
				options: {
					min: false
				},
				files: {
					'docs/tsui/dsp.CoolCat.js': ['temp/build.json']
				}
			}
		},
		comments: {
			js: {
				options: {
					singleline: true,
					multiline: true
				},
				src: ['docs/tsui/dsp.CoolCat.js']
			}
		},
		exec: {
			eslint: 'npm run lint'
		},
		watch: {
			edbml: {
				tasks: [
					'exec:eslint',
					'edbml',
					'concat:coolcat',
					'guibundles',
					'comments:js'
				],
				files: getAllFiles(),
				options: {
					interval: 5000
				}
			}
		},
		concurrent: {
			serve_and_watch: ['devserver', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		},
		devserver: {
			server: {},
			options: {
				base: './docs',
				port: 42069
			}
		}
	});

	grunt.registerTask('default', [
		'edbml',
		'concat:coolcat',
		'guibundles',
		'comments:js',
		'exec:eslint',
		'concurrent'
	]);
};
