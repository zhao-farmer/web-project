// import { Assets, Spritesheet ,BaseTexture} from "../lib/pixi.mjs";

export default class AssetsFactory {

    #spritesheet;
    constructor(sheet){
        this.#spritesheet = sheet;
    }

    getTexture(textureName){
        return this.#spritesheet.textures[textureName];
    }

    getAnimationTexture(animationName){
        return this.#spritesheet.animations[animationName];
    }

}