const WIDTH = 630;
const HEIGHT = 630;
const DPI_WIDTH = WIDTH * 2;
const DPI_HEIGHT = HEIGHT * 2;
const MAX_VALUE = 100000;
const MIN_VALUE = 0;
const MAX_ANGLE = 180;
const MIN_ANGLE = 0;

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
    const btn = document.getElementById('btn');

    if (btn.disabled) {
        btn.removeAttribute('disabled');
        btn.style.cursor = 'pointer';
    }

    let template = "";
    switch (type) {
        case "3sides":
            template = `
            <fieldset id="3sides" class="workplace__inputs">
                <input type="text" id="sideA" placeholder="A ∈ (0; 100000)"><br>
                <input type="text" id="sideB" placeholder="B ∈ (0; 100000)"><br>
                <input type="text" id="sideC" placeholder="C ∈ (0; 100000)"><br>
            </fieldset>
            `
            ;
            break;
        case "2sides&angle":
            template = `
            <fieldset id="2sides&angle" class="workplace__inputs">
                <input type="text" id="sideA" placeholder="A ∈ (0; 100000)"><br>
                <input type="text" id="sideB" placeholder="B ∈ (0; 100000)"><br>
                <input type="text" id="angleAB" placeholder="α ∈ (0; 180)"><br>
            </fieldset>
            `
            ;
            break;
        case "2angles&side":
            template = `
            <fieldset id="2angles&side" class="workplace__inputs">
                <input type="text" id="angleA" placeholder="α ∈ (0; 180)"><br>
                <input type="text" id="angleB" placeholder="β ∈ (0; 180)"><br>
                <input type="text" id="sideAB" placeholder="C ∈ (0; 100000)"><br>
            </fieldset>
            `
            ;
            break;
        case "height&2sides":
            template = `
            <fieldset id="height&2sides" class="workplace__inputs">
                <input type="text" id="height" placeholder="h ∈ (0; 100000)"><br>
                <input type="text" id="sideA" placeholder="A ∈ (0; 100000)"><br>
                <input type="text" id="sideB" placeholder="B ∈ (0; 100000)"><br>
            </fieldset>
            `
            ;
            break;
        case "median&2sides":
            template = `
            <fieldset id="median&2sides" class="workplace__inputs">
                <input type="text" id="median" placeholder="m ∈ (0; 100000)"><br>
                <input type="text" id="sideB" placeholder="B ∈ (0; 100000)"><br>
                <input type="text" id="sideC" placeholder="C ∈ (0; 100000)"><br>
            </fieldset>
            `
            ;
            break;
        case "bisector&2sides":
            template = `
            <fieldset id="bisector&2sides" class="workplace__inputs">
                <input type="text" id="bisector" placeholder="l ∈ (0; 100000)"><br>
                <input type="text" id="sideB" placeholder="B ∈ (0; 100000)"><br>
                <input type="text" id="sideC" placeholder="C ∈ (0; 100000)"><br>
            </fieldset>
            `
            ;
            break;
        case "radius&2angles":
            template = `
            <fieldset id="radius&2angles" class="workplace__inputs">
                <input type="text" id="radius" placeholder="R ∈ (0; 100000)"><br>
                <input type="text" id="angleA" placeholder="α ∈ (0; 180)"><br>
                <input type="text" id="angleB" placeholder="β ∈ (0; 180)"><br>
            </fieldset>
            `
            ;
            break;
        case "radius&2sides":
            template = `
            <fieldset id="radius&2sides" class="workplace__inputs">
                <input type="text" id="radius" placeholder="R ∈ (0; 100000)"><br>
                <input type="text" id="sideA" placeholder="A ∈ (0; 100000)"><br>
                <input type="text" id="sideB" placeholder="B ∈ (0; 100000)"><br>
            </fieldset>
            `
            ;
            break;
        default:
            break;
    }
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
        case "median&2sides":
            animationMedianAnd2sides(ctx);
            break;
        case "bisector&2sides":
            animationBisectorAnd2sides(ctx);
            break;
        case "radius&2angles":
            animationRadiusAnd2angles(ctx);
            break;  
        case "radius&2sides":
            animationRadiusAnd2sides(ctx);
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

function findMaxValue([a, b, c]) {
    return a >= b && a >= c ? a : b >= c && b >= a ? b : c;
}

