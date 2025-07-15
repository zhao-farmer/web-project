import { AnimatedSprite } from "../../../lib/pixi.mjs";
import Platform from "./Platform.js";

export default class BridgePlatform extends Platform{

    #target;
    #assets;
    #sound;

    constructor(view,assets,sound){
        super(view);

        this.#assets = assets;
        this.#sound = sound;
    }

    setTarget(target){
        this.#target = target;
    }

    update(){
        if(this.#target != null){
            // 判断 this.isActive 代表桥只爆炸一次
            if(this.x - this.#target.x < -50 && this.isActive){
                this.isActive = false;
                const deadAnimation = this.#showAndGetDeadAnimation();
                // 当动画结束时
                deadAnimation.onComplete = () =>{
                    this.dead();
                }
            }
            return;
        }
    }


    #showAndGetDeadAnimation(){
        // 播放爆炸声音
        this.#sound.playExplosion01()

        const explosion = new AnimatedSprite(this.#assets.getAnimationTexture('explosion'));
        explosion.animationSpeed = 1/5;
        explosion.scale.x = 1.5;
        explosion.scale.y = 1.5;
        explosion.x -= 10;
        explosion.loop = false;
        explosion.play();
        this._view.addChild(explosion);

        return explosion;
    }
}
