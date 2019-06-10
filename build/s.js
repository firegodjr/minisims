/*
* SJS 3.1.6
* Minimal SystemJS Build
*/
(function () {
    var hasSelf = typeof self !== 'undefined';
    var envGlobal = hasSelf ? self : global;
    var baseUrl;
    if (typeof location !== 'undefined') {
        baseUrl = location.href.split('#')[0].split('?')[0];
        var lastSepIndex = baseUrl.lastIndexOf('/');
        if (lastSepIndex !== -1)
            baseUrl = baseUrl.slice(0, lastSepIndex + 1);
    }
    var backslashRegEx = /\\/g;
    function resolveIfNotPlainOrUrl(relUrl, parentUrl) {
        if (relUrl.indexOf('\\') !== -1)
            relUrl = relUrl.replace(backslashRegEx, '/');
        // protocol-relative
        if (relUrl[0] === '/' && relUrl[1] === '/') {
            return parentUrl.slice(0, parentUrl.indexOf(':') + 1) + relUrl;
        }
        // relative-url
        else if (relUrl[0] === '.' && (relUrl[1] === '/' || relUrl[1] === '.' && (relUrl[2] === '/' || relUrl.length === 2 && (relUrl += '/')) ||
            relUrl.length === 1 && (relUrl += '/')) ||
            relUrl[0] === '/') {
            var parentProtocol = parentUrl.slice(0, parentUrl.indexOf(':') + 1);
            // Disabled, but these cases will give inconsistent results for deep backtracking
            //if (parentUrl[parentProtocol.length] !== '/')
            //  throw new Error('Cannot resolve');
            // read pathname from parent URL
            // pathname taken to be part after leading "/"
            var pathname = void 0;
            if (parentUrl[parentProtocol.length + 1] === '/') {
                // resolving to a :// so we need to read out the auth and host
                if (parentProtocol !== 'file:') {
                    pathname = parentUrl.slice(parentProtocol.length + 2);
                    pathname = pathname.slice(pathname.indexOf('/') + 1);
                }
                else {
                    pathname = parentUrl.slice(8);
                }
            }
            else {
                // resolving to :/ so pathname is the /... part
                pathname = parentUrl.slice(parentProtocol.length + (parentUrl[parentProtocol.length] === '/'));
            }
            if (relUrl[0] === '/')
                return parentUrl.slice(0, parentUrl.length - pathname.length - 1) + relUrl;
            // join together and split for removal of .. and . segments
            // looping the string instead of anything fancy for perf reasons
            // '../../../../../z' resolved to 'x/y' is just 'z'
            var segmented = pathname.slice(0, pathname.lastIndexOf('/') + 1) + relUrl;
            var output = [];
            var segmentIndex = -1;
            for (var i = 0; i < segmented.length; i++) {
                // busy reading a segment - only terminate on '/'
                if (segmentIndex !== -1) {
                    if (segmented[i] === '/') {
                        output.push(segmented.slice(segmentIndex, i + 1));
                        segmentIndex = -1;
                    }
                }
                // new segment - check if it is relative
                else if (segmented[i] === '.') {
                    // ../ segment
                    if (segmented[i + 1] === '.' && (segmented[i + 2] === '/' || i + 2 === segmented.length)) {
                        output.pop();
                        i += 2;
                    }
                    // ./ segment
                    else if (segmented[i + 1] === '/' || i + 1 === segmented.length) {
                        i += 1;
                    }
                    else {
                        // the start of a new segment as below
                        segmentIndex = i;
                    }
                }
                // it is the start of a new segment
                else {
                    segmentIndex = i;
                }
            }
            // finish reading out the last segment
            if (segmentIndex !== -1)
                output.push(segmented.slice(segmentIndex));
            return parentUrl.slice(0, parentUrl.length - pathname.length) + output.join('');
        }
    }
    /*
     * SystemJS Core
     *
     * Provides
     * - System.import
     * - System.register support for
     *     live bindings, function hoisting through circular references,
     *     reexports, dynamic import, import.meta.url, top-level await
     * - System.getRegister to get the registration
     * - Symbol.toStringTag support in Module objects
     * - Hookable System.createContext to customize import.meta
     * - System.onload(id, err?) handler for tracing / hot-reloading
     *
     * Core comes with no System.prototype.resolve or
     * System.prototype.instantiate implementations
     */
    var hasSymbol = typeof Symbol !== 'undefined';
    var toStringTag = hasSymbol && Symbol.toStringTag;
    var REGISTRY = hasSymbol ? Symbol() : '@';
    function SystemJS() {
        this[REGISTRY] = {};
    }
    var systemJSPrototype = SystemJS.prototype;
    systemJSPrototype.import = function (id, parentUrl) {
        var loader = this;
        return Promise.resolve(loader.resolve(id, parentUrl))
            .then(function (id) {
            var load = getOrCreateLoad(loader, id);
            return load.C || topLevelLoad(loader, load);
        });
    };
    // Hookable createContext function -> allowing eg custom import meta
    systemJSPrototype.createContext = function (parentId) {
        return {
            url: parentId
        };
    };
    var lastRegister;
    systemJSPrototype.register = function (deps, declare) {
        lastRegister = [deps, declare];
    };
    /*
     * getRegister provides the last anonymous System.register call
     */
    systemJSPrototype.getRegister = function () {
        var _lastRegister = lastRegister;
        lastRegister = undefined;
        return _lastRegister;
    };
    function getOrCreateLoad(loader, id, firstParentUrl) {
        var load = loader[REGISTRY][id];
        if (load)
            return load;
        var importerSetters = [];
        var ns = Object.create(null);
        if (toStringTag)
            Object.defineProperty(ns, toStringTag, { value: 'Module' });
        var instantiatePromise = Promise.resolve()
            .then(function () {
            return loader.instantiate(id, firstParentUrl);
        })
            .then(function (registration) {
            if (!registration)
                throw new Error('Module ' + id + ' did not instantiate');
            function _export(name, value) {
                // note if we have hoisted exports (including reexports)
                load.h = true;
                var changed = false;
                if (typeof name !== 'object') {
                    if (!(name in ns) || ns[name] !== value) {
                        ns[name] = value;
                        changed = true;
                    }
                }
                else {
                    for (var p in name) {
                        var value_1 = name[p];
                        if (!(p in ns) || ns[p] !== value_1) {
                            ns[p] = value_1;
                            changed = true;
                        }
                    }
                }
                if (changed)
                    for (var i = 0; i < importerSetters.length; i++)
                        importerSetters[i](ns);
                return value;
            }
            var declared = registration[1](_export, registration[1].length === 2 ? {
                import: function (importId) {
                    return loader.import(importId, id);
                },
                meta: loader.createContext(id)
            } : undefined);
            load.e = declared.execute || function () { };
            return [registration[0], declared.setters || []];
        });
        var linkPromise = instantiatePromise
            .then(function (instantiation) {
            return Promise.all(instantiation[0].map(function (dep, i) {
                var setter = instantiation[1][i];
                return Promise.resolve(loader.resolve(dep, id))
                    .then(function (depId) {
                    var depLoad = getOrCreateLoad(loader, depId, id);
                    // depLoad.I may be undefined for already-evaluated
                    return Promise.resolve(depLoad.I)
                        .then(function () {
                        if (setter) {
                            depLoad.i.push(setter);
                            // only run early setters when there are hoisted exports of that module
                            // the timing works here as pending hoisted export calls will trigger through importerSetters
                            if (depLoad.h || !depLoad.I)
                                setter(depLoad.n);
                        }
                        return depLoad;
                    });
                });
            }))
                .then(function (depLoads) {
                load.d = depLoads;
            });
        });
        linkPromise.catch(function (err) {
            load.e = null;
            load.er = err;
        });
        // Captial letter = a promise function
        return load = loader[REGISTRY][id] = {
            id: id,
            // importerSetters, the setters functions registered to this dependency
            // we retain this to add more later
            i: importerSetters,
            // module namespace object
            n: ns,
            // instantiate
            I: instantiatePromise,
            // link
            L: linkPromise,
            // whether it has hoisted exports
            h: false,
            // On instantiate completion we have populated:
            // dependency load records
            d: undefined,
            // execution function
            // set to NULL immediately after execution (or on any failure) to indicate execution has happened
            // in such a case, pC should be used, and pLo, pLi will be emptied
            e: undefined,
            // On execution we have populated:
            // the execution error if any
            er: undefined,
            // in the case of TLA, the execution promise
            E: undefined,
            // On execution, pLi, pLo, e cleared
            // Promise for top-level completion
            C: undefined
        };
    }
    function instantiateAll(loader, load, loaded) {
        if (!loaded[load.id]) {
            loaded[load.id] = true;
            // load.L may be undefined for already-instantiated
            return Promise.resolve(load.L)
                .then(function () {
                return Promise.all(load.d.map(function (dep) {
                    return instantiateAll(loader, dep, loaded);
                }));
            });
        }
    }
    function topLevelLoad(loader, load) {
        return load.C = instantiateAll(loader, load, {})
            .then(function () {
            return postOrderExec(loader, load, {});
        })
            .then(function () {
            return load.n;
        });
    }
    // the closest we can get to call(undefined)
    var nullContext = Object.freeze(Object.create(null));
    // returns a promise if and only if a top-level await subgraph
    // throws on sync errors
    function postOrderExec(loader, load, seen) {
        if (seen[load.id])
            return;
        seen[load.id] = true;
        if (!load.e) {
            if (load.er)
                throw load.er;
            if (load.E)
                return load.E;
            return;
        }
        // deps execute first, unless circular
        var depLoadPromises;
        load.d.forEach(function (depLoad) {
            {
                var depLoadPromise = postOrderExec(loader, depLoad, seen);
                if (depLoadPromise)
                    (depLoadPromises = depLoadPromises || []).push(depLoadPromise);
            }
        });
        if (depLoadPromises) {
            return Promise.all(depLoadPromises).then(doExec);
        }
        return doExec();
        function doExec() {
            try {
                var execPromise = load.e.call(nullContext);
                if (execPromise) {
                    execPromise = execPromise.then(function () {
                        load.C = load.n;
                        load.E = null;
                    });
                    return load.E = load.E || execPromise;
                }
                // (should be a promise, but a minify optimization to leave out Promise.resolve)
                load.C = load.n;
            }
            catch (err) {
                load.er = err;
                throw err;
            }
            finally {
                load.L = load.I = undefined;
                load.e = null;
            }
        }
    }
    envGlobal.System = new SystemJS();
    /*
     * Supports loading System.register via script tag injection
     */
    var err;
    if (typeof window !== 'undefined')
        window.addEventListener('error', function (e) {
            err = e.error;
        });
    var systemRegister = systemJSPrototype.register;
    systemJSPrototype.register = function (deps, declare) {
        err = undefined;
        systemRegister.call(this, deps, declare);
    };
    systemJSPrototype.instantiate = function (url, firstParentUrl) {
        var loader = this;
        return new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.charset = 'utf-8';
            script.async = true;
            script.crossOrigin = 'anonymous';
            script.addEventListener('error', function () {
                reject(new Error('Error loading ' + url + (firstParentUrl ? ' from ' + firstParentUrl : '')));
            });
            script.addEventListener('load', function () {
                document.head.removeChild(script);
                // Note URL normalization issues are going to be a careful concern here
                if (err) {
                    reject(err);
                    return err = undefined;
                }
                else {
                    resolve(loader.getRegister());
                }
            });
            script.src = url;
            document.head.appendChild(script);
        });
    };
    /*
     * Supports loading System.register in workers
     */
    if (hasSelf && typeof importScripts === 'function')
        systemJSPrototype.instantiate = function (url) {
            var loader = this;
            return new Promise(function (resolve, reject) {
                try {
                    importScripts(url);
                }
                catch (e) {
                    reject(e);
                }
                resolve(loader.getRegister());
            });
        };
    systemJSPrototype.resolve = function (id, parentUrl) {
        var resolved = resolveIfNotPlainOrUrl(id, parentUrl || baseUrl);
        if (!resolved) {
            if (id.indexOf(':') !== -1)
                return Promise.resolve(id);
            throw new Error('Cannot resolve "' + id + (parentUrl ? '" from ' + parentUrl : '"'));
        }
        return Promise.resolve(resolved);
    };
}());
