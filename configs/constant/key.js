System.register([], function (exports_1, context_1) {
    "use strict";
    var key;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            exports_1("key", key = {
                jwt: process.env.PRIVATE_KEY,
                uri: process.env.DB_URI,
                jwtRefresh: process.env.REFRESH_KEY,
                expTime: (time) => {
                    return {
                        expiresIn: time * 60,
                    };
                },
            });
        }
    };
});
//# sourceMappingURL=key.js.map