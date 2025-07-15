import Entity from "../../Entity.js";

export default class BossGun extends Entity{

    #target;
    #bulletFactory;
    //设计间隔
    #timeConter = 0;
    //健康值 只有扣为0才会消失
    #health = 5;

    type = 'enemy';
    name = 'bossgun'

    // 闪烁状态计数
    #hitFrameCount = 0;
    #staticData;

    constructor(view,target,bulletFactory,staticData){
        super(view);
        this.#target = target;
        this.#bulletFactory = bulletFactory;
        this.#staticData = staticData;
      
        this.isActive = false;
    }

    update(){

        // 英雄死亡后 不再射击
        if(this.#target.isDead){
            return;
        }

        // 不再活跃时 判断是否处于活跃状态
        if(!this.isActive){
            if(this.x - this.#target.x < 512 + this.collisionBox.width * 2){
                this.isActive = true;
            }
            return;
        }


        //通过两个距离判断角度
        let angle = Math.atan2(this.#target.y - this.y,this.#target.x - this.x);
        this._view.gunRotation = angle;

        //自动开火
        this.#fire();


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
           
            this.#timeConter = 0;
            const deadAnimation = this._view.showAndGetDeadAnimation();
            // 当动画结束时
            deadAnimation.onComplete = () =>{
                this.dead();
                // 开始记分
                this.#staticData.sumScore(this.name);
            }
        }
    }

    // 机器自己的开火
    #fire(){
        this.#timeConter++;

        if(this.#timeConter < 50 && Math.random() > 0.01){
            return;
        }
      
        const bulletContext = {};
        bulletContext.x = this.x;
        bulletContext.y = this.y;
        bulletContext.angle =  180; 
        bulletContext.type = 'enemyBullet';

        this.#bulletFactory.createBossBullet(bulletContext);

        this.#timeConter = 0;
    }
}