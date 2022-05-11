const WIDTH = 630;
const HEIGHT = 630;
const DPI_WIDTH = WIDTH * 2;
const DPI_HEIGHT = HEIGHT * 2;

const canvas = document.getElementById("plot");
const ctx = canvas.getContext("2d");

canvas.style.width = WIDTH + "px";
canvas.style.height = HEIGHT + "px";
canvas.width = DPI_WIDTH;
canvas.height = DPI_HEIGHT;

function findMaxPoints(points) {
    let max_x = points[0].x;
    let max_y = points[0].y;
    for (let point of points) {
        if (max_x < point.x) {
            max_x = point.x;
        }
        if (max_y < point.y) {
            max_y = point.y;
        }
    }
    return {
        x: max_x,
        y: max_y,
    };
}

function findMinPoints(points) {
    let min_x = points[0].x;
    let min_y = points[0].y;
    for (let point of points) {
        if (min_x > point.x) {
            min_x = point.x;
        }
        if (min_y > point.y) {
            min_y = point.y;
        }
    }
    return {
        x: min_x,
        y: min_y,
    };
}

function createCoords(points) {
    const coords = [];

    for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];
        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;
        const steps = Math.max(Math.abs(dx), Math.abs(dy)) / 2;
        //console.log(steps);
        for (let j = 0; j < steps; j++) {
            coords.push({
                x: p0.x + (dx * j) / steps,
                y: p0.y + (dy * j) / steps,
            });
        }
    }
    //console.log(coords);
    return coords;
}

function drawTriangle(ctx, points) {
    ctx.strokeStyle = "#4A495D";
    ctx.lineCap = "round";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.lineTo(points[0].x, points[0].y);
    ctx.closePath();

    ctx.fillStyle = "#0D87B4";
    ctx.fill();

    ctx.stroke();
}

function drawDot(ctx, coords, index) {
    ctx.strokeStyle = "#4A495D";
    ctx.lineCap = "round";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(coords[index - 1].x, coords[index - 1].y);
    ctx.lineTo(coords[index].x, coords[index].y);
    ctx.closePath();

    ctx.stroke();
}

function animate(points, coords, index, ctx) {
    if (index === coords.length) {
        drawTriangle(ctx, points);
        return;
    }

    drawDot(ctx, coords, index);
    requestAnimationFrame(animate.bind(null, points, coords, index + 1, ctx));
}

function toggleSet(radio) {
    const type = radio.value;
    //console.log(type);
    //console.log(radio);
    const btn = document.getElementById('btn');
    if (btn.disabled) {
        btn.removeAttribute('disabled');
        btn.style.cursor = 'pointer';
        //console.log(btn);
    }

    let template = "";
    switch (type) {
        case "3sides":
            template = `
            <fieldset id="3sides" class="workplace__inputs">
                <input type="text" id="sideA" placeholder="10" required><br>
                <input type="text" id="sideB" placeholder="10" required><br>
                <input type="text" id="sideC" placeholder="10" required><br>
            </fieldset>
            `
            ;
            break;
        case "2sides&angle":
            template = `
            <fieldset id="2sides&angle" class="workplace__inputs">
                <input type="text" id="sideA" placeholder="9" required><br>
                <input type="text" id="sideB" placeholder="6" required><br>
                <input type="text" id="angleAB" placeholder="60" required><br>
            </fieldset>
            `
            ;
            break;
        case "2angles&side":
            template = `
            <fieldset id="2angles&side" class="workplace__inputs">
                <input type="text" id="angleA" placeholder="60" required><br>
                <input type="text" id="angleB" placeholder="60" required><br>
                <input type="text" id="sideAB" placeholder="10" required><br>
            </fieldset>
            `
            ;
            break;
        case "height&2sides":
            template = `
            <fieldset id="height&2sides" class="workplace__inputs">
                <input type="text" id="height" placeholder="2.4" required><br>
                <input type="text" id="sideA" placeholder="3" required><br>
                <input type="text" id="sideB" placeholder="4" required><br>
            </fieldset>
            `
            ;
            break;
        default:
            break;
    }
    //console.log(template);
    document.getElementById("workplace_place").innerHTML = template;
}

