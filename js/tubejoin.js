function PdfWriter(ptMin, ptMax) {
    return {
    	config: {
	    	orientation:	"landscape",
	    	units:			"mm",
	    	format:			"a4",
	    	pagesize:		[210, 297],
    	}
    
    	
        mmToPtsString: function(mm) {
            return ((mm/25.4)*72).toFixed(3);
        },
        
        start: function() {
        	this.pdf = new jsPDF(this.config.orientation, this.config.units, this.config.format);
        },
        
        edge: function(a, b, color) {
            b = b.minus(a);
            a = a.minus(ptMin);
        	this.pdf.setDrawColor( b.x ? 0 : 255, 0, 0);
        	this.pdf.lines([[b.x, b.y],], a.x, a.y);
        },
        
        finish: function() {
        	this.pdf.save('template.pdf');
        	this.pdf = undefined;
        },
        
    };
}


function PdfWriterDeprecated(ptMin, ptMax) {
    return {
        ptMin:  ptMin,
        ptMax:  ptMax,
        pdf:    '',
        xref:   [ ],

        mmToPtsString: function(mm) {
            return ((mm/25.4)*72).toFixed(3);
        },
        start: function() {
            this.pdf += '%PDF-1.1\r\n' + 
                        '\xe2\xe3\xcf\xd3\r\n';

            this.xref[1] = this.pdf.length;
            this.pdf += '1 0 obj\r\n' +
                        '  << /Type /Catalog\r\n' +
                        '     /Outlines 2 0 R\r\n' +
                        '     /Pages 3 0 R\r\n' +
                        '  >>\r\n' +
                        'endobj\r\n';

            this.xref[2] = this.pdf.length;
            this.pdf += '2 0 obj\r\n' +
                        '  << /Type /Outlines\r\n' +
                        '     /Count 0\r\n' +
                        '  >>\r\n' +
                        'endobj\r\n';

            this.xref[3] = this.pdf.length;
            this.pdf += '3 0 obj\r\n' +
                        '  << /Type /Pages\r\n' +
                        '     /Kids [4 0 R]\r\n' +
                        '     /Count 1\r\n' +
                        '  >>\r\n' +
                        'endobj\r\n';

            var bound = this.mmToPtsString(this.ptMax.x - this.ptMin.x) + ' ' +
                        this.mmToPtsString(this.ptMax.y - this.ptMin.y);
            this.xref[4] = this.pdf.length;
            this.pdf += '4 0 obj\r\n' +
                        '  << /Type /Page\r\n' +
                        '     /Parent 3 0 R\r\n' +
                        '     /MediaBox [0 0 ' + bound + ']\r\n' +
                        '     /Contents 5 0 R\r\n' +
                        '     /Resources << /ProcSet 7 0 R\r\n' +
                        '                   /Font << /F1 8 0 R >>\r\n' +
                        '                >>\r\n' +
                        '  >>\r\n' +
                        'endobj\r\n';

            this.xref[5] = this.pdf.length;
            this.pdf += '5 0 obj\r\n' +
                        '  << /Length 6 0 R >>\r\n' +
                        'stream\r\n';
            this.bodyStart = this.pdf.length;
        },
        edge: function(a, b, color) {
            var cr = (color >> 16) & 0xff,
                cg = (color >>  8) & 0xff,
                cb = (color >>  0) & 0xff;
            cr = (cr / 255.0).toFixed(3);
            cg = (cg / 255.0).toFixed(3);
            cb = (cb / 255.0).toFixed(3);

            a = a.minus(ptMin);
            b = b.minus(ptMin);
            this.pdf += '1 J 1 j 1 w ' + cr + ' ' + cg + ' ' + cb + ' RG\r\n' +
                        this.mmToPtsString(a.x) + ' ' + this.mmToPtsString(a.y) + ' m ' +
                        this.mmToPtsString(b.x) + ' ' + this.mmToPtsString(b.y) + ' l S\r\n';
        },
        finish: function() {
            this.pdf += 'BT /F1 7 Tf 1 3 Td ' +
                        '(circumference this way --->         ' +
                        'http://cq.cx/tubejoin.pl) Tj ET\r\n' +
                        'q 0 1 -1 0 7 7 cm BT /F1 7 Tf 4 1 Td ' +
                        '(axis this way ---> ) Tj ET Q\r\n';

            var bodyEnd = this.pdf.length;
            this.pdf += 'endstream\r\n' +
                        'endobj\r\n';

            this.xref[6] = this.pdf.length;
            this.pdf += '6 0 obj\r\n' +
                        '  ' + (bodyEnd - this.bodyStart) + '\r\n' +
                        'endobj\r\n';

            this.xref[7] = this.pdf.length;
            this.pdf += '7 0 obj\r\n' +
                        '  [/PDF /Text]\r\n' +
                        'endobj\r\n';

            this.xref[8] = this.pdf.length;
            this.pdf += '8 0 obj\r\n' +
                        '  << /Type /Font\r\n' +
                        '     /Subtype /Type1\r\n' +
                        '     /Name /F1\r\n' +
                        '     /BaseFont /Helvetica\r\n' +
                        '     /Encoding /WinAnsiEncoding\r\n' +
                        '  >>\r\n' +
                        'endobj\r\n';

            this.xref[9] = this.pdf.length;
            this.pdf += '9 0 obj\r\n' +
                        '  << /Creator (http://cq.cx/tubejoin.pl)\r\n' +
                        '  >>\r\n';

            var xrefStart = this.pdf.length;
            this.pdf += 'xref\r\n' +
                        '0 10\r\n' +
                        '0000000000 65535 f\r\n';
            
            function pad(v, n) {
                var ret = v.toString();
                while(ret.length < n) ret = '0' + ret;
                return ret;
            }
            for(var i = 1; i <= 9; i++) {
                this.pdf += pad(this.xref[i], 10) + ' 00000 n\r\n';
            }

            this.pdf += '\r\n' +
                        'trailer\r\n' +
                        '  << /Size 10\r\n' +
                        '     /Root 1 0 R\r\n' +
                        '     /Info 9 0 R\r\n' +
                        '  >>\r\n' +
                        'startxref\r\n' +
                        xrefStart + '\r\n' +
                        '%%EOF\r\n';

            this.uri = 'data:application/pdf,' + encodeURI(this.pdf);
            this.data = this.pdf;
            this.contentType = 'application/pdf';
            this.filename = 'template.pdf';
        },
    };
}

