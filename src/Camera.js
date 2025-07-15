export default class Camera {
    #target;
    #world;
    #isBackScrollX;
    #centerScreenPointX;
    #rightBorderWorldPointX;
    #lastTargetX = 0;

    constructor(cameraSetting) {
        // 目标点 也是英雄的位置
        this.#target = cameraSetting.target;
        // 页面上展示的容器 也就是容器
        this.#world = cameraSetting.world;
        // 是否禁止向后移动
        this.#isBackScrollX = cameraSetting.isBackScrollX;

        // 中心点等于屏幕宽度的二分之一
        this.#centerScreenPointX = cameraSetting.screenSize.width / 2;
        // 右侧可以浏览照相机的点 （过完这个点 不再宽展）
        this.#rightBorderWorldPointX = this.#world.width - this.#centerScreenPointX;
    }
    update() {
        // this.#target.x > this.#centerScreenPointX 当目标超过中心点时 修改相机容器的位置
        // this.#target.x < this.#rightBorderWorldPointX 防止右边没有平台依然有空间
        // this.#isBackScroll || this.#target.x > this.#lastTargetX 判断是否可以向后移动
        if (this.#target.x > this.#centerScreenPointX && this.#target.x < this.#rightBorderWorldPointX && (this.#isBackScrollX || this.#target.x > this.#lastTargetX)) {
            // 相机x的位置等于 中心点减去目标点的x轴 而且这个值 0到无限大
            this.#world.x = this.#centerScreenPointX - this.#target.x;
            // 记录存储最后移动的位置
            this.#lastTargetX = this.#target.x;
        }
    }
}
