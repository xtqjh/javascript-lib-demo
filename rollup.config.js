import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import multiEntry from 'rollup-plugin-multi-entry';
import del from 'rollup-plugin-delete';
// import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
// import copy from 'rollup-plugin-copy';

export default {
  input: 'core/**/*.js',
  output: [
    // https://rollupjs.org/configuration-options/#output-format 英文文档
    // https://www.rollupjs.com/guide/big-list-of-options#outputformat 中文文档
    {
      file: 'dist/fokUtils.cjs',
      format: 'cjs', // commonjs,适用于 Node 环境和其他打包工具
      exports: 'auto', // 解决'cjs'打包出来的不能被require的问题
      esModule: false,
      // sourcemap: true,
    },
    {
      file: 'dist/fokUtils.js',
      format: 'iife', // 立即执行函数
      name: 'fokUtils', // 指定全局变量名
      // sourcemap: true,
    },
    {
      file: 'dist/fokUtils.min.js',
      format: 'iife', // 立即执行函数
      name: 'fokUtils', // 指定全局变量名
      plugins: [
        // terser({
        //   mangle: true, // 启用变量混淆
        //   compress: {
        //     drop_console: true, // 去除console.log语句
        //   },
        // }), // 指定压缩
      ],
    },
    {
      file: 'dist/fokUtils.esm.mjs',
      format: 'esm', // esm,module,将bundle保留为ES模块文件，适用于其他打包工具以及支持 <script type=module> 标签的浏览器
    },
    {
      file: 'dist/fokUtils.umd.js',
      format: 'umd', //  通用模块定义，生成的包同时支持 amd、cjs 和 iife 三种格式
      name: 'fokUtils', // 指定全局变量名
    },
    {
      file: 'dist/fokUtils.umd.min.js',
      format: 'umd', //  通用模块定义，生成的包同时支持 amd、cjs 和 iife 三种格式
      name: 'fokUtils', // 指定全局变量名
      // plugins: [terser()], // 指定压缩
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    // terser(), // 压缩文件(配置后所有文件都压缩)
    // copy({
    //   targets: [
    //     { src: 'src/index.html', dest: 'dist' },
    //     { src: 'src/styles.css', dest: 'dist' }
    //   ]
    // }),
    // babel({
    //   exclude: /node_modules/,
    //   babelrc: false,
    //   presets: [['@babel/preset-env', { modules: false }]],
    //   extensions: ['.js']
    // }),
    babel({
      babelHelpers: 'runtime', // 使用babel-runtime作为辅助函数库
      exclude: 'node_modules/**', // 忽略node_modules目录下的文件
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            targets: {
              browsers: ['ie 8'], // ['ie 11']
            },
          },
        ], // 设置modules为false，避免babel对es6模块进行转换
      ],
      plugins: [
        '@babel/plugin-transform-runtime', // 使用babel-runtime插件，避免重复生成辅助函数
      ],
    }),
    del({
      targets: 'dist/*', // 删除 dist 目录下的所有文件和目录
    }),
    multiEntry({
      exports: true,
    }), // 将多个入口文件打包成一个输出文件，并且支持通配符匹配
  ],
};

/** 
可以和terser一起使用使代码更加简介，只用terser(新一代)也可以
import uglify from 'rollup-plugin-uglify';
uglify({
  mangle: true,
  compress: {
    pure_getters: true,
    global_defs: {
      'ngDevMode': false,
    }
  }
})

rollup-plugin-obfuscate的作用是混淆JavaScript代码，
使其难以被理解和修改。它可以通过重命名变量和函数名称，
删除注释和空格，以及其他技术来实现这一目的。
这有助于保护代码的知识产权和安全性，
防止恶意用户对其进行逆向工程或攻击。
const { obfuscate } = require('rollup-plugin-obfuscate');
obfuscate(),


将输出文件压缩为gzip格式
import gzipPlugin from "rollup-plugin-gzip";
export default [{
    plugins: [
        gzipPlugin(),
    ]
}]

 */