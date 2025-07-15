import * as PIXI from "../lib/pixi.mjs";
import AssetsFactory from "./AssetsFactory.js";
import Game from "./Game.js";

(async () => {
    // 创建一个新的应用程序
    const app = new PIXI.Application();

    // 初始化应用程序
    await app.init({ width: 1024, height: 768 });

    // 初始化精灵表
    const sheet = await PIXI.Assets.load("./assets/atlas.json");
    const assets = new AssetsFactory(sheet);

    // 初始化数据内容
    const data = await PIXI.Assets.load("./assets/data.json");    
    

    //使用游戏类中的方法
    const game = new Game(app,assets,data);

    // 设置固定的FPS为30
    app.ticker.maxFPS = 60;
    app.ticker.minFPS = 60;

    // 定时刷新
    app.ticker.add(game.update, game);

    // 将应用程序画布添加到到文档正文
    document.body.appendChild(app.canvas);

    //监控按下
    document.addEventListener("keydown",  (key) => {
        game.keyboardProcessor.onKeyDown(key);
        
    });
    //监控松开
    document.addEventListener("keyup",  (key) => {
        game.keyboardProcessor.onKeyUp(key);
  
    });

    
})();