function DxfWriter(ptMin, ptMax) {
    return {
        ptMin:  ptMin,
        ptMax:  ptMax,
        dxf:    '',

        start: function() {
            this.dxf += '  999\r\n' +
                        'file created by SolveSpace\r\n' +
                        '  0\r\n' +
                        'SECTION\r\n' +
                        '  2\r\n' +
                        'HEADER\r\n' +
                        '  9\r\n' +
                        '$ACADVER\r\n' +
                        '  1\r\n' +
                        'AC1006\r\n' +
                        '  9\r\n' +
                        '$ANGDIR\r\n' +
                        '  70\r\n' +
                        '0\r\n' +
                        '  9\r\n' +
                        '$AUNITS\r\n' +
                        '  70\r\n' +
                        '0\r\n' +
                        '  9\r\n' +
                        '$AUPREC\r\n' +
                        '  70\r\n' +
                        '0\r\n' +
                        '  9\r\n' +
                        '$INSBASE\r\n' +
                        '  10\r\n' +
                        '0.0\r\n' +
                        '  20\r\n' +
                        '0.0\r\n' +
                        '  30\r\n' +
                        '0.0\r\n' +
                        '  9\r\n' +
                        '$EXTMIN\r\n' +
                        '  10\r\n' +
                        '0.0\r\n' +
                        '  20\r\n' +
                        '0.0\r\n' +
                        '  9\r\n' +
                        '$EXTMAX\r\n' +
                        '  10\r\n' +
                        '10000.0\r\n' +
                        '  20\r\n' +
                        '10000.0\r\n' +
                        '  0\r\n' +
                        'ENDSEC\r\n' +
                        '  0\r\n' +
                        'SECTION\r\n' +
                        '  2\r\n' +
                        'ENTITIES\r\n';
        },
        edge: function(a, b, color) {
            a = a.minus(ptMin);
            b = b.minus(ptMin);
            function line(x) {
                return x.toFixed(3) + '\r\n';
            }
            this.dxf += '  0\r\n' +
                        'LINE\r\n' +
                        '  8\r\n' +
                        '0\r\n' +
                        '  10\r\n' +
                        line(a.x) +
                        '  20\r\n' +
                        line(a.y) +
                        '  30\r\n' +
                        line(a.z) +
                        '  11\r\n' +
                        line(b.x) +
                        '  21\r\n' +
                        line(b.y) +
                        '  31\r\n' +
                        line(b.z);
        },
        finish: function() {
            this.dxf += '  0\r\n' +
                        'ENDSEC\r\n' +
                        '  0\r\n' +
                        'EOF\r\n';

            this.uri = 'data:application/octet-stream,' + encodeURI(this.dxf);
            this.data = this.dxf;
            this.contentType = 'application/octet-stream';
            this.filename = 'template.dxf';
        },
    };
}

function dg(n) { return document.getElementById(n); }
function deepCopy(o) { return JSON.parse(JSON.stringify(o)); }
function Vector3(x, y, z) {
    return {
        x: x, y: y, z: z,
        toString: function() {
            return '(' + x.toFixed(3) + ', ' +
                         y.toFixed(3) + ', ' +
                         z.toFixed(3) + ')';
        },
        toThree: function() {
            return new THREE.Vector3(this.x, this.y, this.z);
        },
        writeIntoArray: function(v, stride, offset) {
            v[offset + 0*stride] = this.x;
            v[offset + 1*stride] = this.y;
            v[offset + 2*stride] = this.z;
        },
        makeMinMax: function(min, max) {
            min.x = Math.min(min.x, this.x);
            min.y = Math.min(min.y, this.y);
            min.z = Math.min(min.z, this.z);

            max.x = Math.max(max.x, this.x);
            max.y = Math.max(max.y, this.y);
            max.z = Math.max(max.z, this.z);
        },
        plus: function(b) {
            return Vector3(this.x + b.x, this.y + b.y, this.z + b.z)
        },
        minus: function(b) {
            return Vector3(this.x - b.x, this.y - b.y, this.z - b.z)
        },
        divPivoting: function(b) {
            var mx = Math.abs(b.x), my = Math.abs(b.y), mz = Math.abs(b.z);
            if(mx >= my && mx >= mz) {
                return this.x / b.x;
            } else if(my >= mz) {
                return this.y / b.y;
            } else {
                return this.z / b.z;
            }
        },
        scaledBy: function(k) {
            return Vector3(this.x*k, this.y*k, this.z*k);
        },
        magSquared: function() {
            return (this.x*this.x + this.y*this.y + this.z*this.z);
        },
        magnitude: function() {
            return Math.sqrt(this.magSquared());
        },
        withMagnitude: function(m) {
            return this.scaledBy(m / this.magnitude());
        },
        cross: function(b) {
            return Vector3(-(this.z*b.y) + (this.y*b.z),
                            (this.z*b.x) - (this.x*b.z),
                           -(this.y*b.x) + (this.x*b.y));
        },
        dot: function(b) {
            return (this.x*b.x + this.y*b.y + this.z*b.z);
        },
        dotIntoCsys: function(u, v, n) {
            return Vector3(this.dot(u), this.dot(v), this.dot(n));
        },
        scaleOutOfCsys: function(u, v, n) {
            return u.scaledBy(this.x).plus(
                   v.scaledBy(this.y).plus(
                   n.scaledBy(this.z)));
        },
        closestPointOnLine: function(p0, dp) {
            dp = dp.withMagnitude(1);
            var pn = (this.minus(p0)).cross(dp);
            var n = pn.cross(dp);
            var d = (dp.cross(p0.minus(this))).magnitude();
            return this.plus(n.withMagnitude(d));
        },
        rotatedAbout: function(axis, theta) {
            var s = Math.sin(theta), c = Math.cos(theta);
            axis = axis.withMagnitude(1);

            return Vector3( (this.x)*(c + (1 - c)*(axis.x)*(axis.x)) +
                            (this.y)*((1 - c)*(axis.x)*(axis.y) - s*(axis.z)) +
                            (this.z)*((1 - c)*(axis.x)*(axis.z) + s*(axis.y)),

                            (this.x)*((1 - c)*(axis.y)*(axis.x) + s*(axis.z)) +
                            (this.y)*(c + (1 - c)*(axis.y)*(axis.y)) +
                            (this.z)*((1 - c)*(axis.y)*(axis.z) - s*(axis.x)),

                            (this.x)*((1 - c)*(axis.z)*(axis.x) - s*(axis.y)) +
                            (this.y)*((1 - c)*(axis.z)*(axis.y) + s*(axis.x)) +
                            (this.z)*(c + (1 - c)*(axis.z)*(axis.z)) );
        },
        normal: function(i) {
            var v = this.withMagnitude(1);
            var xa = Math.abs(v.x),
                ya = Math.abs(v.y),
                za = Math.abs(v.z);
            var n;
            if(xa < ya && xa < za) {
                n = Vector3(0, v.z, -v.y);
            } else if(ya < za) {
                n = Vector3(-v.z, 0, v.x);
            } else {
                n = Vector3(v.y, -v.x, 0);
            }
            if(i == 0) {
                return n;
            } else {
                return v.cross(n).withMagnitude(1);
            }
        },
    };
}