function isTriangleExist(A, B, C) {
    return A + B > C && B + C > A && A + C > B;
}

function alertValue() {
    alert("Введите корректные численные значения! В диапозоне (0, 100_000)!");
}

function alertCalculation(value) {
    alert("Подсчитанные числа для треугольника вне диапозона (0, 100_000)! Одна из сторон равна " + Math.floor(value) + "!");
}

function alertTriangle(){
    alert("Вы ввели некорректное значение! Нарушено правило существования треуголников!");
}

function reduction(a, b, c) {
    while (a > HEIGHT || b > HEIGHT || c > HEIGHT) {
        a /= 2;
        b /= 2;
        c /= 2;
    }
    return [a, b, c];
}

function isValid3sides(a, b, c) {
    return typeof a === 'number' && typeof b === 'number' && typeof c === 'number' && a > MIN_VALUE && a < MAX_VALUE && b > MIN_VALUE && b < MAX_VALUE && c > MIN_VALUE && c < MAX_VALUE;
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

    const reducedValues = reduction(a, b, c);

    const maxValue = findMaxValue(reducedValues);
    const coef = DPI_HEIGHT / (2 * maxValue);
    const A = coef * reducedValues[0];
    const B = coef * reducedValues[1];
    const C = coef * reducedValues[2];

    if (isTriangleExist(A, B, C)) {
        const p = (A + B + C) / 2;
        const S = Math.sqrt(p * (p - A) * (p - B) * (p - C));
        const SinA = (2 * S) / (A * B);
        const alpha = Math.asin(SinA);

        const x = Math.floor(B * Math.cos(alpha));
        const y = Math.floor(B * Math.sin(alpha));

        const initialPoints = [
            { x: WIDTH + A, y: HEIGHT },
            { x: WIDTH, y: HEIGHT },
            { x: WIDTH + x, y: HEIGHT - y },
        ];

        const centeredPoints = findCenteredPoints(initialPoints);

        animate(centeredPoints, createCoords(centeredPoints), 1, ctx);
    } 
    else {
        alertTriangle();
    }
}

function isValid2sidesAndAngle(a, b, angle) {
    return typeof a === 'number' && typeof b === 'number' && typeof angle === 'number' && angle > MIN_ANGLE && angle < MAX_ANGLE && a > MIN_VALUE && a < MAX_VALUE && b > MIN_VALUE && b < MAX_VALUE;
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
        return;
    }

    const angleInRad = (angle * Math.PI) / MAX_ANGLE;
    const c = Math.floor(Math.sqrt(a ** 2 + b ** 2 - 2 * a * b * Math.cos(angleInRad)));

    if (c > MAX_VALUE || c < MIN_VALUE) {
        alertCalculation(c);
        return;
    }

    const reducedValues = reduction(a, b, c);

    const maxValue = findMaxValue(reducedValues);
    const coef = Math.floor(DPI_HEIGHT / (2 * maxValue));
    const A = coef * reducedValues[0];
    const B = coef * reducedValues[1];
    const C = coef * reducedValues[2];

    if (isTriangleExist(A, B, C)) {
        const x = Math.floor(B * Math.cos(angleInRad));
        const y = Math.floor(B * Math.sin(angleInRad));

        const initialPoints = [
            { x: WIDTH + A, y: HEIGHT },
            { x: WIDTH, y: HEIGHT },
            { x: WIDTH + x, y: HEIGHT - y },
        ];

        const centeredPoints = findCenteredPoints(initialPoints);

        animate(centeredPoints, createCoords(centeredPoints), 1, ctx);
    } 
    else {
        alertTriangle();
    }
}

function isValid2anglesAndSide(angleA, angleB, a) {
    return typeof angleA === 'number' && typeof angleB === 'number' && typeof a === 'number' && (angleA > MIN_ANGLE && angleA < MAX_ANGLE && angleB > MIN_ANGLE && angleB < MAX_ANGLE && (angleA + angleB) < MAX_ANGLE) && a > MIN_VALUE && a < MAX_VALUE;
}

