import vue from 'rollup-plugin-vue'
import { glob } from 'glob'
import { relative, extname } from 'path'
import { fileURLToPath } from 'url'
import ts2 from 'rollup-plugin-typescript2'
import cleaner from 'rollup-plugin-cleaner'
import postcess from 'rollup-plugin-postcss'

export default {
  input: Object.fromEntries(
    glob
      .sync('src/**/*.ts')
      .map((file) => [
        relative('src', file.slice(0, file.length - extname(file).length)),
        fileURLToPath(new URL(file, import.meta.url)),
      ]),
  ),
  output: {
    format: 'es',
    dir: 'es',
  },
  plugins: [
    cleaner({
      targets: ['./es'],
    }),
    vue(),
    ts2(),
    postcess({
      extract: true,
    }),
  ],
}
