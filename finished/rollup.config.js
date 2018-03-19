import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';

export default {
    entry: './src/js/app.js',
    sourceMap: 'inline' ,
    output: {
        file: './build/js/app.js',
        format: 'iife'
    },
    plugins: [
        resolve({
            jsnext: true,
            main: true,
            browser: true
        }),
        commonjs(),
        babel({
            exclude: 'node_modules/**',
            babelrc: false,
            presets: [
                ["env", {
                    "modules": false,
                    "targets": {
                        "browsers": ["last 2 versions", "safari >= 7", "ie >= 11"]
                    }
                }],
            ],
            plugins: [
                'external-helpers'
            ],
        }),
        replace({
            ENV: JSON.stringify(process.env.NODE_ENV || 'development')
        })
    ]
};