btn.onclick = () => {
    ctx.clearRect(0, 0, DPI_WIDTH, DPI_HEIGHT);
    ctx.shadowColor = "transparent";

    const type = document.querySelector("fieldset").id;
    //console.log(type);
    switch (type) {
        case "3sides":
            animation3sides(ctx);
            break;
        case "2sides&angle":
            animation2sidesAndAngle(ctx);
            break;
        case "2angles&side":
            animation2anglesAndSide(ctx);
            break;
        case "height&2sides":
            animationHeightAnd2sides(ctx);
            break;
        default:
            break;
    }
};

function findCenteredPoints(points){
    const maxPoints = findMaxPoints(points);
    const minPoints = findMinPoints(points);
    //console.log(maxPoints, minPoints);
    const toCenter = {
        x: (maxPoints.x - minPoints.x) / 2,
        y: (maxPoints.y - minPoints.y) / 2,
    };
    return [
        {
            x: Math.floor(points[0].x - toCenter.x),
            y: Math.floor(points[0].y + toCenter.y)
        },
        {
            x: Math.floor(points[1].x - toCenter.x),
            y: Math.floor(points[1].y + toCenter.y)
        },
        {
            x: Math.floor(points[2].x - toCenter.x),
            y: Math.floor(points[2].y + toCenter.y)
        },
        {
            x: Math.floor(points[0].x - toCenter.x),
            y: Math.floor(points[0].y + toCenter.y)
        }
    ]
}

function findMaxValue(a, b, c) {
    return a >= b && a >= c ? a : b >= c && b >= a ? b : c;
}

function isTriangleExist(A, B, C) {
    return A + B > C && B + C > A && A + C > B;
}

function alertValue() {
    alert("Введите корректные численные значения!");
}

function alertTriangle(){
    alert("Вы ввели некорректное значение! Нарушено правило существования треуголников!");
}

function isValid3sides(a, b, c) {
    return typeof a === 'number' && typeof b === 'number' && typeof c === 'number' && a > 0 && b > 0 && c > 0;
}

function animation3sides(ctx) {
    const a = +document.getElementById("sideA").value;
    const b = +document.getElementById("sideB").value;
    const c = +document.getElementById("sideC").value;
    
    if (!isValid3sides(a, b, c)) {
        alertValue();
        document.getElementById("sideA").value = '';
        document.getElementById("sideB").value = '';
        document.getElementById("sideC").value = '';
        return 
    }

    const maxValue = findMaxValue(a, b, c);
    const coef = DPI_HEIGHT / (2 * maxValue);
    const A = coef * a;
    const B = coef * b;
    const C = coef * c;

    if (isTriangleExist(A, B, C)) {
        const p = (A + B + C) / 2;
        const S = Math.sqrt(p * (p - A) * (p - B) * (p - C));
        const SinA = (2 * S) / (A * B);
        const alpha = Math.asin(SinA);

        const x = Math.floor(B * Math.cos(alpha));
        const y = Math.floor(B * Math.sin(alpha));

        const initialPoints = [
            { x: WIDTH + A, y: HEIGHT },
            { x: WIDTH, y: HEIGHT }, // находится по центру экрана
            { x: WIDTH + x, y: HEIGHT - y },
        ];
        //console.log(initialPoints);
        const centeredPoints = findCenteredPoints(initialPoints);
        //console.log(fixedPoints);
        animate(centeredPoints, createCoords(centeredPoints), 1, ctx);
    } 
    else {
        alertTriangle();
    }
}

function isValid2sidesAndAngle(a, b, angle) {
    return typeof a === 'number' && typeof b === 'number' && typeof angle === 'number' && a > 0 && b > 0 && angle > 0 && angle < 180;
}

function animation2sidesAndAngle(ctx) {
    const a = +document.getElementById("sideA").value;
    const b = +document.getElementById("sideB").value;
    const angle = +document.getElementById("angleAB").value;

    if (!isValid2sidesAndAngle(a, b, angle)) {
        alertValue();
        document.getElementById("sideA").value = '';
        document.getElementById("sideB").value = '';
        document.getElementById("angleAB").value = '';
        return 
    }

    const angleInRad = (angle * Math.PI) / 180;
    const c = Math.floor(Math.sqrt(a ** 2 + b ** 2 - 2 * a * b * Math.cos(angleInRad)));
    const maxValue = findMaxValue(a, b, c);
    const coef = Math.floor(DPI_HEIGHT / (2 * maxValue));
    const A = coef * a;
    const B = coef * b;
    const C = coef * c;

    if (isTriangleExist(A, B, C)) {
        const x = Math.floor(B * Math.cos(angleInRad));
        const y = Math.floor(B * Math.sin(angleInRad));
        const initialPoints = [
            { x: WIDTH + A, y: HEIGHT },
            { x: WIDTH, y: HEIGHT }, // находится по центру экрана
            { x: WIDTH + x, y: HEIGHT - y },
        ];

        const centeredPoints = findCenteredPoints(initialPoints);
        //console.log(fixedPoints);
        animate(centeredPoints, createCoords(centeredPoints), 1, ctx);
    } 
    else {
        alertTriangle();
    }
}

