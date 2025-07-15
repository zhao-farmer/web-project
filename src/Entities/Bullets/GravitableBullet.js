import Bullet from "./Bullet.js";


export default class GravitableBullet extends Bullet{
  
    #prevPoint = {
        x: 0,
        y: 0,
    };

    #velocityY = 0;
    // 禁止水平碰撞
    isForbiddenHorizontalCollision;
    #GRAVITY_FORCE = 0.2;

   
    constructor(view) {
        super(view);

        this.gravitable = true;
        this.isForbiddenHorizontalCollision = true;
        
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
        this.#prevPoint.x = this.x;
        this.#prevPoint.y = this.y;

        this.x += this.speed;

        //加速度跳跃
        this.#velocityY += this.#GRAVITY_FORCE;
        this.y += this.#velocityY;
    }
  

    stay() {
       this.dead();
    }

 
    isJumpState() {
        return false;
    }

}
