const WIDTH = 630
const HEIGHT = 630
const DPI_WIDTH = WIDTH * 2
const DPI_HEIGHT = HEIGHT * 2

const canvas = document.getElementById('plot');
const ctx = canvas.getContext('2d')

canvas.style.width = WIDTH + 'px'
canvas.style.height = HEIGHT + 'px'
canvas.width = DPI_WIDTH
canvas.height = DPI_HEIGHT

// let img = new Image();
// img.src = "D:/Учеба/2 курс/coursework/img/img.png";
// img.onload = function() {
        
//     let pattern = ctx.createPattern(img, "repeat");
//     ctx.fillStyle = pattern;
//     ctx.fillRect(0, 0, DPI_WIDTH, DPI_HEIGHT);
//     ctx.strokeRect(0, 0, DPI_WIDTH, DPI_HEIGHT);
// };



function findMaxCoords(coords) {
    let max_x = coords[0].x;
    let max_y = coords[0].y;
    for (let coord of coords){
        if (max_x < coord.x){
            max_x = coord.x;
        }
        if (max_y < coord.y) {
            max_y = coord.y;
        }
    }
    return {
        x: max_x,
        y: max_y
    }
}

function findMinCoords(coords) {
    let min_x = coords[0].x;
    let min_y = coords[0].y;
    for (let coord of coords){
        if (min_x > coord.x){
            min_x = coord.x;
        }
        if (min_y > coord.y) {
            min_y = coord.y;
        }
    }
    return {
        x: min_x,
        y: min_y
    }
}


  
function createCoords(newCoords) {
    const coords = [];

    for (let i = 1; i < newCoords.length; i++) {
        const
        p0 = newCoords[i - 1],
        p1 = newCoords[i],
        dx = p1.x - p0.x,
        dy = p1.y - p0.y,
        steps = Math.max(Math.abs(dx), Math.abs(dy)) / 2;
        console.log(steps);
        for (let j = 0; j < steps; j++) {
        coords.push({
            x: p0.x + dx * j / steps,
            y: p0.y + dy * j / steps,
        });
        }
    }
    console.log(coords);
    return coords;
}

function animate(newCoords, coords, index, ctx) {
    if (index === coords.length) {
        ctx.strokeStyle = '#4A495D';
        ctx.lineCap = 'round';
        ctx.lineWidth = 4;

        ctx.beginPath();
        ctx.moveTo(newCoords[0].x, newCoords[0].y);
        ctx.lineTo(newCoords[1].x, newCoords[1].y);
        ctx.lineTo(newCoords[2].x, newCoords[2].y);
        ctx.lineTo(newCoords[0].x, newCoords[0].y);
        ctx.closePath();
        
        // ctx.shadowColor = "#bbbbbb";
        // ctx.shadowBlur = 20;
        // ctx.shadowOffsetX = 15;
        // ctx.shadowOffsetY = 15;

        let gradient = ctx.createLinearGradient(0, 0, 0, DPI_HEIGHT);
        gradient.addColorStop("0","magenta");
        gradient.addColorStop(".25","blue");
        gradient.addColorStop(".50","green");
        gradient.addColorStop(".75","red");
        gradient.addColorStop("1.0","yellow");
        
        ctx.fillStyle = gradient;

        
        ctx.fillStyle = '#0D87B4';

        // let img = new Image();
        // img.src = 'D:/Учеба/2 курс/coursework/img/pattern1.png';
        // let pattern = ctx.createPattern(img, 'repeat');
        // ctx.fillStyle = pattern;
        ctx.fill();
        ctx.stroke();
        return;
    }
    
    ctx.strokeStyle = '#4A495D';
    ctx.lineCap = 'round';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(coords[index - 1].x, coords[index - 1].y);
    ctx.lineTo(coords[index].x, coords[index].y);
    ctx.stroke();
    
    requestAnimationFrame(animate.bind(null, newCoords, coords, index + 1, ctx));
}

