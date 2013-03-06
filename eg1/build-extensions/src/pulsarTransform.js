define(["build/buildControl"], function(bc) {
    var acmePackageInfo = 0;
    return function(resource) {
        // the goal of this transform is to change some text in the module resource and then process it just as if
        // it is a normal AMD module that originated in the package tree of amd modules

        // change some text...
        resource.text = resource.text.replace(/replaceMe/, "here is a string value set during the build");

        // now, twiddle the resource to make it look like it came from the acme package tree all along
        if(!acmePackageInfo){
            acmePackageInfo = bc.getSrcModuleInfo("acme/__FAKE_MODULE__");
            // acme path is the fully resolved acme directory; we deduce it from the source location of a fake module
            // this way there are never hard paths encoded in our transform
            acmePath = acmePackageInfo.url.match(/(.+)\/src\/__FAKE_MODULE__/)[1]
        }

        // figure out the intended AMD module identifier...
        mid = resource.dest.match(/.+\/__PULSAR_MARKER__\/(.+)\.pulsar/)[1];

        // we're not going to write the file as a .pulsar file; therefore inform the build control catalog as such
        delete bc.resourcesByDest[resource.dest];

        // now twiddle the resource to make it a normal AMD resource
        var moduleInfo = bc.getSrcModuleInfo("acme/" + mid);
        resource.dest = bc.getDestModuleInfo(moduleInfo.mid).url;
        resource.pid = moduleInfo.pid;
        resource.mid = moduleInfo.mid;
        resource.pack = moduleInfo.pack;
        resource.deps = [];
        resource.tag.amd = 1;

        // inform the build control catalog as such
        bc.resourcesByDest[resource.dest] = resource;
        bc.amdResources[resource.mid] = resource;
    }
});
