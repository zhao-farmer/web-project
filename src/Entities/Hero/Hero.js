import Entity from "../Entity.js";
import HeroWaeponUnit from "./HeroWeaPonUnit.js";

const States = {
    Stay: "stay",
    Jump: "jump",
    FlyDown: "flydown",
};

export default class Hero  extends Entity{

    // 重力
    #GRAVITY_FORCE = 0.2;
    // 速度
    #SPED = 3;
    // 跳跃力
    #JUMP_FORCE = 9;
    #velocityX = 0;
    #velocityY = 0;

    #movement = {
        x: 0,
        y: 0,
    };
    #directionContext = {
        left: 0,
        right: 0,
    };
 
    #prevPoint = {
        x: 0,
        y: 0,
    };


    #state = States.Stay;

    // 趴下状态
    #isLay = false;
    // 举枪向上状态
    #isStayUp = false;
    // 下落状态
    isFall = false;
   
    // 无敌状态计数
    #invincibleFrameCount = 300;
    
    #heroWeaponUnit;

    type = 'hero';

    // 数据资源
    #staticData;

    // 闪烁状态计数
    #hitFrameCount = 0;

    // 状态
    #lowBloodState = true;
    #lowBloodCount = 10;

    constructor(view, staticData) {
        super(view);
 
        this.#staticData = staticData;

        // 设置子弹对象
        this.#heroWeaponUnit = new HeroWaeponUnit(this._view);
        //视图开始时 跳跃落下  然后时跳跃状态必须改变 否则就是下落
        this.#state = States.Jump;
        this._view.showJump();

        this.gravitable = true;
        this.isActive = true;
    }

    get collisionBox() {
        return this._view.collisionBox;
    }
  
    get bulletContext() {
        return this.#heroWeaponUnit.bulletContext;
    }

    get prevPoint(){
        return this.#prevPoint;
    }

    get invincibleFrameCount(){
        return this.#invincibleFrameCount;
    }

  

    update() {

        this.#prevPoint.x = this.x;
        this.#prevPoint.y = this.y;

        // 移动速度
        this.#velocityX = this.#movement.x * this.#SPED;
        this.x += this.#velocityX;

        // 设置属于下落的状态
        if (this.#velocityY > 0) {
            // 如果不是跳跃状态  只有下落的状态  不再使其具有跳跃与趴下的操作
            if (!(this.#state == States.Jump || this.#state == States.FlyDown)) {
                this._view.showFall();
                this.isFall = true;
            }
            this.#state = States.FlyDown;
        }

        //加速度跳跃
        this.#velocityY += this.#GRAVITY_FORCE;
        this.y += this.#velocityY;

        // 处于无敌状态 变为透明
        if(this. #invincibleFrameCount > 0){
            this._view.alpha = 0.5;
            this.#invincibleFrameCount--;
        }else{
            this._view.alpha = 1;
        }

        
        // 处于亏血状态 周身直接闪烁
        if(this.#staticData.remainBlood < 3){
            if(this.#lowBloodState){
                this.#lowBloodCount--;
                if(this.#lowBloodCount == 0){
                    this.#lowBloodState = false;
                }else{
                    this._view.tint = this.#lowBloodCount * 0.1 * 0xf54444;
                }
            }else{
                this.#lowBloodCount++;
                if(this.#lowBloodCount == 10){
                    this.#lowBloodState = true;
                }else{
                    this._view.tint = this.#lowBloodCount * 0.1 * 0xFFFFFF;
                }
            }
        }else{
            // 其他情况挨打才触发
            //红色混合
            if(this.#hitFrameCount > 0){
                this._view.tint = 0xf54444;
                this.#hitFrameCount--;
            }else{
                this._view.tint = 0xFFFFFF;
            }
        }
        

      
    }

    damage(){
        // 英雄的健康值 访问数据 如果血量不见底 
        if(this.#staticData.remainBlood > 1){
            // 身体变红持续帧数
            this.#hitFrameCount = 5;
            // 扣除健康值
            this.#staticData.reduceHealth();
            return;
        }
        // 如果是最后一条命的最后一滴血 还是要扣的
        if(this.#staticData.remainPerson == 0){
            this.#staticData.reduceHealth();
        }

         // 重置配置值
         this.#movement.x = 0;
         this.#GRAVITY_FORCE = 0;
         this.#velocityX = 0;
         this.#velocityY = 0;
 
         const deadAnimation = this._view.showAndGetDeadAnimation();
         // 当动画结束时
         deadAnimation.onComplete = () =>{
             this.dead();
             deadAnimation.removeFromParent();
         }
    }

    stay(platformY) {
        if (this.#state == States.Jump || this.#state == States.FlyDown) {
            const fakeButtonContent = {};
            fakeButtonContent.arrowLeft = this.#movement.x == -1;
            fakeButtonContent.arrowRight = this.#movement.x == 1;
            fakeButtonContent.arrowDown = this.#isLay;
            fakeButtonContent.arrowUp = this.#isStayUp;
            //必须在设置设置按键状态前设置  防止还是跳跃与飞翔状态 图形不改变
            this.#state = States.Stay;
            this.setView(fakeButtonContent);
            this.isFall = false;
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

    throwDown() {
        this.#state = States.Jump;
        this._view.showFall();
        this.isFall = true;
    }
    startLeftMove() {
        this.#directionContext.left = -1;
        if (this.#directionContext.right > 0) {
            this.#movement.x = 0;
            return;
        }
        this.#movement.x = -1;
    }
    startRightMove() {
        this.#directionContext.right = 1;
        if (this.#directionContext.left < 0) {
            this.#movement.x = 0;
            return;
        }
        this.#movement.x = 1;
    }

    stopLeftMove() {
        this.#directionContext.left = 0;
        this.#movement.x = this.#directionContext.right;
    }
    stopRightMove() {
        this.#directionContext.right = 0;
        this.#movement.x = this.#directionContext.left;
    }

    setView(buttonContext) {
        //设置方向
        this._view.flip(this.#movement.x);

        this.#isLay = buttonContext.arrowDown;
        this.#isStayUp = buttonContext.arrowUp;

        this.#heroWeaponUnit.setBulletAngle(buttonContext,this.isJumpState());

        // 跳跃时空中按其他键 会发生变形 这里直接不进行判断
        if (this.isJumpState() || this.#state == States.FlyDown) {
            return;
        }

        if (buttonContext.arrowLeft || buttonContext.arrowRight) {
            if (buttonContext.arrowUp) {
                this._view.showRunUp();
         
            } else if (buttonContext.arrowDown) {
                this._view.showRunDown();
            } else {
                if(buttonContext.shoot){
                    this._view.showRunShoot();
                }else{
                    this._view.showRun();
                }
                
            }
        } else {
            if (buttonContext.arrowUp) {
                this._view.showStayUp();
            } else if (buttonContext.arrowDown) {
                this._view.showLay();
            } else {
                this._view.showStay();
            }
        }
    }


    reset(){
        
        // 角色无敌时间是不至此这个选项的
        if(this.#invincibleFrameCount>0){
            return;
        }
        // 判断人物是否还有复活的可能
        if(this.#staticData.remainPerson < 1){
            return;
        }else{
            this.#staticData.resuractionTips();
        }


        // 加速度
        this.#GRAVITY_FORCE = 0.2;
        // 当前节点的碰撞开启
        this._view.reset();
        // 设置复活标记
        this.resuraction();
        // 开启无敌时间
        this.#invincibleFrameCount = 300;  
    }  
}
