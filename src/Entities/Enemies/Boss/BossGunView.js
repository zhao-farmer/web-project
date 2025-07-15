import { Container, Sprite,AnimatedSprite } from "../../../../lib/pixi.mjs";

export default class BossGunView extends Container{
    

    #collisionBox = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    };

    #view;
    #assets;
    
    constructor(assets){
        super();

        this.#assets = assets;
        
        const view = new Sprite(this.#assets.getTexture('bossgun0000'));
        view.scale.x = 1.4;
        view.scale.y = 1.4;
        this.addChild(view)
     
        this.#collisionBox.width = 38;
        this.#collisionBox.height = 18;

        this.#view = view;
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
        this.#view.visible = false;

        // 出现后可攻击范围改为0
        this.#collisionBox.width = 0;
        this.#collisionBox.height = 0;

        const explosion = new AnimatedSprite(this.#assets.getAnimationTexture('explosion'));
        // 爆炸位置
        explosion.animationSpeed = 1/5;
        explosion.scale.x = 2;
        explosion.scale.y = 2;
        // 爆炸位置
        explosion.x = -explosion.width/2
        explosion.y = -explosion.height/2
        // 开始播放
        explosion.play();
        // 播放后是否重复动画精灵
        explosion.loop = false;
        this.addChild(explosion);

        return explosion;
    }
}