function makeUnroller(axis, offset, radius, templ_seam) {
    var u = axis.normal(0), v = axis.normal(1), n = u.cross(v);
    return function(p) {
        p = (p.minus(offset)).dotIntoCsys(u, v, n);
        var theta = Math.atan2(p.y, p.x);
        theta += (templ_seam*2*Math.PI)/360;
        while(theta > 2*Math.PI) theta -= 2*Math.PI;
        while(theta < 0) theta += 2*Math.PI;
        return Vector3(theta*radius, p.z, 0);
    };
}

function makeNormaler(axis, offset, radius) {
    return function(p) {
        var cp = p.closestPointOnLine(offset, axis);
        return p.minus(cp).withMagnitude(1);
    };
}

function makeClosestPointer(axis, offset, radius) {
    return function(p) {
        var n = axis.withMagnitude(1), u = n.normal(0), v = n.normal(1);
        var tp = (p.minus(offset)).dotIntoCsys(u, v, n);
        var r = Math.sqrt(tp.x*tp.x + tp.y*tp.y);
        tp.x *= radius/r;
        tp.y *= radius/r;
        return (tp.scaleOutOfCsys(u, v, n)).plus(offset);
    };
}

function makeIntersectionWithLiner(axis, offset, radius) {
    return function(p0, p1) {
        var dp = p1.minus(p0);
        if((dp.cross(axis)).magnitude() < EPS) {
            // no intersection points, line is parallel to cylinder axis
            return [ ];
        }
        var n = axis.withMagnitude(1),
            u = (n.cross(dp)).withMagnitude(1),
            v = (n.cross(u)).withMagnitude(1);

        var tp0 = (p0.minus(offset)).dotIntoCsys(u, v, n),
            tp1 = (p1.minus(offset)).dotIntoCsys(u, v, n),
            tdp = tp1.minus(tp0);
        // in the transformed csys, the line is vertical when projected onto the xy
        // plane, and the cylinder axis is the z axis
        var dr = Math.abs(tp0.x) - radius;
        if(dr > EPS) {
            return [ ];
        } else if(dr >= -EPS && dr < EPS) { 
            return [ ];
        } else {
            var yi = Math.sqrt(radius*radius - tp0.x*tp0.x);
            var ret = [ ];
            for(var i = 0; i < 2; i++) {
                var t = (yi - tp0.y)/tdp.y,
                    teps = EPS/tdp.magnitude(),
                    p = tp0.plus(tdp.scaledBy(t));

                if(t > -teps && t < (1-teps) && p.z > 0) {
                    ret.push(offset.plus(p.scaleOutOfCsys(u, v, n)));
                }
                yi = -yi;
            }
            return ret;
        }
    };
}

function Strip(a0, a1, b0, b1) {
    return {
        // from a to b is axial, from 0 to 1 is tangential
        a0: a0, a1: a1,
        b0: b0, b1: b1,

        normal: function() {
            return (this.a0.minus(this.b0)).cross(this.b0.minus(this.a1));
        },
    };
}

