import { Container, Sprite,AnimatedSprite } from "../../../lib/pixi.mjs";

export default class PowerupView extends Container{
    #collisionBox = {
        x:0,
        y:0,
        width:0,
        height:0,
    }

    #view;
    #assets;

    constructor(asserts){
        super();
        this.#assets = asserts;

        this.#view = new Sprite(this.#assets.getTexture('powerup0000'));
        this.addChild(this.#view);

        this.#collisionBox.width = 50;
        this.#collisionBox.height = 20;
    }

    get collisionBox(){
        this.#collisionBox.x = this.x;
        this.#collisionBox.y = this.y;
        return this.#collisionBox;
    }

    get hitBox(){
        return this.collisionBox;
    }


    showAndGetDeadAnimation(){
        // 当前节点不再显示 就是奔跑者
        this.#view.visible = false;

        // 出现后可攻击范围改为0
        this.#collisionBox.width = 0;
        this.#collisionBox.height = 0;

        const explosion = new AnimatedSprite(this.#assets.getAnimationTexture('explosion'));
        // 动画速度
        explosion.animationSpeed = 1/5;
        // 爆炸位置
        explosion.y = -explosion.height/2
        // 开始播放
        explosion.play();
        // 播放后是否重复动画精灵
        explosion.loop = false;
        this.addChild(explosion);

        return explosion;
    }
}