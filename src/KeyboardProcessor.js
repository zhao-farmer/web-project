export default class KeyboardProcessor {
    #keyMap = {
        KeyS: {
            isDown: false,
        },
        KeyA: {
            isDown: false,
        },
        ArrowLeft: {
            isDown: false,
        },
        ArrowRight: {
            isDown: false,
        },
        ArrowUp: {
            isDown: false,
        },
        ArrowDown: {
            isDown: false,
        },
    };
    #gameContext;
    constructor(gameContext) {
        this.#gameContext = gameContext;
    }
    getButton(keyName) {
        return this.#keyMap[keyName];
    }
    // key值 key: "s"  keyCode: 83  type:"keydown" code: "KeyS"
    onKeyDown(key) {
        const button = this.#keyMap[key.code];
        //保证不会按其他按键不会崩溃
        if (button != undefined) {
            //必须放外边 有的组合键兵没有执行操作 也应该设置为true
            button.isDown = true;
            // if (button.hasOwnProperty("executeDown")) {
            //     button.executeDown.call(this.#gameContext);
            // }
            // 使用 ? 代替hasOwnProperty检测属性
            button.executeDown?.call(this.#gameContext);
        }
    }

    onKeyUp(key) {
        const button = this.#keyMap[key.code];
        //必须放外边
        if(button){
            button.isDown = false;
        }
        
        if (button != undefined) {
            button.executeUp?.call(this.#gameContext);
        }
    }

    isButtonPressed(keyName) {
        return this.#keyMap[keyName]?.isDown;
    }
}