function toggleSet(radio) {
    let type = radio.value;
    console.log(type);
    console.log(radio)
    let template = ''
    switch (type) {
        case "3sides":
            template = `
            <fieldset id="3sides" class="workplace__inputs">
                <input type="text" id="sideA" placeholder="10" required><br>
                <input type="text" id="sideB" placeholder="10" required><br>
                <input type="text" id="sideC" placeholder="10" required><br>
            </fieldset>
            `
            break;
        case "2sides&angle":
            template = `
            <fieldset id="2sides&angle" class="workplace__inputs">
                <input type="text" id="sideA" placeholder="9" required><br>
                <input type="text" id="sideB" placeholder="6" required><br>
                <input type="text" id="angleAB" placeholder="60" required><br>
            </fieldset>
            `
            break;
        case "3angles":
            template = `
            <fieldset id="3angles" class="workplace__inputs">
                <input type="text" id="angleA" placeholder="60" required><br>
                <input type="text" id="angleB" placeholder="60" required><br>
                <input type="text" id="angleC" placeholder="60" required><br>
            </fieldset>
            `
            break;
        case "height&2sides":
            template = `
            <fieldset id="height&2sides" class="workplace__inputs">
                <input type="text" id="height" required><br>
                <input type="text" id="sideA" required><br>
                <input type="text" id="sideB" required><br>
            </fieldset>
            `
            break;
        default:
            break;
    }  
    console.log(template);
    document.getElementById('workplace_place').innerHTML = template;
}

btn.onclick = () => {

    ctx.clearRect(0, 0, DPI_WIDTH, DPI_HEIGHT)
    ctx.shadowColor = "transparent";

    let type = document.querySelector('fieldset').id;
    console.log(type);
    switch (type) {
        case '3sides':
            animation3sides(ctx);
            break;
        case '2sides&angle':
            animation2sidesAndAngle(ctx);
            break;
        case '3angles':
            // animation3angles(ctx);
            break;
        case 'height&2sides':
            // animationHeight&2sides(ctx);
            break;
        default:
            break;
    }
    
}


// (function animate(coords, index) {
                //     if (index === coords.length) {
                //         return;
                //     }
                    
                //     ctx.strokeStyle = 'red';
                //     ctx.lineCap = 'round';
                //     ctx.lineWidth = 4;
                //     ctx.beginPath();
                //     ctx.moveTo(coords[index - 1].x, coords[index - 1].y);
                //     ctx.lineTo(coords[index].x, coords[index].y);
                //     ctx.stroke();
                    
                //     requestAnimationFrame(animate.bind(null, coords, index + 1));
                // })(createCoords(newCoords), 1);

