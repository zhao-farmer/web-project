import { Graphics,TextStyle,Container,Text } from "../lib/pixi.mjs";

export default class StaticShowData extends Container{


    #persons = [];
    #personsCount = 3;
    #personsUseCount = 1;
    #bloods = [];
    #bloodsCount = 10;
    #bloodsUseCount = 0;
    #score = 0;
    #scoreShow;

    #personFlashFrameTime = 60;
    #bloodFlashFrameTime = 0;

    // 获取现有复活币
    get remainPerson(){
        return this.#personsCount - this.#personsUseCount;
    }

    // 获取现有血量
    get remainBlood(){
        return this.#bloodsCount - this.#bloodsUseCount;
    }

    #screenSize;

    constructor(screenSize){
        super();
        this.#screenSize = screenSize;

        // 创建静态文字
        this.#createStaticTextShow(screenSize);

        // 创建角色数量
        for (let i = 0; i < this.#personsCount; i++) {
            this.#createPersonStar(i * 30 + 90,30);
        }
        // 创建生命值
        this.#createBloods(screenSize);

        // 创建计分板
        this.#loadScore(screenSize);
        this.addChild(this.#scoreShow)
    }

    // 帧更新
    update(){
        // 判断角色是否需要变化
        if(this.#personFlashFrameTime > 0){
            //需要闪烁的对象
            const flashPerson = this.#persons[this.#personsCount - this.#personsUseCount];
            
            if(!flashPerson){
                return;
            }
            // 按照10的倍数
            let reuslt = this.#personFlashFrameTime % 10;
            // 最后变为0
            if(this.#personFlashFrameTime == 1){
                reuslt = 0;
            }
            // 透明度
            flashPerson.alpha = reuslt * 0.1;
            this.#personFlashFrameTime --;

        }

        // 判断血量是否发生变化
        if(this.#bloodFlashFrameTime> 0){
            //需要闪烁的对象
            const flashBlood = this.#bloods[this.#bloodsCount - this.#bloodsUseCount];
            if(!flashBlood){
                return;
            }

            // 按照10的倍数
            let reuslt = this.#bloodFlashFrameTime % 10;
            // 最后变为0
            if(this.#bloodFlashFrameTime == 1){
                reuslt = 0;
            }
            // 透明度
            flashBlood.alpha = reuslt * 0.1;
            this.#bloodFlashFrameTime --;
        }
        // 记分变化直接替换
    }
    // 复活标志
    resuractionTips(){
        if(this.#personsUseCount < this.#personsCount){
            this.#personsUseCount++;
            this.#personFlashFrameTime = 60;
            // 血量补满
            this.#createBloods();
        }
    }
    // 降低健康值
    reduceHealth(){
        if(this.#bloodsUseCount <= this.#bloodsCount){
            this.#bloodsUseCount++;
            this.#bloodFlashFrameTime = 10; 
        }
    }
    // 累加分数
    sumScore(enemyName){

        if(enemyName == 'runner'){
            this.#score += 10;
        }else if(enemyName == 'tourelle'){
            this.#score += 50;
        }else if(enemyName == 'boss'){
            this.#score += 200;
        }else if(enemyName == 'bossgun'){
            this.#score += 100;
        }

        // 重新加载分数
        let text = this.#addZero(this.#score);
        this.#scoreShow.text = text;
        // this.#loadScore();
    }

    #createStaticTextShow(screenSize){

        const style = new TextStyle({
            fontFamily:'Arial',
            fontSize: 15,
            fill:  '#ffffff',
            stroke:{ color: "#000000", width: 1, join: "round" },
            letterSpacing: 2,
        });

        // 角色
        const personText = new Text({
            text: '角色',
            style,
        });
        personText.x = 30;
        personText.y = 20;
        this.addChild(personText)


        // 血量
        const bloodText = new Text({
            text: '血量',
            style,
        });
        bloodText.x = screenSize.width - 50;
        bloodText.y = 20;
        this.addChild(bloodText)


        //积分
        const scoreText = new Text({
            text: '积分',
            style,
        });
        scoreText.x = screenSize.width - 50;
        scoreText.y = 40;

        this.addChild(scoreText)
    }
   
   

    #loadScore(){
        const style = new TextStyle({
            fontFamily:'Arial',
            fontSize: 15,
            fill:  '#ffffff',
            stroke:{ color: "#000000", width: 1, join: "round" },
            letterSpacing: 1,
        });

        // 获取前缀
        let text = this.#addZero(this.#score);

        this.#scoreShow = new Text({
            text: text,
            style,
        });

        this.#scoreShow.x = this.#screenSize.width - 130;
        this.#scoreShow.y = 40;
        
    }
  
    // 追加0
    #addZero(num) {
        var t = (num + '').length,
            s = '';
        for (var i = 0; i < 8 - t; i++) {
            s += '0';
        }
        return s + num;
    }

      // 创建命数星星
      #createPersonStar(x,y){
        const graphics = new Graphics();
        graphics.star(x, y, 4, 10);
        graphics.fill(0xffcc5a);
        graphics.stroke({ width: 2, color: 0xfffffd });
        this.addChild(graphics);
        this.#persons.push(graphics);

        return graphics;
    }

    // 创建血量
    #createBloods(){
        this.#bloods = [];
        this.#bloodsCount = 10;
        this.#bloodsUseCount = 0;
        for (let i = 0; i < this.#bloodsCount; i++) {
            this.#createBloodRect(this.#screenSize.width - i * 7 - 60,25);
        }
    }


    //创建血量方块
    #createBloodRect(x,y){
        const graphics = new Graphics();
        graphics.rect(x, y, 3, 12);
        graphics.fill(0xffffff);
      
        this.addChild(graphics);
        this.#bloods.push(graphics);
    }

}