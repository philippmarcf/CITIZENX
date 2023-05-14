! function () {
    let t = {
            cornerRadius: 15,
            connectionRadius: 13,
            cellWidth: 95,
            cellHeight: 80,
            rndSeed: Math.floor(1e3 * Math.random()),
            scaleDownGraphics: 1,
            totalFrames: 30,
            colorBG: "rgb(34,34,34)",
            colorGRFC: "rgb(173,255,9)"
        },
        e = [1650, 2 * screen.height],
        i = [480, 1640],
        s, h, o = 1,
        n, l, a, r, c, $, u, g = !1,
        d, f = document.getElementById("manifesto-graphics-canvas"),
        _ = f.getContext("2d");

    function b() {
        var b;
        s = (b = document.getElementById("manifesto-graphics-container")).offsetWidth, h = b.offsetHeight, n = Math.abs(r * t.cellWidth - s) / 2, l = (h - c * t.cellHeight) / 2, s < i[0] ? (o = w(s / i[0], .5, 1), n = Math.abs(r * t.cellWidth - i[0]) / 2, .5 === o && (n = Math.abs(r * t.cellWidth - i[0]) / 2 + Math.abs(s - i[0] / 2)), l = (h - c * t.cellHeight) / 2 + c * t.cellHeight / 2 * (1 - o)) : s > i[1] ? (o = s / i[1], n = Math.abs(r * t.cellWidth - i[1]) / 2, l = (h - c * t.cellHeight) / 2 + c * t.cellHeight / 2 * (1 - o)) : o = 1, f.setAttribute("width", s * window.devicePixelRatio), f.setAttribute("height", h * window.devicePixelRatio), f.setAttribute("style", "width:" + s + "px; height:" + h + "px;"), f.getContext("2d").scale(window.devicePixelRatio, window.devicePixelRatio),
            function i() {
                if (_.clearRect(0, 0, s, h), _.fillStyle = t.colorBG, _.fillRect(0, 0, s, h), $ > u) {
                    let o = d++ % t.totalFrames / t.totalFrames,
                        n = p(o, 0, 1, 0, e[0]);
                    for (let l = 0; l < a.length; l++) {
                        let r = a[l];
                        r.active && !r.appear && r.distToPoint < n && Math.random() > .5 && Math.random() > .5 && (r.appear = !0, u++)
                    }
                } else g = !0, console.log("finnished");
                for (let c = 0; c < a.length; c++) {
                    let f = a[c];
                    f.active && f.appear && f.findNeighbours()
                }
                for (let b = 0; b < a.length; b++) {
                    let w = a[b];
                    w.appear && w.show()
                }
                setTimeout(function () {
                    g || requestAnimationFrame(i)
                }, 33.333333333333336)
            }()
    }
    window.addEventListener("resize", b, !1);
    let p = function (t, e, i, s, h, o) {
            let n = (t - e) / (i - e) * (h - s) + s;
            return o ? s < h ? this.constrain(n, s, h) : this.constrain(n, h, s) : n
        },
        w = function (t, e, i) {
            return Math.max(Math.min(t, i), e)
        },
        x = function () {
            _.fillStyle = t.colorGRFC, _.strokeStyle = t.colorGRFC, _.lineWidth = .5, _.stroke(), _.fill()
        };
    class v {
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
            var e, i, s, h, a, r, c, $, u, g, d, f;
            this.active && (e = (this.x - n) * o, i = this.y * o + l, s = this.w * o, h = this.h * o, a = t.cornerRadius / t.scaleDownGraphics * o, r = this.neighbours, _.beginPath(), r.west || r.north || r.northWest && !r.north && !r.west ? P(e, i, s, h, 0, 0) : P(e, i, s, h, a, 0), r.east || r.north || r.northEast && !r.north && !r.east ? P(e, i, s, h, 0, 1) : P(e, i, s, h, a, 1), r.east || r.south || r.southEast && !r.south && !r.east ? P(e, i, s, h, 0, 2) : P(e, i, s, h, a, 2), r.west || r.south || r.southWest && !r.south && !r.west ? P(e, i, s, h, 0, 3) : P(e, i, s, h, a, 3), r.west || r.north || r.northWest && !r.north && !r.west ? _.lineTo(e, i) : _.lineTo(e, i + a), _.closePath(), x(), c = (this.x - n) * o, $ = this.y * o + l, u = this.w * o, g = this.h * o, d = t.connectionRadius / t.scaleDownGraphics * o, (f = this.neighbours).northWest && !f.north && (_.beginPath(), W(c, $ - d, c + d, $ - d, c + d, $), _.lineTo(c, $), _.closePath(), x()), f.northWest && !f.west && (_.beginPath(), W(c - d, $, c - d, $ + d, c, $ + d), _.lineTo(c, $), _.closePath(), x()), f.northEast && !f.north && (_.beginPath(), W(c + u, $ - d, c + u - d, $ - d, c + u - d, $), _.lineTo(c + u, $), _.closePath(), x()), f.northEast && !f.east && (_.beginPath(), W(c + u + d, $, c + u + d, $ + d, c + u, $ + d), _.lineTo(c + u, $), _.closePath(), x()))
        }
    }

    function P(t, e, i, s, h, o) {
        switch (o) {
            case 0:
                W(t, e + h, t + h, e + h, t + h, e);
                break;
            case 1:
                W(t + i - h, e, t + i - h, e + h, t + i, e + h);
                break;
            case 2:
                W(t + i, e + s - h, t + i - h, e + s - h, t + i - h, e + s);
                break;
            case 3:
                W(t + h, e + s, t + h, e + s - h, t, e + s - h);
                break;
            default:
                console.log("check this line, something went wrong")
        }
    }

    function W(t, e, i, s, h, o) {
        let n = t - i,
            l = e - s,
            a = h - i,
            r = o - s,
            c = n * n + l * l,
            $ = c + n * a + l * r,
            u = 4 / 3 * (Math.sqrt(2 * c * $) - $) / (n * r - l * a),
            g = i + n - u * l;
        _.lineTo(t, e), isNaN(g) || _.bezierCurveTo(g, s + l + u * n, i + a + u * r, s + r - u * a, h, o)
    }(function i() {
        a = [], $ = 0, u = 0, d = 0, r = Math.ceil(e[0] / t.cellWidth * t.scaleDownGraphics), c = Math.ceil(e[1] / t.cellHeight * t.scaleDownGraphics);
        for (let s = 0; s < r; s++) {
            let h = s * (t.cellWidth / t.scaleDownGraphics);
            for (let o = 0; o < c; o++) {
                let n = o * (t.cellHeight / t.scaleDownGraphics),
                    l = s + o * r,
                    g = new v(h, n, t.cellWidth / t.scaleDownGraphics, t.cellHeight / t.scaleDownGraphics, s, o, l);
                $++, a.push(g)
            }
        }
        a.sort(function (t, e) {
            return t.idx - e.idx
        });
        for (let f = 0; f < a.length; f++) {
            let _ = a[f];
            _.active && (_.findNeighbours(), _.findDistToPoint(e[0] / 2, e[1] / 2))
        }
    })(), b()
}();