function animation2anglesAndSide(ctx){
    const angleA = +document.getElementById("angleA").value;
    const angleB = +document.getElementById("angleB").value;
    const a = +document.getElementById("sideAB").value;

    if (!isValid2anglesAndSide(angleA, angleB, a)) {
        alertValue();
        document.getElementById("angleA").value = '';
        document.getElementById("angleB").value = '';
        document.getElementById("sideAB").value = '';
        return;
    }

    const angleAInRad = (angleA * Math.PI) / MAX_ANGLE;
    const angleBInRad = (angleB * Math.PI) / MAX_ANGLE;
    const b = a * Math.sin(angleBInRad) / Math.sin(angleAInRad);

    if (b > MAX_VALUE || b < MIN_VALUE) {
        alertCalculation(b);
        return;
    }

    const angleC = MAX_ANGLE - angleA - angleB;
    const angleCInRad = (angleC * Math.PI) / MAX_ANGLE;
    const c = a * Math.sin(angleCInRad) / Math.sin(angleAInRad);

    if (c > MAX_VALUE || c < MIN_VALUE) {
        alertCalculation(c);
        return;
    }

    const reducedValues = reduction(a, b, c);

    const maxValue = findMaxValue(reducedValues);
    const coef = Math.floor(DPI_HEIGHT / (2 * maxValue));
    const A = coef * reducedValues[0];
    const B = coef * reducedValues[1];
    const C = coef * reducedValues[2];

    if (isTriangleExist(A, B, C)) {
        const x = Math.floor(B * Math.cos(angleCInRad));
        const y = Math.floor(B * Math.sin(angleCInRad));

        const initialPoints = [
            { x: WIDTH + A, y: HEIGHT },
            { x: WIDTH, y: HEIGHT },
            { x: WIDTH + x, y: HEIGHT - y },
        ];

        const centeredPoints = findCenteredPoints(initialPoints);

        animate(centeredPoints, createCoords(centeredPoints), 1, ctx);
    } 
    else {
        alertTriangle();
    }
}

function isValidHeightAnd2sides(height, a, b) {
    return typeof height === 'number' && typeof a === 'number' && typeof b === 'number' && height > MIN_VALUE && a > MIN_VALUE && a < MAX_VALUE && b > MIN_VALUE && b < MAX_VALUE && height < a && height < b;
}

function animationHeightAnd2sides(ctx){
    const height = +document.getElementById("height").value;
    const a = +document.getElementById("sideA").value;
    const b = +document.getElementById("sideB").value;

    if (!isValidHeightAnd2sides(height, a, b)) {
        alert("Введите корректные численные значения! В диапозоне (0, 100_000)! А также проверьте значения, высота не должна быть > или = любой из сторон!");
        document.getElementById("height").value = '';
        document.getElementById("sideA").value = '';
        document.getElementById("sideB").value = '';
        return; 
    }
    
    const c = Math.sqrt(a ** 2 - height ** 2) + Math.sqrt(b ** 2 - height ** 2);

    if (c > MAX_VALUE || c < MIN_VALUE) {
        alertCalculation(c);
        return;
    }

    const reducedValues = reduction(a, b, c);

    const maxValue = findMaxValue(reducedValues);
    const coef = Math.floor(DPI_HEIGHT / (2 * maxValue));
    const A = coef * reducedValues[0];
    const B = coef * reducedValues[1];
    const C = coef * reducedValues[2];

    if (isTriangleExist(A, B, C)) {
        const p = (A + B + C) / 2;
        const S = Math.sqrt(p * (p - A) * (p - B) * (p - C));
        const SinA = (2 * S) / (A * B);
        const alpha = Math.asin(SinA);

        const x = Math.floor(B * Math.cos(alpha));
        const y = Math.floor(B * Math.sin(alpha));

        const initialPoints = [
            { x: WIDTH + A, y: HEIGHT },
            { x: WIDTH, y: HEIGHT },
            { x: WIDTH + x, y: HEIGHT - y },
        ];

        const centeredPoints = findCenteredPoints(initialPoints);

        animate(centeredPoints, createCoords(centeredPoints), 1, ctx);
    } 
    else {
        alertTriangle();
    }
}

function isValidMedianAnd2sides(median, b, c) {
    return typeof median === 'number' && typeof b === 'number' && typeof c === 'number' && median > MIN_VALUE && с > MIN_VALUE && с < MAX_VALUE && b > MIN_VALUE && b < MAX_VALUE && median < с && median < b;
}

