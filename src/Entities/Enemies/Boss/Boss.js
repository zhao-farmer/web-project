import Entity from "../../Entity.js";

export default class Boss extends Entity{

    #health = 30;

    type = 'enemy';
    isBoss = true;
    name = 'boss';
    #staticData;
    #sound;

    constructor(view,staticData,sound){
        super(view);
        this.#staticData = staticData;
        this.isActive = true;
        this.#sound = sound;
    }
     // 闪烁状态计数
     #hitFrameCount = 0;

    update(){
        //判断是否执行闪烁状态
        if(this.#hitFrameCount > 0){
            this._view.tint = 0xf54444;
            this.#hitFrameCount--;
        }else{
            this._view.tint = 0xFFFFFF;
        }
    }

    damage(){
        this.#health--;
        this.#hitFrameCount = 5;
        if(this.#health < 1){
            // 开始记分
            this.#staticData.sumScore(this.name);
            // 是否结束标记
            this.isActive = false;

            const deadAnimation = this._view.showAndGetDeadAnimation();
            // 当动画结束时
            deadAnimation.onComplete = () =>{
                // 全部爆炸
                this._view.showAnditionalExplosions();
                deadAnimation.removeFromParent();
                // 开始记分
                this.#staticData.sumScore(this.name);
                // 播放爆炸声音
                this.#sound.playExplosion03()
            }
        }
    }
}