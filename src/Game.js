import PlatformFactory from "./Entities/Platfroms/PlatformFactory.js";
import KeyboardProcessor from "./KeyboardProcessor.js";
import Camera from "./Camera.js";
import BulletFactory from "./Entities/Bullets/BulletFactory.js";
import HeroFactory from "./Entities/Hero/HeroFactory.js";
import Physics from "./Physics.js";
import Weapon from "./Weapon.js";
import World from "./World.js";
import Sound from "./Sound.js";
import SceneFactory from "./SceneFactory.js";
import EnemiesFactory from "./Entities/Enemies/EnemiesFactory.js";
import PowerupsFactory from "./Entities/Powerups/PowerupsFactory.js";
import StaticBackground from "./StaticBackground.js";
import DynamicBackground from "./DynamicBackground.js";
import { Color, FillGradient, Text, TextStyle } from "../lib/pixi.mjs";
import StaticShowData from "./StaticShowData.js";
export default class Game {
    #pixiApp;
    #hero;
    
    #platforms = [];
    //键盘按键
    keyboardProcessor;
    //摄像机与屏幕大小
    #camera;
    #worldContainer;
    //子弹工厂
    #bulletFactory;
    // 实体集合
    #entities = [];
    //武器
    #weapon;
    // 是否结束游戏
    #isEndGame = false;
    // 数据信息
    #staticShowData;
    // 音乐
    #sound;
    // 数据
    #dataSheet;
    // 动态背景
    #dynamicBackground;

