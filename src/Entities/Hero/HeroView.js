import { Container, Graphics, Sprite, AnimatedSprite } from "../../../lib/pixi.mjs";

export default class HeroView extends Container {
    #bounds = {
        width: 0,
        height: 0,
    };
    #collisionBox = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    };
    #hitBox = {
        x:0,
        y:0,
        width:0,
        height:0,
        shiftX:0,
        shiftY:0,
    }
    #stm = {
        currentState: "default",
        states: {},
    };

    #bulletPointShift = {
        x: 0,
        y: 0,
    };
    #rootNode;
    #assets;
    constructor(assets) {
        super();

        this.#assets = assets;

        this.#createNodeStructure();

        this.#rootNode.pivot.x = 10;
        this.#rootNode.x = 10;

        this.#bounds.width = 20;
        this.#bounds.height = 90;
        this.#collisionBox.width = this.#bounds.width;
        this.#collisionBox.height = this.#bounds.height;

        // 待机
        this.#stm.states.stay = this.#getStayImage();
        // 待机朝上
        this.#stm.states.stayUp = this.#getStayUpImage();
        // 跑
        this.#stm.states.run = this.#getRunImage();
        // 跑起来发射子弹
        this.#stm.states.runShoot = this.#getRunShootImage();
        // 朝右上或左上
        this.#stm.states.runUp = this.#getRunUpImage();
        // 朝右下或左下
        this.#stm.states.runDown = this.#getRunDownImage();
        // 趴下
        this.#stm.states.lay = this.#getLayImage();
        // 跳起来
        this.#stm.states.jump = this.#getJumpImage();
        // 下落
        this.#stm.states.fall = this.#getFallImage();

        // 将所有key值 加入主节点
        for (let key in this.#stm.states) {
            this.#rootNode.addChild(this.#stm.states[key]);
        }
    }

    get collisionBox() {
        this.#collisionBox.x = this.x;
        this.#collisionBox.y = this.y;
        return this.#collisionBox;
    }

    get hitBox(){
        this.#hitBox.x = this.x + this.#hitBox.shiftX;
        this.#hitBox.y = this.y + this.#hitBox.shiftY;
        return this.#hitBox;
    }

    get isFliped() {
        return this.#rootNode.scale.x == -1;
    }

    get bulletPointShift() {
        return this.#bulletPointShift;
    }

    reset(){
        this.#rootNode.visible = true;
        this.#collisionBox.width = this.#bounds.width;
        this.#collisionBox.height = this.#bounds.height;
    }

    showTransparent(){
        // 透明度设置为0.5
        this.#rootNode.alpha = 0.5;
    }
    
    showAndGetDeadAnimation(){
        // 当前节点不再显示 就是奔跑者
        this.#rootNode.visible = false;

        // 出现后可攻击范围改为0
        this.#collisionBox.width = 0;
        this.#collisionBox.height = 0;

        const explosion = new AnimatedSprite(this.#assets.getAnimationTexture('explosion'));
        // 爆炸位置
        explosion.animationSpeed = 1/5;
        // 爆炸位置
        explosion.x = -explosion.width/2
        // 开始播放
        explosion.play();
        // 播放后是否重复动画精灵
        explosion.loop = false;
        this.addChild(explosion);

        return explosion;
    }

    showStay() {
        this.#toState("stay");
        this.#setBullectPointShift(50, 29);

        this.#hitBox.width = 20;
        this.#hitBox.height = 90;
        this.#hitBox.shiftX = 0;
        this.#hitBox.shiftY = 0;
    }

    showStayUp() {
        this.#toState("stayUp");
        this.#setBullectPointShift(18, -30);

        this.#hitBox.width = 20;
        this.#hitBox.height = 90;
        this.#hitBox.shiftX = 0;
        this.#hitBox.shiftY = 0;
    }

    showRun() {
        this.#toState("run");
        this.#setBullectPointShift(65, 30);

        this.#hitBox.width = 20;
        this.#hitBox.height = 90;
        this.#hitBox.shiftX = 0;
        this.#hitBox.shiftY = 0;
    }

    showRunShoot() {
        this.#toState("runShoot");
        this.#setBullectPointShift(50, 29);

        this.#hitBox.width = 20;
        this.#hitBox.height = 90;
        this.#hitBox.shiftX = 0;
        this.#hitBox.shiftY = 0;
    }

    showRunUp() {
        this.#toState("runUp");
        this.#setBullectPointShift(40, 0);

        this.#hitBox.width = 20;
        this.#hitBox.height = 90;
        this.#hitBox.shiftX = 0;
        this.#hitBox.shiftY = 0;
    }

    showRunDown() {
        this.#toState("runDown");
        this.#setBullectPointShift(47, 50);

        this.#hitBox.width = 20;
        this.#hitBox.height = 90;
        this.#hitBox.shiftX = 0;
        this.#hitBox.shiftY = 0;
    }

    showLay() {
        this.#toState("lay");
        this.#setBullectPointShift(50, 70);

        this.#hitBox.width = 90;
        this.#hitBox.height = 20;
        this.#hitBox.shiftX = -40;
        this.#hitBox.shiftY = 70;
    }
    showJump() {
        this.#toState("jump");
        this.#setBullectPointShift(-2, 40);

        this.#hitBox.width = 40;
        this.#hitBox.height = 40;
        this.#hitBox.shiftX = -10;
        this.#hitBox.shiftY = 25;
    }
    showFall() {
        this.#toState("fall");

        this.#hitBox.width = 20;
        this.#hitBox.height = 90;
        this.#hitBox.shiftX = 0;
        this.#hitBox.shiftY = 0;
    }

    flip(direction) {
        switch (direction) {
            case 1:
            case -1:
                this.#rootNode.scale.x = direction;
        }
    }

    #toState(key) {
        if (this.#stm.currentState == key) {
            return;
        }
        for (let key in this.#stm.states) {
            this.#stm.states[key].visible = false;
        }
        this.#stm.states[key].visible = true;
        this.#stm.currentState = key;
    }

    #createNodeStructure() {
        const rootNode = new Container();
        this.addChild(rootNode);
        this.#rootNode = rootNode;
    }

    #setBullectPointShift(x, y) {
        // this.#rootNode.scale.x 等于正一或负一
        // 枢轴点 乘以方向 获取正向或反向的枢轴点（主要是处理反向的枢轴点）
        // 最后乘以方向 也是处理反向的射击点
        this.#bulletPointShift.x = (x + this.#rootNode.pivot.x * this.#rootNode.scale.x) * this.#rootNode.scale.x;
        this.#bulletPointShift.y = y;
    }

    #getStayImage() {
        const view = new Sprite(this.#assets.getTexture("stay0000"));
        return view;
    }
    #getStayUpImage() {
        const view = new Sprite(this.#assets.getTexture("stayup0000"));
        view.x += 2;
        view.y -= 31;
        return view;
    }
    //跑步动作
    #getRunImage() {
        const view = new AnimatedSprite(this.#assets.getAnimationTexture('run'));
        view.animationSpeed = 1/10;
        view.play();
        view.y -=3;
        return view;
    }

    // 由两部分组成 上半部分与下半部分通过遮罩进行显示 
    // 最终组成一个新的动画
    #getRunShootImage(){
        const container = new Container();

        const upperDart = new Sprite(this.#assets.getTexture('stay0000'));
        upperDart.x = 8;
        upperDart.y = 2;

        const upperDartMask = new Graphics();
        upperDartMask.rect(0,0,100,45);
        upperDartMask.fill(0xffffff)

        upperDart.mask = upperDartMask;

        const bottomPart = new AnimatedSprite(this.#assets.getAnimationTexture('run'));
        bottomPart.animationSpeed = 1/10;
        bottomPart.play();
        bottomPart.y -=3;

        const bottomDartMask = new Graphics();
        bottomDartMask.rect(0,45,100,45);
        bottomDartMask.fill(0xffffff)

        bottomPart.mask = bottomDartMask;

        container.addChild(upperDart);
        container.addChild(bottomPart);
        container.addChild(upperDartMask);
        container.addChild(bottomDartMask);

        return container;
    }

    // 跑步左上或右上
    #getRunUpImage() {
        const view = new AnimatedSprite(this.#assets.getAnimationTexture('runup'));
        view.animationSpeed = 1/10;
        view.play();
        view.y -=3;
        return view;
    }



    // 跑步朝左下或右下
    #getRunDownImage() {
        const view = new AnimatedSprite(this.#assets.getAnimationTexture('rundown'));
        view.animationSpeed = 1/10;
        view.play();
        view.y -=3;
        return view;
    }

    // 趴下的动作
    #getLayImage() {
        const view = new Sprite(this.#assets.getTexture("lay0000"));
        view.x -= 25;
        view.y += 50;
        return view;
    }

    // 跳起的动作
    #getJumpImage() {
        const view = new AnimatedSprite(this.#assets.getAnimationTexture('jump'));
        view.animationSpeed = 1/10;
        view.play();
        view.y -= 3;
        view.x -= 10;
        return view;
    }

    // 跑步动作的第三帧
    #getFallImage() {
        const view = new Sprite(this.#assets.getTexture("run0003"));

        return view;
    }
}
