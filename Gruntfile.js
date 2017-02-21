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
					'public/tsui/dsp.CoolCat.js': getAllFiles()
				}
			}
		},
		watch: {
			edbml: {
				tasks: [
					'edbml',
					'concat:coolcat'
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
				base: './public',
				port: 42069
			}
		}
	});

	grunt.registerTask('default', [
		'edbml',
		'concat:coolcat',
		'concurrent'
	]);
};
