export default class Music {
    #background
    constructor() {
        // 背景音乐
        this.#background = document.getElementById("audioId")
        this.#background.loop = true
        this.#background.src = './assets/sound/background.mp3'
        this.#background.muted = true
        this.#background.volume= 0.5;
        this.#background.gameLevel = 1
    }

    loadMusic(){
        if (this.#background && this.#background.muted == true) {
            //等到用户有交互操作了之后，就取消静音
            this.#background.muted = false
            this.#background.play();
        }
    }
    

    playMusic(level){
        if(this.#background.muted ||this.#background.gameLevel === level){
            return;
        }
         // 各个关卡的BGM
        if(level == 1){
            this.#background.src = './assets/sound/background.mp3'
            this.#background.play()
        }else if(level === 2){
           
        }
    }

    // 枪声1
    playSpear01(){
        let audio = document.createElement("audio");
        audio.src = './assets/sound/spear01.mp3';
        // 加载完成后开始播放
        audio.addEventListener('canplaythrough', function() {
            audio.play();
        });
    }

    // 枪声2
    playSpear02(){
        let audio = document.createElement("audio");
        audio.src = './assets/sound/spear02.mp3';
        // 加载完成后开始播放
        audio.addEventListener('canplaythrough', function() {
            audio.play();
        });
    }

    // 机器枪声
    playMachineSpear(){
        let audio = document.createElement("audio");
        audio.src = './assets/sound/spear02.mp3';
        // 加载完成后开始播放
        audio.addEventListener('canplaythrough', function() {
            audio.play();
        });
    }

    // 敌人爆炸声
    playExplosion00(){
        let audio = document.createElement("audio");
        audio.src = './assets/sound/explosion00.mp3';
        // 加载完成后开始播放
        audio.addEventListener('canplaythrough', function() {
            audio.play();
        });
    }

    // 桥爆炸声
    playExplosion01(){
        let audio = document.createElement("audio");
        audio.src = './assets/sound/explosion01.mp3';
        // 加载完成后开始播放
        audio.addEventListener('canplaythrough', function() {
            audio.play();
        });
    }

    // Boss爆炸声
    playExplosion03(){
        let audio = document.createElement("audio");
        audio.src = './assets/sound/explosion03.mp3';
        // 加载完成后开始播放
        audio.addEventListener('canplaythrough', function() {
            audio.play();
        });
    }
}