function animation3sides(ctx) {
    const a = document.getElementById('sideA').value;
    const b = document.getElementById('sideB').value;
    const c = document.getElementById('sideC').value;
    console.log(document.getElementById('sideC').value)
    let tmp = a >= b && a >= c ? a : b >= c && b >= a ? b : c;
    const koef = DPI_HEIGHT / (2 * tmp);
    let A = koef * a;
    let B = koef * b;
    let C = koef * c;

    if (A + B > C && B + C > A && A + C > B) {
        let p = (A + B + C) / 2;
        let S = Math.sqrt(p * (p - A) * (p - B) * (p - C));
        let SinA = 2 * S / (A * B);
        let alpha = Math.asin(SinA);
    
        let x = Math.floor(B * Math.cos(alpha));
        let y = Math.floor(B * Math.sin(alpha));

        const coords = [
            {   x: WIDTH + A, y: HEIGHT}, 
            {   x: WIDTH, y: HEIGHT}, 
            {   x: WIDTH + x, y: HEIGHT - y}
        ];    
    
        console.log(coords);
        const maxCoords = findMaxCoords(coords);
        const minCoords = findMinCoords(coords);
        console.log(maxCoords, minCoords);
        const toCenter = {  
            x: (maxCoords.x - minCoords.x) / 2,
            y: (maxCoords.y - minCoords.y) / 2
        };
        let coef = DPI_HEIGHT / (maxCoords.y - minCoords.y);
        console.log(coef)
        const newCoords = [
            {
                x: DPI_WIDTH / 2 + A - toCenter.x,
                y: DPI_HEIGHT / 2 + toCenter.y
            }, 
            {
                x: DPI_WIDTH / 2 - toCenter.x,
                y: DPI_HEIGHT / 2 + toCenter.y
            }, 
            {
                x: DPI_WIDTH / 2 + x - toCenter.x,
                y: DPI_HEIGHT / 2 - y + toCenter.y
            }, 
            {
                x: DPI_WIDTH / 2 + A - toCenter.x,
                y: DPI_HEIGHT / 2 + toCenter.y
            }
        ];
        
        // const newCoords = [
        //     {
        //         x: DPI_WIDTH / 2 + A - toCenter.x,
        //         y: DPI_HEIGHT / 2 + toCenter.y
        //     }, {
        //         x: DPI_WIDTH / 2 - toCenter.x,
        //         y: DPI_HEIGHT / 2 + toCenter.y
        //     }, {
        //         x: DPI_WIDTH / 2 + x - toCenter.x,
        //         y: DPI_HEIGHT / 2 - y + toCenter.y
        //     }
        // ] 
        
        // ctx.beginPath();
        // ctx.rect(DPI_WIDTH / 2, DPI_HEIGHT / 2, 1, 1)
        // ctx.closePath();
        // ctx.stroke();

        // ctx.beginPath();
        // ctx.rect(minCoords.x - toCenter.x, minCoords.y + toCenter.y, maxCoords.x - minCoords.x, maxCoords.y - minCoords.y)
        // ctx.closePath();
        // ctx.lineWidth = 5;
        // ctx.strokeStyle = '#ff0000';
        // ctx.stroke();

        // ctx.beginPath();
        // ctx.rect((maxCoords.x + minCoords.x) / 2, (maxCoords.y - minCoords.y) / 2, 1, 1)
        // ctx.closePath();
        


        animate(newCoords, createCoords(newCoords), 1, ctx);



        // ctx.beginPath();
        // ctx.moveTo(newCoords[0].x, newCoords[0].y);
        // console.log(newCoords[0].x, newCoords[0].y);
        // ctx.font('normal 20px Arial, sans-serif');
        // ctx.fillText('A', DPI_WIDTH / 2 + A, DPI_HEIGHT / 2);
        // ctx.lineTo(newCoords[1].x, newCoords[1].y);
        // console.log(newCoords[1].x, newCoords[1].y);
        // ctx.fillText('B', DPI_WIDTH / 2, DPI_HEIGHT / 2);
        // ctx.lineTo(newCoords[2].x, newCoords[2].y);
        // console.log(newCoords[2].x, newCoords[2].y);
        // ctx.fillText('C', DPI_WIDTH / 2 + x, DPI_HEIGHT / 2 - y);
        // ctx.lineTo(newCoords[0].x, newCoords[0].y);
        // console.log(newCoords[0].x, newCoords[0].y);
        // ctx.closePath();
        
        
        // ctx.fillStyle = '#FF0000';
        // ctx.fill();

        // ctx.lineWidth = 5;
        // ctx.strokeStyle = '#666666';
        // ctx.stroke();

        
    } else if(A + B <= C) {
        //document.getElementById('c').style.outline = '2px solid #ff0000'
        alert("Вы ввели некорректное значение!")
    } else if(B + C <= A) {160
        //document.getElementById('a').style.outline = '2px solid #ff0000'
        alert("Вы ввели некорректное значение!")
    } else if(A + C <= B) {
        //document.getElementById('b').style.outline = '2px solid #ff0000'
        alert("Вы ввели некорректное значение!")
    }
}