function TubeGeometry() {
    return {
        strips:    [ ],
        interEdge: [ ],

        addCylinder: function(axis, origin, diameter, n, templ_seam) {
            var radius = diameter/2;
            this.radius = radius;
            var u = axis.normal(0), v = axis.normal(1);

            var pp = origin.plus(u.scaledBy(radius));
            for(var i = 1; i <= n; i++) {
                var theta = (i == n) ? 0 : (2*Math.PI*i)/n;
                var um = radius*Math.cos(theta),
                    vm = radius*Math.sin(theta);

                var p = origin.plus(u.scaledBy(um)).plus(v.scaledBy(vm));

                this.strips.push(Strip(p, pp, p.plus(axis), pp.plus(axis)));
                pp = p;
            }

            this.unroll = makeUnroller(axis, origin, radius, templ_seam);
            this.normal = makeNormaler(axis, origin, radius);
            this.intersectionWithLine = makeIntersectionWithLiner(axis, origin, radius);
            this.closestPoint = makeClosestPointer(axis, origin, radius);
        },
        addEdge: function(pa, pb, color) {  
            this.interEdge.push([ pa, pb, color ]);
        },
        classify: function(st, tg, out) {
            var nst = st.normal();
            var nip = nst.cross(st.b0.minus(st.b1));
            var ntg = tg.normal(st.b0);
            if(ntg.dot(nip) < 0) {
                out.push(st);
            }
        },
        intersectStrip: function(st, other, out) {
            var int0 = other.intersectionWithLine(st.a0, st.b0),
                int1 = other.intersectionWithLine(st.a1, st.b1);

            if(int0.length == 1 && int1.length == 1) {
                this.classify(Strip(st.a0, st.a1, int0[0], int1[0]), other, out);
                // reverse 0 and 1 to keep direction the same, don't flip normal
                this.classify(Strip(st.b1, st.b0, int1[0], int0[0]), other, out);
                this.addEdge(int0[0], int1[0], other.color);

            } else if(int0.length == 2 && int1.length == 2) {
                this.classify(Strip(st.a0, st.a1, int0[0], int1[0]), other, out);
                this.classify(Strip(int0[0], int1[0], int0[1], int1[1]), other, out);
                this.classify(Strip(st.b1, st.b0, int1[1], int0[1]), other, out);
                this.addEdge(int0[0], int1[0], other.color);
                this.addEdge(int0[1], int1[1], other.color);

            } else if(int0.length == 0 && int1.length == 0) {
                out.push(st);
            } else if(((int0.length == 2 && int1.length == 0) ||
                      (int0.length == 0 && int1.length == 2)) &&
                  (st.a0.minus(st.a1)).magnitude() < 0.5)
            {
                if(int0.length == 0) {
                    st = Strip(st.b1, st.b0, st.a1, st.a0);
                    int0 = int1;
                }

                var pti = (int0[0].plus(int0[1])).scaledBy(0.5);
                // replace with Newton iteration, stupid
                for(var i = 0; i < 10; i++) {
                    var ptit = this.closestPoint(pti),
                        ptio = other.closestPoint(pti);
                    pti = (ptit.plus(ptio)).scaledBy(0.5);
                }
                var n = st.normal().withMagnitude(1),
                    u = (st.a0.minus(st.b0)).withMagnitude(1),
                    v = n.cross(u).withMagnitude(1);
                var ta1 = st.a1.dotIntoCsys(u, v, n),
                    tb1 = st.b1.dotIntoCsys(u, v, n),
                    ti0 = int0[0].dotIntoCsys(u, v, n),
                    ti1 = int0[1].dotIntoCsys(u, v, n),
                    tii = pti.dotIntoCsys(u, v, n);
                if(Math.abs(ti0.x - ta1.x) > Math.abs(ti1.x - tb1.x)) {
                    var t;
                    t = ti0; ti0 = ti1; ti1 = t;
                    t = int0[0]; int0[0] = int0[1]; int0[1] = t;
                }
                var d = ti0.x - ti1.x;
                var tv0 = Vector3(tii.x + d/6, tii.y, tii.z),
                    tv1 = Vector3(tii.x - d/6, tii.y, tii.z),
                    tvo = Vector3(tii.x, ta1.y, tii.z),
                    tai = Vector3(ta1.x, tii.y, tii.z),
                    tbi = Vector3(tb1.x, tii.y, tii.z);

                tii = tii.scaleOutOfCsys(u, v, n);
                tv0 = tv0.scaleOutOfCsys(u, v, n);
                tv1 = tv1.scaleOutOfCsys(u, v, n);
                tvo = tvo.scaleOutOfCsys(u, v, n);
                tai = tai.scaleOutOfCsys(u, v, n);
                tbi = tbi.scaleOutOfCsys(u, v, n);
                
                this.addEdge(int0[0], tii, other.color);
                this.addEdge(int0[1], tii, other.color);
                var sti = Strip(int0[0], tv0, int0[1], tv1), // little piece near inter
                    sta = Strip(st.a0, tai, int0[0], tv0),
                    stb = Strip(tbi, st.b0, tv1, int0[1]),
                    sts = Strip(tai, st.a1, tbi, st.b1); // full-length sliver quad
                out.push(sta);
                out.push(stb);
                out.push(sts);
            } else {
                if((st.a0.minus(st.a1)).magnitude() > 0.1) {
                    var am = (st.a0.plus(st.a1)).scaledBy(0.5),
                        bm = (st.b0.plus(st.b1)).scaledBy(0.5);
                    var s0m = Strip(st.a0, am, st.b0, bm),
                        sm1 = Strip(am, st.a1, bm, st.b1);
                    this.intersectStrip(s0m, other, out);
                    this.intersectStrip(sm1, other, out);
                } else {
                    if(int0.length > 0 && int1.length > 0) {
                        // treat like 1 and 1, small error
                        this.classify(Strip(st.a0, st.a1, int0[0], int1[0]), other, out);
                        this.classify(Strip(st.b1, st.b0, int1[0], int0[0]), other, out);
                        this.addEdge(int0[0], int1[0], other.color);
                    } else {
                        out.push(st);
                    }
                }
            }
        },
        intersectAgainst: function(other, trim) {
            var sn = [ ];
            for(var i = 0; i < this.strips.length; i++) {
                var st = this.strips[i];
                this.intersectStrip(st, other, sn);
            }
            if(trim) {
                this.strips = sn;
            }
        },
        positionNormalArray: function() {
            var pos  = new Float32Array(this.strips.length*2*9),
                norm = new Float32Array(this.strips.length*2*9);

            var flat = dg('flat_shading').checked;

            for(var i = 0; i < this.strips.length; i++) {
                var st = this.strips[i];
                var na0 = this.normal(st.a0),
                    na1 = this.normal(st.a1),
                    nb0 = this.normal(st.b0),
                    nb1 = this.normal(st.b1);
                if(flat) {
                    na1 = nb0 = nb1 = na0;
                }

                st.a0.writeIntoArray(pos, 1, i*2*9 +  0);
                st.b0.writeIntoArray(pos, 1, i*2*9 +  3);
                st.b1.writeIntoArray(pos, 1, i*2*9 +  6);

                st.a0.writeIntoArray(pos, 1, i*2*9 +  9);
                st.b1.writeIntoArray(pos, 1, i*2*9 + 12);
                st.a1.writeIntoArray(pos, 1, i*2*9 + 15);

                na0.writeIntoArray(norm, 1, i*2*9 +  0);
                nb0.writeIntoArray(norm, 1, i*2*9 +  3);
                nb1.writeIntoArray(norm, 1, i*2*9 +  6);

                na0.writeIntoArray(norm, 1, i*2*9 +  9);
                nb1.writeIntoArray(norm, 1, i*2*9 + 12);
                na1.writeIntoArray(norm, 1, i*2*9 + 15);
            }
            return [ pos, norm ];
        },
    };
}