function animationMedianAnd2sides(ctx) {
    const median = +document.getElementById("median").value;
    const b = +document.getElementById("sideB").value;
    const c = +document.getElementById("sideC").value;

    if (!isValidMedianAnd2sides(median, b, c)) {
        alert("Введите корректные численные значения! В диапозоне (0, 100_000)! А также проверьте значения, медиана не должна быть > или = любой из сторон!");
        document.getElementById("median").value = '';
        document.getElementById("sideB").value = '';
        document.getElementById("sideC").value = '';
        return;
    }
    
    const a = Math.sqrt(2 * (b ** 2 + c ** 2) - 4 * median ** 2);

    if (a > MAX_VALUE || a < MIN_VALUE) {
        alertCalculation(a);
        return;
    }

    const reducedValues = reduction(a, b, c);

    const maxValue = findMaxValue(reducedValues);
    const coef = Math.floor(DPI_HEIGHT / (2 * maxValue));
    const A = coef * reducedValues[0];
    const B = coef * reducedValues[1];
    const C = coef * reducedValues[2];

    if (isTriangleExist(A, B, C)) {
        const p = (A + B + C) / 2;
        const S = Math.sqrt(p * (p - A) * (p - B) * (p - C));
        const SinA = (2 * S) / (A * B);
        const alpha = Math.asin(SinA);

        const x = Math.floor(B * Math.cos(alpha));
        const y = Math.floor(B * Math.sin(alpha));
        const initialPoints = [
            { x: WIDTH + A, y: HEIGHT },
            { x: WIDTH, y: HEIGHT },
            { x: WIDTH + x, y: HEIGHT - y },
        ];

        const centeredPoints = findCenteredPoints(initialPoints);

        animate(centeredPoints, createCoords(centeredPoints), 1, ctx);
    } 
    else {
        alertTriangle();
    }
}

function isValidBisectorAnd2sides(bisector, b, c) {
    return typeof bisector === 'number' && typeof b === 'number' && typeof c === 'number' && bisector > MIN_VALUE && с > MIN_VALUE && с < MAX_VALUE && b > MIN_VALUE && b < MAX_VALUE && bisector < с && bisector < b;
}

function animationBisectorAnd2sides(ctx) {
    const bisector = +document.getElementById("bisector").value;
    const b = +document.getElementById("sideB").value;
    const c = +document.getElementById("sideC").value;

    if (!isValidBisectorAnd2sides(bisector, b, c)) {
        alert("Введите корректные численные значения! В диапозоне (0, 100_000)! А также проверьте значения, биссектриса не должна быть > или = любой из сторон!");
        document.getElementById("bisector").value = '';
        document.getElementById("sideB").value = '';
        document.getElementById("sideC").value = '';
        return;
    }
    
    const a = (b + c)*Math.sqrt(1 - bisector ** 2 / (c * b));

    if (a > MAX_VALUE || a < MIN_VALUE) {
        alertCalculation(a);
        return;
    }

    const reducedValues = reduction(a, b, c);

    const maxValue = findMaxValue(reducedValues);
    const coef = Math.floor(DPI_HEIGHT / (2 * maxValue));
    const A = coef * reducedValues[0];
    const B = coef * reducedValues[1];
    const C = coef * reducedValues[2];

    if (isTriangleExist(A, B, C)) {
        const p = (A + B + C) / 2;
        const S = Math.sqrt(p * (p - A) * (p - B) * (p - C));
        const SinA = (2 * S) / (A * B);
        const alpha = Math.asin(SinA);

        const x = Math.floor(B * Math.cos(alpha));
        const y = Math.floor(B * Math.sin(alpha));

        const initialPoints = [
            { x: WIDTH + A, y: HEIGHT },
            { x: WIDTH, y: HEIGHT },
            { x: WIDTH + x, y: HEIGHT - y },
        ];

        const centeredPoints = findCenteredPoints(initialPoints);

        animate(centeredPoints, createCoords(centeredPoints), 1, ctx);
    } 
    else {
        alertTriangle();
    }
}

function isValidRadiusAnd2angles(radius, angleA, angleB) {
    return typeof radius === 'number' && typeof angleA === 'number' && typeof angleB === 'number' && (angleA > MIN_ANGLE && angleA < MAX_ANGLE && angleB > MIN_ANGLE && angleB < MAX_ANGLE && (angleA + angleB) < MAX_ANGLE) && radius > MIN_VALUE && radius < MAX_VALUE;
}

