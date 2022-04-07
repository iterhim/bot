const { Scenes } = require('telegraf');

const nameScene = new Scenes.BaseScene('first');

nameScene.enter(async ctx => {});

module.exports = nameScene;
