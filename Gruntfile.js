module.exports = function (grunt) {
    var matchdep;


    /**
     * `matchdep` - matchdep
     *
     * This module goes through all tasks and initialises them so you don't have to use `grunt.loadNpmTasks`
     */

    matchdep = require("matchdep");

    matchdep.filterDev("grunt-*").forEach(grunt.loadNpmTasks);


    grunt.initConfig({

        concat: {
            js: {
                src: [
                    "./login/js/brandview/controls/input-group.js",
                    "./login/js/brandview/base.js",
                    "./login/js/brandview/services.js",
                    "./login/js/brandview/page.js"
                ],
                dest: "./login/js/bundle.js"
            },
            modernizr: {
                src: [
                    "./bower_components/modernizr/modernizr.js",
                    "./login/js/brandview/modernizr-tests/input-properties.js"
                ],
                dest: "./login/js/libs/modernizr.js"
            }
        },


        /**
         * `cssmin` - grunt-contrib-cssmin
         *
         * This module takes the compiled SASS file (style.css) and creates new file with minified content (nasty.css).
         */

        cssmin: {
            dist: {
                src: "./login/css/style.css",
                dest: "./login/css/nasty.css"
            }
        },


        /**
         * `sass` - "grunt-sass"
         *
         * Compiles style.css into style.scss.
         */

        sass: {
            dist: {
                files: {
                    "./login/css/style.css": "./login/css/style.scss"
                }
            }
        },


        /**
         * `watch` - "grunt-contrib-watch"
         *
         * This module triggers various tasks when certain files are being edited.
         */

        watch: {
            dist: {
                files: ["./login/css/**/*.scss", "./login/js/brandview/**/*.js"],
                tasks: ["build_dev"]
            }
        }
    });


    /**
     * `build_dev`
     *
     * The purpose of this task is to compile all files but keeping them readable (not minified).
     */

    grunt.registerTask("build_dev", ["sass", "concat:js", "notify_hooks"]);

    grunt.registerTask("server", ["sass", "concat:js", "notify:server"]);


    /**
     * `build`
     *
     * This task is used to build all files for the production. This includes minification, SCSS compilation, JS
     * concat etc.
     */

    grunt.registerTask("build", ["sass", "cssmin", "concat:js", "concat:modernizr"]);
};