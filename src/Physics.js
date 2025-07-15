// 物理类
export default class Physics{
    
    // 只用于检测碰撞
    static getOrientCollisionResult(aaRect, bbRect, aaPrevPoint) {
        const collisionResult = {
            horizontal: false, //水平
            vertical: false, //垂直
        };
        // 未发生碰撞 直接返回
        if (!this.isCheckAABB(aaRect, bbRect)) {
            return collisionResult;
        }

        aaRect.y = aaPrevPoint.y;
        // 这一步发生碰撞 而上一步未发生碰撞 由于只修改了y轴 所以垂直碰撞返回为真
        if (!this.isCheckAABB(aaRect, bbRect)) {
            collisionResult.vertical = true;
            return collisionResult;
        }
        // 发生了碰撞 但不是y轴 所以水平方向为true
        collisionResult.horizontal = true;
        return collisionResult;
    }

    // 体积碰撞 如果返回true 发生碰撞
    static isCheckAABB(entity, area) {
        return entity.x < area.x + area.width && 
        entity.x + entity.width > area.x && 
        entity.y < area.y + area.height && 
        entity.y + entity.height > area.y;
    } 
}