import { Container, TilingSprite } from "../lib/pixi.mjs";

export default class DynamicBackground {

    #assets;
    #worldContainer;
    #dataSheet;
    #blackSize = 128;
    #spriteData = [];
    constructor(assets,worldContainer,dataSheet){
        this.#assets = assets;
        this.#worldContainer = worldContainer;
        this.#dataSheet = dataSheet;
        this.#blackSize = this.#dataSheet.blackSize;


        // 创建水花
        let data = this.#dataSheet.waterFlower;
        for (const object of data) {
            let sprite =  this.#createWaterFlower(object.rotate,object.xIndex * this.#blackSize + object.xAdd,
                object.y,object.width,object.height);
            let item = {}
            item.sprite = sprite;
            item.direction = object.direction;
            item.speed = object.speed;

            this.#spriteData.push(item)
        }

        // 创建飘动的树
    }

    update(){
        // 水流动
        this.#updateWaterFlow();
    }

    // 创建水花
    #createWaterFlower(rotate,x,y,width,height){
        // 创建容器
        const view = new Container();

        // 创建TilingSprite类型精灵
        const texture = this.#assets.getTexture('water0000');
        const tilingSprite = new TilingSprite({texture,width:width,height:height});

        // 调整角度
        tilingSprite.rotation = rotate * Math.PI / 180;

        // 容器设置
        view.addChild(tilingSprite);
        view.x = x;
        view.y = y;

        // 添加到最前方
        this.#worldContainer.foreground.addChild(view);

        return tilingSprite;
    }

    // 创建飘动的树
    #createTree(x,y){
        const tree = new AnimatedSprite(this.#assets.getAnimationTexture('teee'));
        // 动画速度
        tree.animationSpeed = 1/5;
        // 开始播放
        tree.play();
        // 播放后是否重复动画精灵
        tree.loop = tree;
        tree.x = x;
        tree.y = y;
        this.#worldContainer.foreground.addChild(tree);
    }

    #updateWaterFlow(){
        // console.log(this.#spriteData.length);
        
        if( this.#spriteData.length > 0 ){
            for (const item of this.#spriteData) {
                if(item.direction === 1){
                    item.sprite.tilePosition.x += item.speed;
                }else if(item.direction === 2){
                    item.sprite.tilePosition.x -= item.speed;
                }
            }
        }
    }
}