var defaultTube = {
    od:             120,
    id:             119,
    length:         100,
    theta:          0,
    phi:            0,
    offset_rad:     0,
    offset_ax:      0,
    offset_ax_me:   0,
    pwls:           200,
    templ_seam:     0,
    through:        true,
    trim:           true,
    trim_others:    true,
    shown:          true,
};
var defaultTube2 = {
    od:             80,
    id:             79,
    length:         180,
    theta:          60,
    phi:            0,
    offset_rad:     0,
    offset_ax:      -40,
    offset_ax_me:   0,
    pwls:           200,
    templ_seam:     90,
    trim:           true,
    trim_others:    true,
    through:        false,
    shown:          true,
};
var tubes = {
    shown:      0,
    tubes:      [ deepCopy(defaultTube), deepCopy(defaultTube2) ],
};
var view = {
    right:      Vector3( 0.06, -0.64, -0.76),
    up:         Vector3( 0.90,  0.37, -0.23),
    out:        Vector3( 0.43, -0.67,  0.60),
    offset:     Vector3( 0.00, -0.30,  0.00),
    scale:      0.0079,
    mouseX: 0, mouseY: 0,
};
var scene, camera, renderer, controls, stats;
var debugLines;
var logc = 0;
var EPS = 1e-6; // small compared to floating point error

function debugPoint(p) {
    var star = [ Vector3(1, 0, 0), Vector3(0, 1, 0), Vector3(0, 0, 1),
                 Vector3(1, 1, 0), Vector3(0, 1, 1), Vector3(1, 0, 1) ];
    for(var i = 0; i < star.length; i++) {
        var si = star[i].withMagnitude(0.5);
        debugLines.push(p.plus(si));
        debugLines.push(p.minus(si));
    }
}
function debugEdge(p0, p1) {
    debugLines.push(p0);
    debugLines.push(p1);
}
function debugStrip(st) {
    debugEdge(st.a0, st.a1);
    debugEdge(st.a1, st.b1);
    debugEdge(st.b1, st.b0);
    debugEdge(st.b0, st.a0);
}

function outsideColor(i) {
    var l = [ 0x0000ff, 0x00ff00, 0xff00ff, 0xffff00 ];
    return l[i % l.length];
}

function makeMesh() {
    debugLines = [ ];

    var tl = 0;
    for(var i = 0; i < tubes.tubes.length; i++) {
        tl = Math.max(tl, 20*tubes.tubes[i].od);
    }

    // first, generate the tube geometry, as quad strips along axis of cylinders
    var axis0;
    for(var i = 0; i < tubes.tubes.length; i++) {
        var tube = tubes.tubes[i];

        var st = Math.sin(degToRad(tube.theta)),
            ct = Math.cos(degToRad(tube.theta)),
            sp = Math.sin(degToRad(tube.phi)),
            cp = Math.cos(degToRad(tube.phi));
        var axis = Vector3(st*cp, st*sp, ct);

        var offset = Vector3(0, 0, 0);
        if(i == 0) {
            axis0 = axis;
        } else {
            var n = axis0.cross(axis);
            if(n.magnitude() > EPS) offset = n.withMagnitude(tube.offset_rad);
        }
        offset = offset.plus(axis0.withMagnitude(tube.offset_ax));
        offset = offset.plus(axis.withMagnitude(tube.offset_ax_me));

        axis = axis.withMagnitude((tube.length > 0) ? tube.length : tl);
        if(tube.through) {
            offset = offset.minus(axis);
            axis = axis.scaledBy(2);
        }

        tube.color = outsideColor(i);
        tube.geomOd = TubeGeometry();
        tube.geomOd.addCylinder(axis, offset, tube.od, tube.pwls, tube.templ_seam);
        tube.geomOd.color = tube.color;

        tube.geomId = null;
        if(dg('consider_id').checked) {
            tube.geomId = TubeGeometry();
            tube.geomId.addCylinder(axis, offset, tube.id, tube.pwls, tube.templ_seam);
            tube.geomId.color = 0x888888;
        }
    }

    // then, intersect each tube against all the others
    for(var i = 0; i < tubes.tubes.length; i++) {
        for(var j = 0; j < tubes.tubes.length; j++) {
            if(i == j) continue;
            var ti = tubes.tubes[i],
                tj = tubes.tubes[j];
            if(!tj.trim_others) continue;

            logc = (i == 0 && j == 2) ? 0 : 1e6;
            if(true) {
                if(ti.geomId && tj.geomId) {
                    // do ID first, otherwise material intersecting OD is already
                    // cut away
                    ti.geomOd.intersectAgainst(tj.geomId, ti.trim);
                    ti.geomOd.intersectAgainst(tj.geomOd, ti.trim);
                    ti.geomId.intersectAgainst(tj.geomId, ti.trim);
                    ti.geomId.intersectAgainst(tj.geomOd, ti.trim);
                } else {
                    ti.geomOd.intersectAgainst(tj.geomOd, ti.trim);
                }
            } else {
                if(i == 0 && j == 1) {
                    ti.geomOd.intersectAgainst(tj.geomOd, ti.trim);
                }
            }
        }
    }

    // and finally generate the stuff that we'll render
    for(var i = 0; i < tubes.tubes.length; i++) {
        var tube = tubes.tubes[i];
        tube.render = [ ];

        for(var j = 0; j < 2; j++) {
            var m = (j == 0) ? tube.geomOd : tube.geomId;
            if(!m) continue;
            if(!tube.shown) continue;

            // a solid model of the tube, strips that have possibly been trimmed
            // against other tubes
            var pn = m.positionNormalArray();
            var geom = new THREE.BufferGeometry();
            geom.addAttribute('position', new THREE.BufferAttribute(pn[0], 3));
            geom.addAttribute('normal', new THREE.BufferAttribute(pn[1], 3));
            var mat = new THREE.MeshLambertMaterial({ color: m.color });
            if(dg('consider_id').checked) {
                mat.side = THREE.DoubleSide;
                tube.render.push(new THREE.Mesh(geom, mat));
            } else {
                mat.side = THREE.FrontSide;
                tube.render.push(new THREE.Mesh(geom, mat));
                mat = new THREE.MeshLambertMaterial({ color: 0x888888 });
                mat.side = THREE.BackSide;
                tube.render.push(new THREE.Mesh(geom, mat));
            }
            if(false) {
                tube.render.push(new THREE.WireframeHelper(mesh, 0xff0000));
            }
        }
    }

    for(var i = 0; i < tubes.tubes.length; i++) {
        var tube = tubes.tubes[i];
        tube.renderActive = [ ];

        for(var j = 0; j < 2; j++) {
            var m = (j == 0) ? tube.geomOd : tube.geomId;
            if(!m) continue;

            // edges, shown only for the active tube
            var emat = new THREE.LineBasicMaterial({ depthTest: false });
            emat.vertexColors = THREE.VertexColors;
            var egeom = new THREE.BufferGeometry();
            var pa = new Float32Array(m.interEdge.length*3*2);
                pc = new Float32Array(m.interEdge.length*3*2);
            for(var k = 0; k < m.interEdge.length; k++) {
                var edge = m.interEdge[k];
                var e0 = edge[0], e1 = edge[1], color = edge[2];
                e0.writeIntoArray(pa, 1, k*3*2 + 0);
                e1.writeIntoArray(pa, 1, k*3*2 + 3);

                var vc = Vector3((color >> 16) & 0xff,
                                 (color >>  8) & 0xff,
                                 (color >>  0) & 0xff).scaledBy(1.0/255);
                vc.writeIntoArray(pc, 1, k*3*2 + 0);
                vc.writeIntoArray(pc, 1, k*3*2 + 3);
            }
            egeom.addAttribute('position', new THREE.BufferAttribute(pa, 3));
            egeom.addAttribute('color', new THREE.BufferAttribute(pc, 3));
            tube.renderActive.push(new THREE.Line(egeom, emat, THREE.LinePieces));
        }
    }
}

