/**
 * 公共配置文件
 * 存放项目中重复使用的配置数据
 */

// 存档位默认配置
export const DEFAULT_SAVE_SLOTS = [
    { id: 1, text: "空", progress: 1 },
    { id: 2, text: "空", progress: 1 },
    { id: 3, text: "空", progress: 1 },
    { id: 4, text: "空", progress: 1 },
    { id: 5, text: "空", progress: 1 }
];

// 最大存档位数量
export const MAX_SAVE_SLOTS = 30;

// 设置项配置
export const SETTINGS_CONFIG = [
    { key: 'textSpeedSetting', prop: 'textSpeed', type: 'number' },
    { key: 'fontSizeSetting', prop: 'fontSize', type: 'number' },
    { key: 'autoPlayDelaySetting', prop: 'autoPlayDelay', type: 'number' },
    { key: 'bgScrollSpeedSetting', prop: 'bgScrollSpeed', type: 'number' },
    { key: 'characterNameFontSizeSetting', prop: 'characterNameFontSize', type: 'number' },
    { key: 'screenAlwaysOnSetting', prop: 'screenAlwaysOn', type: 'boolean' },
    { key: 'boldTextSetting', prop: 'boldText', type: 'boolean' },
    { key: 'skipOnlyReadSetting', prop: 'skipOnlyRead', type: 'boolean' },
    { key: 'hiddenModeSetting', prop: 'hiddenMode', type: 'boolean' },
    { key: 'unreadColorSetting', prop: 'unreadColor', type: 'string' },
    { key: 'readColorSetting', prop: 'readColor', type: 'string' }
];

// 章节列表
export const CHAPTERS_LIST = [
    1, 609, 1248, 2052, 2709, 2961, 3262, 3922, 4000, 4701, 4999, 5496, 5894,
    6425, 6926, 7200, 7580, 8169, 8340, 8464, 8872, 9190, 9413, 9698, 10032,
    10130, 10340, 10549, 10819, 11132, 11905, 12603, 12692, 13044, 13090,
    13402, 13498, 13737, 13948, 14099
];

// 选择项页面列表
export const CHOICE_PAGES = [
    3613, 5954, 7705, 11282, 11566, 11693, 12080
];
