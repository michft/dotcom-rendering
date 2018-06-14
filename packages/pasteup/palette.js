// @flow
const palette = {
    red: {
        light: '#ff4e36',
        medium: '#c70000',
        dark: '#ad0006',
    },
    orange: {
        light: '#f5be2c',
        medium: '#ff7f0f',
        dark: '#ed6300',
    },
    blue: {
        light: '#00b2ff',
        medium: '#0084c6',
        dark: '#005689',
    },
    gold: {
        light: '#eacca0',
        medium: '#ab8958',
        dark: '#6b5840',
    },
    pink: {
        light: '#ffabdb',
        medium: '#bb3b80',
        dark: '#7d0068',
    },
    yellow: {
        medium: '#ffe500',
        dark: '#edd600',
    },
    neutral: {
        header: '#e9eff1',
        '1': '#121212',
        '2': '#333333',
        '3': '#767676',
        '4': '#999999',
        '5': '#dcdcdc',
        '6': '#ececec',
        '7': '#f6f6f6',
    },
};

export default palette;
export const pillars = {
    news: palette.red.medium,
    opinion: palette.orange.medium,
    sport: palette.blue.medium,
    culture: palette.gold.medium,
    lifestyle: palette.pink.medium,
};

export const pillarsHighlight = {
    news: '#ff4e36',
    opinion: '#ff7f0f',
    sport: '#00b2ff',
    culture: '#eacca0',
    lifestyle: '#ffabdb',    
};
