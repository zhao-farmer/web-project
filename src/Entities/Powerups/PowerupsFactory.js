import Powerup from "./Powerup.js";
import PowerupView from "./PowerupView.js";
import SpreadGunPowerup from "./SpreadGunPowerup.js";
import SpreadGunPowerupView from "./SpreadGunPowerupView.js";

export default class PowerupsFactory{
    
    #entities;
    #assets;
    #worldContainer;
    #target;
    
    constructor(worldContainer,entities,assets,target){
        this.#worldContainer = worldContainer;
        this.#entities = entities;
        this.#assets = assets;
        this.#target = target;
    }

    createPowerup(x,y){
        const view = new PowerupView(this.#assets);
        const powerup = new Powerup(this,view,y,this.#target);
        view.x = x;

        this.#worldContainer.addChild(view);
        this.#entities.push(powerup);
    }

    createSpreadGunPowerup(x,y){
        const spreadGunPowerupView = new SpreadGunPowerupView(this.#assets);
        const spreadGunPowerup = new SpreadGunPowerup(spreadGunPowerupView);

        spreadGunPowerup.x = x;
        spreadGunPowerup.y = y;

        this.#worldContainer.addChild(spreadGunPowerupView);
        this.#entities.push(spreadGunPowerup);
        
    }
}