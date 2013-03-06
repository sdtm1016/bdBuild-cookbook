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

        // since this build it intended to be utilized with properly-expressed AMD modules;
        // don't insert absolute module ids into the modules
        insertAbsMids:0
    };
})();