    constructor(pixiApp,assets,data) {
        // pixi对象
        this.#pixiApp = pixiApp;
        // 数据对象
        this.#dataSheet = data;

        // 声音对象
        this.#sound = new Sound();
        // 选择BGM
        this.#sound.playMusic(1);

        
        //监听页面鼠标与键盘按下的事件        
        this.#pixiApp.canvas.addEventListener('mousedown',()=>{
            this.#sound.loadMusic()
        });
        document.body.addEventListener('keydown', ()=>{
            this.#sound.loadMusic()
        });
    

        // 创建界类（包含一切物品）
        this.#worldContainer = new World();
        // 添加静态背景
        this.#pixiApp.stage.addChild(new StaticBackground(this.#pixiApp.screen,assets));
        // 添加动态背景
        this.#dynamicBackground = new DynamicBackground(assets,this.#worldContainer,this.#dataSheet);
        // 静态数据
        this.#staticShowData = new StaticShowData(this.#pixiApp.screen)
        // 将世界类添加到舞台上
        this.#pixiApp.stage.addChild(this.#worldContainer);

        // 创建子弹工厂
        this.#bulletFactory = new BulletFactory(this.#worldContainer.game,this.#entities);

        // 初始化英雄工厂
        const heroFactory = new HeroFactory(this.#worldContainer.game,assets,this.#staticShowData);
        // 英雄生成位置
        this.#hero = heroFactory.create(160,100);
        // 英雄添加到实体类集合
        this.#entities.push(this.#hero)

         // 初始化敌方 工厂
        const enemyFactory = new EnemiesFactory(this.#worldContainer.game,this.#hero,this.#bulletFactory,this.#entities,assets,this.#staticShowData,this.#sound);
        
        // 初始化增强武器工厂
        const powerupFactory = new PowerupsFactory(this.#worldContainer.game,this.#entities,assets,this.#hero);
        // powerupFactory.createPowerup();

        // 初始化平台工厂
        const platformFactory = new PlatformFactory(this.#worldContainer,assets,this.#sound);

        //开始创建所有平台
        const sceneFactory = new SceneFactory(this.#platforms,this.#entities,platformFactory,enemyFactory,this.#hero,powerupFactory,this.#dataSheet);
        sceneFactory.createScene();

        // 初始化键盘交互类
        this.keyboardProcessor = new KeyboardProcessor(this);
        // 设置交互信息
        this.setKeys();

        // 相机配置信息
        const cameraSetting = {
            target: this.#hero,
            world: this.#worldContainer,
            screenSize: this.#pixiApp.screen,
            maxWorldWidth: this.#worldContainer.width,
            isBackScrollX: false, // 是否限制向后移动
        };
        // 创建相机对象
        this.#camera = new Camera(cameraSetting);
      
        // 初始化武器类
        this.#weapon = new Weapon(this.#bulletFactory, this.#sound);
        // 选择武器
        this.#weapon.setWeapon(1);


        //最后添加 记分板 生命 角色
        this.#pixiApp.stage.addChild(this.#staticShowData);


    }

    // 更新的方法
    update(){
        // 英雄 敌人 子弹 全部都加入到了实体中
        // 这里进行遍历循环
        for (let i = 0; i < this.#entities.length; i++) {
            const entity = this.#entities[i];
            // 带动实际实体的更新
            entity.update();
            // 如果实体是英雄/敌人/攻击补给箱/切枪补给箱 进行验证 
            if(entity.type == 'hero' || entity.type == 'enemy' || entity.type == 'enemyPerson' || entity.type == 'powerupBox' || entity.type == 'spreadGunPowerup'){
                // 验证毁坏
                this.#checkDamage(entity);
                // 验证接触的地板
                this.#checkPlatforms(entity);
            }
            // 判断实体的状态
            // 敌人与子弹判断是否超出屏幕外
            this.#checkEntityStatus(entity,i);            
        }
        // 根据角色的移动 摄影机也花生变动
        this.#camera.update();
        // 武器的更新
        this.#weapon.update(this.#hero.bulletContext);
        // 判断游戏是否结束
        this.#checkGameStatus();
        // 检测英雄是否死亡
        this.#checkHeroStatus();
        // 检测数据更新
        this.#staticShowData.update();
        // 动态背景
        this.#dynamicBackground.update();
        
    }

    #checkGameStatus(){
        if(this.#isEndGame){
            return;
        }

        // ============= 判断胜利 =============
        // some 存在的类型 实体类集合中存在boss 且 以及不活跃了（健康值为0）
        const isBossDead = this.#entities.some(e => e.isBoss && !e.isActive);

        
        if(isBossDead){
            //所有非boss的 敌人 全部都死亡
            const enemies = this.#entities.filter(e =>e.type == 'enemy' && !e.isBoss);
            
            enemies.forEach(e => e.dead());

            // 不再进行此类判断
            this.#isEndGame = true;
            this.#showEndGame("挑 战  成 功");
            return;
        }

        // ============= 判断失败 =============
        // 判断角色是否用完
        if(this.#staticShowData.remainPerson < 0 && this.#staticShowData.remainBlood == 0){
             // 不再进行此类判断
             this.#isEndGame = true;

             this.#showEndGame("游 戏  结 束");
        }

    }

    #showEndGame(showTips){
        // 创建填充样式 设置为填充渐变
        const fill = new FillGradient(0, 0, 0, 36 * 1.7 * 7);
        const colors = [0xffffff,0xdd0000].map((color) => Color.shared.setValue(color).toNumber());
        colors.forEach((number, index) =>{
            const ratio = index / colors.length;
            fill.addColorStop(ratio, number);
        });

        // 字体样式
        const style = new TextStyle({
            fontFamily:'Impact',
            fontSize: 50,
            fill: {fill},
            stroke:{ color: "#000000", width: 5, join: "round" },
            letterSpacing: 30,
        });
        //"STAGE CLEAR" "GAME OVER"
        const text = new Text({text: showTips,style:style});
        text.x = this.#pixiApp.screen.width/2 - text.width/2;
        text.y = this.#pixiApp.screen.height/2 - text.height/2;

        this.#pixiApp.stage.addChild(text);
    }

    #checkHeroStatus(){
        if(this.#isEndGame){
            return;
        }

        const isHeroDead = !this.#entities.some(e => e.type == 'hero') && this.#hero.isDead;

        if(isHeroDead){
            this.#entities.push(this.#hero);
            this.#worldContainer.game.addChild(this.#hero._view);
            this.#hero.reset();
            this.#hero.x = -this.#worldContainer.x + 160;
            this.#hero.y = 100;
            this.#weapon.setWeapon(1);
        }
    }

    // 造成损害的部分
    #checkDamage(entity){
        // 拾取箱子的优先级最高
        const powerups = this.#entities.filter(power => power.type == 'spreadGunPowerup' && entity.type == 'hero');
        // 进行循环
        for(let powerup of powerups){
            if(Physics.isCheckAABB(powerup.hitBox,entity.hitBox)){
                // 补给箱消失
                powerup.damage();
                // 切换枪的类型
                this.#weapon.setWeapon(powerup.powerupType);
                break;
            }  
        }

        // 如果英雄处于无敌时间 不再继续下去  
        if(entity.type == 'hero' && entity.invincibleFrameCount > 0){
            return;
        }

        // 检测可能会发生碰撞的实体
        const damagers = this.#entities.filter(damager =>
            // 如果检测的实体是敌人 循环的实体是英雄的子弹
            ((entity.type == 'enemy' || entity.type == 'powerupBox') && damager.type == 'heroBullet')
            // 检测的实体是英雄 循环的实体是敌人的子弹 或者 敌方本身
            || (entity.type == 'hero' && (damager.type == 'enemyBullet' || damager.type == 'enemy' ))     
        );

        // 开始遍历
        for(let damager of damagers){
            // 如果发生碰撞 验证的实体进入死亡状态
            // 如果碰撞的实体不是敌方（目前就是子弹）  碰撞的实体也进行死亡  
            if(Physics.isCheckAABB(damager.hitBox,entity.hitBox)){
                if(damager.type == 'enemy'){
                    // 如果是奔跑者 直接爆炸 
                    if(damager.name == 'runner'){
                        damager.damage();
                     
                    }else{
                        // 其他类型 无事发生
                        return;
                    }
                }else{
                    damager.dead();
                }

                entity.damage();
                // 跳出此循环
                break;
            }  
        } 
    }

  
    // 检测站台
    #checkPlatforms(character){
        //已死亡的 或者不会移动的
     
        if(character.isDead || !character.gravitable){
            return;
        }

        //开始循环
        for(let platform of this.#platforms){
            // 处于跳跃状态 且当前站台不是最底层box 跳过此选项  （也就是下落）
            if(character.isJumpState() && platform.type != 'box' || !platform.isActive){
                continue;
            }
            // 检测对象与平台
            this.checkPlatfromCollision(character,platform);
        }

        // 如果是英雄且 x轴小于最小初始值时 回复到最左侧的初始值
        if(character.type == 'hero' && character.x < -this.#worldContainer.x){
            character.x = character.prevPoint.x;
        }
    }

    // 检测对象与平台
    checkPlatfromCollision(character, platform) {
        const prevPoint = character.prevPoint;
        const collisionResult = Physics.getOrientCollisionResult(character.collisionBox, platform.collisionBox, prevPoint);
        // 垂直方向发生碰撞
        if (collisionResult.vertical == true) {
            // y轴等于上次记录的值
            character.y = prevPoint.y;
            // 并呆在这里原地 传递的值是平台水平方向y轴的值
            character.stay(platform.y);
        }
        //  collisionResult.horizontal == true 可以水平方向判断
        //  platform.type == "box" box类型无法下落
        //  character.isForbiddednHorizontalCollision 禁止水平方向判断（判断子弹落点）
        if (collisionResult.horizontal == true && platform.type == "box" && !character.isForbiddednHorizontalCollision) {
            // 如果是可以走上去的 y轴也发生变化
            if (platform.isStep) {
                // 新的平台y轴的位置大于原本的位置 每次使用左右两键也会自然走
                character.stay(platform.y);
            }else{
                // 其他类型只是x发生变化
                character.x = prevPoint.x;
            }
        }
        return collisionResult;
    }


    setKeys() {
        // 按A键 生成子弹
        this.keyboardProcessor.getButton("KeyA").executeDown = function () {
            // 当英雄不是死亡 且不处于坠落状态 才会发射子弹
            if(!this.#hero.isDead && !this.#hero.isFall){
                const bullets = this.#entities.filter(bullet => bullet.type == this.#hero.bulletContext.type);
                if(bullets.length>10){
                    return;
                }
                // 开火
                this.#weapon.startFire(this.#sound);
                // 用于 判断是否是跑步射击状态
                this.#hero.setView(this.getArrowButtonContext());
            }
        };
        // 松开A键 也检测
        this.keyboardProcessor.getButton("KeyA").executeUp = function () {
            if(!this.#hero.isDead && !this.#hero.isFall){
                this.#weapon.stopFire();
                this.#hero.setView(this.getArrowButtonContext());
            }   
        };

        // 按S键 进行跳跃
        this.keyboardProcessor.getButton("KeyS").executeDown = function () {
            if (
                this.keyboardProcessor.isButtonPressed("ArrowDown") &&
                !(this.keyboardProcessor.isButtonPressed("ArrowLeft") || this.keyboardProcessor.isButtonPressed("ArrowRight"))
            ) {
                this.#hero.throwDown();
            } else {
                this.#hero.jump();
            }
        };
        // 左键
        const ArrowLeft = this.keyboardProcessor.getButton("ArrowLeft");
        ArrowLeft.executeDown = function () {
            this.#hero.startLeftMove();
            this.#hero.setView(this.getArrowButtonContext());
        };
        ArrowLeft.executeUp = function () {
            this.#hero.stopLeftMove();
            this.#hero.setView(this.getArrowButtonContext());
        };
        // 右键
        const ArrowRight = this.keyboardProcessor.getButton("ArrowRight");
        ArrowRight.executeDown = function () {
            this.#hero.startRightMove();
            this.#hero.setView(this.getArrowButtonContext());
        };
        ArrowRight.executeUp = function () {
            this.#hero.stopRightMove();
            this.#hero.setView(this.getArrowButtonContext());
        };
        // 上键
        const arrowUp = this.keyboardProcessor.getButton("ArrowUp");
        arrowUp.executeDown = function () {
            this.#hero.setView(this.getArrowButtonContext());
        };
        arrowUp.executeUp = function () {
            this.#hero.setView(this.getArrowButtonContext());
        };
        // 下键
        const ArrowDown = this.keyboardProcessor.getButton("ArrowDown");
        ArrowDown.executeDown = function () {
            this.#hero.setView(this.getArrowButtonContext());
        };
        ArrowDown.executeUp = function () {
            this.#hero.setView(this.getArrowButtonContext());
        };
    }

    getArrowButtonContext() {
        const buttonContext = {};
        buttonContext.arrowLeft = this.keyboardProcessor.isButtonPressed("ArrowLeft");
        buttonContext.arrowRight = this.keyboardProcessor.isButtonPressed("ArrowRight");
        buttonContext.arrowUp = this.keyboardProcessor.isButtonPressed("ArrowUp");
        buttonContext.arrowDown = this.keyboardProcessor.isButtonPressed("ArrowDown");
        buttonContext.shoot = this.keyboardProcessor.isButtonPressed("KeyA");
        return buttonContext;
    }

    // 检测实体的状态  如果超出范围 进行一处
    #checkEntityStatus(entity,index){
        // 英雄单独判断
        // 如果死亡或在屏幕外
        if(entity.type == 'hero' && this.#isScreenOut(entity) && !this.#hero.isDead){
            entity.dead();
        }else if(entity.isDead || this.#isScreenOut(entity)){
            // 将当前对象移除舞台
            entity.removeFromStage();
            // 实体对象移除已移出舞台上的元素
            this.#entities.splice(index,1);
        }
       
    }
    // 当前实体是否超出屏幕外
    // 因为屏幕会随着屏幕移动 不会出现在屏幕外
    #isScreenOut(entity){
        if(entity.type == 'heroBullet' || entity.type == 'enemyBullt'){
            return  (entity.x > this.#pixiApp.screen.width - this.#worldContainer.x  
                || entity.x < -this.#worldContainer.x  
                || entity.y > this.#pixiApp.screen.height  
                || entity.y < 0)
        }else if(entity.type == 'enemy' || entity.type == 'hero' ){
            return entity.x < (- this.#worldContainer.x) || entity.y> this.#pixiApp.screen.height;
        }
    }

   
}
