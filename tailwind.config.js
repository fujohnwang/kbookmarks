module.exports = {
    content: ['./src/**/*.{svelte,js,ts}', './public/index.html'],
    plugins: [require("@tailwindcss/typography"), require('daisyui')],
    future: {
        purgeLayersByDefault: true,
        removeDeprecatedGapUtilities: true,
    },
    purge: {
        content: ['./src/**/*.{svelte,js,ts}', './public/index.html'],
        enabled: true
    },
};
