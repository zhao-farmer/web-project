import {Container} from '../lib/pixi.mjs';

// 世界类
export default class World extends Container{

    // 背景
    #background;
    // 游戏
    #game;
    // 水面背景
    #foreground;
    // 数据信息
    #gameData;

    constructor(){
        super();

        this.#background = new Container();
        this.addChild(this.#background);

        this.#game = new Container();
        this.addChild(this.#game);

        this.#foreground = new Container();
        this.addChild(this.#foreground)

        this.#gameData = new Container();
        this.addChild(this.#gameData)
    }

    get background(){
        return this.#background;
    }

    get game(){
        return this.#game;
    }

    get foreground(){
        return this.#foreground;
    }

    get gameData(){
        return this.#gameData;
    }
}