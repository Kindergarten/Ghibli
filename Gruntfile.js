module.exports = function (grunt) {
    var matchdep = require("matchdep");

    /** matchdep module goes through all tasks and initialises them so you don't have to use `grunt.loadNpmTasks` */
    matchdep = require("matchdep");

    matchdep.filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        cssmin: {
            dist: {
                src: "./login/css/style.css",
                dest: "./login/css/nasty.css"
            }
        }
    });

    grunt.registerTask("build", ["cssmin"]);
};