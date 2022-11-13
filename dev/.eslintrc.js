module.exports = {
  extends: ['eslint:recommended', 'prettier'], //拡張 - ルールはeslint標準のルール prettierで整形するために最後にprettierを追加
  plugins: [],
  env: {
    browser: true, //windowやalertなどのグローバル変数が定義される
    es6: true, //ECMAScript 2015 で追加された構文や組込みオブジェクトが利用可能になる
    node: true, //node.jsの変数や構文が定義される
    jquery: true, //jqueryを利用可能にする
  },
  rules: {
    //eslintのルールを追加する
    semi: ['error', 'always'], //末尾セミコロン
    quotes: ['error', 'single'], //文字列のクォート
    'no-unused-vars': ['warn'], //varを許可しない
    'no-var': ['error'], //使われていない変数にエラーを出す
  },
  parserOptions: {
    sourceType: 'module',
  },
};
