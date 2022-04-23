import { useState, useEffect } from "react";

import "pace-js/themes/blue/pace-theme-minimal.css";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/global.css";

import config from "../config";

export default function Render({ Component, pageProps }) {
    useEffect(() => {
        import("jquery/src/jquery.js");
        import("pace-js/pace.min.js");
        import("bootstrap/dist/js/bootstrap");
        import("aos/dist/aos.js");
        import("smooth-scroll/dist/smooth-scroll.polyfills.js");
        import("../public/js/handle");
    }, []);

    return <Component {...pageProps} />;
}
