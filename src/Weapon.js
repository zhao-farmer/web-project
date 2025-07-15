
// 武器类
export default class Weapon{

    #currentGunStrategy;
    #bulletFactory;

    #count = 0;
    #limit = 6;

    #isFire = false;
    #sound 

    // 如果不设置武器类习惯 默认使用初始武器
    constructor(bulletFactory,sound){
        this.#bulletFactory = bulletFactory;
        this.#currentGunStrategy = this.#defaultGunStrategy;
        this.#sound = sound;
    }

    // 使用update 而不直接使用按键 阻止子弹的延迟
    update(bulletContext){
        if(this.#isFire == false){
            return;
        }
        if(this.#count % this.#limit == 0){
            this.#currentGunStrategy(bulletContext);
        }
        this.#count ++ ;
    }


    // 切换武器
    setWeapon(type){
        switch(type){
            case 1:
                this.#currentGunStrategy = this.#defaultGunStrategy;
                break;
            case 2:
                this.#currentGunStrategy = this.#spreadGunStrategy;
                break;
        }
    }
    // 开火
    startFire(){
        this.#isFire = true;
    }
    // 停火
    stopFire(){
        this.#isFire = false;
        this.#count = 0;
    }

    // 默认发射火力
    #defaultGunStrategy(bulletContext){
        this.#limit = 10;
        this.#bulletFactory.createBullet(bulletContext);

        this.#sound.playSpear01()
    }

    // 扇形子弹发射
    #spreadGunStrategy(bulletContext){
        this.#limit = 40;
        let angleShift = - 20;
        for (let i = 0; i < 5; i++) {
            const loaclBulletContext = {
                x : bulletContext.x,
                y : bulletContext.y,
                angle: bulletContext.angle + angleShift,
                type: bulletContext.type,
            }
            // 开花弹
            this.#bulletFactory.createSpreadGunBullet(loaclBulletContext);
            //从 负20 到 正20
            angleShift += 10;
            
        }

        this.#sound.playSpear02()
    }
}