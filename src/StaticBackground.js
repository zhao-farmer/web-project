import { Graphics, Sprite,Container } from "../lib/pixi.mjs";

export default class StaticBackground extends Container{
    constructor(screenSize,assets){
        super();

        //创建山脉
        this.#createMounts(assets,600,250,1.3);
        this.#createMounts(assets,820,230,1.6);
        
        //创建星星
        for (let i = 0; i < 300; i++) {
            const star = this.#createStar();
            star.x = Math.random() * screenSize.width;
            star.y = Math.random() * screenSize.height;
        }

        // 水 瀑布
        const water = new Graphics();
        water.rect(0,screenSize.height/2 + 130,screenSize.width,screenSize.height);
        water.fill(0x0072ec);
        this.addChild(water);
      
    }

    #createStar(){
        const star = new Graphics();
        star.rect(0,0,2,2);
        star.fill(0xdddddd);

        this.addChild(star);
        return star;
    }


    #createMounts(assets,x,y,scale){
        const mounts = new Sprite(assets.getTexture('mounts0000'));
        mounts.scale.x = scale;
        mounts.scale.y = scale;
        mounts.x = x;
        mounts.y = y;
        this.addChild(mounts);
    }
}