function animationRadiusAnd2angles(ctx) {
    const radius = +document.getElementById("radius").value;
    const angleA = +document.getElementById("angleA").value;
    const angleB = +document.getElementById("angleB").value;

    if (!isValidRadiusAnd2angles(radius, angleA, angleB)) {
        alertValue();
        document.getElementById("radius").value = '';
        document.getElementById("angleA").value = '';
        document.getElementById("angleB").value = '';
        return; 
    }
    
    const angleAInRad = (angleA * Math.PI) / MAX_ANGLE;
    const angleBInRad = (angleB * Math.PI) / MAX_ANGLE;

    const a = 2 * radius * Math.sin(angleAInRad);

    if (a > MAX_VALUE || a < MIN_VALUE) {
        alertCalculation(a);
        return;
    }

    const b = 2 * radius * Math.sin(angleBInRad);

    if (b > MAX_VALUE || b < MIN_VALUE) {
        alertCalculation(b);
        return;
    }

    const angleC = MAX_ANGLE - angleA - angleB;
    const angleCInRad = (angleC * Math.PI) / MAX_ANGLE;
    const c = a * Math.sin(angleCInRad) / Math.sin(angleAInRad);

    if (c > MAX_VALUE || c < MIN_VALUE) {
        alertCalculation(c);
        return;
    }

    const reducedValues = reduction(a, b, c);

    const maxValue = findMaxValue(reducedValues);
    const coef = Math.floor(DPI_HEIGHT / (2 * maxValue));
    const A = coef * reducedValues[0];
    const B = coef * reducedValues[1];
    const C = coef * reducedValues[2];

    if (isTriangleExist(A, B, C)) {
        const x = Math.floor(B * Math.cos(angleCInRad));
        const y = Math.floor(B * Math.sin(angleCInRad));
        const initialPoints = [
            { x: WIDTH + A, y: HEIGHT },
            { x: WIDTH, y: HEIGHT },
            { x: WIDTH + x, y: HEIGHT - y },
        ];

        const centeredPoints = findCenteredPoints(initialPoints);

        animate(centeredPoints, createCoords(centeredPoints), 1, ctx);
    } 
    else {
        alertTriangle();
    }
}

function isValidRadiusAnd2sides(radius, a, b) {
    return typeof a === 'number' && typeof b === 'number' && typeof radius === 'number' && radius > MIN_VALUE && a > MIN_VALUE && a < MAX_VALUE && b > MIN_VALUE && b < MAX_VALUE && b <= 2 * radius && a <= 2 * radius;
}

function animationRadiusAnd2sides(ctx) {
    const radius = +document.getElementById("radius").value;
    const a = +document.getElementById("sideA").value;
    const b = +document.getElementById("sideB").value;
    
    if (!isValidRadiusAnd2sides(radius, a, b)) {
        alert("Введите корректные численные значения! В диапозоне (0, 100_000)! a & b <= 2 * radius!");
        document.getElementById("radius").value = '';
        document.getElementById("sideA").value = '';
        document.getElementById("sideB").value = '';
        return;
    }
    
    const angleAInRad = Math.asin(a / (2 * radius));
    const angleBInRad = Math.asin(b / (2 * radius));
    const angleCInRad = Math.PI - angleAInRad - angleBInRad;
    const c = a * Math.sin(angleCInRad) / Math.sin(angleAInRad);

    if (c > MAX_VALUE || c < MIN_VALUE) {
        alertCalculation(c);
        return;
    }

    const reducedValues = reduction(a, b, c);

    const maxValue = findMaxValue(reducedValues);
    const coef = Math.floor(DPI_HEIGHT / (2 * maxValue));
    const A = coef * reducedValues[0];
    const B = coef * reducedValues[1];
    const C = coef * reducedValues[2];

    if (isTriangleExist(A, B, C)) {
        const x = Math.floor(B * Math.cos(angleCInRad));
        const y = Math.floor(B * Math.sin(angleCInRad));
        const initialPoints = [
            { x: WIDTH + A, y: HEIGHT },
            { x: WIDTH, y: HEIGHT },
            { x: WIDTH + x, y: HEIGHT - y },
        ];

        const centeredPoints = findCenteredPoints(initialPoints);

        animate(centeredPoints, createCoords(centeredPoints), 1, ctx);
    } 
    else {
        alertTriangle();
    }
}