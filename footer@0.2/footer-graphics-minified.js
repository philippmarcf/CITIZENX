! function () {
    let t = {
            cornerRadius: 15,
            connectionRadius: 13,
            cellWidth: 95,
            cellHeight: 80,
            rndSeed: Math.floor(1e3 * Math.random()),
            scaleDownGraphics: 1,
            totalFrames: 30,
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
        s, o, h = 1,
        l, n, a, r, c, $, d, g = !1,
        u, f = document.getElementById("footer-graphics-canvas"),
        p = f.getContext("2d");

    function _() {
        var e;
        s = (e = document.getElementById("footer-graphics-container")).offsetWidth, o = e.offsetHeight, l = Math.abs(r * t.cellWidth - s) / 2, n = (o - c * t.cellHeight) / 2, s < i[0] ? (h = v(s / i[0], .5, 1), l = Math.abs(r * t.cellWidth - i[0]) / 2, .5 === h && (l = Math.abs(r * t.cellWidth - i[0]) / 2 + Math.abs(s - i[0] / 2)), n = (o - c * t.cellHeight) / 2 + c * t.cellHeight / 2 * (1 - h)) : s > i[1] ? (h = s / i[1], l = Math.abs(r * t.cellWidth - i[1]) / 2, n = (o - c * t.cellHeight) / 2 + c * t.cellHeight / 2 * (1 - h)) : h = 1, f.setAttribute("width", s * window.devicePixelRatio), f.setAttribute("height", o * window.devicePixelRatio), f.setAttribute("style", "width:" + s + "px; height:" + o + "px;"), f.getContext("2d").scale(window.devicePixelRatio, window.devicePixelRatio), w(!1)
    }

    function b() {
        let i = Date.now(),
            s = openSimplexNoise(i);
        a = [], $ = 0, d = 0, u = 0, r = Math.ceil(e[0] / t.cellWidth * t.scaleDownGraphics), c = Math.ceil(e[1] / t.cellHeight * t.scaleDownGraphics);
        for (let o = 0; o < r; o++) {
            let h = o * (t.cellWidth / t.scaleDownGraphics);
            for (let l = 0; l < c; l++) {
                let n = l * (t.cellHeight / t.scaleDownGraphics),
                    g = o + l * r,
                    f = new m(h, n, t.cellWidth / t.scaleDownGraphics, t.cellHeight / t.scaleDownGraphics, o, l, g);
                if ("Random" == t.cellAddType) Math.random() > t.randomPercent / 100 ? f.active = !1 : $++, a.push(f);
                else if ("Noise" === t.cellAddType) {
                    let p = s.noise2D(h * t.scaleNoise, n * t.scaleNoise);
                    p > t.minNoise && p < t.maxNoise ? $++ : f.active = !1, a.push(f)
                } else console.log("cellAddType is not defined")
            }
        }
        a.sort(function (t, e) {
            return t.idx - e.idx
        });
        for (let _ = 0; _ < a.length; _++) {
            let b = a[_];
            b.active && (b.findNeighbours(), b.findDistToPoint(e[0] / 2, e[1] / 2))
        }
    }

    function w(i) {
        if (p.clearRect(0, 0, s, o), p.fillStyle = t.colorBG, p.fillRect(0, 0, s, o), $ > d) {
            let h = u++ % t.totalFrames / t.totalFrames,
                l = x(h, 0, 1, 0, e[0]);
            for (let n = 0; n < a.length; n++) {
                let r = a[n];
                g ? r.active && r.appear && r.distToPoint < l && (r.appear = !1, d += 2) : r.active && !r.appear && r.distToPoint < l && (r.appear = !0, d++)
            }
        } else d = 0, u = 0, (g = !g) || b();
        for (let c = 0; c < a.length; c++) {
            let f = a[c];
            f.active && f.appear && f.findNeighbours()
        }
        for (let _ = 0; _ < a.length; _++) {
            let v = a[_];
            v.appear && v.show()
        }
        i && setTimeout(function () {
            requestAnimationFrame(w)
        }, 33.333333333333336)
    }
    window.addEventListener("resize", _, !1);
    let x = function (t, e, i, s, o, h) {
            let l = (t - e) / (i - e) * (o - s) + s;
            return h ? s < o ? this.constrain(l, s, o) : this.constrain(l, o, s) : l
        },
        v = function (t, e, i) {
            return Math.max(Math.min(t, i), e)
        },
        P = function () {
            p.fillStyle = t.colorGRFC, p.strokeStyle = t.colorGRFC, p.lineWidth = .5, p.stroke(), p.fill()
        };
    class m {
        constructor(t, e, i, s, o, h, l) {
            [this.x, this.y, this.w, this.h, this.i, this.j, this.idx] = [t, e, i, s, o, h, l], this.active = !0, this.appear = !1
        }
        findDistToPoint(t, e) {
            this.distToPoint = Math.sqrt((t - this.x - this.w / 2) ** 2 + (e - this.y - this.h / 2) ** 2)
        }
        findNeighbours() {
            this.neighbours = [];
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
            } catch (o) {
                console.log(o, this.idx)
            }
        }
        show() {
            var e, i, s, o, a, r, c, $, d, g, u, f;
            this.active && (e = (this.x - l) * h, i = this.y * h + n + this.h * h / 3, s = this.w * h, o = this.h * h, a = t.cornerRadius / t.scaleDownGraphics * h, r = this.neighbours, p.beginPath(), r.west || r.north || r.northWest && !r.north && !r.west ? T(e, i, s, o, 0, 0) : T(e, i, s, o, a, 0), r.east || r.north || r.northEast && !r.north && !r.east ? T(e, i, s, o, 0, 1) : T(e, i, s, o, a, 1), r.east || r.south || r.southEast && !r.south && !r.east ? T(e, i, s, o, 0, 2) : T(e, i, s, o, a, 2), r.west || r.south || r.southWest && !r.south && !r.west ? T(e, i, s, o, 0, 3) : T(e, i, s, o, a, 3), r.west || r.north || r.northWest && !r.north && !r.west ? p.lineTo(e, i) : p.lineTo(e, i + a), p.closePath(), P(), c = (this.x - l) * h, $ = this.y * h + n + this.h * h / 3, d = this.w * h, g = this.h * h, u = t.connectionRadius / t.scaleDownGraphics * h, (f = this.neighbours).northWest && !f.north && (p.beginPath(), W(c, $ - u, c + u, $ - u, c + u, $), p.lineTo(c, $), p.closePath(), P()), f.northWest && !f.west && (p.beginPath(), W(c - u, $, c - u, $ + u, c, $ + u), p.lineTo(c, $), p.closePath(), P()), f.northEast && !f.north && (p.beginPath(), W(c + d, $ - u, c + d - u, $ - u, c + d - u, $), p.lineTo(c + d, $), p.closePath(), P()), f.northEast && !f.east && (p.beginPath(), W(c + d + u, $, c + d + u, $ + u, c + d, $ + u), p.lineTo(c + d, $), p.closePath(), P()))
        }
    }

    function T(t, e, i, s, o, h) {
        switch (h) {
            case 0:
                W(t, e + o, t + o, e + o, t + o, e);
                break;
            case 1:
                W(t + i - o, e, t + i - o, e + o, t + i, e + o);
                break;
            case 2:
                W(t + i, e + s - o, t + i - o, e + s - o, t + i - o, e + s);
                break;
            case 3:
                W(t + o, e + s, t + o, e + s - o, t, e + s - o);
                break;
            default:
                console.log("check this line, something went wrong")
        }
    }

    function W(t, e, i, s, o, h) {
        let l = t - i,
            n = e - s,
            a = o - i,
            r = h - s,
            c = l * l + n * n,
            $ = c + l * a + n * r,
            d = 4 / 3 * (Math.sqrt(2 * c * $) - $) / (l * r - n * a),
            g = i + l - d * n;
        p.lineTo(t, e), isNaN(g) || p.bezierCurveTo(g, s + n + d * l, i + a + d * r, s + r - d * a, o, h)
    }
    b(), _(), w(!0)
}();