import Hero from "./Hero.js";
import HeroView from "./HeroView.js";

export default class HeroFactory{
    #worldContainer;
    #assets;
    #staticData;
    constructor(worldContainer,assets,staticData) {
        this.#worldContainer = worldContainer;
        this.#assets = assets;
        this.#staticData = staticData;
    }
    create(x, y) {
        const heroView = new HeroView(this.#assets);
        this.#worldContainer.addChild(heroView);
      
        const hero = new Hero(heroView, this.#staticData);
        hero.x = x;
        hero.y = y;
        
        return hero;
    }
}