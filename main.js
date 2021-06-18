
window.onload = () => {
    const App = new Vue({
        el:'#app',
        data() {
            return {
                title: 'MASK',
                activeQuestion: 0,
                inMask: true,
                inputBoxShow: true
            }
        },
        methods: {
            answer(){
                  this.inMask = !this.inMask
            },
            anwsered() {
                setTimeout(() => {
                    
                this.inMask = !this.inMask
                }, 1000);
            },
            nextQuestion() {
                if (this.activeQuestion <= 2) this.activeQuestion++
            },
            prevQuestion() {
                if (this.activeQuestion >= 1) this.activeQuestion--
            }
        }
    })

    // Vue.createApp(App).mount('#app')

}

let btn1, btn2
let value1 //how happy
let value2 //how satisfied
let value3 
let value4
let borderRadius

let maskA, maskB, maskAM, maskBM
let mask
const maskW = 500
const maskH = 700

function preload() {
    mask = loadImage('./mask_2.png')
}

function setup() {
    let cnv = createCanvas(window.innerWidth, window.innerHeight)
    cnv.parent('#canvasBox')

    maskB = createGraphics(maskW, maskH)
    maskA = createGraphics(maskW, maskH)
    maskAM = createImage(maskW, maskH)
    maskBM = createImage(maskW, maskH)

    colorMode(HSL, 100)

}

function draw() {
    clear()
    maskA.background('white')
    maskB.background('white')
    maskAM = createImage(maskW, maskH)
    maskBM = createImage(maskW, maskH)



    makeMaskA()
    makeMaskB()


}

function makeMaskA() {
    //绘制第一个面具

    makeMaskPattern(maskA)
    //面具生成程序，两个面具用同样的逻辑，只是参数不一样

    maskAM.copy(maskA, 0, 0, maskW, maskH, 0, 0, maskW, maskH)
    
    maskAM.mask(mask)
    //如果不要面具遮罩，注释上面这句

    image(maskAM, width / 2 - maskW / 2, 30)
}

function makeMaskB() {
    makeMaskPattern(maskB)

    //第二个面具画完以后要擦除
    maskB.erase()
    maskB.translate(map(mouseX, 0, maskW, 0, maskW / 2), 0)
    maskB.rect(0, 0, maskW, 800)
    maskB.resetMatrix()
    maskB.noErase()

    maskBM.copy(maskB, 0, 0, maskW, maskH, 0, 0, maskW, maskH)
    
    maskBM.mask(mask)
    //如果不要面具遮罩，注释上面这句

    image(maskBM, width / 2 - maskW / 2, 30)

}

function makeMaskPattern(xMask) {
    xMask.noStroke()
    let maskType

    // 程序难点，在html页面每个问题有两个input栏，会根据inMask变量显示与否；
    // 面具绘制分别使用两个input的值
    if (xMask == maskA) {
        maskType = noise(3) * 100
        value1 = select('#value1').value()
        value2 = select('#value2').value()
        value3 = select('#value3').value()
        value4 = select('#value4').value()
        borderRadius = select('#value1').value()
    } else {
        maskType = noise(5) * 100
        value1 = select('#value1M').value()
        value2 = select('#value2M').value()
        value3 = select('#value3M').value()
        value4 = select('#value4M').value()
        borderRadius = select('#value1M').value()
    }

    c1 = color(value1, map(value1, 0, 100, 0, 100), 80)
    xMask.fill(c1)

    //Q1 第一种图案
    let currentHeight = 0
    let allHeight = 0
    let i = noise(5) * 100
    do {
        i++
        if (i > 100) i = 0
        let ranHeight = max(5, noise(maskType) * value1 * 5)
        allHeight += ranHeight
        let ranC = color(i * 3, map(value1, 0, 100, 100, 50), map(value1, 0, 100, 80, 20))
        xMask.fill(ranC)
        xMask.rect(0, 0 + currentHeight, maskW, ranHeight)
        currentHeight += ranHeight
    }
    while (allHeight < maskH)


    //Q2 第二种图案
    for (let i = 0; i < map(value2,0,100,1,10); i++) {
        c2 = color(noise(i)*100, 80, map(value2, 0, 100, 90, 10))
        xMask.fill(c2)
        xMask.circle(maskW / 2, maskH / 2 + map(value2, 0, 100, -200, 200),  map(mouseY, 0, height, 400, 700-i*100))
    }

    //Q3 第三种图案
    xMask.rectMode(CENTER);
    xMask.translate(maskW / 2,mouseY)
    xMask.rotate(PI/4)
    
    for(let i = 0; i < 5; i++){
        let c3 = color(noise(value3*i*5)*100,50,50)
        let rectSize = map(value3,0,100,100,500) - i*[map(value3,0,100,0,30)]
        xMask.fill(c3)
        xMask.rect(0,0,rectSize,rectSize)
    }
    
    xMask.resetMatrix()
    xMask.shearX(map(value3,0,100,PI/3,0))
    xMask.resetMatrix()
    xMask.rectMode(CORNER)


    //Q4
    // console.log(value4);
    
    
    xMask.rectMode(CENTER)
    for(let i = 0; i <3;i++){
        
        let c = color(noise(value4*i)*100,map(value4,0,100,60,100),map(value4,0,100,0,100))
        let circleRadius = 100 + value4 - i * map(mouseY,0,height,0,100) + map(mouseY,0,height,0,150)
        xMask.fill(c)
        xMask.square(maskW/2,maskH,circleRadius,map(value4,0,100,200,0))
    }

    

    xMask.rectMode(CORNER)
}