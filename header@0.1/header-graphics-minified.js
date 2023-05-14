! function () {
    let t = {
            cornerRadius: 15,
            connectionRadius: 13,
            cellWidth: 95,
            cellHeight: 80,
            rndSeed: Math.floor(1e3 * Math.random()),
            scaleDownGraphics: 1,
            totalFrames: 60,
            randomPercent: 25,
            cellAddType: "Noise",
            minNoise: 0,
            maxNoise: .35,
            scaleNoise: .1,
            colorBG: "rgb(161,161,161)",
            colorGRFC: "rgb(173,255,9)"
        },
        e = [1650, 2 * screen.height],
        i = [480, 1640],
        s, h, o = 1,
        n, l, a, r, c, d, $, u = !1,
        g, _ = document.getElementById("header-graphics-canvas"),
        f = _.getContext("2d"),
        p = Date.now(),
        b = openSimplexNoise(p);

    function w() {
        var p;
        s = (p = document.getElementById("header-graphics-container")).offsetWidth, h = p.offsetHeight, n = Math.abs(r * t.cellWidth - s) / 2, l = (h - c * t.cellHeight) / 2, s < i[0] ? (o = v(s / i[0], .5, 1), n = Math.abs(r * t.cellWidth - i[0]) / 2, .5 === o && (n = Math.abs(r * t.cellWidth - i[0]) / 2 + Math.abs(s - i[0] / 2)), l = (h - c * t.cellHeight) / 2 + c * t.cellHeight / 2 * (1 - o)) : s > i[1] ? (o = s / i[1], n = Math.abs(r * t.cellWidth - i[1]) / 2, l = (h - c * t.cellHeight) / 2 + c * t.cellHeight / 2 * (1 - o)) : o = 1, _.setAttribute("width", s * window.devicePixelRatio), _.setAttribute("height", h * window.devicePixelRatio), _.setAttribute("style", "width:" + s + "px; height:" + h + "px;"), _.getContext("2d").scale(window.devicePixelRatio, window.devicePixelRatio),
            function i() {
                if (f.clearRect(0, 0, s, h), f.fillStyle = t.colorBG, f.fillRect(0, 0, s, h), d > $) {
                    let o = g++ % t.totalFrames / t.totalFrames,
                        n = x(o, 0, 1, 0, e[0]);
                    for (let l = 0; l < a.length; l++) {
                        let r = a[l];
                        r.active && !r.appear && r.distToPoint < n && Math.random() > .5 && (r.appear = !0, $++)
                    }
                } else u = !0, console.log("finnished");
                for (let c = 0; c < a.length; c++) {
                    let _ = a[c];
                    _.active && _.appear && _.findNeighbours()
                }
                for (let p = 0; p < a.length; p++) {
                    let b = a[p];
                    b.appear && b.show()
                }
                setTimeout(function () {
                    u || requestAnimationFrame(i)
                }, 33.333333333333336)
            }()
    }
    window.addEventListener("resize", w, !1);
    let x = function (t, e, i, s, h, o) {
            let n = (t - e) / (i - e) * (h - s) + s;
            return o ? s < h ? this.constrain(n, s, h) : this.constrain(n, h, s) : n
        },
        v = function (t, e, i) {
            return Math.max(Math.min(t, i), e)
        },
        P = function () {
            f.fillStyle = t.colorGRFC, f.strokeStyle = t.colorGRFC, f.lineWidth = .5, f.stroke(), f.fill()
        };
    class m {
        constructor(t, e, i, s, h, o, n) {
            [this.x, this.y, this.w, this.h, this.i, this.j, this.idx] = [t, e, i, s, h, o, n], this.active = !0, this.appear = !1, this.neighbours = {
                west: !1,
                south: !1,
                east: !1,
                north: !1,
                nortWest: !1,
                southEast: !1
            }
        }
        findDistToPoint(t, e) {
            this.distToPoint = Math.sqrt((t - this.x - this.w / 2) ** 2 + (e - this.y - this.h / 2) ** 2)
        }
        findNeighbours() {
            try {
                if (this.i > 0) {
                    let t = a[this.idx - 1];
                    t.active && t.appear && (this.neighbours.west = !0, t.neighbours.east = !0)
                }
                if (this.j > 0) {
                    let e = a[this.idx - r];
                    e.active && e.appear && (this.neighbours.north = !0, e.neighbours.south = !0)
                }
                if (this.i > 0 && this.j > 0) {
                    let i = a[this.idx - r - 1];
                    i.active && i.appear && (this.neighbours.northWest = !0, i.neighbours.southEast = !0)
                }
                if (this.i < r - 1 && this.j > 0) {
                    let s = a[this.idx - r + 1];
                    s.active && s.appear && (this.neighbours.northEast = !0, s.neighbours.southWest = !0)
                }
            } catch (h) {
                console.log(h, this.idx)
            }
        }
        show() {
            var e, i, s, h, a, r, c, d, $, u, g, _;
            this.active && (e = (this.x - n) * o, i = this.y * o + l, s = this.w * o, h = this.h * o, a = t.cornerRadius / t.scaleDownGraphics * o, r = this.neighbours, f.beginPath(), r.west || r.north || r.northWest && !r.north && !r.west ? W(e, i, s, h, 0, 0) : W(e, i, s, h, a, 0), r.east || r.north || r.northEast && !r.north && !r.east ? W(e, i, s, h, 0, 1) : W(e, i, s, h, a, 1), r.east || r.south || r.southEast && !r.south && !r.east ? W(e, i, s, h, 0, 2) : W(e, i, s, h, a, 2), r.west || r.south || r.southWest && !r.south && !r.west ? W(e, i, s, h, 0, 3) : W(e, i, s, h, a, 3), r.west || r.north || r.northWest && !r.north && !r.west ? f.lineTo(e, i) : f.lineTo(e, i + a), f.closePath(), P(), c = (this.x - n) * o, d = this.y * o + l, $ = this.w * o, u = this.h * o, g = t.connectionRadius / t.scaleDownGraphics * o, (_ = this.neighbours).northWest && !_.north && (f.beginPath(), T(c, d - g, c + g, d - g, c + g, d), f.lineTo(c, d), f.closePath(), P()), _.northWest && !_.west && (f.beginPath(), T(c - g, d, c - g, d + g, c, d + g), f.lineTo(c, d), f.closePath(), P()), _.northEast && !_.north && (f.beginPath(), T(c + $, d - g, c + $ - g, d - g, c + $ - g, d), f.lineTo(c + $, d), f.closePath(), P()), _.northEast && !_.east && (f.beginPath(), T(c + $ + g, d, c + $ + g, d + g, c + $, d + g), f.lineTo(c + $, d), f.closePath(), P()))
        }
    }

    function W(t, e, i, s, h, o) {
        switch (o) {
            case 0:
                T(t, e + h, t + h, e + h, t + h, e);
                break;
            case 1:
                T(t + i - h, e, t + i - h, e + h, t + i, e + h);
                break;
            case 2:
                T(t + i, e + s - h, t + i - h, e + s - h, t + i - h, e + s);
                break;
            case 3:
                T(t + h, e + s, t + h, e + s - h, t, e + s - h);
                break;
            default:
                console.log("check this line, something went wrong")
        }
    }

    function T(t, e, i, s, h, o) {
        let n = t - i,
            l = e - s,
            a = h - i,
            r = o - s,
            c = n * n + l * l,
            d = c + n * a + l * r,
            $ = 4 / 3 * (Math.sqrt(2 * c * d) - d) / (n * r - l * a),
            u = i + n - $ * l;
        f.lineTo(t, e), isNaN(u) || f.bezierCurveTo(u, s + l + $ * n, i + a + $ * r, s + r - $ * a, h, o)
    }(function i() {
        a = [], d = 0, $ = 0, g = 0, r = Math.ceil(e[0] / t.cellWidth * t.scaleDownGraphics), c = Math.ceil(e[1] / t.cellHeight * t.scaleDownGraphics);
        for (let s = 0; s < r; s++) {
            let h = s * (t.cellWidth / t.scaleDownGraphics);
            for (let o = 0; o < c; o++) {
                let n = o * (t.cellHeight / t.scaleDownGraphics),
                    l = s + o * r,
                    u = new m(h, n, t.cellWidth / t.scaleDownGraphics, t.cellHeight / t.scaleDownGraphics, s, o, l);
                if ("Random" == t.cellAddType) Math.random() > t.randomPercent / 100 ? u.active = !1 : d++, a.push(u);
                else if ("Noise" === t.cellAddType) {
                    let _ = b.noise2D(h * t.scaleNoise, n * t.scaleNoise);
                    _ > t.minNoise && _ < t.maxNoise ? d++ : u.active = !1, a.push(u)
                } else console.log("cellAddType is not defined")
            }
        }
        a.sort(function (t, e) {
            return t.idx - e.idx
        });
        for (let f = 0; f < a.length; f++) {
            let p = a[f];
            p.active && (p.findNeighbours(), p.findDistToPoint(e[0] / 2, e[1] / 2))
        }
    })(), w()
}();