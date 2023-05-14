(function () {
    let params = {
        cornerRadius: 15,
        connectionRadius: 13,
        cellWidth: 95,
        cellHeight: 80,
        rndSeed: Math.floor(Math.random() * 1000),
        scaleDownGraphics: 1,

        totalFrames: 30,

        // pick cell type values
        randomPercent: 25,
        cellAddType: "Noise",

        // noise
        minNoise: 0.0,
        maxNoise: 0.35,
        scaleNoise: .1,

        // color
        colorBG: "rgb(161,161,161)",
        colorGRFC: "rgb(173,255,9)"
    }

    let _canvasSize = [1650, screen.height * 2]
    let _minMaxSize = [480, 1640]

    let _w, _h
    let _sclGraphics = 1
    let _offsetX, _offsetY

    let _cells
    let _cellsX
    let _cellsY
    let _totalCells, _currentCells

    // animation
    let _finished = false
    let _currFrame
    let framesPerSecond = 30;

    // get canvas to a variable
    const canvas = document.getElementById("footer-graphics-canvas");
    const ctx = canvas.getContext("2d");

    // add listener for resize
    window.addEventListener('resize', resizeMyCanvas, false);

    //———————————————————————————————————————————————————————————————————————————————————————————————— 
    //———————————————————————————————————————————————————————————————————————————————————————————————— 
    //———————————————————————————————————————————————————————————————————————————————————————————————— setup
    function setup() {
        // create graphics
        createMyGraphics()

        // resize canvas after creating to fit the div
        resizeMyCanvas()

        // start draw loop
        draw(true)
    }

    //———————————————————————————————————————————————————————————————————————————————————————————————— getWidthAndHeight
    function getWidthAndHeight() {
        // resize and center image
        var myDiv = document.getElementById('footer-graphics-container');
        _w = myDiv.offsetWidth
        _h = myDiv.offsetHeight

        _offsetX = Math.abs(_cellsX * params.cellWidth - _w) / 2
        _offsetY = ((_h - _cellsY * params.cellHeight) / 2)
        if (_w < _minMaxSize[0]) {
            _sclGraphics = constrain(_w / _minMaxSize[0], 0.5, 1)
            _offsetX = Math.abs(_cellsX * params.cellWidth - _minMaxSize[0]) / 2
            if (_sclGraphics === 0.5) {
                _offsetX = Math.abs(_cellsX * params.cellWidth - _minMaxSize[0]) / 2 + Math.abs((_w - _minMaxSize[0] / 2))
            }
            _offsetY = ((_h - _cellsY * params.cellHeight) / 2) + ((_cellsY * params.cellHeight) / 2) * (1 - _sclGraphics)
        } else if (_w > _minMaxSize[1]) {
            _sclGraphics = _w / _minMaxSize[1]
            _offsetX = Math.abs(_cellsX * params.cellWidth - _minMaxSize[1]) / 2
            _offsetY = ((_h - _cellsY * params.cellHeight) / 2) + ((_cellsY * params.cellHeight) / 2) * (1 - _sclGraphics)
        } else {
            _sclGraphics = 1
        }
    }

    //———————————————————————————————————————————————————————————————————————————————————————————————— resizeMyCanvas
    function resizeMyCanvas() {
        getWidthAndHeight()

        // scale the canvas by window.devicePixelRatio
        canvas.setAttribute('width', _w * window.devicePixelRatio);
        canvas.setAttribute('height', _h * window.devicePixelRatio);

        // use css to bring it back to regular size
        canvas.setAttribute('style', 'width:' + _w + 'px; height:' + _h + 'px;')

        // set the scale of the context
        canvas.getContext('2d').scale(window.devicePixelRatio, window.devicePixelRatio);

        // draw
        draw(false)
    }
    //———————————————————————————————————————————————————————————————————————————————————————————————— createMyGraphics
    function createMyGraphics() {
        // simplex node
        const seed = Date.now();
        const openSimplex = openSimplexNoise(seed);


        // create grid
        _cells = []
        _totalCells = 0
        _currentCells = 0
        _currFrame = 0

        _cellsX = Math.ceil(_canvasSize[0] / params.cellWidth * params.scaleDownGraphics)
        _cellsY = Math.ceil(_canvasSize[1] / params.cellHeight * params.scaleDownGraphics)

        for (let i = 0; i < _cellsX; i++) {
            const x = i * (params.cellWidth / params.scaleDownGraphics)
            for (let j = 0; j < _cellsY; j++) {
                const y = j * (params.cellHeight / params.scaleDownGraphics)
                // draw single shape
                const idx = i + j * _cellsX
                // console.log(i, j, idx)
                const c = new Cell(x, y, params.cellWidth / params.scaleDownGraphics, params.cellHeight / params.scaleDownGraphics, i, j, idx)
                if (params.cellAddType == "Random") {
                    // Cell version 1 : Random
                    if (Math.random() > params.randomPercent / 100.0) {
                        c.active = false
                    } else {
                        _totalCells++
                    }
                    _cells.push(c)
                } else if (params.cellAddType === "Noise") {
                    // Cell version 2 : Noise
                    const noiseVal = openSimplex.noise2D(x * params.scaleNoise, y * params.scaleNoise)
                    if (!(noiseVal > params.minNoise && noiseVal < params.maxNoise)) c.active = false
                    else _totalCells++
                    _cells.push(c)
                } else {
                    console.log("cellAddType is not defined")
                }
            }
        }

        // sort based on the index
        _cells.sort(function (a, b) {
            return a.idx - b.idx;
        })

        // define a connection between rectangles straight
        for (let i = 0; i < _cells.length; i++) {
            const c = _cells[i]
            // only check active cells
            if (c.active) {
                c.findNeighbours()
                c.findDistToPoint(_canvasSize[0] / 2, _canvasSize[1] / 2)
            }
        }
    }

    //———————————————————————————————————————————————————————————————————————————————————————————————— 
    //———————————————————————————————————————————————————————————————————————————————————————————————— 
    //———————————————————————————————————————————————————————————————————————————————————————————————— draw
    function draw(ignoreDraw) {
        // background
        ctx.clearRect(0, 0, _w, _h);
        ctx.fillStyle = params.colorBG;
        ctx.fillRect(0, 0, _w, _h);

        // appearance/ disappearance of elements
        if (_totalCells > _currentCells) {
            const percent = (_currFrame++ % params.totalFrames) / params.totalFrames
            const d = map(percent, 0, 1, 0, _canvasSize[0])

            // ctx.beginPath()
            // ctx.arc(_w / 2, _h / 2, d, 0, Math.PI * 2)
            // ctx.lineWidth = 10
            // ctx.strokeStyle = "#fff";
            // ctx.stroke()
            // ctx.closePath()

            for (let i = 0; i < _cells.length; i++) {
                const c = _cells[i]

                // if finnished dissapear
                if (_finished) {
                    if (c.active && c.appear) {
                        if (c.distToPoint < d) {
                            c.appear = false
                            _currentCells += 2
                        }
                    }
                }
                // appear
                else {
                    if (c.active && !c.appear) {
                        if (c.distToPoint < d) {
                            c.appear = true
                            _currentCells++
                        }
                    }
                }
            }
        } else {
            _finished = !_finished
            _currentCells = 0
            _currFrame = 0
            if (!_finished) {
                createMyGraphics()
            }
        }

        // define a connection between rectangles straight
        for (let i = 0; i < _cells.length; i++) {
            const c = _cells[i]
            // only check active cells
            if (c.active && c.appear) c.findNeighbours()
        }

        for (let i = 0; i < _cells.length; i++) {
            const c = _cells[i]
            if (c.appear) c.show()
        }

        // call the draw function again!
        if (ignoreDraw) {
            setTimeout(function () {
                // animating/drawing code goes here
                // if (!_finished) requestAnimationFrame(draw);
                requestAnimationFrame(draw);
            }, 1000 / framesPerSecond);
        }
    }

    //———————————————————————————————————————————————————————————————————————————————————————————————— 
    //———————————————————————————————————————————————————————————————————————————————————————————————— 
    //———————————————————————————————————————————————————————————————————————————————————————————————— Functions
    const map = function (n, start1, stop1, start2, stop2, withinBounds) {
        const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
        if (!withinBounds) {
            return newval;
        }
        if (start2 < stop2) {
            return this.constrain(newval, start2, stop2);
        } else {
            return this.constrain(newval, stop2, start2);
        }
    };

    const constrain = function (n, low, high) {
        return Math.max(Math.min(n, high), low);
    };

    // style how the graphics will look
    const myFormStyle = function () {
        ctx.fillStyle = params.colorGRFC;
        ctx.strokeStyle = params.colorGRFC;
        ctx.lineWidth = .5
        ctx.stroke()
        ctx.fill()
    }

    //———————————————————————————————————————————————————————————————————————————————————————————————— 
    //———————————————————————————————————————————————————————————————————————————————————————————————— 
    //———————————————————————————————————————————————————————————————————————————————————————————————— Cell
    class Cell {
        constructor(x, y, w, h, i, j, idx) {
            [this.x, this.y, this.w, this.h, this.i, this.j, this.idx] = [x, y, w, h, i, j, idx]
            this.active = true
            this.appear = false

            // this.neighbours = {
            //     west: false,
            //     south: false,
            //     east: false,
            //     north: false,
            //     nortWest: false,
            //     southEast: false
            // }
        }

        findDistToPoint(x2, y2) {
            this.distToPoint = Math.sqrt((x2 - this.x - this.w / 2) ** 2 + (y2 - this.y - this.h / 2) ** 2)
        }

        // neighbours
        findNeighbours() {
            this.neighbours = []
            try {
                // check for edge first
                // west & east
                if (this.i > 0) {
                    const cw = _cells[this.idx - 1]
                    if (cw.active && cw.appear) {
                        this.neighbours.west = true
                        cw.neighbours.east = true
                    }
                }
                // north & south
                if (this.j > 0) {
                    const cn = _cells[this.idx - _cellsX]
                    if (cn.active && cn.appear) {
                        this.neighbours.north = true
                        cn.neighbours.south = true
                    }
                }
                // northWest
                if (this.i > 0 && this.j > 0) {
                    const cnw = _cells[this.idx - _cellsX - 1]
                    if (cnw.active && cnw.appear) {
                        this.neighbours.northWest = true
                        cnw.neighbours.southEast = true
                    }
                }
                // nortEast
                if (this.i < _cellsX - 1 && this.j > 0) {
                    const cne = _cells[this.idx - _cellsX + 1]
                    if (cne.active && cne.appear) {
                        this.neighbours.northEast = true
                        cne.neighbours.southWest = true
                    }
                }
            } catch (error) {
                console.log(error, this.idx)
            }
        }

        // show
        show() {
            if (this.active) {
                // drawRectangle
                drawRect((this.x - _offsetX) * _sclGraphics, this.y * _sclGraphics + _offsetY + this.h * _sclGraphics / 3, this.w * _sclGraphics, this.h * _sclGraphics, params.cornerRadius / params.scaleDownGraphics * _sclGraphics, this.neighbours)
                myFormStyle()

                // draw connections
                drawConnection((this.x - _offsetX) * _sclGraphics, this.y * _sclGraphics + _offsetY + this.h * _sclGraphics / 3, this.w * _sclGraphics, this.h * _sclGraphics, params.connectionRadius / params.scaleDownGraphics * _sclGraphics, this.neighbours)
            }
        }
    }

    //———————————————————————————————————————————————————————————————————————————————————————————————— Cell draw functions
    function drawConnection(x, y, w, h, cornerRadius, neighbours) {
        if (neighbours.northWest && !neighbours.north) {
            ctx.beginPath()
            drawArc(
                x, y - cornerRadius,
                x + cornerRadius, y - cornerRadius,
                x + cornerRadius, y)
            ctx.lineTo(x, y)
            ctx.closePath()
            myFormStyle()
        }

        if (neighbours.northWest && !neighbours.west) {
            ctx.beginPath()
            drawArc(
                x - cornerRadius, y,
                x - cornerRadius, y + cornerRadius,
                x, y + cornerRadius)
            ctx.lineTo(x, y)
            ctx.closePath()
            myFormStyle()
        }

        if (neighbours.northEast && !neighbours.north) {
            ctx.beginPath()
            drawArc(
                x + w, y - cornerRadius,
                x + w - cornerRadius, y - cornerRadius,
                x + w - cornerRadius, y)
            ctx.lineTo(x + w, y)
            ctx.closePath()
            myFormStyle()
        }

        if (neighbours.northEast && !neighbours.east) {
            ctx.beginPath()
            drawArc(
                x + w + cornerRadius, y,
                x + w + cornerRadius, y + cornerRadius,
                x + w, y + cornerRadius)
            ctx.lineTo(x + w, y)
            ctx.closePath()
            myFormStyle()
        }
    }

    function drawRect(x, y, w, h, cornerRadius, neighbours) {
        ctx.beginPath()
        // Top left
        if ((neighbours.west || neighbours.north) || (neighbours.northWest && !neighbours.north && !neighbours.west)) {
            drawCorner(x, y, w, h, 0, 0)
        } else {
            drawCorner(x, y, w, h, cornerRadius, 0)
        }

        // Top Right
        if ((neighbours.east || neighbours.north) || (neighbours.northEast && !neighbours.north && !neighbours.east)) {
            drawCorner(x, y, w, h, 0, 1)
        } else {
            drawCorner(x, y, w, h, cornerRadius, 1)
        }

        // Bottom Right
        if ((neighbours.east || neighbours.south) || (neighbours.southEast && !neighbours.south && !neighbours.east)) {
            drawCorner(x, y, w, h, 0, 2)
        } else {
            drawCorner(x, y, w, h, cornerRadius, 2)
        }

        // Bottom Left
        if ((neighbours.west || neighbours.south) || (neighbours.southWest && !neighbours.south && !neighbours.west)) {
            drawCorner(x, y, w, h, 0, 3)
        } else {
            drawCorner(x, y, w, h, cornerRadius, 3)
        }

        // last connection
        if ((neighbours.west || neighbours.north) || (neighbours.northWest && !neighbours.north && !neighbours.west)) {
            ctx.lineTo(x, y);
        } else {
            ctx.lineTo(x, y + cornerRadius);
        }
        ctx.closePath()
    }

    function drawCorner(x, y, w, h, cornerRadius, side) {
        switch (side) {
            case 0:
                drawArc(
                    x, y + cornerRadius,
                    x + cornerRadius, y + cornerRadius,
                    x + cornerRadius, y)
                break;
            case 1:
                drawArc(
                    x + w - cornerRadius, y,
                    x + w - cornerRadius, y + cornerRadius,
                    x + w, y + cornerRadius)
                break;
            case 2:
                drawArc(
                    x + w, y + h - cornerRadius,
                    x + w - cornerRadius, y + h - cornerRadius,
                    x + w - cornerRadius, y + h)
                break;
            case 3:
                drawArc(
                    x + cornerRadius, y + h,
                    x + cornerRadius, y + h - cornerRadius,
                    x, y + h - cornerRadius)
                break;
            default:
                console.log('check this line, something went wrong')
        }
    }

    function drawArc(x1, y1, xc, yc, x4, y4) {
        const ax = x1 - xc
        const ay = y1 - yc
        const bx = x4 - xc
        const by = y4 - yc

        const q1 = ax * ax + ay * ay
        const q2 = q1 + ax * bx + ay * by
        const k2 = (4 / 3) * (Math.sqrt(2 * q1 * q2) - q2) / (ax * by - ay * bx)

        const x2 = xc + ax - k2 * ay
        const y2 = yc + ay + k2 * ax
        const x3 = xc + bx + k2 * by
        const y3 = yc + by - k2 * bx

        ctx.lineTo(x1, y1);
        // FIXME: there could be a problem here at some point, quick fix as divided by zero does not exist
        if (!isNaN(x2)) ctx.bezierCurveTo(x2, y2, x3, y3, x4, y4)
    }

    // init everything
    setup()
})()