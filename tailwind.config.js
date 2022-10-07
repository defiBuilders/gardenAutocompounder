/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors')

module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    darkMode: 'class',
    theme: {
        colors: {
            black: colors.black,
            white: colors.white,
            gray: colors.gray,
            emerald: colors.emerald,

            indigo: colors.indigo,
            yellow: colors.yellow,

            green: 'rgb(2, 156, 76)',
            red: colors.red,
            dark: '#0E141B',
            darkPrimary: '#2B4554',
            blue: 'rgb(0, 183, 235)',
        },
    },
    plugins: [require('tailwindcss'), require('autoprefixer')],
    variants: {
        extend: {
            //Disables following CSS properties when the property disbaled is active.
            backgroundColor: ['disabled'],
            textColor: ['disabled'],
        },
    },
}
