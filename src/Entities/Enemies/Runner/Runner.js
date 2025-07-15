import Entity from "../../Entity.js";
const States = {
    Stay: "stay",
    Jump: "jump",
    FlyDown: "flydown",
};

export default class Runner extends Entity{
    #GRAVITY_FORCE = 0.2;
    #SPEED = 3;
    #JUMP_FORCE = 9;
    #velocityX = 0;
    #velocityY = 0;

    #movement = {
        x: 0,
        y: 0,
    };
    
    #prevPoint = {
        x: 0,
        y: 0,
    };

    #target ;
    #staticData;
    #state = States.Stay;
    #sound;

    type = 'enemy';
    name = 'runner';
    jumpBehaviorKoef = 0.4;
   
    constructor(view,target,staticData,sound) {
        super(view);

        this.#target = target;
        this.#staticData = staticData;

        //视图开始时 跳跃落下  然后时跳跃状态必须改变 否则就是下落
        this.#state = States.Jump;
        this._view.showJump();

        this.#movement.x = -1;

        this.gravitable = true;
        this.isActive = false;

        this.#sound = sound;
   
    }

    get collisionBox() {
        return this._view.collisionBox;
    }



    get x() {
        return this._view.x;
    }
    set x(value) {
        this._view.x = value;
    }
    get y() {
        return this._view.y;
    }
    set y(value) {
        this._view.y = value;
    }


    get prevPoint(){
        return this.#prevPoint;
    }

    update() {

        // 激活验证
        if(!this.isActive){
            if(this.x - this.#target.x < 512 + this.collisionBox.width * 2){
                this.isActive = true;
            }
            return;
        }

        this.#prevPoint.x = this.x;
        this.#prevPoint.y = this.y;

        this.#velocityX = this.#movement.x * this.#SPEED;
        this.x += this.#velocityX;

        // 设置属于下落的状态
        if (this.#velocityY > 0) {
            // 如果不是跳跃状态  只有下落的状态  不再使其具有跳跃与趴下的操作
            if (!(this.#state == States.Jump || this.#state == States.FlyDown)) {
                //
                if(Math.random() > this.jumpBehaviorKoef){
                    this._view.showJump()
                }else{
                    this.jump();
                }
              
            }
            // 只有距离平台大于0 才能下落  
            // 防止了 下落后无法跳跃的问题
            if (this.#velocityY > 0) {
                this.#state = States.FlyDown;
            }
           
        }

        //加速度跳跃
        this.#velocityY += this.#GRAVITY_FORCE;
        this.y += this.#velocityY;
    }
    damage(){
        // 重置配置值
        this.#movement.x = 0;
        this.#GRAVITY_FORCE = 0;
        this.#velocityX = 0;
        this.#velocityY = 0;

        const deadAnimation = this._view.showAndGetDeadAnimation();
        // 当动画结束时
        deadAnimation.onComplete = () =>{
            //设置死亡
            this.dead();
            // 开始记分
            this.#staticData.sumScore(this.name);
            // 播放爆炸声音
            this.#sound.playExplosion00()
        }
    }

    stay(platformY) {
        if (this.#state == States.Jump || this.#state == States.FlyDown) {
            const fakeButtonContent = {};
            fakeButtonContent.arrowLeft = this.#movement.x == -1;
            fakeButtonContent.arrowRight = this.#movement.x == 1;
               //必须在设置设置按键状态前设置  防止还是跳跃与飞翔状态 图形不改变
            this.#state = States.Stay;
            this.setView(fakeButtonContent);
        }
        // 设置状态
        this.#state = States.Stay;
        // 设置加速度
        this.#velocityY = 0;

        // 1 保持落在平台上 不会向上跳跃一次
        // 2 可以走楼梯 瞬间移到上一步上
        this.y = platformY - this._view.collisionBox.height;
    }

    jump() {
        //在跳的时候与向下时 直接返回 不进行二段跳
        if (this.#state == States.Jump || this.#state == States.FlyDown) {
            return;
        }
        this.#state = States.Jump;
        // 减去这个值后 加速度从 -6 一直到 +6 与平台发生碰撞后 报纸为0
        this.#velocityY -= this.#JUMP_FORCE;

        this._view.showJump();
    }
    isJumpState() {
        return this.#state == States.Jump;
    }

 

    setView() {
        //设置方向
        this._view.flip(this.#movement.x);

        // 跳跃时空中按其他键 会发生变形 这里直接不进行判断
        if (this.isJumpState() || this.#state == States.FlyDown) {
            return;
        }else {
            this._view.showRun();
        } 
    }

    removeFromParent(){
        if (this._view.parent != null) {
            this._view.removeFromParent();
        }
    }

}
