module.exports = function (grunt) {
    grunt.initConfig({
        ts: {
            build: {
                tsconfig: true,
            },
            options: {
                fast: 'never'
            }
        },
        clean: ["scripts/**/*.js", "*.vsix", "dist", "test"]
    });
    
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask("build", ["ts:build"]);

    grunt.registerTask("default", ["build"]);
};