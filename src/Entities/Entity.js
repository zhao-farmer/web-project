export default class Entity{
    _view;
    #isDead;
    // 是否处于活跃状态
    #isActive;
    // 是否可以移动的 默认为false
    #gravitable = false;

    constructor(view){
        this._view = view;
    }

    get x(){
        return this._view.x;
    }
    set x(value){
        this._view.x = value;
    }

    get y(){
        return this._view.y;
    }
    set y(value){
        this._view.y = value;
    }

    get gravitable(){
        return this.#gravitable;
    }
    set gravitable(value){
        this.#gravitable = value;
    }

    get isActive(){
        return this.#isActive;
    }
    set isActive(value){
        this.#isActive = value;
    }
    get collisionBox(){
        return this._view.collisionBox;
    }

    get hitBox(){
        return this._view.hitBox;
    }

    get isDead(){
        return this.#isDead;
    }

    // 复活
    resuraction(){
        this.#isDead = false;
    }
    // 死亡
    dead(){
        this.#isDead = true;
    }

    removeFromStage(){
        if(this._view.parent != null){
            this._view.removeFromParent();
        }
    }
}
