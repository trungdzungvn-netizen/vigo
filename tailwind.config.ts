import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}'], theme: { extend: { colors: { brand: { 50:'#eef8f2',100:'#d8eee0',600:'#23764c',700:'#185c39',900:'#123d2b' } } } }, plugins: [] };
export default config;
