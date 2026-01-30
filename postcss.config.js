import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import pxtorem from 'postcss-pxtorem';

export default {
  plugins: [
    tailwindcss,
    autoprefixer,
    cssnano({
      preset: 'default',
    }),
    pxtorem({
      rootValue: 16,
      propList: ['*'],
      selectorBlackList: [/^html$/] // often needed to avoid double scaling on root
    }),
  ],
};
