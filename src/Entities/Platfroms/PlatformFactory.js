import Platform from "./Platform.js";
import PlatformView from "./PlatformView.js";
import { Graphics, Sprite, Container} from "../../../lib/pixi.mjs";
import BridgePlatform from "./BridgePlatform.js";


export default class PlatformFactory {

    //平台的宽度与高度
    #platFormWidth = 128;
    #platFormHeight = 24;
    #worldContainer;
    #assets;
    #sound;

    constructor(worldContainer,assets,sound) {
        this.#worldContainer = worldContainer;
        this.#assets = assets;
        this.#sound = sound;
    }


    // 创建平台
    createPlatform(x, y) {
        const skin =  this.#getGroundPlatform();

        const view = new PlatformView(this.#platFormWidth, this.#platFormHeight);
        view.addChild(skin);

        //平台设定位置 并添加到界类的背景选项
        const platform = new Platform(view,this.#assets);
        platform.x = x;
        platform.y = y;        
        this.#worldContainer.background.addChild(view);
        return platform;
    }
    // 创建无法下落的平台
    createBox(x, y) {
        const skin =  this.#getGroundPlatform();

        const view = new PlatformView(this.#platFormWidth, this.#platFormHeight);
        view.addChild(skin);

        const platform = new Platform(view);
        platform.x = x;
        platform.y = y;
        platform.type = 'box';    
        this.#worldContainer.background.addChild(view);
        return platform;
    }

    createStepBox(x, y){
        const box = this.createBox(x, y);
        box.isStep = true;
        return box;
    }

    // 创建最底层移动平台
    createUnderside(x, y){
        const skin = new Graphics();
        skin.rect(0, -this.#platFormHeight, this.#platFormWidth, this.#platFormHeight);
        // 描边蓝色
        skin.stroke({ width: 1, color: 0x0072ec});
        // 填充蓝色
        skin.fill(0x0072ec)

        const view = new PlatformView(this.#platFormWidth, this.#platFormHeight);
        view.addChild(skin);

        const platform = new Platform(view);
        platform.x = x;
        platform.y = y;
        platform.type = 'box';    
        this.#worldContainer.foreground.addChild(view);
        return platform;
    }

  


    createBossWall(x, y){
        const skin = new Sprite(this.#assets.getTexture('boss0000'));
        skin.scale.x = 1.5;
        skin.scale.y = 1.5;

        const view = new PlatformView(this.#platFormWidth * 3, 768);
        view.addChild(skin);

        const platform = new Platform(view);
        platform.x = x - 60;
        platform.y = y - 45;
        platform.type = 'box';    
        this.#worldContainer.background.addChild(view);
        return platform;
    }


    createBridge(x,y){
        // 精灵纹理
        const skin = new Sprite(this.#assets.getTexture('bridge0000'));

        // 显示信息
        const view = new PlatformView(this.#platFormWidth, this.#platFormHeight);
        view.addChild(skin);

        const platform = new BridgePlatform(view, this.#assets,this.#sound);
        platform.x = x;
        platform.y = y; 
        platform.type = 'box';  
        this.#worldContainer.background.addChild(view);
        return platform;
    }

    // 创建丛林
    createJungle(x,y){
        const container = new Container();

        const jungleTop = new Sprite(this.#assets.getTexture('jungletop0000'));
       
        for (let i = 0; i < 5; i++) {
            const jungleBottom1 = this.#createJungleBottom(container);
            jungleBottom1.y = jungleTop.height * i - 2 * i ;
            jungleBottom1.x = x;
        }
        jungleTop.x = x;
        jungleTop.y = y;
        container.addChild(jungleTop);

        this.#worldContainer.background.addChild(container);
    }

    #createJungleBottom(container){
      
        const jungleBottom = new Sprite(this.#assets.getTexture('junglebottom0000'));
        container.addChild(jungleBottom);
        return jungleBottom;
    }

    // pixi8.0 只允许容器添加子项 Sprite原则上不允许添加
    #getGroundPlatform(){

        const container = new Container();

        const grass = new Sprite(this.#assets.getTexture('platform0000'));
        const ground1 = new Sprite(this.#assets.getTexture('ground0000'));
        ground1.y = grass.height - 1;

        const ground2 = new Sprite(this.#assets.getTexture('ground0000'));
        ground2.y = grass.height * 2 - 2;

        const ground3 = new Sprite(this.#assets.getTexture('ground0000'));
        ground3.y = grass.height * 3 - 4;

        // 添加草地（含石板）
        container.addChild(grass)
        // 添加石块
        container.addChild(ground1);
        container.addChild(ground2);
        container.addChild(ground3);

        return container;
    }
}