function templateShown(outside) {
    regen();

    var ts = tubes.tubes[tubes.shown],
        tg = outside ? ts.geomOd : ts.geomId;
    if(!tg) return;

    var ptMin = Vector3( 1e9,  1e9, 0),
        ptMax = Vector3(-1e9, -1e9, 0);
    var edges = [ ];
    for(var i = 0; i < tg.interEdge.length; i++) {
        var e = tg.interEdge[i];
        var ne = [ tg.unroll(e[0]), tg.unroll(e[1]), e[2] ];
        // don't draw long edges where the phase wraps
        if(ne[0].minus(ne[1]).magnitude() > 0.94*2*Math.PI*tg.radius) continue;
        ne[0].makeMinMax(ptMin, ptMax);
        ne[1].makeMinMax(ptMin, ptMax);
        edges.push(ne);
    }
    if(edges.length == 0) return;
    var marg = 5;
    ptMin = ptMin.minus(Vector3(marg, marg, 0));
    ptMax = ptMax.plus(Vector3(marg, marg, 0));

    var wr = dg('pdf').checked ? PdfWriter(ptMin, ptMax) : DxfWriter(ptMin, ptMax);
    wr.start();
    // grid first, z order
    if(dg('overlay_grid').checked) {
        var c = 0xcccccc;
        for(var i = 0; i < (ptMax.x - ptMin.x) + 10; i += 10) {
            var x = ptMin.x + i - marg;
            wr.edge(Vector3(x, ptMin.y, 0), Vector3(x, ptMax.y, 0), c);
        }
        for(var i = 0; i < (ptMax.y - ptMin.y) + 10; i += 10) {
            var y = ptMin.y + i - marg;
            wr.edge(Vector3(ptMin.x, y, 0), Vector3(ptMax.x, y, 0), c);
        }
    }
    for(var i = 0; i < edges.length; i++) {
        var e = edges[i];
        wr.edge(e[0], e[1], e[2]);
    }
    wr.finish();
    
    if (wr.data) {
	    if('msSaveOrOpenBlob' in navigator) {
	        // IE doesn't support .download
	        var arr = new Uint8Array(wr.data.length);
	        for(var i = 0; i < wr.data.length; i++) {
	            arr[i] = wr.data.charCodeAt(i);
	        }
	        var blob = new Blob([ arr ], { type: wr.contentType });
	        navigator.msSaveOrOpenBlob(blob, wr.filename);
	    } else {
	        var dla = document.createElement('a');
	        dla.href = wr.uri;
	        dla.target = '_blank';
	        dla.download = wr.filename;
	        dla.style.display = 'none';
	        document.body.appendChild(dla);
	        dla.click();
	        document.body.removeChild(dla);
	    }
    }
}

function degToRad(d) { return (2*Math.PI*d)/360; }
var mmInchFactor = 1;
var mmInchPlaces = 2;
function mmToDisplay(v) { return (v / mmInchFactor).toFixed(mmInchPlaces); }
function displayToMm(v) { return (mmInchFactor*parseFloat(v)); }

function addTube(e) {
    e.preventDefault();

    controlsToTube();
    tubes.tubes.push(deepCopy(tubes.tubes[tubes.shown]));
    var i = tubes.tubes.length - 1;
    tubes.tubes[i].theta += 60;
    tubes.tubes[i].shown = true;
    tubes.shown = i;
    tubeToControls();
}

function deleteShown() {
    tubes.tubes.splice(tubes.shown, 1);
    var n = tubes.tubes.length;
    if(n == 0) {
        tubes.tubes = [ deepCopy(defaultTube) ];
    } else {
        if(tubes.shown >= n) {
            tubes.shown = n - 1;
        }
    }
    tubeToControls();
}

