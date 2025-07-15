import { Container, Sprite,AnimatedSprite } from "../../../../lib/pixi.mjs";

export default class TourelleView extends Container{
    

    #collisionBox = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    };

    #gunView;
    #assets;
    
    constructor(assets){
        super();

        this.#assets = assets;

        const container = new Container();

        const view = new Sprite(this.#assets.getTexture('tourelle0000'));
        view.scale.x = 1.4;
        view.scale.y = 1.4;
        view.x -= view.width/2;
        view.y -= view.height/2;

      
        container.addChild(view)

        this.#gunView = new Sprite(this.#assets.getTexture('tourellegun0000'));
        this.#gunView.pivot.x = 22;
        this.#gunView.pivot.y = 19;

        this.#collisionBox.width = 128;
        this.#collisionBox.height = 128;

        container.addChild(this.#gunView);

        this.addChild(container);
    }

    // 获取转动的角度
    get gunRotation(){
        return this.#gunView.rotation;
    }
    // 设置转动的角度
    set gunRotation(value){
        this.#gunView.rotation = value;
    }

    get collisionBox() {
        this.#collisionBox.x = this.x - this.#collisionBox.width/2;
        this.#collisionBox.y = this.y - this.#collisionBox.height/2;
        return this.#collisionBox;
    }

    get hitBox() {
        return this.collisionBox;
    }
    showAndGetDeadAnimation(){
        // 当前节点不再显示 就是奔跑者
        this.#gunView.visible = false;

        // 出现后可攻击范围改为0
        this.#collisionBox.width = 0;
        this.#collisionBox.height = 0;

        const explosion = new AnimatedSprite(this.#assets.getAnimationTexture('explosion'));
        // 动画精灵播放熟读与
        explosion.animationSpeed = 1/5;
        explosion.scale.x = 2;
        explosion.scale.y = 2;
        // 动画精灵位置
        explosion.x = -explosion.width/2
        explosion.y = -explosion.height/2
        // 播放后是否重复动画精灵
        explosion.loop = false;
        // 开始播放
        explosion.play();
        // 添加当前容器下
        this.addChild(explosion);

        return explosion;
    }
}