function animation2sidesAndAngle(ctx) {
    const a = document.getElementById('sideA').value;
    const b = document.getElementById('sideB').value;
    const angle = document.getElementById('angleAB').value;
    const angleInRad = angle * Math.PI / 180;
    const c = Math.floor(Math.sqrt(a ** 2 + b ** 2 - 2 * a * b * Math.cos(angleInRad)))
    console.log(c, "eto c");
    let tmp = a >= b && a >= c ? a : b >= c && b >= a ? b : c;
    const koef = Math.floor(DPI_HEIGHT / (2 * tmp));
    let A = koef * a;
    let B = koef * b;
    let C = koef * c;

    if (A + B > C && B + C > A && A + C > B) {
        let p = (A + B + C) / 2;
        let S = Math.sqrt(p * (p - A) * (p - B) * (p - C));
        let SinA = 2 * S / (A * B);
        let alpha = Math.asin(SinA);
        console.log(alpha, 'это alpha')
        console.log(angleInRad, 'это angleInRad')
        let x = Math.floor(B * Math.cos(angleInRad)),
            y = Math.floor(B * Math.sin(angleInRad));
        console.log(x, 'это икс')
        const coords = [
            {
                x: DPI_WIDTH / 2 + A,
                y: DPI_HEIGHT / 2
            }, 
            {
                x: DPI_WIDTH / 2,
                y: DPI_HEIGHT / 2
            }, 
            {
                x: DPI_WIDTH / 2 + x,
                y: DPI_HEIGHT / 2 - y
            }
        ]    
    
        console.log(coords);
        const maxCoords = findMaxCoords(coords);
        const minCoords = findMinCoords(coords);
        console.log(maxCoords, minCoords);
        const toCenter = {
            x: (maxCoords.x - minCoords.x) / 2,
            y: (maxCoords.y - minCoords.y) / 2
        }
        let coef = DPI_HEIGHT / (maxCoords.y - minCoords.y);
        console.log(coef)
        const newCoords = [
            {
                x: DPI_WIDTH / 2 + A - toCenter.x,
                y: DPI_HEIGHT / 2 + toCenter.y
            }, 
            {
                x: DPI_WIDTH / 2 - toCenter.x,
                y: DPI_HEIGHT / 2 + toCenter.y
            }, 
            {
                x: DPI_WIDTH / 2 + x - toCenter.x,
                y: DPI_HEIGHT / 2 - y + toCenter.y
            }, 
            {
                x: DPI_WIDTH / 2 + A - toCenter.x,
                y: DPI_HEIGHT / 2 + toCenter.y
            }
        ]
        
        // const newCoords = [
        //     {
        //         x: DPI_WIDTH / 2 + A - toCenter.x,
        //         y: DPI_HEIGHT / 2 + toCenter.y
        //     }, {
        //         x: DPI_WIDTH / 2 - toCenter.x,
        //         y: DPI_HEIGHT / 2 + toCenter.y
        //     }, {
        //         x: DPI_WIDTH / 2 + x - toCenter.x,
        //         y: DPI_HEIGHT / 2 - y + toCenter.y
        //     }
        // ] 
        
        // ctx.beginPath();
        // ctx.rect(DPI_WIDTH / 2, DPI_HEIGHT / 2, 1, 1)
        // ctx.closePath();
        // ctx.stroke();

        // ctx.beginPath();
        // ctx.rect(minCoords.x - toCenter.x, minCoords.y + toCenter.y, maxCoords.x - minCoords.x, maxCoords.y - minCoords.y)
        // ctx.closePath();
        // ctx.lineWidth = 5;
        // ctx.strokeStyle = '#ff0000';
        // ctx.stroke();

        // ctx.beginPath();
        // ctx.rect((maxCoords.x + minCoords.x) / 2, (maxCoords.y - minCoords.y) / 2, 1, 1)
        // ctx.closePath();
        


        animate(newCoords, createCoords(newCoords), 1, ctx);



        // ctx.beginPath();
        // ctx.moveTo(newCoords[0].x, newCoords[0].y);
        // console.log(newCoords[0].x, newCoords[0].y);
        // ctx.font('normal 20px Arial, sans-serif');
        // ctx.fillText('A', DPI_WIDTH / 2 + A, DPI_HEIGHT / 2);
        // ctx.lineTo(newCoords[1].x, newCoords[1].y);
        // console.log(newCoords[1].x, newCoords[1].y);
        // ctx.fillText('B', DPI_WIDTH / 2, DPI_HEIGHT / 2);
        // ctx.lineTo(newCoords[2].x, newCoords[2].y);
        // console.log(newCoords[2].x, newCoords[2].y);
        // ctx.fillText('C', DPI_WIDTH / 2 + x, DPI_HEIGHT / 2 - y);
        // ctx.lineTo(newCoords[0].x, newCoords[0].y);
        // console.log(newCoords[0].x, newCoords[0].y);
        // ctx.closePath();
        
        
        // ctx.fillStyle = '#FF0000';
        // ctx.fill();

        // ctx.lineWidth = 5;
        // ctx.strokeStyle = '#666666';
        // ctx.stroke();

        
    } else if(A + B <= C) {
        //document.getElementById('c').style.outline = '2px solid #ff0000'
        alert("Вы ввели некорректное значение!")
    } else if(B + C <= A) {
        //document.getElementById('a').style.outline = '2px solid #ff0000'
        alert("Вы ввели некорректное значение!")
    } else if(A + C <= B) {
        //document.getElementById('b').style.outline = '2px solid #ff0000'
        alert("Вы ввели некорректное значение!")
    }
}