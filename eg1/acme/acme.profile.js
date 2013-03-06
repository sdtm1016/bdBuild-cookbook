// tell the loader where our build extensions package is located
require({
    packages:[{
        name:"acme-build-extensions",
        location:selfPath + "/../build-extensions/src"
    }]
});

// add the transform to the build control; add a job to transform "pulsar" resources
require(["build/buildControlDefault"], function(bc){
     // inform the builder where to find the new "transformPulsar" transform, and which gate to which to associate the transform...
    bc.transforms.transformPulsar = ["acme-build-extensions/pulsarTransform", "read"];

    // and a job to transform pulsar resources accordingly
    bc.transformJobs.unshift(
        // a pair of (predicate, vector of trasnforms)
        // if predicate is true, stop searching for a job for the given resource; instruct the builder to apply the transforms to the jub
        [
            function(resource, bc){
                return resource.tag.pulsar;
            },

            // treat just like an AMD resource, except with the extra transform
            ["read", "transformPulsar", "dojoPragmas", "hasFindAll", "insertSymbols", "hasFixup", "depsScan", "writeAmd", "writeOptimized"]
        ]
     );
});


var profile = (function(){
    return {
        // relative to this file
        basePath:"..",

        // relative to base path
        releaseDir:"./acme-built",

        packages:[{
            name:"acme",
            location:"./acme/src",

            // (src, dest) pairs, relative to the package (src, dest) paths
            // here we send all resources in the ../resources-outside-package-src-tree to the subtree "__PULSAR_MARKER__"
            // in the package destination tree; the pulsar transform will use this fact (see build-extensions/pulsarTransform.js)
            trees:[["../resources-outside-package-src-tree", "./__PULSAR_MARKER__"]],

            resourceTags:{
                pulsar: function(filename, mid){
                    // files with the .pulsar extension that have "/resources-outside-package-src-tree/" in their path
                    // are tagged with "pulsar"; transform jobs will use this tag to filter such resources into a special job
                    // (see transformJobs, above)
                    return /\/resources-outside-package-src-tree\/.+\.pulsar$/.test(filename);
                },

                amd: function(filename, mid){
                    return  /\.js$/.test(filename) && /^acme\//.test(mid);
                }
            }
        }],

        selectorEngine:"lite",

        defaultConfig:{
            hasCache:{
                // these are the values given above, not-built client code may test for these so they need to be available
                'dojo-built':1,
                'dojo-loader':1,

                // this is a node example; make these true for a browser example
                'dom':0,
                'host-browser':0,

                // not required for node
                //"config-selectorEngine":"lite"
            },
            async:1
        },

        dojoBootText:"require.boot && require.apply(null, require.boot);",

        // since this build it intended to be utilized with properly-expressed AMD modules;
        // don't insert absolute module ids into the modules
        insertAbsMids:0,

        // these are all the has feature that affect the loader and/or the bootstrap
        // the settings below are optimized for the smallest AMD loader that is configurable
        // and include dom-ready support
        staticHasFeatures:{
            // dojo/dojo
            'config-dojo-loader-catches':0,

            // dojo/dojo
            'config-tlmSiblingOfDojo':0,

            // dojo/dojo
            'dojo-amd-factory-scan':0,

            // dojo/dojo
            'dojo-combo-api':0,

            // dojo/_base/config, dojo/dojo
            'dojo-config-api':1,

            // dojo/main
            'dojo-config-require':0,

            // dojo/_base/kernel
            'dojo-debug-messages':0,

            // dojo/dojo
            'dojo-dom-ready-api':1,

            // dojo/main
            'dojo-firebug':0,

            // dojo/_base/kernel
            'dojo-guarantee-console':1,

            // dojo/has
            'dojo-has-api':1,

            // dojo/dojo
            'dojo-inject-api':1,

            // dojo/_base/config, dojo/_base/kernel, dojo/_base/loader, dojo/ready
            'dojo-loader':1,

            // dojo/dojo
            'dojo-log-api':0,

            // dojo/_base/kernel
            'dojo-modulePaths':0,

            // dojo/_base/kernel
            'dojo-moduleUrl':0,

            // dojo/dojo
            'dojo-publish-privates':0,

            // dojo/dojo
            'dojo-requirejs-api':0,

            // dojo/dojo
            'dojo-sniff':0,

            // dojo/dojo, dojo/i18n, dojo/ready
            'dojo-sync-loader':0,

            // dojo/dojo
            'dojo-test-sniff':0,

            // dojo/dojo
            'dojo-timeout-api':0,

            // dojo/dojo
            'dojo-trace-api':0,

            // dojo/dojo
            'dojo-undef-api':0,

            // dojo/i18n
            'dojo-v1x-i18n-Api':0,

            // dojo/_base/xhr
            'dojo-xhr-factory':0,

            // node example; therefore...
            // dojo/_base/loader, dojo/dojo, dojo/on
            'dom':0,

            // dojo/dojo
            'host-browser':1,

            // dojo/_base/array, dojo/_base/connect, dojo/_base/kernel, dojo/_base/lang
            'extend-dojo':1
        }

    };
})();