function isValid2anglesAndSide(angleA, angleB, sideAB) {
    return typeof angleA === 'number' && typeof angleB === 'number' && typeof sideAB === 'number' && (angleA > 0 && angleA < 180 && angleB > 0 && angleB < 180 && (angleA + angleB) < 180) && sideAB > 0;
}

function animation2anglesAndSide(ctx){
    
    const angleA = +document.getElementById("angleA").value;
    const angleB = +document.getElementById("angleB").value;
    const sideAB = +document.getElementById("sideAB").value;
    if (!isValid2anglesAndSide(angleA, angleB, sideAB)) {
        alertValue();
        document.getElementById("angleA").value = '';
        document.getElementById("angleB").value = '';
        document.getElementById("sideAB").value = '';
        return 
    }
    const angleAInRad = (angleA * Math.PI) / 180;
    const angleBInRad = (angleB * Math.PI) / 180;
    const a = sideAB;
    const b = a * Math.sin(angleBInRad) / Math.sin(angleAInRad);
    console.log(b);
    const angleC = 180 - angleA - angleB;
    console.log(angleC);
    const angleCInRad = (angleC * Math.PI) / 180;
    const c = a * Math.sin(angleCInRad) / Math.sin(angleAInRad);
    console.log(c);
    const maxValue = findMaxValue(a, b, c);
    const coef = Math.floor(DPI_HEIGHT / (2 * maxValue));
    const A = coef * a;
    const B = coef * b;
    const C = coef * c;

    if (isTriangleExist(A, B, C)) {
        const x = Math.floor(B * Math.cos(alpha));
        const y = Math.floor(B * Math.sin(alpha));
        const initialPoints = [
            { x: WIDTH + A, y: HEIGHT },
            { x: WIDTH, y: HEIGHT }, // находится по центру экрана
            { x: WIDTH + x, y: HEIGHT - y },
        ];

        const centeredPoints = findCenteredPoints(initialPoints);
        //console.log(fixedPoints);
        animate(centeredPoints, createCoords(centeredPoints), 1, ctx);
    } 
    else {
        alertTriangle();
    }
}

function isValidHeightAnd2sides(height, sideA, sideB) {
    return typeof height === 'number' && typeof sideA === 'number' && typeof sideB === 'number' && height > 0 && sideA > 0 && sideB > 0;
}

function animationHeightAnd2sides(ctx){
    
    const height = +document.getElementById("height").value;
    const a = +document.getElementById("sideA").value;
    const b = +document.getElementById("sideB").value;
    if (!isValidHeightAnd2sides(height, a, b)) {
        console.log(height)
        alertValue();
        document.getElementById("height").value = '';
        document.getElementById("sideA").value = '';
        document.getElementById("sideB").value = '';
        return 
    }
    
    const x = Math.sqrt(b ** 2 - height ** 2);
    const c = Math.sqrt(a ** 2 - height ** 2) + x;
    const maxValue = findMaxValue(a, b, c);
    const coef = Math.floor(DPI_HEIGHT / (2 * maxValue));
    const A = coef * a;
    const B = coef * b;
    const C = coef * c;

    if (isTriangleExist(A, B, C)) {
        const p = (A + B + C) / 2;
        const S = Math.sqrt(p * (p - A) * (p - B) * (p - C));
        const SinA = (2 * S) / (A * B);
        const alpha = Math.asin(SinA);

        const x = Math.floor(B * Math.cos(alpha));
        const y = Math.floor(B * Math.sin(alpha));
        const initialPoints = [
            { x: WIDTH + A, y: HEIGHT },
            { x: WIDTH, y: HEIGHT }, // находится по центру экрана
            { x: WIDTH + x, y: HEIGHT - y },
        ];

        const centeredPoints = findCenteredPoints(initialPoints);
        //console.log(fixedPoints);
        animate(centeredPoints, createCoords(centeredPoints), 1, ctx);
    } 
    else {
        alertTriangle();
    }
}