function changeShown(e, i) {
    e.preventDefault();

    controlsToTube();
    tubes.shown = i;
    tubeToControls();
}

function controlsToTube() {
    var tube = tubes.tubes[tubes.shown];
    tube.od = displayToMm(dg('tube_od').value);
    tube.id = Math.min(tube.od-0.1, displayToMm(dg('tube_id').value));
    tube.length = displayToMm(dg('tube_length').value);
    tube.theta = parseFloat(dg('tube_theta').value);
    tube.phi = parseFloat(dg('tube_phi').value);
    tube.offset_rad = displayToMm(dg('tube_offset_rad').value);
    tube.offset_ax = displayToMm(dg('tube_offset_ax').value);
    tube.offset_ax_me = displayToMm(dg('tube_offset_ax_me').value);
    tube.pwls = Math.max(5, Math.min(1000, parseInt(dg('tube_pwls').value)));
    tube.templ_seam = parseFloat(dg('tube_templ_seam').value);
    tube.through = dg('tube_through').checked;
    tube.trim = dg('tube_trim').checked;
    tube.trim_others = dg('tube_trim_others').checked;
    tube.shown = dg('tube_shown').checked;
}

function makeClosure(f, i) {
    return function(e) { return f(e, i); };
}

function tubeToControls() {
    var tabs = dg('tabh');
    tabs.innerHTML = '';
    for(var i = 0; i < tubes.tubes.length; i++) {
        var op = document.createElement('a');
        op.text = 'Tube ' + (i + 1);
        op.href = "#";
        op.className = (i == tubes.shown) ? 'tabsel' : 'tabunsel';
        op.addEventListener('click', makeClosure(changeShown, i), true);
        tabs.appendChild(op);
    }
    if(tubes.tubes.length < 9) {
        var op = document.createElement('a');
        op.text = '+ Add Tube';
        op.href = '#';
        op.className = 'tabunsel';
        op.addEventListener('click', addTube, true);
        tabs.appendChild(op);
    }

    if(tubes.tubes.length < 7) {
        var base = window.location.toString().replace(/\?.*/, '');
        var obj = { tubes: tubes, view: view };
        for(var i = 0; i < obj.tubes.tubes.length; i++) {
            var ot = obj.tubes.tubes[i];
            // unneeded and huge
            delete ot.geomOd;
            delete ot.geomId;
            delete ot.render;
            delete ot.renderActive;
        }

        op = document.createElement('a');
        op.text = 'Permalink';
        op.href = base + '?json=' + encodeURI(JSON.stringify(obj));
        op.className = 'tabperma';
        op.target = '_blank';
        tabs.appendChild(op);
    }

    var tube = tubes.tubes[tubes.shown];
    dg('tube_name').value = 'Tube ' + (tubes.shown + 1);
    dg('tube_od').value = mmToDisplay(tube.od);
    dg('tube_id').value = mmToDisplay(tube.id);
    dg('tube_length').value = (tube.length > 0) ? mmToDisplay(tube.length) : 'auto';
    dg('tube_theta').value = tube.theta;
    dg('tube_phi').value = tube.phi;
    dg('tube_offset_rad').value = mmToDisplay(tube.offset_rad);
    dg('tube_offset_ax').value = mmToDisplay(tube.offset_ax);
    dg('tube_offset_ax_me').value = mmToDisplay(tube.offset_ax_me);
    dg('tube_pwls').value = tube.pwls;
    dg('tube_templ_seam').value = tube.templ_seam;
    if(tube.through) {
        dg('tube_through').checked = true;
    } else {
        dg('tube_deadend').checked = true;
    }
    dg('tube_shown').checked = tube.shown;
    dg('tube_trim').checked = tube.trim;
    dg('tube_trim_others').checked = tube.trim_others;

    var l = [ 'tube_theta', 'tube_phi',
              'tube_offset_rad', 'tube_offset_ax', 'tube_offset_ax_me' ];
    for(var i = 0; i < l.length; i++) {
        var e = dg(l[i]);
        if(tubes.shown == 0) {
            e.disabled = true;
            e.value = '0';
        } else {
            e.disabled = false;
        }
    }
    dg('tube_id').disabled = !dg('consider_id').checked;
    dg('template_id').disabled = !dg('consider_id').checked;

    var el;
    for(var i = 0; el = dg('unit' + i); i++) {
        el.innerHTML = dg('inch').checked ? 'inch' : 'mm';
    }

    renderGl(true);
}

function showAll(show) {
    controlsToTube();
    for(var i = 0; i < tubes.tubes.length; i++) {
        tubes.tubes[i].shown = show;
    }
    tubeToControls();
}

function mmInch() {
    controlsToTube();
    if(dg('mm').checked) {
        mmInchFactor = 1;
        mmInchPlaces = 2;
    } else {
        mmInchFactor = 25.4;
        mmInchPlaces = 3;
    }
    tubeToControls();
}

function regen() {
    controlsToTube();
    tubeToControls();
}

