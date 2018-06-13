! function(t) {
	"use strict";
	var e, n, i, r, o, a;
	e = window, n = document, i = "script", r = "ga", e.GoogleAnalyticsObject = r, e.ga = e.ga || function() {
		(e.ga.q = e.ga.q || []).push(arguments)
	}, e.ga.l = 1 * new Date, o = n.createElement(i), a = n.getElementsByTagName(i)[0], o.async = 1, o.src = "https://www.google-analytics.com/analytics.js", a.parentNode.insertBefore(o, a), ga("create", "UA-103772589-3", "auto"), ga("send", "pageview");
	var s = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		l = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float gamma;\nuniform float contrast;\nuniform float saturation;\nuniform float brightness;\nuniform float red;\nuniform float green;\nuniform float blue;\nuniform float alpha;\n\nvoid main(void)\n{\n    vec4 c = texture2D(uSampler, vTextureCoord);\n\n    if (c.a > 0.0) {\n        c.rgb /= c.a;\n\n        vec3 rgb = pow(c.rgb, vec3(1. / gamma));\n        rgb = mix(vec3(.5), mix(vec3(dot(vec3(.2125, .7154, .0721), rgb)), rgb, saturation), contrast);\n        rgb.r *= red;\n        rgb.g *= green;\n        rgb.b *= blue;\n        c.rgb = rgb * brightness;\n\n        c.rgb *= c.a;\n    }\n\n    gl_FragColor = c * alpha;\n}\n",
		u = function(t) {
			function e(e) {
				t.call(this, s, l), Object.assign(this, {
					gamma: 1,
					saturation: 1,
					contrast: 1,
					brightness: 1,
					red: 1,
					green: 1,
					blue: 1,
					alpha: 1
				}, e)
			}
			return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.apply = function(t, e, n, i) {
				this.uniforms.gamma = Math.max(this.gamma, 1e-4), this.uniforms.saturation = this.saturation, this.uniforms.contrast = this.contrast, this.uniforms.brightness = this.brightness, this.uniforms.red = this.red, this.uniforms.green = this.green, this.uniforms.blue = this.blue, this.uniforms.alpha = this.alpha, t.applyFilter(this, e, n, i)
			}, e
		}(t.Filter),
		c = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		d = "\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec2 uOffset;\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n\n    // Sample top left pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y + uOffset.y));\n\n    // Sample top right pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y + uOffset.y));\n\n    // Sample bottom right pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y - uOffset.y));\n\n    // Sample bottom left pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y - uOffset.y));\n\n    // Average\n    color *= 0.25;\n\n    gl_FragColor = color;\n}",
		f = "\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec2 uOffset;\nuniform vec4 filterClamp;\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n\n    // Sample top left pixel\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y + uOffset.y), filterClamp.xy, filterClamp.zw));\n\n    // Sample top right pixel\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y + uOffset.y), filterClamp.xy, filterClamp.zw));\n\n    // Sample bottom right pixel\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y - uOffset.y), filterClamp.xy, filterClamp.zw));\n\n    // Sample bottom left pixel\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y - uOffset.y), filterClamp.xy, filterClamp.zw));\n\n    // Average\n    color *= 0.25;\n\n    gl_FragColor = color;\n}\n",
		h = function(e) {
			function n(n, i, r) {
				void 0 === n && (n = 4), void 0 === i && (i = 3), void 0 === r && (r = !1), e.call(this, c, r ? f : d), this.uniforms.uOffset = new Float32Array(2), this._pixelSize = new t.Point, this.pixelSize = 1, this._clamp = r, this._kernels = null, Array.isArray(n) ? this.kernels = n : (this._blur = n, this.quality = i)
			}
			e && (n.__proto__ = e), n.prototype = Object.create(e && e.prototype), n.prototype.constructor = n;
			var i = {
				kernels: {
					configurable: !0
				},
				clamp: {
					configurable: !0
				},
				pixelSize: {
					configurable: !0
				},
				quality: {
					configurable: !0
				},
				blur: {
					configurable: !0
				}
			};
			return n.prototype.apply = function(t, e, n, i) {
				var r, o = this.pixelSize.x / e.size.width,
					a = this.pixelSize.y / e.size.height;
				if(1 === this._quality || 0 === this._blur) r = this._kernels[0] + .5, this.uniforms.uOffset[0] = r * o, this.uniforms.uOffset[1] = r * a, t.applyFilter(this, e, n, i);
				else {
					for(var s, l = t.getRenderTarget(!0), u = e, c = l, d = this._quality - 1, f = 0; f < d; f++) r = this._kernels[f] + .5, this.uniforms.uOffset[0] = r * o, this.uniforms.uOffset[1] = r * a, t.applyFilter(this, u, c, !0), s = u, u = c, c = s;
					r = this._kernels[d] + .5, this.uniforms.uOffset[0] = r * o, this.uniforms.uOffset[1] = r * a, t.applyFilter(this, u, n, i), t.returnRenderTarget(l)
				}
			}, n.prototype._generateKernels = function() {
				var t = this._blur,
					e = this._quality,
					n = [t];
				if(t > 0)
					for(var i = t, r = t / e, o = 1; o < e; o++) i -= r, n.push(i);
				this._kernels = n
			}, i.kernels.get = function() {
				return this._kernels
			}, i.kernels.set = function(t) {
				Array.isArray(t) && t.length > 0 ? (this._kernels = t, this._quality = t.length, this._blur = Math.max.apply(Math, t)) : (this._kernels = [0], this._quality = 1)
			}, i.clamp.get = function() {
				return this._clamp
			}, i.pixelSize.set = function(e) {
				"number" == typeof e ? (this._pixelSize.x = e, this._pixelSize.y = e) : Array.isArray(e) ? (this._pixelSize.x = e[0], this._pixelSize.y = e[1]) : e instanceof t.Point ? (this._pixelSize.x = e.x, this._pixelSize.y = e.y) : (this._pixelSize.x = 1, this._pixelSize.y = 1)
			}, i.pixelSize.get = function() {
				return this._pixelSize
			}, i.quality.get = function() {
				return this._quality
			}, i.quality.set = function(t) {
				this._quality = Math.max(1, Math.round(t)), this._generateKernels()
			}, i.blur.get = function() {
				return this._blur
			}, i.blur.set = function(t) {
				this._blur = t, this._generateKernels()
			}, Object.defineProperties(n.prototype, i), n
		}(t.Filter),
		m = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		p = "\nuniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform float threshold;\n\nvoid main() {\n    vec4 color = texture2D(uSampler, vTextureCoord);\n\n    // A simple & fast algorithm for getting brightness.\n    // It's inaccuracy , but good enought for this feature.\n    float _max = max(max(color.r, color.g), color.b);\n    float _min = min(min(color.r, color.g), color.b);\n    float brightness = (_max + _min) * 0.5;\n\n    if(brightness > threshold) {\n        gl_FragColor = color;\n    } else {\n        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\n    }\n}\n",
		g = function(t) {
			function e(e) {
				void 0 === e && (e = .5), t.call(this, m, p), this.threshold = e
			}
			t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
			var n = {
				threshold: {
					configurable: !0
				}
			};
			return n.threshold.get = function() {
				return this.uniforms.threshold
			}, n.threshold.set = function(t) {
				this.uniforms.threshold = t
			}, Object.defineProperties(e.prototype, n), e
		}(t.Filter),
		v = "uniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D bloomTexture;\nuniform float bloomScale;\nuniform float brightness;\n\nvoid main() {\n    vec4 color = texture2D(uSampler, vTextureCoord);\n    color.rgb *= brightness;\n    vec4 bloomColor = vec4(texture2D(bloomTexture, vTextureCoord).rgb, 0.0);\n    bloomColor.rgb *= bloomScale;\n    gl_FragColor = color + bloomColor;\n}\n",
		x = function(e) {
			function n(n) {
				e.call(this, m, v), "number" == typeof n && (n = {
					threshold: n
				}), n = Object.assign({
					threshold: .5,
					bloomScale: 1,
					brightness: 1,
					kernels: null,
					blur: 8,
					quality: 4,
					pixelSize: 1,
					resolution: t.settings.RESOLUTION
				}, n), this.bloomScale = n.bloomScale, this.brightness = n.brightness;
				var i = n.kernels,
					r = n.blur,
					o = n.quality,
					a = n.pixelSize,
					s = n.resolution;
				this._extractFilter = new g(n.threshold), this._extractFilter.resolution = s, this._blurFilter = i ? new h(i) : new h(r, o), this.pixelSize = a, this.resolution = s
			}
			e && (n.__proto__ = e), n.prototype = Object.create(e && e.prototype), n.prototype.constructor = n;
			var i = {
				resolution: {
					configurable: !0
				},
				threshold: {
					configurable: !0
				},
				kernels: {
					configurable: !0
				},
				blur: {
					configurable: !0
				},
				quality: {
					configurable: !0
				},
				pixelSize: {
					configurable: !0
				}
			};
			return n.prototype.apply = function(t, e, n, i, r) {
				var o = t.getRenderTarget(!0);
				this._extractFilter.apply(t, e, o, !0, r);
				var a = t.getRenderTarget(!0);
				this._blurFilter.apply(t, o, a, !0, r), this.uniforms.bloomScale = this.bloomScale, this.uniforms.brightness = this.brightness, this.uniforms.bloomTexture = a, t.applyFilter(this, e, n, i), t.returnRenderTarget(a), t.returnRenderTarget(o)
			}, i.resolution.get = function() {
				return this._resolution
			}, i.resolution.set = function(t) {
				this._resolution = t, this._extractFilter && (this._extractFilter.resolution = t), this._blurFilter && (this._blurFilter.resolution = t)
			}, i.threshold.get = function() {
				return this._extractFilter.threshold
			}, i.threshold.set = function(t) {
				this._extractFilter.threshold = t
			}, i.kernels.get = function() {
				return this._blurFilter.kernels
			}, i.kernels.set = function(t) {
				this._blurFilter.kernels = t
			}, i.blur.get = function() {
				return this._blurFilter.blur
			}, i.blur.set = function(t) {
				this._blurFilter.blur = t
			}, i.quality.get = function() {
				return this._blurFilter.quality
			}, i.quality.set = function(t) {
				this._blurFilter.quality = t
			}, i.pixelSize.get = function() {
				return this._blurFilter.pixelSize
			}, i.pixelSize.set = function(t) {
				this._blurFilter.pixelSize = t
			}, Object.defineProperties(n.prototype, i), n
		}(t.Filter),
		y = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		b = "varying vec2 vTextureCoord;\n\nuniform vec4 filterArea;\nuniform float pixelSize;\nuniform sampler2D uSampler;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 pixelate(vec2 coord, vec2 size)\n{\n    return floor( coord / size ) * size;\n}\n\nvec2 getMod(vec2 coord, vec2 size)\n{\n    return mod( coord , size) / size;\n}\n\nfloat character(float n, vec2 p)\n{\n    p = floor(p*vec2(4.0, -4.0) + 2.5);\n    if (clamp(p.x, 0.0, 4.0) == p.x && clamp(p.y, 0.0, 4.0) == p.y)\n    {\n        if (int(mod(n/exp2(p.x + 5.0*p.y), 2.0)) == 1) return 1.0;\n    }\n    return 0.0;\n}\n\nvoid main()\n{\n    vec2 coord = mapCoord(vTextureCoord);\n\n    // get the rounded color..\n    vec2 pixCoord = pixelate(coord, vec2(pixelSize));\n    pixCoord = unmapCoord(pixCoord);\n\n    vec4 color = texture2D(uSampler, pixCoord);\n\n    // determine the character to use\n    float gray = (color.r + color.g + color.b) / 3.0;\n\n    float n =  65536.0;             // .\n    if (gray > 0.2) n = 65600.0;    // :\n    if (gray > 0.3) n = 332772.0;   // *\n    if (gray > 0.4) n = 15255086.0; // o\n    if (gray > 0.5) n = 23385164.0; // &\n    if (gray > 0.6) n = 15252014.0; // 8\n    if (gray > 0.7) n = 13199452.0; // @\n    if (gray > 0.8) n = 11512810.0; // #\n\n    // get the mod..\n    vec2 modd = getMod(coord, vec2(pixelSize));\n\n    gl_FragColor = color * character( n, vec2(-1.0) + modd * 2.0);\n\n}",
		C = function(t) {
			function e(e) {
				void 0 === e && (e = 8), t.call(this, y, b), this.size = e
			}
			t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
			var n = {
				size: {
					configurable: !0
				}
			};
			return n.size.get = function() {
				return this.uniforms.pixelSize
			}, n.size.set = function(t) {
				this.uniforms.pixelSize = t
			}, Object.defineProperties(e.prototype, n), e
		}(t.Filter),
		_ = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		S = "precision mediump float;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform float transformX;\nuniform float transformY;\nuniform vec3 lightColor;\nuniform float lightAlpha;\nuniform vec3 shadowColor;\nuniform float shadowAlpha;\n\nvoid main(void) {\n    vec2 transform = vec2(1.0 / filterArea) * vec2(transformX, transformY);\n    vec4 color = texture2D(uSampler, vTextureCoord);\n    float light = texture2D(uSampler, vTextureCoord - transform).a;\n    float shadow = texture2D(uSampler, vTextureCoord + transform).a;\n\n    color.rgb = mix(color.rgb, lightColor, clamp((color.a - light) * lightAlpha, 0.0, 1.0));\n    color.rgb = mix(color.rgb, shadowColor, clamp((color.a - shadow) * shadowAlpha, 0.0, 1.0));\n    gl_FragColor = vec4(color.rgb * color.a, color.a);\n}\n",
		F = function(e) {
			function n(t) {
				void 0 === t && (t = {}), e.call(this, _, S), this.uniforms.lightColor = new Float32Array(3), this.uniforms.shadowColor = new Float32Array(3), t = Object.assign({
					rotation: 45,
					thickness: 2,
					lightColor: 16777215,
					lightAlpha: .7,
					shadowColor: 0,
					shadowAlpha: .7
				}, t), this.rotation = t.rotation, this.thickness = t.thickness, this.lightColor = t.lightColor, this.lightAlpha = t.lightAlpha, this.shadowColor = t.shadowColor, this.shadowAlpha = t.shadowAlpha
			}
			e && (n.__proto__ = e), n.prototype = Object.create(e && e.prototype), n.prototype.constructor = n;
			var i = {
				rotation: {
					configurable: !0
				},
				thickness: {
					configurable: !0
				},
				lightColor: {
					configurable: !0
				},
				lightAlpha: {
					configurable: !0
				},
				shadowColor: {
					configurable: !0
				},
				shadowAlpha: {
					configurable: !0
				}
			};
			return n.prototype._updateTransform = function() {
				this.uniforms.transformX = this._thickness * Math.cos(this._angle), this.uniforms.transformY = this._thickness * Math.sin(this._angle)
			}, i.rotation.get = function() {
				return this._angle / t.DEG_TO_RAD
			}, i.rotation.set = function(e) {
				this._angle = e * t.DEG_TO_RAD, this._updateTransform()
			}, i.thickness.get = function() {
				return this._thickness
			}, i.thickness.set = function(t) {
				this._thickness = t, this._updateTransform()
			}, i.lightColor.get = function() {
				return t.utils.rgb2hex(this.uniforms.lightColor)
			}, i.lightColor.set = function(e) {
				t.utils.hex2rgb(e, this.uniforms.lightColor)
			}, i.lightAlpha.get = function() {
				return this.uniforms.lightAlpha
			}, i.lightAlpha.set = function(t) {
				this.uniforms.lightAlpha = t
			}, i.shadowColor.get = function() {
				return t.utils.rgb2hex(this.uniforms.shadowColor)
			}, i.shadowColor.set = function(e) {
				t.utils.hex2rgb(e, this.uniforms.shadowColor)
			}, i.shadowAlpha.get = function() {
				return this.uniforms.shadowAlpha
			}, i.shadowAlpha.set = function(t) {
				this.uniforms.shadowAlpha = t
			}, Object.defineProperties(n.prototype, i), n
		}(t.Filter),
		T = t.filters,
		z = T.BlurXFilter,
		w = T.BlurYFilter,
		A = T.AlphaFilter,
		P = function(e) {
			function n(n, i, r, o) {
				var a, s;
				void 0 === n && (n = 2), void 0 === i && (i = 4), void 0 === r && (r = t.settings.RESOLUTION), void 0 === o && (o = 5), e.call(this), "number" == typeof n ? (a = n, s = n) : n instanceof t.Point ? (a = n.x, s = n.y) : Array.isArray(n) && (a = n[0], s = n[1]), this.blurXFilter = new z(a, i, r, o), this.blurYFilter = new w(s, i, r, o), this.blurYFilter.blendMode = t.BLEND_MODES.SCREEN, this.defaultFilter = new A
			}
			e && (n.__proto__ = e), n.prototype = Object.create(e && e.prototype), n.prototype.constructor = n;
			var i = {
				blur: {
					configurable: !0
				},
				blurX: {
					configurable: !0
				},
				blurY: {
					configurable: !0
				}
			};
			return n.prototype.apply = function(t, e, n) {
				var i = t.getRenderTarget(!0);
				this.defaultFilter.apply(t, e, n), this.blurXFilter.apply(t, e, i), this.blurYFilter.apply(t, i, n), t.returnRenderTarget(i)
			}, i.blur.get = function() {
				return this.blurXFilter.blur
			}, i.blur.set = function(t) {
				this.blurXFilter.blur = this.blurYFilter.blur = t
			}, i.blurX.get = function() {
				return this.blurXFilter.blur
			}, i.blurX.set = function(t) {
				this.blurXFilter.blur = t
			}, i.blurY.get = function() {
				return this.blurYFilter.blur
			}, i.blurY.set = function(t) {
				this.blurYFilter.blur = t
			}, Object.defineProperties(n.prototype, i), n
		}(t.Filter),
		M = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		O = "uniform float radius;\nuniform float strength;\nuniform vec2 center;\nuniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform vec2 dimensions;\n\nvoid main()\n{\n    vec2 coord = vTextureCoord * filterArea.xy;\n    coord -= center * dimensions.xy;\n    float distance = length(coord);\n    if (distance < radius) {\n        float percent = distance / radius;\n        if (strength > 0.0) {\n            coord *= mix(1.0, smoothstep(0.0, radius / distance, percent), strength * 0.75);\n        } else {\n            coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);\n        }\n    }\n    coord += center * dimensions.xy;\n    coord /= filterArea.xy;\n    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    vec4 color = texture2D(uSampler, clampedCoord);\n    if (coord != clampedCoord) {\n        color *= max(0.0, 1.0 - length(coord - clampedCoord));\n    }\n\n    gl_FragColor = color;\n}\n",
		D = function(t) {
			function e(e, n, i) {
				t.call(this, M, O), this.uniforms.dimensions = new Float32Array(2), this.center = e || [.5, .5], this.radius = n || 100, this.strength = i || 1
			}
			t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
			var n = {
				radius: {
					configurable: !0
				},
				strength: {
					configurable: !0
				},
				center: {
					configurable: !0
				}
			};
			return e.prototype.apply = function(t, e, n, i) {
				this.uniforms.dimensions[0] = e.sourceFrame.width, this.uniforms.dimensions[1] = e.sourceFrame.height, t.applyFilter(this, e, n, i)
			}, n.radius.get = function() {
				return this.uniforms.radius
			}, n.radius.set = function(t) {
				this.uniforms.radius = t
			}, n.strength.get = function() {
				return this.uniforms.strength
			}, n.strength.set = function(t) {
				this.uniforms.strength = t
			}, n.center.get = function() {
				return this.uniforms.center
			}, n.center.set = function(t) {
				this.uniforms.center = t
			}, Object.defineProperties(e.prototype, n), e
		}(t.Filter),
		j = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		R = "\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform sampler2D colorMap;\n\nuniform float _mix;\nuniform float _size;\nuniform float _sliceSize;\nuniform float _slicePixelSize;\nuniform float _sliceInnerSize;\n\nvoid main() {\n    vec4 color = texture2D(uSampler, vTextureCoord.xy);\n\n    float sliceIndex = color.b * (_size - 1.0);\n    float zSlice0 = floor(sliceIndex);\n    float zSlice1 = ceil(sliceIndex);\n\n    float xOffset = _slicePixelSize * 0.5 + color.r * _sliceInnerSize;\n    float s0 = xOffset + zSlice0 * _sliceSize;\n    float s1 = xOffset + zSlice1 * _sliceSize;\n    vec4 slice0Color = texture2D(colorMap, vec2(s0, color.g));\n    vec4 slice1Color = texture2D(colorMap, vec2(s1, color.g));\n    vec4 adjusted = mix(slice0Color, slice1Color, fract(sliceIndex));\n\n    gl_FragColor = mix(color, adjusted, _mix);\n}\n",
		k = function(e) {
			function n(t, n, i) {
				void 0 === n && (n = !1), void 0 === i && (i = 1), e.call(this, j, R), this._size = 0, this._sliceSize = 0, this._slicePixelSize = 0, this._sliceInnerSize = 0, this._scaleMode = null, this._nearest = !1, this.nearest = n, this.mix = i, this.colorMap = t
			}
			e && (n.__proto__ = e), n.prototype = Object.create(e && e.prototype), n.prototype.constructor = n;
			var i = {
				colorSize: {
					configurable: !0
				},
				colorMap: {
					configurable: !0
				},
				nearest: {
					configurable: !0
				}
			};
			return n.prototype.apply = function(t, e, n, i) {
				this.uniforms._mix = this.mix, t.applyFilter(this, e, n, i)
			}, i.colorSize.get = function() {
				return this._size
			}, i.colorMap.get = function() {
				return this._colorMap
			}, i.colorMap.set = function(e) {
				e instanceof t.Texture || (e = t.Texture.from(e)), e && e.baseTexture && (e.baseTexture.scaleMode = this._scaleMode, e.baseTexture.mipmap = !1, this._size = e.height, this._sliceSize = 1 / this._size, this._slicePixelSize = this._sliceSize / this._size, this._sliceInnerSize = this._slicePixelSize * (this._size - 1), this.uniforms._size = this._size, this.uniforms._sliceSize = this._sliceSize, this.uniforms._slicePixelSize = this._slicePixelSize, this.uniforms._sliceInnerSize = this._sliceInnerSize, this.uniforms.colorMap = e), this._colorMap = e
			}, i.nearest.get = function() {
				return this._nearest
			}, i.nearest.set = function(e) {
				this._nearest = e, this._scaleMode = e ? t.SCALE_MODES.NEAREST : t.SCALE_MODES.LINEAR;
				var n = this._colorMap;
				n && n.baseTexture && (n.baseTexture._glTextures = {}, n.baseTexture.scaleMode = this._scaleMode, n.baseTexture.mipmap = !1, n._updateID++, n.baseTexture.emit("update", n.baseTexture))
			}, n.prototype.updateColorMap = function() {
				var t = this._colorMap;
				t && t.baseTexture && (t._updateID++, t.baseTexture.emit("update", t.baseTexture), this.colorMap = t)
			}, n.prototype.destroy = function(t) {
				this._colorMap && this._colorMap.destroy(t), e.prototype.destroy.call(this)
			}, Object.defineProperties(n.prototype, i), n
		}(t.Filter),
		L = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		E = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec3 originalColor;\nuniform vec3 newColor;\nuniform float epsilon;\nvoid main(void) {\n    vec4 currentColor = texture2D(uSampler, vTextureCoord);\n    vec3 colorDiff = originalColor - (currentColor.rgb / max(currentColor.a, 0.0000000001));\n    float colorDistance = length(colorDiff);\n    float doReplace = step(colorDistance, epsilon);\n    gl_FragColor = vec4(mix(currentColor.rgb, (newColor + colorDiff) * currentColor.a, doReplace), currentColor.a);\n}\n",
		I = function(e) {
			function n(t, n, i) {
				void 0 === t && (t = 16711680), void 0 === n && (n = 0), void 0 === i && (i = .4), e.call(this, L, E), this.uniforms.originalColor = new Float32Array(3), this.uniforms.newColor = new Float32Array(3), this.originalColor = t, this.newColor = n, this.epsilon = i
			}
			e && (n.__proto__ = e), n.prototype = Object.create(e && e.prototype), n.prototype.constructor = n;
			var i = {
				originalColor: {
					configurable: !0
				},
				newColor: {
					configurable: !0
				},
				epsilon: {
					configurable: !0
				}
			};
			return i.originalColor.set = function(e) {
				var n = this.uniforms.originalColor;
				"number" == typeof e ? (t.utils.hex2rgb(e, n), this._originalColor = e) : (n[0] = e[0], n[1] = e[1], n[2] = e[2], this._originalColor = t.utils.rgb2hex(n))
			}, i.originalColor.get = function() {
				return this._originalColor
			}, i.newColor.set = function(e) {
				var n = this.uniforms.newColor;
				"number" == typeof e ? (t.utils.hex2rgb(e, n), this._newColor = e) : (n[0] = e[0], n[1] = e[1], n[2] = e[2], this._newColor = t.utils.rgb2hex(n))
			}, i.newColor.get = function() {
				return this._newColor
			}, i.epsilon.set = function(t) {
				this.uniforms.epsilon = t
			}, i.epsilon.get = function() {
				return this.uniforms.epsilon
			}, Object.defineProperties(n.prototype, i), n
		}(t.Filter),
		V = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		B = "precision mediump float;\n\nvarying mediump vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec2 texelSize;\nuniform float matrix[9];\n\nvoid main(void)\n{\n   vec4 c11 = texture2D(uSampler, vTextureCoord - texelSize); // top left\n   vec4 c12 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - texelSize.y)); // top center\n   vec4 c13 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y - texelSize.y)); // top right\n\n   vec4 c21 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y)); // mid left\n   vec4 c22 = texture2D(uSampler, vTextureCoord); // mid center\n   vec4 c23 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y)); // mid right\n\n   vec4 c31 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y + texelSize.y)); // bottom left\n   vec4 c32 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + texelSize.y)); // bottom center\n   vec4 c33 = texture2D(uSampler, vTextureCoord + texelSize); // bottom right\n\n   gl_FragColor =\n       c11 * matrix[0] + c12 * matrix[1] + c13 * matrix[2] +\n       c21 * matrix[3] + c22 * matrix[4] + c23 * matrix[5] +\n       c31 * matrix[6] + c32 * matrix[7] + c33 * matrix[8];\n\n   gl_FragColor.a = c22.a;\n}\n",
		W = function(t) {
			function e(e, n, i) {
				t.call(this, V, B), this.uniforms.texelSize = new Float32Array(9), this.matrix = e, this.width = n, this.height = i
			}
			t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
			var n = {
				matrix: {
					configurable: !0
				},
				width: {
					configurable: !0
				},
				height: {
					configurable: !0
				}
			};
			return n.matrix.get = function() {
				return this.uniforms.matrix
			}, n.matrix.set = function(t) {
				this.uniforms.matrix = new Float32Array(t)
			}, n.width.get = function() {
				return 1 / this.uniforms.texelSize[0]
			}, n.width.set = function(t) {
				this.uniforms.texelSize[0] = 1 / t
			}, n.height.get = function() {
				return 1 / this.uniforms.texelSize[1]
			}, n.height.set = function(t) {
				this.uniforms.texelSize[1] = 1 / t
			}, Object.defineProperties(e.prototype, n), e
		}(t.Filter),
		N = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		X = "precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    float lum = length(texture2D(uSampler, vTextureCoord.xy).rgb);\n\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n\n    if (lum < 1.00)\n    {\n        if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.75)\n    {\n        if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.50)\n    {\n        if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.3)\n    {\n        if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n}\n",
		q = function(t) {
			function e() {
				t.call(this, N, X)
			}
			return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e
		}(t.Filter),
		G = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		K = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\nuniform vec2 dimensions;\n\nconst float SQRT_2 = 1.414213;\n\nconst float light = 1.0;\n\nuniform float curvature;\nuniform float lineWidth;\nuniform float lineContrast;\nuniform bool verticalLine;\nuniform float noise;\nuniform float noiseSize;\n\nuniform float vignetting;\nuniform float vignettingAlpha;\nuniform float vignettingBlur;\n\nuniform float seed;\nuniform float time;\n\nfloat rand(vec2 co) {\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvoid main(void)\n{\n    vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;\n    vec2 coord = pixelCoord / dimensions;\n\n    vec2 dir = vec2(coord - vec2(0.5, 0.5));\n\n    float _c = curvature > 0. ? curvature : 1.;\n    float k = curvature > 0. ?(length(dir * dir) * 0.25 * _c * _c + 0.935 * _c) : 1.;\n    vec2 uv = dir * k;\n\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n    vec3 rgb = gl_FragColor.rgb;\n\n\n    if (noise > 0.0 && noiseSize > 0.0)\n    {\n        pixelCoord.x = floor(pixelCoord.x / noiseSize);\n        pixelCoord.y = floor(pixelCoord.y / noiseSize);\n        float _noise = rand(pixelCoord * noiseSize * seed) - 0.5;\n        rgb += _noise * noise;\n    }\n\n    if (lineWidth > 0.0) {\n        float v = (verticalLine ? uv.x * dimensions.x : uv.y * dimensions.y) * min(1.0, 2.0 / lineWidth ) / _c;\n        float j = 1. + cos(v * 1.2 - time) * 0.5 * lineContrast;\n        rgb *= j;\n        float segment = verticalLine ? mod((dir.x + .5) * dimensions.x, 4.) : mod((dir.y + .5) * dimensions.y, 4.);\n        rgb *= 0.99 + ceil(segment) * 0.015;\n    }\n\n    if (vignetting > 0.0)\n    {\n        float outter = SQRT_2 - vignetting * SQRT_2;\n        float darker = clamp((outter - length(dir) * SQRT_2) / ( 0.00001 + vignettingBlur * SQRT_2), 0.0, 1.0);\n        rgb *= darker + (1.0 - darker) * (1.0 - vignettingAlpha);\n    }\n\n    gl_FragColor.rgb = rgb;\n}\n",
		Y = function(t) {
			function e(e) {
				t.call(this, G, K), this.uniforms.dimensions = new Float32Array(2), this.time = 0, this.seed = 0, Object.assign(this, {
					curvature: 1,
					lineWidth: 1,
					lineContrast: .25,
					verticalLine: !1,
					noise: 0,
					noiseSize: 1,
					seed: 0,
					vignetting: .3,
					vignettingAlpha: 1,
					vignettingBlur: .3,
					time: 0
				}, e)
			}
			t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
			var n = {
				curvature: {
					configurable: !0
				},
				lineWidth: {
					configurable: !0
				},
				lineContrast: {
					configurable: !0
				},
				verticalLine: {
					configurable: !0
				},
				noise: {
					configurable: !0
				},
				noiseSize: {
					configurable: !0
				},
				vignetting: {
					configurable: !0
				},
				vignettingAlpha: {
					configurable: !0
				},
				vignettingBlur: {
					configurable: !0
				}
			};
			return e.prototype.apply = function(t, e, n, i) {
				this.uniforms.dimensions[0] = e.sourceFrame.width, this.uniforms.dimensions[1] = e.sourceFrame.height, this.uniforms.seed = this.seed, this.uniforms.time = this.time, t.applyFilter(this, e, n, i)
			}, n.curvature.set = function(t) {
				this.uniforms.curvature = t
			}, n.curvature.get = function() {
				return this.uniforms.curvature
			}, n.lineWidth.set = function(t) {
				this.uniforms.lineWidth = t
			}, n.lineWidth.get = function() {
				return this.uniforms.lineWidth
			}, n.lineContrast.set = function(t) {
				this.uniforms.lineContrast = t
			}, n.lineContrast.get = function() {
				return this.uniforms.lineContrast
			}, n.verticalLine.set = function(t) {
				this.uniforms.verticalLine = t
			}, n.verticalLine.get = function() {
				return this.uniforms.verticalLine
			}, n.noise.set = function(t) {
				this.uniforms.noise = t
			}, n.noise.get = function() {
				return this.uniforms.noise
			}, n.noiseSize.set = function(t) {
				this.uniforms.noiseSize = t
			}, n.noiseSize.get = function() {
				return this.uniforms.noiseSize
			}, n.vignetting.set = function(t) {
				this.uniforms.vignetting = t
			}, n.vignetting.get = function() {
				return this.uniforms.vignetting
			}, n.vignettingAlpha.set = function(t) {
				this.uniforms.vignettingAlpha = t
			}, n.vignettingAlpha.get = function() {
				return this.uniforms.vignettingAlpha
			}, n.vignettingBlur.set = function(t) {
				this.uniforms.vignettingBlur = t
			}, n.vignettingBlur.get = function() {
				return this.uniforms.vignettingBlur
			}, Object.defineProperties(e.prototype, n), e
		}(t.Filter),
		H = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		U = "precision mediump float;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;\n\nuniform float angle;\nuniform float scale;\n\nfloat pattern()\n{\n   float s = sin(angle), c = cos(angle);\n   vec2 tex = vTextureCoord * filterArea.xy;\n   vec2 point = vec2(\n       c * tex.x - s * tex.y,\n       s * tex.x + c * tex.y\n   ) * scale;\n   return (sin(point.x) * sin(point.y)) * 4.0;\n}\n\nvoid main()\n{\n   vec4 color = texture2D(uSampler, vTextureCoord);\n   float average = (color.r + color.g + color.b) / 3.0;\n   gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);\n}\n",
		Q = function(t) {
			function e(e, n) {
				void 0 === e && (e = 1), void 0 === n && (n = 5), t.call(this, H, U), this.scale = e, this.angle = n
			}
			t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
			var n = {
				scale: {
					configurable: !0
				},
				angle: {
					configurable: !0
				}
			};
			return n.scale.get = function() {
				return this.uniforms.scale
			}, n.scale.set = function(t) {
				this.uniforms.scale = t
			}, n.angle.get = function() {
				return this.uniforms.angle
			}, n.angle.set = function(t) {
				this.uniforms.angle = t
			}, Object.defineProperties(e.prototype, n), e
		}(t.Filter),
		Z = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		$ = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float alpha;\nuniform vec3 color;\nvoid main(void){\n    vec4 sample = texture2D(uSampler, vTextureCoord);\n\n    // Un-premultiply alpha before applying the color\n    if (sample.a > 0.0) {\n        sample.rgb /= sample.a;\n    }\n\n    // Premultiply alpha again\n    sample.rgb = color.rgb * sample.a;\n\n    // alpha user alpha\n    sample *= alpha;\n\n    gl_FragColor = sample;\n}",
		J = function(e) {
			function n(n) {
				n && n.constructor !== Object && (console.warn("DropShadowFilter now uses options instead of (rotation, distance, blur, color, alpha)"), n = {
					rotation: n
				}, void 0 !== arguments[1] && (n.distance = arguments[1]), void 0 !== arguments[2] && (n.blur = arguments[2]), void 0 !== arguments[3] && (n.color = arguments[3]), void 0 !== arguments[4] && (n.alpha = arguments[4])), n = Object.assign({
					rotation: 45,
					distance: 5,
					color: 0,
					alpha: .5,
					shadowOnly: !1,
					kernels: null,
					blur: 2,
					quality: 3,
					pixelSize: 1,
					resolution: t.settings.RESOLUTION
				}, n), e.call(this);
				var i = n.kernels,
					r = n.blur,
					o = n.quality,
					a = n.pixelSize,
					s = n.resolution;
				this._tintFilter = new t.Filter(Z, $), this._tintFilter.uniforms.color = new Float32Array(4), this._tintFilter.resolution = s, this._blurFilter = i ? new h(i) : new h(r, o), this.pixelSize = a, this.resolution = s, this.targetTransform = new t.Matrix;
				var l = n.shadowOnly,
					u = n.rotation,
					c = n.distance,
					d = n.alpha,
					f = n.color;
				this.shadowOnly = l, this.rotation = u, this.distance = c, this.alpha = d, this.color = f, this._updatePadding()
			}
			e && (n.__proto__ = e), n.prototype = Object.create(e && e.prototype), n.prototype.constructor = n;
			var i = {
				resolution: {
					configurable: !0
				},
				distance: {
					configurable: !0
				},
				rotation: {
					configurable: !0
				},
				alpha: {
					configurable: !0
				},
				color: {
					configurable: !0
				},
				kernels: {
					configurable: !0
				},
				blur: {
					configurable: !0
				},
				quality: {
					configurable: !0
				},
				pixelSize: {
					configurable: !0
				}
			};
			return n.prototype.apply = function(t, e, n, i) {
				var r = t.getRenderTarget();
				r.transform = this.targetTransform, this._tintFilter.apply(t, e, r, !0), r.transform = null, this._blurFilter.apply(t, r, n), !0 !== this.shadowOnly && t.applyFilter(this, e, n, i), t.returnRenderTarget(r)
			}, n.prototype._updatePadding = function() {
				this.padding = this.distance + 2 * this.blur
			}, n.prototype._updateTargetTransform = function() {
				this.targetTransform.tx = this.distance * Math.cos(this.angle), this.targetTransform.ty = this.distance * Math.sin(this.angle)
			}, i.resolution.get = function() {
				return this._resolution
			}, i.resolution.set = function(t) {
				this._resolution = t, this._tintFilter && (this._tintFilter.resolution = t), this._blurFilter && (this._blurFilter.resolution = t)
			}, i.distance.get = function() {
				return this._distance
			}, i.distance.set = function(t) {
				this._distance = t, this._updatePadding(), this._updateTargetTransform()
			}, i.rotation.get = function() {
				return this.angle / t.DEG_TO_RAD
			}, i.rotation.set = function(e) {
				this.angle = e * t.DEG_TO_RAD, this._updateTargetTransform()
			}, i.alpha.get = function() {
				return this._tintFilter.uniforms.alpha
			}, i.alpha.set = function(t) {
				this._tintFilter.uniforms.alpha = t
			}, i.color.get = function() {
				return t.utils.rgb2hex(this._tintFilter.uniforms.color)
			}, i.color.set = function(e) {
				t.utils.hex2rgb(e, this._tintFilter.uniforms.color)
			}, i.kernels.get = function() {
				return this._blurFilter.kernels
			}, i.kernels.set = function(t) {
				this._blurFilter.kernels = t
			}, i.blur.get = function() {
				return this._blurFilter.blur
			}, i.blur.set = function(t) {
				this._blurFilter.blur = t, this._updatePadding()
			}, i.quality.get = function() {
				return this._blurFilter.quality
			}, i.quality.set = function(t) {
				this._blurFilter.quality = t
			}, i.pixelSize.get = function() {
				return this._blurFilter.pixelSize
			}, i.pixelSize.set = function(t) {
				this._blurFilter.pixelSize = t
			}, Object.defineProperties(n.prototype, i), n
		}(t.Filter),
		tt = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		et = "precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float strength;\nuniform vec4 filterArea;\n\n\nvoid main(void)\n{\n\tvec2 onePixel = vec2(1.0 / filterArea);\n\n\tvec4 color;\n\n\tcolor.rgb = vec3(0.5);\n\n\tcolor -= texture2D(uSampler, vTextureCoord - onePixel) * strength;\n\tcolor += texture2D(uSampler, vTextureCoord + onePixel) * strength;\n\n\tcolor.rgb = vec3((color.r + color.g + color.b) / 3.0);\n\n\tfloat alpha = texture2D(uSampler, vTextureCoord).a;\n\n\tgl_FragColor = vec4(color.rgb * alpha, alpha);\n}\n",
		nt = function(t) {
			function e(e) {
				void 0 === e && (e = 5), t.call(this, tt, et), this.strength = e
			}
			t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
			var n = {
				strength: {
					configurable: !0
				}
			};
			return n.strength.get = function() {
				return this.uniforms.strength
			}, n.strength.set = function(t) {
				this.uniforms.strength = t
			}, Object.defineProperties(e.prototype, n), e
		}(t.Filter),
		it = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		rt = "// precision highp float;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform vec2 dimensions;\nuniform float aspect;\n\nuniform sampler2D displacementMap;\nuniform float offset;\nuniform float sinDir;\nuniform float cosDir;\nuniform int fillMode;\n\nuniform float seed;\nuniform vec2 red;\nuniform vec2 green;\nuniform vec2 blue;\n\nconst int TRANSPARENT = 0;\nconst int ORIGINAL = 1;\nconst int LOOP = 2;\nconst int CLAMP = 3;\nconst int MIRROR = 4;\n\nvoid main(void)\n{\n    vec2 coord = (vTextureCoord * filterArea.xy) / dimensions;\n\n    if (coord.x > 1.0 || coord.y > 1.0) {\n        return;\n    }\n\n    float cx = coord.x - 0.5;\n    float cy = (coord.y - 0.5) * aspect;\n    float ny = (-sinDir * cx + cosDir * cy) / aspect + 0.5;\n\n    // displacementMap: repeat\n    // ny = ny > 1.0 ? ny - 1.0 : (ny < 0.0 ? 1.0 + ny : ny);\n\n    // displacementMap: mirror\n    ny = ny > 1.0 ? 2.0 - ny : (ny < 0.0 ? -ny : ny);\n\n    vec4 dc = texture2D(displacementMap, vec2(0.5, ny));\n\n    float displacement = (dc.r - dc.g) * (offset / filterArea.x);\n\n    coord = vTextureCoord + vec2(cosDir * displacement, sinDir * displacement * aspect);\n\n    if (fillMode == CLAMP) {\n        coord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    } else {\n        if( coord.x > filterClamp.z ) {\n            if (fillMode == ORIGINAL) {\n                gl_FragColor = texture2D(uSampler, vTextureCoord);\n                return;\n            } else if (fillMode == LOOP) {\n                coord.x -= filterClamp.z;\n            } else if (fillMode == MIRROR) {\n                coord.x = filterClamp.z * 2.0 - coord.x;\n            } else {\n                gl_FragColor = vec4(0., 0., 0., 0.);\n                return;\n            }\n        } else if( coord.x < filterClamp.x ) {\n            if (fillMode == ORIGINAL) {\n                gl_FragColor = texture2D(uSampler, vTextureCoord);\n                return;\n            } else if (fillMode == LOOP) {\n                coord.x += filterClamp.z;\n            } else if (fillMode == MIRROR) {\n                coord.x *= -filterClamp.z;\n            } else {\n                gl_FragColor = vec4(0., 0., 0., 0.);\n                return;\n            }\n        }\n\n        if( coord.y > filterClamp.w ) {\n            if (fillMode == ORIGINAL) {\n                gl_FragColor = texture2D(uSampler, vTextureCoord);\n                return;\n            } else if (fillMode == LOOP) {\n                coord.y -= filterClamp.w;\n            } else if (fillMode == MIRROR) {\n                coord.y = filterClamp.w * 2.0 - coord.y;\n            } else {\n                gl_FragColor = vec4(0., 0., 0., 0.);\n                return;\n            }\n        } else if( coord.y < filterClamp.y ) {\n            if (fillMode == ORIGINAL) {\n                gl_FragColor = texture2D(uSampler, vTextureCoord);\n                return;\n            } else if (fillMode == LOOP) {\n                coord.y += filterClamp.w;\n            } else if (fillMode == MIRROR) {\n                coord.y *= -filterClamp.w;\n            } else {\n                gl_FragColor = vec4(0., 0., 0., 0.);\n                return;\n            }\n        }\n    }\n\n    gl_FragColor.r = texture2D(uSampler, coord + red * (1.0 - seed * 0.4) / filterArea.xy).r;\n    gl_FragColor.g = texture2D(uSampler, coord + green * (1.0 - seed * 0.3) / filterArea.xy).g;\n    gl_FragColor.b = texture2D(uSampler, coord + blue * (1.0 - seed * 0.2) / filterArea.xy).b;\n    gl_FragColor.a = texture2D(uSampler, coord).a;\n}\n",
		ot = function(e) {
			function n(n) {
				void 0 === n && (n = {}), e.call(this, it, rt), this.uniforms.dimensions = new Float32Array(2), n = Object.assign({
					slices: 5,
					offset: 100,
					direction: 0,
					fillMode: 0,
					average: !1,
					seed: 0,
					red: [0, 0],
					green: [0, 0],
					blue: [0, 0],
					minSize: 8,
					sampleSize: 512
				}, n), this.direction = n.direction, this.red = n.red, this.green = n.green, this.blue = n.blue, this.offset = n.offset, this.fillMode = n.fillMode, this.average = n.average, this.seed = n.seed, this.minSize = n.minSize, this.sampleSize = n.sampleSize, this._canvas = document.createElement("canvas"), this._canvas.width = 4, this._canvas.height = this.sampleSize, this.texture = t.Texture.fromCanvas(this._canvas, t.SCALE_MODES.NEAREST), this._slices = 0, this.slices = n.slices
			}
			e && (n.__proto__ = e), n.prototype = Object.create(e && e.prototype), n.prototype.constructor = n;
			var i = {
				sizes: {
					configurable: !0
				},
				offsets: {
					configurable: !0
				},
				slices: {
					configurable: !0
				},
				direction: {
					configurable: !0
				},
				red: {
					configurable: !0
				},
				green: {
					configurable: !0
				},
				blue: {
					configurable: !0
				}
			};
			return n.prototype.apply = function(t, e, n, i) {
				var r = e.sourceFrame.width,
					o = e.sourceFrame.height;
				this.uniforms.dimensions[0] = r, this.uniforms.dimensions[1] = o, this.uniforms.aspect = o / r, this.uniforms.seed = this.seed, this.uniforms.offset = this.offset, this.uniforms.fillMode = this.fillMode, t.applyFilter(this, e, n, i)
			}, n.prototype._randomizeSizes = function() {
				var t = this._sizes,
					e = this._slices - 1,
					n = this.sampleSize,
					i = Math.min(this.minSize / n, .9 / this._slices);
				if(this.average) {
					for(var r = this._slices, o = 1, a = 0; a < e; a++) {
						var s = o / (r - a),
							l = Math.max(s * (1 - .6 * Math.random()), i);
						t[a] = l, o -= l
					}
					t[e] = o
				} else {
					for(var u = 1, c = Math.sqrt(1 / this._slices), d = 0; d < e; d++) {
						var f = Math.max(c * u * Math.random(), i);
						t[d] = f, u -= f
					}
					t[e] = u
				}
				this.shuffle()
			}, n.prototype.shuffle = function() {
				for(var t = this._sizes, e = this._slices - 1; e > 0; e--) {
					var n = Math.random() * e >> 0,
						i = t[e];
					t[e] = t[n], t[n] = i
				}
			}, n.prototype._randomizeOffsets = function() {
				for(var t = 0; t < this._slices; t++) this._offsets[t] = Math.random() * (Math.random() < .5 ? -1 : 1)
			}, n.prototype.refresh = function() {
				this._randomizeSizes(), this._randomizeOffsets(), this.redraw()
			}, n.prototype.redraw = function() {
				var t, e = this.sampleSize,
					n = this.texture,
					i = this._canvas.getContext("2d");
				i.clearRect(0, 0, 8, e);
				for(var r = 0, o = 0; o < this._slices; o++) {
					t = Math.floor(256 * this._offsets[o]);
					var a = this._sizes[o] * e,
						s = t > 0 ? t : 0,
						l = t < 0 ? -t : 0;
					i.fillStyle = "rgba(" + s + ", " + l + ", 0, 1)", i.fillRect(0, r >> 0, e, a + 1 >> 0), r += a
				}
				n._updateID++, n.baseTexture.emit("update", n.baseTexture), this.uniforms.displacementMap = n
			}, i.sizes.set = function(t) {
				for(var e = Math.min(this._slices, t.length), n = 0; n < e; n++) this._sizes[n] = t[n]
			}, i.sizes.get = function() {
				return this._sizes
			}, i.offsets.set = function(t) {
				for(var e = Math.min(this._slices, t.length), n = 0; n < e; n++) this._offsets[n] = t[n]
			}, i.offsets.get = function() {
				return this._offsets
			}, i.slices.get = function() {
				return this._slices
			}, i.slices.set = function(t) {
				this._slices !== t && (this._slices = t, this.uniforms.slices = t, this._sizes = this.uniforms.slicesWidth = new Float32Array(t), this._offsets = this.uniforms.slicesOffset = new Float32Array(t), this.refresh())
			}, i.direction.get = function() {
				return this._direction
			}, i.direction.set = function(e) {
				if(this._direction !== e) {
					this._direction = e;
					var n = e * t.DEG_TO_RAD;
					this.uniforms.sinDir = Math.sin(n), this.uniforms.cosDir = Math.cos(n)
				}
			}, i.red.get = function() {
				return this.uniforms.red
			}, i.red.set = function(t) {
				this.uniforms.red = t
			}, i.green.get = function() {
				return this.uniforms.green
			}, i.green.set = function(t) {
				this.uniforms.green = t
			}, i.blue.get = function() {
				return this.uniforms.blue
			}, i.blue.set = function(t) {
				this.uniforms.blue = t
			}, n.prototype.destroy = function() {
				this.texture.destroy(!0), this.texture = null, this._canvas = null, this.red = null, this.green = null, this.blue = null, this._sizes = null, this._offsets = null
			}, Object.defineProperties(n.prototype, i), n
		}(t.Filter);
	ot.TRANSPARENT = 0, ot.ORIGINAL = 1, ot.LOOP = 2, ot.CLAMP = 3, ot.MIRROR = 4;
	var at = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		st = "varying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nuniform float distance;\nuniform float outerStrength;\nuniform float innerStrength;\nuniform vec4 glowColor;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nconst float PI = 3.14159265358979323846264;\n\nvoid main(void) {\n    vec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float totalAlpha = 0.0;\n    float maxTotalAlpha = 0.0;\n    float cosAngle;\n    float sinAngle;\n    vec2 displaced;\n    for (float angle = 0.0; angle <= PI * 2.0; angle += %QUALITY_DIST%) {\n       cosAngle = cos(angle);\n       sinAngle = sin(angle);\n       for (float curDistance = 1.0; curDistance <= %DIST%; curDistance++) {\n           displaced.x = vTextureCoord.x + cosAngle * curDistance * px.x;\n           displaced.y = vTextureCoord.y + sinAngle * curDistance * px.y;\n           curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n           totalAlpha += (distance - curDistance) * curColor.a;\n           maxTotalAlpha += (distance - curDistance);\n       }\n    }\n    maxTotalAlpha = max(maxTotalAlpha, 0.0001);\n\n    ownColor.a = max(ownColor.a, 0.0001);\n    ownColor.rgb = ownColor.rgb / ownColor.a;\n    float outerGlowAlpha = (totalAlpha / maxTotalAlpha)  * outerStrength * (1. - ownColor.a);\n    float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * innerStrength * ownColor.a;\n    float resultAlpha = (ownColor.a + outerGlowAlpha);\n    gl_FragColor = vec4(mix(mix(ownColor.rgb, glowColor.rgb, innerGlowAlpha / ownColor.a), glowColor.rgb, outerGlowAlpha / resultAlpha) * resultAlpha, resultAlpha);\n}\n",
		lt = function(e) {
			function n(t, n, i, r, o) {
				void 0 === t && (t = 10), void 0 === n && (n = 4), void 0 === i && (i = 0), void 0 === r && (r = 16777215), void 0 === o && (o = .1), e.call(this, at, st.replace(/%QUALITY_DIST%/gi, "" + (1 / o / t).toFixed(7)).replace(/%DIST%/gi, "" + t.toFixed(7))), this.uniforms.glowColor = new Float32Array([0, 0, 0, 1]), this.distance = t, this.color = r, this.outerStrength = n, this.innerStrength = i
			}
			e && (n.__proto__ = e), n.prototype = Object.create(e && e.prototype), n.prototype.constructor = n;
			var i = {
				color: {
					configurable: !0
				},
				distance: {
					configurable: !0
				},
				outerStrength: {
					configurable: !0
				},
				innerStrength: {
					configurable: !0
				}
			};
			return i.color.get = function() {
				return t.utils.rgb2hex(this.uniforms.glowColor)
			}, i.color.set = function(e) {
				t.utils.hex2rgb(e, this.uniforms.glowColor)
			}, i.distance.get = function() {
				return this.uniforms.distance
			}, i.distance.set = function(t) {
				this.uniforms.distance = t
			}, i.outerStrength.get = function() {
				return this.uniforms.outerStrength
			}, i.outerStrength.set = function(t) {
				this.uniforms.outerStrength = t
			}, i.innerStrength.get = function() {
				return this.uniforms.innerStrength
			}, i.innerStrength.set = function(t) {
				this.uniforms.innerStrength = t
			}, Object.defineProperties(n.prototype, i), n
		}(t.Filter),
		ut = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		ct = "vec3 mod289(vec3 x)\n{\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 mod289(vec4 x)\n{\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 permute(vec4 x)\n{\n    return mod289(((x * 34.0) + 1.0) * x);\n}\nvec4 taylorInvSqrt(vec4 r)\n{\n    return 1.79284291400159 - 0.85373472095314 * r;\n}\nvec3 fade(vec3 t)\n{\n    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);\n}\n// Classic Perlin noise, periodic variant\nfloat pnoise(vec3 P, vec3 rep)\n{\n    vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period\n    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period\n    Pi0 = mod289(Pi0);\n    Pi1 = mod289(Pi1);\n    vec3 Pf0 = fract(P); // Fractional part for interpolation\n    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n    vec4 iy = vec4(Pi0.yy, Pi1.yy);\n    vec4 iz0 = Pi0.zzzz;\n    vec4 iz1 = Pi1.zzzz;\n    vec4 ixy = permute(permute(ix) + iy);\n    vec4 ixy0 = permute(ixy + iz0);\n    vec4 ixy1 = permute(ixy + iz1);\n    vec4 gx0 = ixy0 * (1.0 / 7.0);\n    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n    gx0 = fract(gx0);\n    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n    vec4 sz0 = step(gz0, vec4(0.0));\n    gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n    gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n    vec4 gx1 = ixy1 * (1.0 / 7.0);\n    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n    gx1 = fract(gx1);\n    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n    vec4 sz1 = step(gz1, vec4(0.0));\n    gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n    gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n    vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);\n    vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);\n    vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);\n    vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);\n    vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);\n    vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);\n    vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);\n    vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);\n    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n    g000 *= norm0.x;\n    g010 *= norm0.y;\n    g100 *= norm0.z;\n    g110 *= norm0.w;\n    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n    g001 *= norm1.x;\n    g011 *= norm1.y;\n    g101 *= norm1.z;\n    g111 *= norm1.w;\n    float n000 = dot(g000, Pf0);\n    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n    float n111 = dot(g111, Pf1);\n    vec3 fade_xyz = fade(Pf0);\n    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n    return 2.2 * n_xyz;\n}\nfloat turb(vec3 P, vec3 rep, float lacunarity, float gain)\n{\n    float sum = 0.0;\n    float sc = 1.0;\n    float totalgain = 1.0;\n    for (float i = 0.0; i < 6.0; i++)\n    {\n        sum += totalgain * pnoise(P * sc, rep);\n        sc *= lacunarity;\n        totalgain *= gain;\n    }\n    return abs(sum);\n}\n",
		dt = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\n\nuniform vec2 light;\nuniform bool parallel;\nuniform float aspect;\n\nuniform float gain;\nuniform float lacunarity;\nuniform float time;\n\n${perlin}\n\nvoid main(void) {\n    vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;\n\n    float d;\n\n    if (parallel) {\n        float _cos = light.x;\n        float _sin = light.y;\n        d = (_cos * coord.x) + (_sin * coord.y * aspect);\n    } else {\n        float dx = coord.x - light.x / dimensions.x;\n        float dy = (coord.y - light.y / dimensions.y) * aspect;\n        float dis = sqrt(dx * dx + dy * dy) + 0.00001;\n        d = dy / dis;\n    }\n\n    vec3 dir = vec3(d, d, 0.0);\n\n    float noise = turb(dir + vec3(time, 0.0, 62.1 + time) * 0.05, vec3(480.0, 320.0, 480.0), lacunarity, gain);\n    noise = mix(noise, 0.0, 0.3);\n    //fade vertically.\n    vec4 mist = vec4(noise, noise, noise, 1.0) * (1.0 - coord.y);\n    mist.a = 1.0;\n\n    gl_FragColor = texture2D(uSampler, vTextureCoord) + mist;\n}\n",
		ft = function(e) {
			function n(n) {
				e.call(this, ut, dt.replace("${perlin}", ct)), this.uniforms.dimensions = new Float32Array(2), "number" == typeof n && (console.warn("GodrayFilter now uses options instead of (angle, gain, lacunarity, time)"), n = {
					angle: n
				}, void 0 !== arguments[1] && (n.gain = arguments[1]), void 0 !== arguments[2] && (n.lacunarity = arguments[2]), void 0 !== arguments[3] && (n.time = arguments[3])), n = Object.assign({
					angle: 30,
					gain: .5,
					lacunarity: 2.5,
					time: 0,
					parallel: !0,
					center: [0, 0]
				}, n), this._angleLight = new t.Point, this.angle = n.angle, this.gain = n.gain, this.lacunarity = n.lacunarity, this.parallel = n.parallel, this.center = n.center, this.time = n.time
			}
			e && (n.__proto__ = e), n.prototype = Object.create(e && e.prototype), n.prototype.constructor = n;
			var i = {
				angle: {
					configurable: !0
				},
				gain: {
					configurable: !0
				},
				lacunarity: {
					configurable: !0
				}
			};
			return n.prototype.apply = function(t, e, n, i) {
				var r = e.sourceFrame,
					o = r.width,
					a = r.height;
				this.uniforms.light = this.parallel ? this._angleLight : this.center, this.uniforms.parallel = this.parallel, this.uniforms.dimensions[0] = o, this.uniforms.dimensions[1] = a, this.uniforms.aspect = a / o, this.uniforms.time = this.time, t.applyFilter(this, e, n, i)
			}, i.angle.get = function() {
				return this._angle
			}, i.angle.set = function(e) {
				this._angle = e;
				var n = e * t.DEG_TO_RAD;
				this._angleLight.x = Math.cos(n), this._angleLight.y = Math.sin(n)
			}, i.gain.get = function() {
				return this.uniforms.gain
			}, i.gain.set = function(t) {
				this.uniforms.gain = t
			}, i.lacunarity.get = function() {
				return this.uniforms.lacunarity
			}, i.lacunarity.set = function(t) {
				this.uniforms.lacunarity = t
			}, Object.defineProperties(n.prototype, i), n
		}(t.Filter),
		ht = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		mt = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform vec2 uVelocity;\nuniform int uKernelSize;\nuniform float uOffset;\n\nconst int MAX_KERNEL_SIZE = 2048;\n\n// Notice:\n// the perfect way:\n//    int kernelSize = min(uKernelSize, MAX_KERNELSIZE);\n// BUT in real use-case , uKernelSize < MAX_KERNELSIZE almost always.\n// So use uKernelSize directly.\n\nvoid main(void)\n{\n    vec4 color = texture2D(uSampler, vTextureCoord);\n\n    if (uKernelSize == 0)\n    {\n        gl_FragColor = color;\n        return;\n    }\n\n    vec2 velocity = uVelocity / filterArea.xy;\n    float offset = -uOffset / length(uVelocity) - 0.5;\n    int k = uKernelSize - 1;\n\n    for(int i = 0; i < MAX_KERNEL_SIZE - 1; i++) {\n        if (i == k) {\n            break;\n        }\n        vec2 bias = velocity * (float(i) / float(k) + offset);\n        color += texture2D(uSampler, vTextureCoord + bias);\n    }\n    gl_FragColor = color / float(uKernelSize);\n}\n",
		pt = function(e) {
			function n(n, i, r) {
				void 0 === n && (n = [0, 0]), void 0 === i && (i = 5), void 0 === r && (r = 0), e.call(this, ht, mt), this.uniforms.uVelocity = new Float32Array(2), this._velocity = new t.Point(0, 0), this.velocity = n, this.kernelSize = i, this.offset = r
			}
			e && (n.__proto__ = e), n.prototype = Object.create(e && e.prototype), n.prototype.constructor = n;
			var i = {
				velocity: {
					configurable: !0
				},
				offset: {
					configurable: !0
				}
			};
			return n.prototype.apply = function(t, e, n, i) {
				var r = this.velocity,
					o = r.x,
					a = r.y;
				this.uniforms.uKernelSize = 0 !== o || 0 !== a ? this.kernelSize : 0, t.applyFilter(this, e, n, i)
			}, i.velocity.set = function(e) {
				Array.isArray(e) ? (this._velocity.x = e[0], this._velocity.y = e[1]) : e instanceof t.Point && (this._velocity.x = e.x, this._velocity.y = e.y), this.uniforms.uVelocity[0] = this._velocity.x, this.uniforms.uVelocity[1] = this._velocity.y
			}, i.velocity.get = function() {
				return this._velocity
			}, i.offset.set = function(t) {
				this.uniforms.uOffset = t
			}, i.offset.get = function() {
				return this.uniforms.uOffset
			}, Object.defineProperties(n.prototype, i), n
		}(t.Filter),
		gt = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		vt = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float epsilon;\n\nconst int MAX_COLORS = %maxColors%;\n\nuniform vec3 originalColors[MAX_COLORS];\nuniform vec3 targetColors[MAX_COLORS];\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n\n    float alpha = gl_FragColor.a;\n    if (alpha < 0.0001)\n    {\n      return;\n    }\n\n    vec3 color = gl_FragColor.rgb / alpha;\n\n    for(int i = 0; i < MAX_COLORS; i++)\n    {\n      vec3 origColor = originalColors[i];\n      if (origColor.r < 0.0)\n      {\n        break;\n      }\n      vec3 colorDiff = origColor - color;\n      if (length(colorDiff) < epsilon)\n      {\n        vec3 targetColor = targetColors[i];\n        gl_FragColor = vec4((targetColor + colorDiff) * alpha, alpha);\n        return;\n      }\n    }\n}\n",
		xt = function(e) {
			function n(t, n, i) {
				void 0 === n && (n = .05), void 0 === i && (i = null), i = i || t.length, e.call(this, gt, vt.replace(/%maxColors%/g, i)), this.epsilon = n, this._maxColors = i, this._replacements = null, this.uniforms.originalColors = new Float32Array(3 * i), this.uniforms.targetColors = new Float32Array(3 * i), this.replacements = t
			}
			e && (n.__proto__ = e), n.prototype = Object.create(e && e.prototype), n.prototype.constructor = n;
			var i = {
				replacements: {
					configurable: !0
				},
				maxColors: {
					configurable: !0
				},
				epsilon: {
					configurable: !0
				}
			};
			return i.replacements.set = function(e) {
				var n = this.uniforms.originalColors,
					i = this.uniforms.targetColors,
					r = e.length;
				if(r > this._maxColors) throw "Length of replacements (" + r + ") exceeds the maximum colors length (" + this._maxColors + ")";
				n[3 * r] = -1;
				for(var o = 0; o < r; o++) {
					var a = e[o],
						s = a[0];
					"number" == typeof s ? s = t.utils.hex2rgb(s) : a[0] = t.utils.rgb2hex(s), n[3 * o] = s[0], n[3 * o + 1] = s[1], n[3 * o + 2] = s[2];
					var l = a[1];
					"number" == typeof l ? l = t.utils.hex2rgb(l) : a[1] = t.utils.rgb2hex(l), i[3 * o] = l[0], i[3 * o + 1] = l[1], i[3 * o + 2] = l[2]
				}
				this._replacements = e
			}, i.replacements.get = function() {
				return this._replacements
			}, n.prototype.refresh = function() {
				this.replacements = this._replacements
			}, i.maxColors.get = function() {
				return this._maxColors
			}, i.epsilon.set = function(t) {
				this.uniforms.epsilon = t
			}, i.epsilon.get = function() {
				return this.uniforms.epsilon
			}, Object.defineProperties(n.prototype, i), n
		}(t.Filter),
		yt = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		bt = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\n\nuniform float sepia;\nuniform float noise;\nuniform float noiseSize;\nuniform float scratch;\nuniform float scratchDensity;\nuniform float scratchWidth;\nuniform float vignetting;\nuniform float vignettingAlpha;\nuniform float vignettingBlur;\nuniform float seed;\n\nconst float SQRT_2 = 1.414213;\nconst vec3 SEPIA_RGB = vec3(112.0 / 255.0, 66.0 / 255.0, 20.0 / 255.0);\n\nfloat rand(vec2 co) {\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvec3 Overlay(vec3 src, vec3 dst)\n{\n    // if (dst <= 0.5) then: 2 * src * dst\n    // if (dst > 0.5) then: 1 - 2 * (1 - dst) * (1 - src)\n    return vec3((dst.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - dst.x) * (1.0 - src.x)),\n                (dst.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - dst.y) * (1.0 - src.y)),\n                (dst.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - dst.z) * (1.0 - src.z)));\n}\n\n\nvoid main()\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n    vec3 color = gl_FragColor.rgb;\n\n    if (sepia > 0.0)\n    {\n        float gray = (color.x + color.y + color.z) / 3.0;\n        vec3 grayscale = vec3(gray);\n\n        color = Overlay(SEPIA_RGB, grayscale);\n\n        color = grayscale + sepia * (color - grayscale);\n    }\n\n    vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;\n\n    if (vignetting > 0.0)\n    {\n        float outter = SQRT_2 - vignetting * SQRT_2;\n        vec2 dir = vec2(vec2(0.5, 0.5) - coord);\n        dir.y *= dimensions.y / dimensions.x;\n        float darker = clamp((outter - length(dir) * SQRT_2) / ( 0.00001 + vignettingBlur * SQRT_2), 0.0, 1.0);\n        color.rgb *= darker + (1.0 - darker) * (1.0 - vignettingAlpha);\n    }\n\n    if (scratchDensity > seed && scratch != 0.0)\n    {\n        float phase = seed * 256.0;\n        float s = mod(floor(phase), 2.0);\n        float dist = 1.0 / scratchDensity;\n        float d = distance(coord, vec2(seed * dist, abs(s - seed * dist)));\n        if (d < seed * 0.6 + 0.4)\n        {\n            highp float period = scratchDensity * 10.0;\n\n            float xx = coord.x * period + phase;\n            float aa = abs(mod(xx, 0.5) * 4.0);\n            float bb = mod(floor(xx / 0.5), 2.0);\n            float yy = (1.0 - bb) * aa + bb * (2.0 - aa);\n\n            float kk = 2.0 * period;\n            float dw = scratchWidth / dimensions.x * (0.75 + seed);\n            float dh = dw * kk;\n\n            float tine = (yy - (2.0 - dh));\n\n            if (tine > 0.0) {\n                float _sign = sign(scratch);\n\n                tine = s * tine / period + scratch + 0.1;\n                tine = clamp(tine + 1.0, 0.5 + _sign * 0.5, 1.5 + _sign * 0.5);\n\n                color.rgb *= tine;\n            }\n        }\n    }\n\n    if (noise > 0.0 && noiseSize > 0.0)\n    {\n        vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;\n        pixelCoord.x = floor(pixelCoord.x / noiseSize);\n        pixelCoord.y = floor(pixelCoord.y / noiseSize);\n        // vec2 d = pixelCoord * noiseSize * vec2(1024.0 + seed * 512.0, 1024.0 - seed * 512.0);\n        // float _noise = snoise(d) * 0.5;\n        float _noise = rand(pixelCoord * noiseSize * seed) - 0.5;\n        color += _noise * noise;\n    }\n\n    gl_FragColor.rgb = color;\n}\n",
		Ct = function(t) {
			function e(e, n) {
				void 0 === n && (n = 0), t.call(this, yt, bt), this.uniforms.dimensions = new Float32Array(2), "number" == typeof e ? (this.seed = e, e = null) : this.seed = n, Object.assign(this, {
					sepia: .3,
					noise: .3,
					noiseSize: 1,
					scratch: .5,
					scratchDensity: .3,
					scratchWidth: 1,
					vignetting: .3,
					vignettingAlpha: 1,
					vignettingBlur: .3
				}, e)
			}
			t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
			var n = {
				sepia: {
					configurable: !0
				},
				noise: {
					configurable: !0
				},
				noiseSize: {
					configurable: !0
				},
				scratch: {
					configurable: !0
				},
				scratchDensity: {
					configurable: !0
				},
				scratchWidth: {
					configurable: !0
				},
				vignetting: {
					configurable: !0
				},
				vignettingAlpha: {
					configurable: !0
				},
				vignettingBlur: {
					configurable: !0
				}
			};
			return e.prototype.apply = function(t, e, n, i) {
				this.uniforms.dimensions[0] = e.sourceFrame.width, this.uniforms.dimensions[1] = e.sourceFrame.height, this.uniforms.seed = this.seed, t.applyFilter(this, e, n, i)
			}, n.sepia.set = function(t) {
				this.uniforms.sepia = t
			}, n.sepia.get = function() {
				return this.uniforms.sepia
			}, n.noise.set = function(t) {
				this.uniforms.noise = t
			}, n.noise.get = function() {
				return this.uniforms.noise
			}, n.noiseSize.set = function(t) {
				this.uniforms.noiseSize = t
			}, n.noiseSize.get = function() {
				return this.uniforms.noiseSize
			}, n.scratch.set = function(t) {
				this.uniforms.scratch = t
			}, n.scratch.get = function() {
				return this.uniforms.scratch
			}, n.scratchDensity.set = function(t) {
				this.uniforms.scratchDensity = t
			}, n.scratchDensity.get = function() {
				return this.uniforms.scratchDensity
			}, n.scratchWidth.set = function(t) {
				this.uniforms.scratchWidth = t
			}, n.scratchWidth.get = function() {
				return this.uniforms.scratchWidth
			}, n.vignetting.set = function(t) {
				this.uniforms.vignetting = t
			}, n.vignetting.get = function() {
				return this.uniforms.vignetting
			}, n.vignettingAlpha.set = function(t) {
				this.uniforms.vignettingAlpha = t
			}, n.vignettingAlpha.get = function() {
				return this.uniforms.vignettingAlpha
			}, n.vignettingBlur.set = function(t) {
				this.uniforms.vignettingBlur = t
			}, n.vignettingBlur.get = function() {
				return this.uniforms.vignettingBlur
			}, Object.defineProperties(e.prototype, n), e
		}(t.Filter),
		_t = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		St = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec2 thickness;\nuniform vec4 outlineColor;\nuniform vec4 filterClamp;\n\nconst float DOUBLE_PI = 3.14159265358979323846264 * 2.;\n\nvoid main(void) {\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float maxAlpha = 0.;\n    vec2 displaced;\n    for (float angle = 0.; angle <= DOUBLE_PI; angle += ${angleStep}) {\n        displaced.x = vTextureCoord.x + thickness.x * cos(angle);\n        displaced.y = vTextureCoord.y + thickness.y * sin(angle);\n        curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n        maxAlpha = max(maxAlpha, curColor.a);\n    }\n    float resultAlpha = max(maxAlpha, ownColor.a);\n    gl_FragColor = vec4((ownColor.rgb + outlineColor.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);\n}\n",
		Ft = function(e) {
			function n(t, i, r) {
				void 0 === t && (t = 1), void 0 === i && (i = 0), void 0 === r && (r = .1);
				var o = Math.max(r * n.MAX_SAMPLES, n.MIN_SAMPLES),
					a = (2 * Math.PI / o).toFixed(7);
				e.call(this, _t, St.replace(/\$\{angleStep\}/, a)), this.uniforms.thickness = new Float32Array([0, 0]), this.thickness = t, this.uniforms.outlineColor = new Float32Array([0, 0, 0, 1]), this.color = i, this.quality = r
			}
			e && (n.__proto__ = e), n.prototype = Object.create(e && e.prototype), n.prototype.constructor = n;
			var i = {
				color: {
					configurable: !0
				}
			};
			return n.prototype.apply = function(t, e, n, i) {
				this.uniforms.thickness[0] = this.thickness / e.size.width, this.uniforms.thickness[1] = this.thickness / e.size.height, t.applyFilter(this, e, n, i)
			}, i.color.get = function() {
				return t.utils.rgb2hex(this.uniforms.outlineColor)
			}, i.color.set = function(e) {
				t.utils.hex2rgb(e, this.uniforms.outlineColor)
			}, Object.defineProperties(n.prototype, i), n
		}(t.Filter);
	Ft.MIN_SAMPLES = 1, Ft.MAX_SAMPLES = 100;
	var Tt = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		zt = "precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform vec2 size;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 pixelate(vec2 coord, vec2 size)\n{\n\treturn floor( coord / size ) * size;\n}\n\nvoid main(void)\n{\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = pixelate(coord, size);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord);\n}\n",
		wt = function(t) {
			function e(e) {
				void 0 === e && (e = 10), t.call(this, Tt, zt), this.size = e
			}
			t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
			var n = {
				size: {
					configurable: !0
				}
			};
			return n.size.get = function() {
				return this.uniforms.size
			}, n.size.set = function(t) {
				"number" == typeof t && (t = [t, t]), this.uniforms.size = t
			}, Object.defineProperties(e.prototype, n), e
		}(t.Filter),
		At = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		Pt = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform float uRadian;\nuniform vec2 uCenter;\nuniform float uRadius;\nuniform int uKernelSize;\n\nconst int MAX_KERNEL_SIZE = 2048;\n\nvoid main(void)\n{\n    vec4 color = texture2D(uSampler, vTextureCoord);\n\n    if (uKernelSize == 0)\n    {\n        gl_FragColor = color;\n        return;\n    }\n\n    float aspect = filterArea.y / filterArea.x;\n    vec2 center = uCenter.xy / filterArea.xy;\n    float gradient = uRadius / filterArea.x * 0.3;\n    float radius = uRadius / filterArea.x - gradient * 0.5;\n    int k = uKernelSize - 1;\n\n    vec2 coord = vTextureCoord;\n    vec2 dir = vec2(center - coord);\n    float dist = length(vec2(dir.x, dir.y * aspect));\n\n    float radianStep = uRadian;\n    if (radius >= 0.0 && dist > radius) {\n        float delta = dist - radius;\n        float gap = gradient;\n        float scale = 1.0 - abs(delta / gap);\n        if (scale <= 0.0) {\n            gl_FragColor = color;\n            return;\n        }\n        radianStep *= scale;\n    }\n    radianStep /= float(k);\n\n    float s = sin(radianStep);\n    float c = cos(radianStep);\n    mat2 rotationMatrix = mat2(vec2(c, -s), vec2(s, c));\n\n    for(int i = 0; i < MAX_KERNEL_SIZE - 1; i++) {\n        if (i == k) {\n            break;\n        }\n\n        coord -= center;\n        coord.y *= aspect;\n        coord = rotationMatrix * coord;\n        coord.y /= aspect;\n        coord += center;\n\n        vec4 sample = texture2D(uSampler, coord);\n\n        // switch to pre-multiplied alpha to correctly blur transparent images\n        // sample.rgb *= sample.a;\n\n        color += sample;\n    }\n\n    gl_FragColor = color / float(uKernelSize);\n}\n",
		Mt = function(t) {
			function e(e, n, i, r) {
				void 0 === e && (e = 0), void 0 === n && (n = [0, 0]), void 0 === i && (i = 5), void 0 === r && (r = -1), t.call(this, At, Pt), this._angle = 0, this.angle = e, this.center = n, this.kernelSize = i, this.radius = r
			}
			t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
			var n = {
				angle: {
					configurable: !0
				},
				center: {
					configurable: !0
				},
				radius: {
					configurable: !0
				}
			};
			return e.prototype.apply = function(t, e, n, i) {
				this.uniforms.uKernelSize = 0 !== this._angle ? this.kernelSize : 0, t.applyFilter(this, e, n, i)
			}, n.angle.set = function(t) {
				this._angle = t, this.uniforms.uRadian = t * Math.PI / 180
			}, n.angle.get = function() {
				return this._angle
			}, n.center.get = function() {
				return this.uniforms.uCenter
			}, n.center.set = function(t) {
				this.uniforms.uCenter = t
			}, n.radius.get = function() {
				return this.uniforms.uRadius
			}, n.radius.set = function(t) {
				(t < 0 || t === 1 / 0) && (t = -1), this.uniforms.uRadius = t
			}, Object.defineProperties(e.prototype, n), e
		}(t.Filter),
		Ot = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		Dt = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform vec2 dimensions;\n\nuniform bool mirror;\nuniform float boundary;\nuniform vec2 amplitude;\nuniform vec2 waveLength;\nuniform vec2 alpha;\nuniform float time;\n\nfloat rand(vec2 co) {\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvoid main(void)\n{\n    vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;\n    vec2 coord = pixelCoord / dimensions;\n\n    if (coord.y < boundary) {\n        gl_FragColor = texture2D(uSampler, vTextureCoord);\n        return;\n    }\n\n    float k = (coord.y - boundary) / (1. - boundary + 0.0001);\n    float areaY = boundary * dimensions.y / filterArea.y;\n    float v = areaY + areaY - vTextureCoord.y;\n    float y = mirror ? v : vTextureCoord.y;\n\n    float _amplitude = ((amplitude.y - amplitude.x) * k + amplitude.x ) / filterArea.x;\n    float _waveLength = ((waveLength.y - waveLength.x) * k + waveLength.x) / filterArea.y;\n    float _alpha = (alpha.y - alpha.x) * k + alpha.x;\n\n    float x = vTextureCoord.x + cos(v * 6.28 / _waveLength - time) * _amplitude;\n    x = clamp(x, filterClamp.x, filterClamp.z);\n\n    vec4 color = texture2D(uSampler, vec2(x, y));\n\n    gl_FragColor = color * _alpha;\n}\n",
		jt = function(t) {
			function e(e) {
				t.call(this, Ot, Dt), this.uniforms.amplitude = new Float32Array(2), this.uniforms.waveLength = new Float32Array(2), this.uniforms.alpha = new Float32Array(2), this.uniforms.dimensions = new Float32Array(2), Object.assign(this, {
					mirror: !0,
					boundary: .5,
					amplitude: [0, 20],
					waveLength: [30, 100],
					alpha: [1, 1],
					time: 0
				}, e)
			}
			t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
			var n = {
				mirror: {
					configurable: !0
				},
				boundary: {
					configurable: !0
				},
				amplitude: {
					configurable: !0
				},
				waveLength: {
					configurable: !0
				},
				alpha: {
					configurable: !0
				}
			};
			return e.prototype.apply = function(t, e, n, i) {
				this.uniforms.dimensions[0] = e.sourceFrame.width, this.uniforms.dimensions[1] = e.sourceFrame.height, this.uniforms.time = this.time, t.applyFilter(this, e, n, i)
			}, n.mirror.set = function(t) {
				this.uniforms.mirror = t
			}, n.mirror.get = function() {
				return this.uniforms.mirror
			}, n.boundary.set = function(t) {
				this.uniforms.boundary = t
			}, n.boundary.get = function() {
				return this.uniforms.boundary
			}, n.amplitude.set = function(t) {
				this.uniforms.amplitude[0] = t[0], this.uniforms.amplitude[1] = t[1]
			}, n.amplitude.get = function() {
				return this.uniforms.amplitude
			}, n.waveLength.set = function(t) {
				this.uniforms.waveLength[0] = t[0], this.uniforms.waveLength[1] = t[1]
			}, n.waveLength.get = function() {
				return this.uniforms.waveLength
			}, n.alpha.set = function(t) {
				this.uniforms.alpha[0] = t[0], this.uniforms.alpha[1] = t[1]
			}, n.alpha.get = function() {
				return this.uniforms.alpha
			}, Object.defineProperties(e.prototype, n), e
		}(t.Filter),
		Rt = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		kt = "precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 red;\nuniform vec2 green;\nuniform vec2 blue;\n\nvoid main(void)\n{\n   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/filterArea.xy).r;\n   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/filterArea.xy).g;\n   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/filterArea.xy).b;\n   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;\n}\n",
		Lt = function(t) {
			function e(e, n, i) {
				void 0 === e && (e = [-10, 0]), void 0 === n && (n = [0, 10]), void 0 === i && (i = [0, 0]), t.call(this, Rt, kt), this.red = e, this.green = n, this.blue = i
			}
			t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
			var n = {
				red: {
					configurable: !0
				},
				green: {
					configurable: !0
				},
				blue: {
					configurable: !0
				}
			};
			return n.red.get = function() {
				return this.uniforms.red
			}, n.red.set = function(t) {
				this.uniforms.red = t
			}, n.green.get = function() {
				return this.uniforms.green
			}, n.green.set = function(t) {
				this.uniforms.green = t
			}, n.blue.get = function() {
				return this.uniforms.blue
			}, n.blue.set = function(t) {
				this.uniforms.blue = t
			}, Object.defineProperties(e.prototype, n), e
		}(t.Filter),
		Et = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		It = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\n\nuniform vec2 center;\n\nuniform float amplitude;\nuniform float wavelength;\n// uniform float power;\nuniform float brightness;\nuniform float speed;\nuniform float radius;\n\nuniform float time;\n\nconst float PI = 3.14159;\n\nvoid main()\n{\n    float halfWavelength = wavelength * 0.5 / filterArea.x;\n    float maxRadius = radius / filterArea.x;\n    float currentRadius = time * speed / filterArea.x;\n\n    float fade = 1.0;\n\n    if (maxRadius > 0.0) {\n        if (currentRadius > maxRadius) {\n            gl_FragColor = texture2D(uSampler, vTextureCoord);\n            return;\n        }\n        fade = 1.0 - pow(currentRadius / maxRadius, 2.0);\n    }\n\n    vec2 dir = vec2(vTextureCoord - center / filterArea.xy);\n    dir.y *= filterArea.y / filterArea.x;\n    float dist = length(dir);\n\n    if (dist <= 0.0 || dist < currentRadius - halfWavelength || dist > currentRadius + halfWavelength) {\n        gl_FragColor = texture2D(uSampler, vTextureCoord);\n        return;\n    }\n\n    vec2 diffUV = normalize(dir);\n\n    float diff = (dist - currentRadius) / halfWavelength;\n\n    float p = 1.0 - pow(abs(diff), 2.0);\n\n    // float powDiff = diff * pow(p, 2.0) * ( amplitude * fade );\n    float powDiff = 1.25 * sin(diff * PI) * p * ( amplitude * fade );\n\n    vec2 offset = diffUV * powDiff / filterArea.xy;\n\n    // Do clamp :\n    vec2 coord = vTextureCoord + offset;\n    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    vec4 color = texture2D(uSampler, clampedCoord);\n    if (coord != clampedCoord) {\n        color *= max(0.0, 1.0 - length(coord - clampedCoord));\n    }\n\n    // No clamp :\n    // gl_FragColor = texture2D(uSampler, vTextureCoord + offset);\n\n    color.rgb *= 1.0 + (brightness - 1.0) * p * fade;\n\n    gl_FragColor = color;\n}\n",
		Vt = function(t) {
			function e(e, n, i) {
				void 0 === e && (e = [0, 0]), void 0 === n && (n = {}), void 0 === i && (i = 0), t.call(this, Et, It), this.center = e, Array.isArray(n) && (console.warn("Deprecated Warning: ShockwaveFilter params Array has been changed to options Object."), n = {}), n = Object.assign({
					amplitude: 30,
					wavelength: 160,
					brightness: 1,
					speed: 500,
					radius: -1
				}, n), this.amplitude = n.amplitude, this.wavelength = n.wavelength, this.brightness = n.brightness, this.speed = n.speed, this.radius = n.radius, this.time = i
			}
			t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
			var n = {
				center: {
					configurable: !0
				},
				amplitude: {
					configurable: !0
				},
				wavelength: {
					configurable: !0
				},
				brightness: {
					configurable: !0
				},
				speed: {
					configurable: !0
				},
				radius: {
					configurable: !0
				}
			};
			return e.prototype.apply = function(t, e, n, i) {
				this.uniforms.time = this.time, t.applyFilter(this, e, n, i)
			}, n.center.get = function() {
				return this.uniforms.center
			}, n.center.set = function(t) {
				this.uniforms.center = t
			}, n.amplitude.get = function() {
				return this.uniforms.amplitude
			}, n.amplitude.set = function(t) {
				this.uniforms.amplitude = t
			}, n.wavelength.get = function() {
				return this.uniforms.wavelength
			}, n.wavelength.set = function(t) {
				this.uniforms.wavelength = t
			}, n.brightness.get = function() {
				return this.uniforms.brightness
			}, n.brightness.set = function(t) {
				this.uniforms.brightness = t
			}, n.speed.get = function() {
				return this.uniforms.speed
			}, n.speed.set = function(t) {
				this.uniforms.speed = t
			}, n.radius.get = function() {
				return this.uniforms.radius
			}, n.radius.set = function(t) {
				this.uniforms.radius = t
			}, Object.defineProperties(e.prototype, n), e
		}(t.Filter),
		Bt = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		Wt = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform sampler2D uLightmap;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\nuniform vec4 ambientColor;\nvoid main() {\n    vec4 diffuseColor = texture2D(uSampler, vTextureCoord);\n    vec2 lightCoord = (vTextureCoord * filterArea.xy) / dimensions;\n    vec4 light = texture2D(uLightmap, lightCoord);\n    vec3 ambient = ambientColor.rgb * ambientColor.a;\n    vec3 intensity = ambient + light.rgb;\n    vec3 finalColor = diffuseColor.rgb * intensity;\n    gl_FragColor = vec4(finalColor, diffuseColor.a);\n}\n",
		Nt = function(e) {
			function n(t, n, i) {
				void 0 === n && (n = 0), void 0 === i && (i = 1), e.call(this, Bt, Wt), this.uniforms.dimensions = new Float32Array(2), this.uniforms.ambientColor = new Float32Array([0, 0, 0, i]), this.texture = t, this.color = n
			}
			e && (n.__proto__ = e), n.prototype = Object.create(e && e.prototype), n.prototype.constructor = n;
			var i = {
				texture: {
					configurable: !0
				},
				color: {
					configurable: !0
				},
				alpha: {
					configurable: !0
				}
			};
			return n.prototype.apply = function(t, e, n, i) {
				this.uniforms.dimensions[0] = e.sourceFrame.width, this.uniforms.dimensions[1] = e.sourceFrame.height, t.applyFilter(this, e, n, i)
			}, i.texture.get = function() {
				return this.uniforms.uLightmap
			}, i.texture.set = function(t) {
				this.uniforms.uLightmap = t
			}, i.color.set = function(e) {
				var n = this.uniforms.ambientColor;
				"number" == typeof e ? (t.utils.hex2rgb(e, n), this._color = e) : (n[0] = e[0], n[1] = e[1], n[2] = e[2], n[3] = e[3], this._color = t.utils.rgb2hex(n))
			}, i.color.get = function() {
				return this._color
			}, i.alpha.get = function() {
				return this.uniforms.ambientColor[3]
			}, i.alpha.set = function(t) {
				this.uniforms.ambientColor[3] = t
			}, Object.defineProperties(n.prototype, i), n
		}(t.Filter),
		Xt = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		qt = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float blur;\nuniform float gradientBlur;\nuniform vec2 start;\nuniform vec2 end;\nuniform vec2 delta;\nuniform vec2 texSize;\n\nfloat random(vec3 scale, float seed)\n{\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n    float total = 0.0;\n\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n    vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));\n    float radius = smoothstep(0.0, 1.0, abs(dot(vTextureCoord * texSize - start, normal)) / gradientBlur) * blur;\n\n    for (float t = -30.0; t <= 30.0; t++)\n    {\n        float percent = (t + offset - 0.5) / 30.0;\n        float weight = 1.0 - abs(percent);\n        vec4 sample = texture2D(uSampler, vTextureCoord + delta / texSize * percent * radius);\n        sample.rgb *= sample.a;\n        color += sample * weight;\n        total += weight;\n    }\n\n    color /= total;\n    color.rgb /= color.a + 0.00001;\n\n    gl_FragColor = color;\n}\n",
		Gt = function(e) {
			function n(n, i, r, o) {
				void 0 === n && (n = 100), void 0 === i && (i = 600), void 0 === r && (r = null), void 0 === o && (o = null), e.call(this, Xt, qt), this.uniforms.blur = n, this.uniforms.gradientBlur = i, this.uniforms.start = r || new t.Point(0, window.innerHeight / 2), this.uniforms.end = o || new t.Point(600, window.innerHeight / 2), this.uniforms.delta = new t.Point(30, 30), this.uniforms.texSize = new t.Point(window.innerWidth, window.innerHeight), this.updateDelta()
			}
			e && (n.__proto__ = e), n.prototype = Object.create(e && e.prototype), n.prototype.constructor = n;
			var i = {
				blur: {
					configurable: !0
				},
				gradientBlur: {
					configurable: !0
				},
				start: {
					configurable: !0
				},
				end: {
					configurable: !0
				}
			};
			return n.prototype.updateDelta = function() {
				this.uniforms.delta.x = 0, this.uniforms.delta.y = 0
			}, i.blur.get = function() {
				return this.uniforms.blur
			}, i.blur.set = function(t) {
				this.uniforms.blur = t
			}, i.gradientBlur.get = function() {
				return this.uniforms.gradientBlur
			}, i.gradientBlur.set = function(t) {
				this.uniforms.gradientBlur = t
			}, i.start.get = function() {
				return this.uniforms.start
			}, i.start.set = function(t) {
				this.uniforms.start = t, this.updateDelta()
			}, i.end.get = function() {
				return this.uniforms.end
			}, i.end.set = function(t) {
				this.uniforms.end = t, this.updateDelta()
			}, Object.defineProperties(n.prototype, i), n
		}(t.Filter),
		Kt = function(t) {
			function e() {
				t.apply(this, arguments)
			}
			return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.updateDelta = function() {
				var t = this.uniforms.end.x - this.uniforms.start.x,
					e = this.uniforms.end.y - this.uniforms.start.y,
					n = Math.sqrt(t * t + e * e);
				this.uniforms.delta.x = t / n, this.uniforms.delta.y = e / n
			}, e
		}(Gt),
		Yt = function(t) {
			function e() {
				t.apply(this, arguments)
			}
			return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.updateDelta = function() {
				var t = this.uniforms.end.x - this.uniforms.start.x,
					e = this.uniforms.end.y - this.uniforms.start.y,
					n = Math.sqrt(t * t + e * e);
				this.uniforms.delta.x = -e / n, this.uniforms.delta.y = t / n
			}, e
		}(Gt),
		Ht = function(t) {
			function e(e, n, i, r) {
				void 0 === e && (e = 100), void 0 === n && (n = 600), void 0 === i && (i = null), void 0 === r && (r = null), t.call(this), this.tiltShiftXFilter = new Kt(e, n, i, r), this.tiltShiftYFilter = new Yt(e, n, i, r)
			}
			t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
			var n = {
				blur: {
					configurable: !0
				},
				gradientBlur: {
					configurable: !0
				},
				start: {
					configurable: !0
				},
				end: {
					configurable: !0
				}
			};
			return e.prototype.apply = function(t, e, n) {
				var i = t.getRenderTarget(!0);
				this.tiltShiftXFilter.apply(t, e, i), this.tiltShiftYFilter.apply(t, i, n), t.returnRenderTarget(i)
			}, n.blur.get = function() {
				return this.tiltShiftXFilter.blur
			}, n.blur.set = function(t) {
				this.tiltShiftXFilter.blur = this.tiltShiftYFilter.blur = t
			}, n.gradientBlur.get = function() {
				return this.tiltShiftXFilter.gradientBlur
			}, n.gradientBlur.set = function(t) {
				this.tiltShiftXFilter.gradientBlur = this.tiltShiftYFilter.gradientBlur = t
			}, n.start.get = function() {
				return this.tiltShiftXFilter.start
			}, n.start.set = function(t) {
				this.tiltShiftXFilter.start = this.tiltShiftYFilter.start = t
			}, n.end.get = function() {
				return this.tiltShiftXFilter.end
			}, n.end.set = function(t) {
				this.tiltShiftXFilter.end = this.tiltShiftYFilter.end = t
			}, Object.defineProperties(e.prototype, n), e
		}(t.Filter),
		Ut = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		Qt = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float radius;\nuniform float angle;\nuniform vec2 offset;\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 twist(vec2 coord)\n{\n    coord -= offset;\n\n    float dist = length(coord);\n\n    if (dist < radius)\n    {\n        float ratioDist = (radius - dist) / radius;\n        float angleMod = ratioDist * ratioDist * angle;\n        float s = sin(angleMod);\n        float c = cos(angleMod);\n        coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);\n    }\n\n    coord += offset;\n\n    return coord;\n}\n\nvoid main(void)\n{\n\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = twist(coord);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord );\n\n}\n",
		Zt = function(t) {
			function e(e, n, i) {
				void 0 === e && (e = 200), void 0 === n && (n = 4), void 0 === i && (i = 20), t.call(this, Ut, Qt), this.radius = e, this.angle = n, this.padding = i
			}
			t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
			var n = {
				offset: {
					configurable: !0
				},
				radius: {
					configurable: !0
				},
				angle: {
					configurable: !0
				}
			};
			return n.offset.get = function() {
				return this.uniforms.offset
			}, n.offset.set = function(t) {
				this.uniforms.offset = t
			}, n.radius.get = function() {
				return this.uniforms.radius
			}, n.radius.set = function(t) {
				this.uniforms.radius = t
			}, n.angle.get = function() {
				return this.uniforms.angle
			}, n.angle.set = function(t) {
				this.uniforms.angle = t
			}, Object.defineProperties(e.prototype, n), e
		}(t.Filter),
		$t = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
		Jt = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform vec2 uCenter;\nuniform float uStrength;\nuniform float uInnerRadius;\nuniform float uRadius;\n\nconst float MAX_KERNEL_SIZE = 32.0;\n\nfloat random(vec3 scale, float seed) {\n    // use the fragment position for a different seed per-pixel\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\n\nvoid main() {\n\n    float minGradient = uInnerRadius * 0.3;\n    float innerRadius = (uInnerRadius + minGradient * 0.5) / filterArea.x;\n\n    float gradient = uRadius * 0.3;\n    float radius = (uRadius - gradient * 0.5) / filterArea.x;\n\n    float countLimit = MAX_KERNEL_SIZE;\n\n    vec2 dir = vec2(uCenter.xy / filterArea.xy - vTextureCoord);\n    float dist = length(vec2(dir.x, dir.y * filterArea.y / filterArea.x));\n\n    float strength = uStrength;\n\n    float delta = 0.0;\n    float gap;\n    if (dist < innerRadius) {\n        delta = innerRadius - dist;\n        gap = minGradient;\n    } else if (radius >= 0.0 && dist > radius) { // radius < 0 means it's infinity\n        delta = dist - radius;\n        gap = gradient;\n    }\n\n    if (delta > 0.0) {\n        float normalCount = gap / filterArea.x;\n        delta = (normalCount - delta) / normalCount;\n        countLimit *= delta;\n        strength *= delta;\n        if (countLimit < 1.0)\n        {\n            gl_FragColor = texture2D(uSampler, vTextureCoord);\n            return;\n        }\n    }\n\n    // randomize the lookup values to hide the fixed number of samples\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n\n    float total = 0.0;\n    vec4 color = vec4(0.0);\n\n    dir *= strength;\n\n    for (float t = 0.0; t < MAX_KERNEL_SIZE; t++) {\n        float percent = (t + offset) / MAX_KERNEL_SIZE;\n        float weight = 4.0 * (percent - percent * percent);\n        vec2 p = vTextureCoord + dir * percent;\n        vec4 sample = texture2D(uSampler, p);\n\n        // switch to pre-multiplied alpha to correctly blur transparent images\n        // sample.rgb *= sample.a;\n\n        color += sample * weight;\n        total += weight;\n\n        if (t > countLimit){\n            break;\n        }\n    }\n\n    color /= total;\n    // switch back from pre-multiplied alpha\n    color.rgb /= color.a + 0.00001;\n\n    gl_FragColor = color;\n}\n",
		te = function(t) {
			function e(e, n, i, r) {
				void 0 === e && (e = .1), void 0 === n && (n = [0, 0]), void 0 === i && (i = 0), void 0 === r && (r = -1), t.call(this, $t, Jt), this.center = n, this.strength = e, this.innerRadius = i, this.radius = r
			}
			t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
			var n = {
				center: {
					configurable: !0
				},
				strength: {
					configurable: !0
				},
				innerRadius: {
					configurable: !0
				},
				radius: {
					configurable: !0
				}
			};
			return n.center.get = function() {
				return this.uniforms.uCenter
			}, n.center.set = function(t) {
				this.uniforms.uCenter = t
			}, n.strength.get = function() {
				return this.uniforms.uStrength
			}, n.strength.set = function(t) {
				this.uniforms.uStrength = t
			}, n.innerRadius.get = function() {
				return this.uniforms.uInnerRadius
			}, n.innerRadius.set = function(t) {
				this.uniforms.uInnerRadius = t
			}, n.radius.get = function() {
				return this.uniforms.uRadius
			}, n.radius.set = function(t) {
				(t < 0 || t === 1 / 0) && (t = -1), this.uniforms.uRadius = t
			}, Object.defineProperties(e.prototype, n), e
		}(t.Filter),
		ee = Object.freeze({
			AdjustmentFilter: u,
			AdvancedBloomFilter: x,
			AsciiFilter: C,
			BevelFilter: F,
			BloomFilter: P,
			BulgePinchFilter: D,
			ColorMapFilter: k,
			ColorReplaceFilter: I,
			ConvolutionFilter: W,
			CrossHatchFilter: q,
			CRTFilter: Y,
			DotFilter: Q,
			DropShadowFilter: J,
			EmbossFilter: nt,
			GlitchFilter: ot,
			GlowFilter: lt,
			GodrayFilter: ft,
			KawaseBlurFilter: h,
			MotionBlurFilter: pt,
			MultiColorReplaceFilter: xt,
			OldFilmFilter: Ct,
			OutlineFilter: Ft,
			PixelateFilter: wt,
			RadialBlurFilter: Mt,
			ReflectionFilter: jt,
			RGBSplitFilter: Lt,
			ShockwaveFilter: Vt,
			SimpleLightmapFilter: Nt,
			TiltShiftFilter: Ht,
			TiltShiftAxisFilter: Gt,
			TiltShiftXFilter: Kt,
			TiltShiftYFilter: Yt,
			TwistFilter: Zt,
			ZoomBlurFilter: te
		}),
		ne = function(e) {
			function n() {
				var n = new dat.GUI;
				n.useLocalStorage = !1;
				var i = document.querySelector("#container"),
					r = i.offsetWidth,
					o = i.offsetHeight;
				e.call(this, {
					view: document.querySelector("#stage"),
					width: r,
					height: o,
					autoStart: !1,
					backgroundColor: 0
				}), this.legacy = parseInt(t.VERSION.split(".")[0]) < 5, t.settings.PRECISION_FRAGMENT = "highp", this.domElement = i, this.initWidth = r, this.initHeight = o, this.animating = !0, this.rendering = !0, this.events = new t.utils.EventEmitter, this.animateTimer = 0, this.bg = null, this.pond = null, this.fishCount = 20, this.fishes = [], this.fishFilters = [], this.pondFilters = [], this.filterArea = new t.Rectangle, this.padding = 100, this.bounds = new t.Rectangle(-this.padding, -this.padding, r + 2 * this.padding, o + 2 * this.padding);
				var a = this;
				this.gui = n, this.gui.add(this, "rendering").name("&bull; Rendering").onChange(function(t) {
					t ? a.start() : a.stop()
				}), this.gui.add(this, "animating").name("&bull; Animating")
			}
			e && (n.__proto__ = e), n.prototype = Object.create(e && e.prototype), n.prototype.constructor = n;
			var i = {
				resources: {
					configurable: !0
				}
			};
			return i.resources.get = function() {
				return this.loader.resources
			}, n.prototype.load = function(t, e) {
				var n = this;
				this.loader.add(t).load(function() {
					e(), n.init(), n.start()
				})
			}, n.prototype.init = function() {
				var e = this.loader.resources,
					n = this.bounds,
					i = this.initWidth,
					r = this.initHeight;
				this.pond = new t.Container, this.pond.filterArea = this.filterArea, this.pond.filters = this.pondFilters, this.stage.addChild(this.pond), this.bg = new t.Sprite(e.background.texture), this.pond.addChild(this.bg);
				for(var o = 0; o < this.fishCount; o++) {
					var a = "fish" + (o % 4 + 1),
						s = new t.Sprite(e[a].texture);
					s.anchor.set(.5), s.filters = this.fishFilters, s.direction = Math.random() * Math.PI * 2, s.speed = 2 + 2 * Math.random(), s.turnSpeed = Math.random() - .8, s.x = Math.random() * n.width, s.y = Math.random() * n.height, s.scale.set(.8 + .3 * Math.random()), this.pond.addChild(s), this.fishes.push(s)
				}
				this.overlay = new t.extras.TilingSprite(e.overlay.texture, i, r), this.pond.addChild(this.overlay), window.addEventListener("resize", this.resize.bind(this)), this.resize(), this.ticker.add(this.animate, this)
			}, n.prototype.resize = function() {
				var t = this.padding,
					e = this.bg,
					n = this.overlay,
					i = this.filterArea,
					r = this.bounds,
					o = this.domElement.offsetWidth,
					a = this.domElement.offsetHeight,
					s = this.legacy ? 4 : 0,
					l = e.texture.width / e.texture.height;
				o / a > l ? (e.width = o, e.height = o / l) : (e.height = a, e.width = a * l), e.x = (o - e.width) / 2, e.y = (a - e.height) / 2, n.width = o, n.height = a, r.x = -t, r.y = -t, r.width = o + 2 * t, r.height = a + 2 * t, i.x = s, i.y = s, i.width = o - 2 * s, i.height = a - 2 * s, this.events.emit("resize", o, a), this.renderer.resize(o, a), this.render()
			}, n.prototype.animate = function(t) {
				this.animateTimer += t;
				var e = this.bounds,
					n = this.animateTimer,
					i = this.overlay;
				if(this.events.emit("animate", t, n), this.animating) {
					i.tilePosition.x = -1 * n, i.tilePosition.y = -1 * n;
					for(var r = 0; r < this.fishes.length; r++) {
						var o = this.fishes[r];
						o.direction += .01 * o.turnSpeed, o.x += Math.sin(o.direction) * o.speed, o.y += Math.cos(o.direction) * o.speed, o.rotation = -o.direction - Math.PI / 2, o.x < e.x && (o.x += e.width), o.x > e.x + e.width && (o.x -= e.width), o.y < e.y && (o.y += e.height), o.y > e.y + e.height && (o.y -= e.height)
					}
				}
			}, n.prototype.addFilter = function(e, n) {
				var i = this;
				"function" == typeof n && (n = {
					oncreate: n
				}), (n = Object.assign({
					name: e,
					enabled: !1,
					opened: !1,
					args: null,
					fishOnly: !1,
					global: !1,
					oncreate: null
				}, n)).global && (n.name += " (pixi.js)");
				var r, o = this,
					a = this.gui.addFolder(n.name),
					s = ee[e] || t.filters[e];
				if(!s) throw 'Unable to find class name with "' + e + '"';
				if(n.args) {
					var l = function(t) {
						s.apply(this, t)
					};
					l.prototype = s.prototype, r = new l(n.args)
				} else r = new s;
				return r.enabled = n.enabled, a.add(r, "enabled").onChange(function(t) {
					ga("send", "event", e, t ? "enabled" : "disabled"), o.events.emit("enable", t), i.render(), t ? a.domElement.className += " enabled" : a.domElement.className = a.domElement.className.replace(" enabled", "")
				}), n.opened && a.open(), n.enabled && (a.domElement.className += " enabled"), n.oncreate && n.oncreate.call(r, a), n.fishOnly ? this.fishFilters.push(r) : this.pondFilters.push(r), r
			}, Object.defineProperties(n.prototype, i), n
		}(t.Application);
	var ie = Object.freeze({
			adjustment: function() {
				this.addFilter("AdjustmentFilter", {
					oncreate: function(t) {
						t.add(this, "gamma", 0, 5), t.add(this, "saturation", 0, 5), t.add(this, "contrast", 0, 5), t.add(this, "brightness", 0, 5), t.add(this, "red", 0, 5), t.add(this, "green", 0, 5), t.add(this, "blue", 0, 5), t.add(this, "alpha", 0, 1)
					}
				})
			},
			advancedBloom: function() {
				this.addFilter("AdvancedBloomFilter", function(t) {
					t.add(this, "threshold", .1, .9), t.add(this, "bloomScale", .5, 1.5), t.add(this, "brightness", .5, 1.5), t.add(this, "blur", 0, 20), t.add(this, "quality", 0, 20)
				})
			},
			alpha: function() {
				this.addFilter("AlphaFilter", {
					global: !0,
					oncreate: function(t) {
						t.add(this, "alpha", 0, 1)
					}
				})
			},
			ascii: function() {
				this.addFilter("AsciiFilter", function(t) {
					t.add(this, "size", 2, 20)
				})
			},
			bevel: function() {
				this.addFilter("BevelFilter", {
					fishOnly: !0,
					oncreate: function(t) {
						t.add(this, "rotation", 0, 360), t.add(this, "thickness", 0, 5), t.addColor(this, "lightColor"), t.add(this, "lightAlpha", 0, 1), t.addColor(this, "shadowColor"), t.add(this, "shadowAlpha", 0, 1)
					}
				})
			},
			bloom: function() {
				this.addFilter("BloomFilter", function(t) {
					t.add(this, "blur", 0, 20), t.add(this, "blurX", 0, 20), t.add(this, "blurY", 0, 20)
				})
			},
			blur: function() {
				this.addFilter("BlurFilter", {
					global: !0,
					oncreate: function(t) {
						t.add(this, "blur", 0, 100), t.add(this, "quality", 1, 10)
					}
				})
			},
			bulgePinch: function() {
				this.addFilter("BulgePinchFilter", function(t) {
					t.add(this, "radius", 0, 1e3), t.add(this, "strength", -1, 1), t.add(this.center, "0", 0, 1).name("center.x"), t.add(this.center, "1", 0, 1).name("center.y")
				})
			},
			colorMap: function() {
				var t = this.resources.colormap.texture;
				this.addFilter("ColorMapFilter", {
					enabled: !1,
					args: [t, !1],
					oncreate: function(t) {
						t.add(this, "mix", 0, 1), t.add(this, "nearest"), this._noop = function() {}, t.add(this, "_noop").name('<img src="./images/colormap.png" width="220" height="13">')
					}
				})
			},
			colorMatrix: function() {
				this.addFilter("ColorMatrixFilter", {
					global: !0,
					oncreate: function(t) {
						t.add(this, "reset"), t.add(this, "sepia"), t.add(this, "negative"), t.add({
							kodachrome: this.kodachrome.bind(this, !0)
						}, "kodachrome"), t.add({
							lsd: this.lsd.bind(this, !0)
						}, "lsd"), t.add(this, "polaroid"), t.add(this, "desaturate"), t.add({
							contrast: this.contrast.bind(this, 1)
						}, "contrast"), t.add({
							greyscale: this.greyscale.bind(this, 1)
						}, "greyscale"), t.add({
							predator: this.predator.bind(this, 1)
						}, "predator"), t.add({
							saturate: this.saturate.bind(this, 1)
						}, "saturate")
					}
				})
			},
			colorReplace: function() {
				this.addFilter("ColorReplaceFilter", function(t) {
					t.addColor(this, "originalColor"), t.addColor(this, "newColor"), t.add(this, "epsilon", 0, 1)
				})
			},
			convolution: function() {
				this.addFilter("ConvolutionFilter", {
					args: [
						[0, 0, 0, 1, 1, 1, 0, 0, 0], 300, 300
					],
					oncreate: function(t) {
						t.add(this, "width", 0, 500), t.add(this, "height", 0, 500)
					}
				})
			},
			crossHatch: function() {
				this.addFilter("CrossHatchFilter")
			},
			crt: function() {
				var t = this;
				t.addFilter("CRTFilter", {
					args: [{
						lineWidth: 3,
						lineContrast: .3,
						noise: .2,
						time: .5
					}],
					oncreate: function(e) {
						var n = this;
						n.animating = !0, t.events.on("enable", function(t) {
							t && n.animating && (n.time = 0)
						}), t.events.on("animate", function() {
							n.animating && (n.seed = Math.random(), n.time += .5)
						}), e.add(this, "animating").name("(animating)"), e.add(this, "curvature", 0, 10), e.add(this, "lineWidth", 0, 5), e.add(this, "lineContrast", 0, 1), e.add(this, "verticalLine"), e.add(this, "noise", 0, 1), e.add(this, "noiseSize", 1, 10), e.add(this, "vignetting", 0, 1), e.add(this, "vignettingAlpha", 0, 1), e.add(this, "vignettingBlur", 0, 1), e.add(this, "seed", 0, 1), e.add(this, "time", 0, 20)
					}
				})
			},
			displacement: function() {
				var e = this;
				this.resources.map.texture.baseTexture.wrapMode = t.WRAP_MODES.REPEAT;
				var n = new t.Sprite(this.resources.map.texture);
				this.addFilter("DisplacementFilter", {
					enabled: !0,
					global: !0,
					args: [n, this.initWidth, this.initHeight],
					oncreate: function(t) {
						this.scale.x = 50, this.scale.y = 50, t.add(this.scale, "x", 1, 200).name("scale.x"), t.add(this.scale, "y", 1, 200).name("scale.y"), e.events.on("resize", function(t, e) {
							n.width = t, n.height = e
						})
					}
				})
			},
			dot: function() {
				this.addFilter("DotFilter", function(t) {
					t.add(this, "scale", .3, 1), t.add(this, "angle", 0, 5)
				})
			},
			dropShadow: function() {
				this.addFilter("DropShadowFilter", {
					fishOnly: !0,
					oncreate: function(t) {
						t.add(this, "blur", 0, 20), t.add(this, "quality", 0, 20), t.add(this, "alpha", 0, 1), t.add(this, "distance", 0, 50), t.add(this, "rotation", 0, 360), t.addColor(this, "color"), t.add(this, "shadowOnly")
					}
				})
			},
			emboss: function() {
				this.addFilter("EmbossFilter", function(t) {
					t.add(this, "strength", 0, 20)
				})
			},
			glitch: function() {
				var t = this;
				t.addFilter("GlitchFilter", {
					args: [{
						slices: 10,
						offset: 100,
						direction: 0,
						fillMode: 2,
						average: !1,
						red: [2, 2],
						green: [-10, 4],
						blue: [10, -4],
						seed: .5
					}, 0],
					oncreate: function(e) {
						var n = this;
						this.animating = !0, t.events.on("animate", function() {
							n.animating && (n.seed = Math.random())
						}), e.add(this, "animating").name("(animating)"), e.add(this, "seed", 0, 1), e.add(this, "slices", 2, 20).onChange(function(t) {
							n.slices = t >> 0
						}), e.add(this, "offset", -400, 400), e.add(this, "direction", -180, 180), e.add(this, "fillMode", {
							TRANSPARENT: 0,
							ORIGINAL: 1,
							LOOP: 2,
							CLAMP: 3,
							MIRROR: 4
						}), e.add(this.red, "0", -50, 50).name("red.x"), e.add(this.red, "1", -50, 50).name("red.y"), e.add(this.blue, "0", -50, 50).name("blue.x"), e.add(this.blue, "1", -50, 50).name("blue.y"), e.add(this.green, "0", -50, 50).name("green.x"), e.add(this.green, "1", -50, 50).name("green.y"), e.add(this, "refresh")
					}
				})
			},
			glow: function() {
				this.addFilter("GlowFilter", {
					fishOnly: !0,
					args: [15, 2, 1, 16777215, .1],
					oncreate: function(t) {
						t.add(this, "innerStrength", 0, 20), t.add(this, "outerStrength", 0, 20), t.add(this, "distance", 10, 20), t.addColor(this, "color")
					}
				})
			},
			godray: function() {
				var e = this;
				this.addFilter("GodrayFilter", {
					enabled: !1,
					opened: !1,
					oncreate: function(n) {
						var i = this;
						this.light = 30, this.gain = .6, this.lacunarity = 2.75, this.animating = !0, this.center = new t.Point(100, -100), e.events.on("enable", function(t) {
							t && i.animating && (i.time = 0)
						}), e.events.on("animate", function() {
							i.animating && (i.time += e.ticker.elapsedMS / 1e3)
						}), n.add(this, "animating").name("(animating)"), n.add(this, "time", 0, 1), n.add(this, "gain", 0, 1), n.add(this, "lacunarity", 0, 5), n.add(this, "parallel"), n.add(this, "angle", -60, 60), n.add(this.center, "x", -100, e.initWidth + 100).name("center.x"), n.add(this.center, "y", -1e3, -100).name("center.y")
					}
				})
			},
			kawaseBlur: function() {
				this.addFilter("KawaseBlurFilter", {
					args: [4, 3, !0],
					oncreate: function(t) {
						t.add(this, "blur", 0, 20), t.add(this, "quality", 1, 20), t.add(this.pixelSize, "x", 0, 10).name("pixelSize.x"), t.add(this.pixelSize, "y", 0, 10).name("pixelSize.y")
					}
				})
			},
			motionBlur: function() {
				var t = [40, 40];
				this.addFilter("MotionBlurFilter", {
					enabled: !1,
					global: !1,
					args: [t, 15],
					oncreate: function(e) {
						var n = this;
						e.add(t, "0", -90, 90).name("velocity.x").onChange(function() {
							n.velocity = t
						}), e.add(t, "1", -90, 90).name("velocity.y").onChange(function() {
							n.velocity = t
						}), e.add(n, "kernelSize", [3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25]).name("kernelSize"), e.add(n, "offset", -150, 150).name("offset")
					}
				})
			},
			multiColorReplace: function() {
				var t = [
					[3238359, 16711680],
					[938417, 65280],
					[1464209, 16776960]
				];
				this.addFilter("MultiColorReplaceFilter", {
					args: [t, .2],
					oncreate: function(e) {
						var n = this.refresh.bind(this);
						e.addColor(t[0], "0").name("original 0").onChange(n), e.addColor(t[0], "1").name("target 0").onChange(n), e.addColor(t[1], "0").name("original 1").onChange(n), e.addColor(t[1], "1").name("target 1").onChange(n), e.addColor(t[2], "0").name("original 2").onChange(n), e.addColor(t[2], "1").name("target 2").onChange(n), e.add(this, "epsilon", 0, 1)
					}
				})
			},
			noise: function() {
				this.addFilter("NoiseFilter", {
					global: !0,
					oncreate: function(t) {
						t.add(this, "noise", 0, 1), t.add(this, "seed", .01, .99)
					}
				})
			},
			oldFilm: function() {
				var t = this;
				t.addFilter("OldFilmFilter", {
					enabled: !1,
					global: !1,
					opened: !1,
					args: [
						[t.initWidth / 2, t.initHeight / 2]
					],
					oncreate: function(e) {
						var n = this;
						t.events.on("animate", function() {
							n.seed = Math.random()
						}), e.add(this, "sepia", 0, 1), e.add(this, "noise", 0, 1), e.add(this, "noiseSize", 1, 10), e.add(this, "scratch", -1, 1), e.add(this, "scratchDensity", 0, 1), e.add(this, "scratchWidth", 1, 20), e.add(this, "vignetting", 0, 1), e.add(this, "vignettingAlpha", 0, 1), e.add(this, "vignettingBlur", 0, 1)
					}
				})
			},
			outline: function() {
				this.addFilter("OutlineFilter", {
					enabled: !1,
					fishOnly: !0,
					args: [4, 0, .25],
					oncreate: function(t) {
						var e = this;
						this.padding = this.thickness + 4, t.add(this, "thickness", 0, 10).onChange(function(t) {
							e.padding = t + 4
						}), t.addColor(this, "color")
					}
				})
			},
			pixelate: function() {
				this.addFilter("PixelateFilter", function(t) {
					t.add(this.size, "0", 4, 40).name("size.x"), t.add(this.size, "1", 4, 40).name("size.y")
				})
			},
			radialBlur: function() {
				var t = this;
				t.addFilter("RadialBlurFilter", {
					args: [20, [t.initWidth / 2, t.initHeight / 2], 15, 300],
					enabled: !1,
					oncreate: function(e) {
						e.add(this, "angle", -180, 180), e.add(this.center, "0", 0, t.initWidth).name("center.x"), e.add(this.center, "1", 0, t.initHeight).name("center.y"), e.add(this, "radius", -1, Math.max(t.initWidth, t.initHeight)), e.add(this, "kernelSize", [3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25]).name("kernelSize")
					}
				})
			},
			reflection: function() {
				var t = this;
				t.addFilter("ReflectionFilter", {
					oncreate: function(e) {
						var n = this;
						n.animating = !0, t.events.on("enable", function(t) {
							t && n.animating && (n.time = 0)
						}), t.events.on("animate", function() {
							n.animating && (n.time += .1)
						}), e.add(this, "animating").name("(animating)"), e.add(this, "mirror"), e.add(this, "boundary", 0, 1), e.add(this.amplitude, "0", 0, 50).name("amplitude.start"), e.add(this.amplitude, "1", 0, 50).name("amplitude.end"), e.add(this.waveLength, "0", 10, 200).name("waveLength.start"), e.add(this.waveLength, "1", 10, 200).name("waveLength.end"), e.add(this.alpha, "0", 0, 1).name("alpha.start"), e.add(this.alpha, "1", 0, 1).name("alpha.end"), e.add(this, "time", 0, 20)
					}
				})
			},
			rgb: function() {
				this.addFilter("RGBSplitFilter", function(t) {
					t.add(this.red, "0", -20, 20).name("red.x"), t.add(this.red, "1", -20, 20).name("red.y"), t.add(this.blue, "0", -20, 20).name("blue.x"), t.add(this.blue, "1", -20, 20).name("blue.y"), t.add(this.green, "0", -20, 20).name("green.x"), t.add(this.green, "1", -20, 20).name("green.y")
				})
			},
			shockwave: function() {
				var t = this;
				this.addFilter("ShockwaveFilter", {
					enabled: !1,
					global: !1,
					args: [
						[t.initWidth / 2, t.initHeight / 2]
					],
					oncreate: function(e) {
						var n = this;
						n.animating = !0, t.events.on("enable", function(t) {
							t && n.animating && (n.time = 0)
						}), t.events.on("animate", function() {
							n.animating && (n.time += t.ticker.elapsedMS / 1e3, n.time %= 2.5)
						}), e.add(this, "animating").name("(animating)"), e.add(this, "time", 0, 2.5), e.add(this, "amplitude", 1, 100), e.add(this, "wavelength", 2, 400), e.add(this, "brightness", .2, 2), e.add(this, "radius", 100, 2e3), e.add(this.center, "0", 0, t.initWidth).name("center.x"), e.add(this.center, "1", 0, t.initHeight).name("center.y")
					}
				})
			},
			simpleLightmap: function() {
				this.addFilter("SimpleLightmapFilter", {
					args: [this.resources.lightmap.texture, 6710886],
					oncreate: function(t) {
						t.addColor(this, "color"), t.add(this, "alpha", 0, 1)
					}
				})
			},
			tiltShift: function() {
				this.addFilter("TiltShiftFilter", function(t) {
					t.add(this, "blur", 0, 200), t.add(this, "gradientBlur", 0, 1e3)
				})
			},
			twist: function() {
				var e = this;
				this.addFilter("TwistFilter", function(n) {
					this.offset = new t.Point(e.initWidth / 2, e.initHeight / 2), n.add(this, "angle", -10, 10), n.add(this, "radius", 0, e.initWidth), n.add(this.offset, "x", 0, e.initWidth), n.add(this.offset, "y", 0, e.initHeight)
				})
			},
			zoomBlur: function() {
				var t = this;
				this.addFilter("ZoomBlurFilter", {
					args: [.1, [t.initWidth / 2, t.initHeight / 2], 80],
					oncreate: function(e) {
						e.add(this, "strength", .01, .5), e.add(this.center, "0", 0, t.initWidth).name("center.x"), e.add(this.center, "1", 0, t.initHeight).name("center.y"), e.add(this, "innerRadius", 0, t.initWidth / 2)
					}
				})
			}
		}),
		re = new ne;
	re.load([{
		name: "background",
		url: "images/displacement_BG.jpg"
	}, {
		name: "overlay",
		url: "images/overlay.png"
	}, {
		name: "map",
		url: "images/displacement_map.png"
	}, {
		name: "fish1",
		url: "images/displacement_fish1.png"
	}, {
		name: "fish2",
		url: "images/displacement_fish2.png"
	}, {
		name: "fish3",
		url: "images/displacement_fish3.png"
	}, {
		name: "fish4",
		url: "images/displacement_fish4.png"
	}, {
		name: "lightmap",
		url: "images/lightmap.png"
	}, {
		name: "colormap",
		url: "images/colormap.png"
	}], function() {
		for(var t in ie) ie[t].call(re)
	})
}(PIXI);