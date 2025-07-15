// 场景工厂类
export default class SceneFactory{

    //平台对象类
    #platforms;
    // 平台工厂类
    #platFormsFactory;
    // 敌人工厂
    #enemyFactory;
    // 实体类
    #entities;
    // 英雄目标
    #target;
    // 切换弹工厂
    #powerupFactory;
    // 数据表
    #dataSheet;
    // 将游戏分成了一个个的格子  每个格子的大小是128
    #blackSize = 128;

    constructor(platforms, entities, platformFactory,enemyFactory,target,powerupFactory,dataSheet){
        this.#platforms = platforms;
        this.#platFormsFactory = platformFactory;
        this.#enemyFactory = enemyFactory;
        this.#entities = entities;
        this.#target = target;
        this.#powerupFactory = powerupFactory;
        this.#dataSheet = dataSheet;
        this.#blackSize = this.#dataSheet.blackSize;
    }

    // 创建各种平台
    createScene(){
        // 越靠后创建的图越在前方  

        // 创建丛林
        this.#createDecoration();
        // 创建普通平台
        this.#createPlatforms();
        // 创建无法下坠的墙
        this.#createGround();
        // 创建无法下坠区域
        this.#createUnderside();
        // 创建boss墙
        this.#createBossWall();
        // 创建爆炸桥 
        this.#createInteractiveBridges();

        // 创建敌人
        this.#createEnemies();
        // 创建补给箱
        this.#createPowerups();

    }

    #createDecoration(){
        for (let i = 22; i < 52; i++) {
            this.#platFormsFactory.createJungle(this.#blackSize * i,0);
        }
    }

    #createPlatforms(){
        let data = this.#dataSheet.platforms;
        for (const object of data) {
            this.#create(object.xIndexes,object.y,this.#platFormsFactory.createPlatform);
        }
    }

    #createGround(){
        let data = this.#dataSheet.ground;
        for (const object of data) {
            //设置为stepBox 都可以走上去的
            this.#create(object.xIndexes,object.y,this.#platFormsFactory.createStepBox);
        }
    }

    #createUnderside(){
        let data = this.#dataSheet.underside;
        this.#create(data.xIndexes,data.y,this.#platFormsFactory.createUnderside);
    }

    #createBossWall(){
        let data = this.#dataSheet.bossWall;

        // 可以改位置 让其前移
        this.#create(data.xIndexes,data.y,this.#platFormsFactory.createBossWall);

        // 设置创建位置
        this.#enemyFactory.createBoss(this.#blackSize * data.xIndex,data.boss);
    }

    // 通过传递x，y轴 与创建对应的方法进行回调创建
    #create(xIndexes,y,createFunc){
        for(let i of xIndexes){
            this.#platforms.push(createFunc.call(this.#platFormsFactory,this.#blackSize * i,y));
        }
    }

    // 初始化桥梁
    #createInteractiveBridges(){

        let data = this.#dataSheet.bridges;
        for(let i of data.xIndexes){
            let bridge = this.#platFormsFactory.createBridge(this.#blackSize * i,data.y);
            bridge.setTarget(this.#target);
            this.#platforms.push(bridge);
            this.#entities.push(bridge);
        }
    }


    
    //固定位置生成敌人
    #createEnemies(){
        let runnerData = this.#dataSheet.runner;
        for (const object of runnerData) {
            this.#enemyFactory.createRunner(this.#blackSize * object.xIndex + object.xAdd, object.y);
        }


        let runnerJumpData = this.#dataSheet.runnerJump;
        for (const object of runnerJumpData) {
            let runner =  this.#enemyFactory.createRunner(this.#blackSize * object.xIndex + object.xAdd, object.y);
            runner.jumpBehaviorKoef = 1;
        }
        
        let tourelleData = this.#dataSheet.tourelle;
        for (const object of tourelleData) {
            this.#enemyFactory.createTourelle(this.#blackSize * object.xIndex + object.xAdd, object.y);
        }
    }
 
    // 创建强力弹道位置
    #createPowerups(){
        let data = this.#dataSheet.powerups;
        for (const object of data) {
            this.#powerupFactory.createPowerup(this.#blackSize * object.xIndex,object.y);
        }
    }
}