function renderGl(remake) {
    scene = new THREE.Scene();
    scene.frustumCulled = false;

    camera = new THREE.PerspectiveCamera( 45, 1, -2e4, 2e4);
    var cpme = camera.projectionMatrix.elements;
    for(var i = 0; i < 16; i++) cpme[i] = 0.0;
    view.right.scaledBy(view.scale).writeIntoArray(cpme, 4, 0);
    view.up.scaledBy(view.scale).writeIntoArray(cpme, 4, 1);
    view.out.scaledBy(-view.scale/3e3).writeIntoArray(cpme, 4, 2);
    cpme[15] = 1;
    view.offset.writeIntoArray(cpme, 1, 12);
    scene.add(camera);

    var light;
    light = new THREE.DirectionalLight(0xffffff, 0.5);
    var lp = Vector3(-1, 1, 0).scaleOutOfCsys(view.right, view.up, view.out);
    light.position.set(lp.x, lp.y, lp.z);
    scene.add(light);

    light = new THREE.DirectionalLight(0xffffff, 0.5);
    var lp = Vector3(1, 1, 1).scaleOutOfCsys(view.right, view.up, view.out);
    light.position.set(lp.x, lp.y, lp.z);
    scene.add(light);
    light = new THREE.AmbientLight(0x444444);
    scene.add(light);

    if(remake) makeMesh();
    for(var i = 0; i < tubes.tubes.length; i++) {
        var tube = tubes.tubes[i];
        for(var j = 0; j < tube.render.length; j++) {
            scene.add(tube.render[j]);
        }
    }
    if(dg('curves').checked) {
        var tube = tubes.tubes[tubes.shown];
        for(var j = 0; j < tube.renderActive.length; j++) {
            scene.add(tube.renderActive[j]);
        }
    }

    var dbm = new THREE.LineBasicMaterial({ color: 0xff0000, depthTest: false });
    var dbg = new THREE.Geometry();
    for(var i = 0; i < debugLines.length; i += 2) {
        dbg.vertices.push(new THREE.Vector3(debugLines[i].x,
                                            debugLines[i].y,
                                            debugLines[i].z),
                          new THREE.Vector3(debugLines[i+1].x,
                                            debugLines[i+1].y,
                                            debugLines[i+1].z));
    }
    var dbl = new THREE.Line(dbg, dbm, THREE.LinePieces);
    scene.add(dbl);

    renderer.render(scene, camera);
}

function mouseDistanceToGlDistance(xy) {
    return xy*2/400;
}

function renderMouseWheel(e) {
    e.preventDefault();
    zoom(e.deltaY > 0 ? -1 : 1);
}

function renderMouseUp(e) {
    e.preventDefault();
}

function renderMouseDown(e) {
    e.preventDefault();
    view.mouseX = e.clientX;
    view.mouseY = e.clientY;
}

function renderMouseMove(e) {
    e.preventDefault();
    var dx =  mouseDistanceToGlDistance(e.clientX - view.mouseX),
        dy = -mouseDistanceToGlDistance(e.clientY - view.mouseY);

    var leftDown, middleDown, rightDown;
    if('buttons' in e) {
        leftDown   = ((e.buttons & 1) != 0);
        middleDown = ((e.buttons & 4) != 0);
        rightDown  = ((e.buttons & 2) != 0);
    } else {
        leftDown   = (e.which == 1);
        middleDown = (e.which == 2);
        rightDown  = (e.which == 3);
    }

    if(rightDown || (leftDown && e.shiftKey) || middleDown) {
        view.offset = view.offset.plus(Vector3(dx, dy, 0));
    } else if(leftDown) {
        var s = 1;
        view.right = view.right.rotatedAbout(view.up, -s*dx);
        view.up = view.up.rotatedAbout(view.right, s*dy);

        view.right = view.right.withMagnitude(1);
        view.out = (view.right.cross(view.up)).withMagnitude(1);
        view.up = (view.out.cross(view.right)).withMagnitude(1);
    } else {
        return;
    }

    view.mouseX = e.clientX;
    view.mouseY = e.clientY;
    renderGl(false);
}

function zoom(v) {
    if(v == 0) {
        var ptMin = Vector3( 1e9,  1e9, 0),
            ptMax = Vector3(-1e9, -1e9, 0);

        for(var i = 0; i < tubes.tubes.length; i++) {
            var tube = tubes.tubes[i];
            var tgs = tube.geomOd.strips;
            for(var j = 0; j < tgs.length; j++) {
                var st = tgs[j];
                var p = [ st.a0, st.a1, st.b0, st.b1 ];
                for(var k = 0; k < p.length; k++) {
                    var pt = p[k];
                    pt = pt.dotIntoCsys(view.right, view.up, view.out);
                    pt.makeMinMax(ptMin, ptMax);
                }
            }
        }
        var sx = 2 / (ptMax.x - ptMin.x),
            sy = 2 / (ptMax.y - ptMin.y);
        view.scale = Math.min(sx, sy)*0.95;

        view.offset = (ptMax.plus(ptMin)).scaledBy(-0.5*view.scale);
        view.offset.z = 0;
    } else if(v > 0) {
        view.scale /= 0.7;
    } else {
        view.scale *= 0.7;
    }
    renderGl(false);
}

function renderKeyPress(e) {
    if(document.activeElement.type == 'text') return;

    if(e.keyCode == 45 || e.keyCode == 95 || e.key == '-' || e.key == '_') {
        zoom(-1);
    } else if(e.keyCode == 43 || e.keyCode == 61 || e.key == '+' || e.key == '=') {
        zoom(1);
    } else if(e.keyCode == 102 || e.keyCode == 70 || e.key == 'f' || e.key == 'F') {
        zoom(0);
    } else {
        return;
    }
    renderGl(false);
    e.preventDefault();
}

function tubeJoinInit() {
    renderer = new THREE.WebGLRenderer( {antialias:true} );
    renderer.setSize(400, 400);
  
    if(window.location.search.indexOf('?json=') == 0) {
        try {
            var p = window.location.search.replace('?json=', '');
            var obj = JSON.parse(decodeURI(p));
            if(obj.view && obj.tubes) {
                view.scale = obj.view.scale;
                var l = [ 'right', 'up', 'out', 'offset' ];
                for(var i = 0; i < l.length; i++) {
                    var p = l[i], ovp = obj.view[p];
                    view[p] = Vector3(ovp.x, ovp.y, ovp.z);
                }
                tubes = obj.tubes;
            }
        } catch(e) { }
    }

    var tj = dg('threejs');
    tj.appendChild(renderer.domElement);

    tj.addEventListener('mousemove', renderMouseMove, true);
    tj.addEventListener('mousedown', renderMouseDown, true);
    tj.addEventListener('wheel', renderMouseWheel, true);
    tj.addEventListener('mouseup', renderMouseUp, true);
    document.body.addEventListener('keypress', renderKeyPress, true);
    
    tubeToControls();
    renderGl(true);
}

