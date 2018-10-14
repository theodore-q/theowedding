var params;
var kaleidoscope;
var dx, dy;

params = {
     image_url: 'https://image.ibb.co/fsYvaf/wall-Of-Flowers.jpg',
 // image_url: 'https://i2.wp.com/cdn2.vectorstock.com/i/thumb-large/11/06/abstract-pink-watercolor-background-vector-4161106.jpg?resize=450%2C300',
    triangle_size: 455,
    easing_ratio: 0.08,
    auto_rotate_speed: 0.0002
};

var ImageUtils = function() {};

ImageUtils.downscale = function(dst, src, scale) {
    var work0 = document.createElement('canvas');
    var work1 = document.createElement('canvas');
    var w = work0.width = work1.width = src.naturalWidth || src.width;
    var h = work0.height = work1.height = src.naturalHeight || src.height;
    var ctx0 = work0.getContext('2d');
    var ctx1 = work1.getContext('2d');
    ctx0.drawImage(src, 0, 0);

    // Resize by half recursively for better quality.
    while (scale < 0.5) {
        ctx1.clearRect(0, 0, w/2, h/2);
        ctx1.drawImage(work0, 0, 0, w, h, 0, 0, w/2, h/2);
        w /= 2;
        h /= 2;
        scale *= 2;

        var tmpCanvas = work0; work0 = work1; work1 = tmpCanvas;
        var tmpContext = ctx0; ctx0 = ctx1; ctx1 = tmpContext;
    }

    dst.width = w*scale;
    dst.height = h*scale;
    dst.getContext('2d').drawImage(work0, 0, 0, w, h, 0, 0, w*scale, h*scale);
};

var Kaleidoscope = function(canvas, triangleSide) {
    this._canvas = canvas;
    this._context = canvas.getContext('2d');
    this._triangleWidth = triangleSide;
    this._triangleHeight = triangleSide * Math.sqrt(3) / 2;

    this.fillStyle = '#000000';
    this.offsetX = 0;
    this.offsetY = 0;
    this.rotation = 0;

    this._cache = document.createElement('canvas');
    this._cache.width = triangleSide*7/2;
    this._cache.height = triangleSide;
    this._cacheContext = this._cache.getContext('2d');
};

Kaleidoscope.prototype = {
    draw: function() {
        // First, crop the image into a triangle,
        // and draw a parallelogram composed from six triangular images.
        var c = this._cacheContext;
        var w = this._triangleWidth;
        var h = this._triangleHeight;
        c.fillStyle = this.fillStyle;
        c.strokeStyle = this.fillStyle;
        c.lineWidth = 1.5;
        c.clearRect(0, 0, this._cache.width, this._cache.height);

        this._drawTriangle(c, 0,     0, 0,           false);
        this._drawTriangle(c, w,     0, Math.PI  /3, true );
        this._drawTriangle(c, w*3/2, h, Math.PI*4/3, false);
        this._drawTriangle(c, w*5/2, h, Math.PI*3/3, true );
        this._drawTriangle(c, w*3,   0, Math.PI*2/3, false);
        this._drawTriangle(c, w*5/2, h, Math.PI*5/3, true );

        // Then fill the canvas with the parallelogram.
        c = this._context;
        var offsetX = 0;
        var startH = -1;
        var startV = 0;
        var endH = Math.ceil(this._canvas.width / (w*3));
        var endV = Math.ceil(this._canvas.height / h);

        c.clearRect(0, 0, this._canvas.width, this._canvas.height);
        for (var i = startV; i < endV; i++) {
            for (var j = startH; j < endH; j++) {
                c.drawImage(this._cache, j*w*3 + offsetX, i*h);
            }
            offsetX = w*3/2 - offsetX;
        }
    },

    setSize: function(width, height) {
        this._canvas.width = width;
        this._canvas.height = height;
    },

    setImage: function(image) {
        var scale = Math.max(this._triangleWidth / image.naturalWidth, this._triangleHeight / image.naturalHeight); 

        if (scale < 1.0) {
            var tmp = document.createElement('canvas');
            ImageUtils.downscale(tmp, image, scale);
            this.fillStyle = this._cacheContext.createPattern(tmp, 'repeat');
        }
        else {
            this.fillStyle = this._cacheContext.createPattern(image, 'repeat');
        }
    },

    _drawTriangle: function(c, dx, dy, dt, flip) {
        var w = this._triangleWidth;
        var h = this._triangleHeight;

        c.save();
        c.translate(dx, dy);
        c.rotate(dt);
        if (flip) {
            c.translate(w, 0);
            c.scale(-1, 1);
        }
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(w, 0);
        c.lineTo(w/2, h);
        c.closePath();
        c.translate(this.offsetX, this.offsetY);
        c.rotate(this.rotation);
        c.fill();
        c.stroke();
        c.restore();
    }
};

window.addEventListener('load', function() {
    init();
    draw();
});

function init() {
    var canvas = document.querySelector('#canvas');
    kaleidoscope = new Kaleidoscope(canvas, params.triangle_size);
    kaleidoscope.setSize(window.innerWidth, window.innerHeight);

    dx = 0;
    dy = 0;

    loadImageAsync(params.image_url, setImage);

    window.addEventListener('mousemove', function(e) {
        // dx = (e.pageX / window.innerWidth - 0.5) * params.triangle_size;
        // dy = (e.pageY / window.innerHeight - 0.5) * params.triangle_size;
    });

    window.addEventListener('deviceorientation', function(e) {
        dx = params.triangle_size * Math.sin(e.beta * Math.PI / 180);
        dy = params.triangle_size * Math.sin(e.gamma * Math.PI / 90);
    });

    window.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    window.addEventListener('drop', function(e) {
        e.preventDefault();
        
        if (e.dataTransfer.files.length < 1) {
            return;
        }
        
        openImageFileAsync(e.dataTransfer.files[0], setImage);
    });

    // Add some delay not to bother generating thumbnail.
    setTimeout(function() {
        window.addEventListener('resize', function(e) {
            kaleidoscope.setSize(window.innerWidth, window.innerHeight);
        });
    }, 3000);
}

function draw() {
    kaleidoscope.offsetX += (dx - kaleidoscope.offsetX) * params.easing_ratio;
    kaleidoscope.offsetY += (dy - kaleidoscope.offsetY) * params.easing_ratio;
    kaleidoscope.rotation += params.auto_rotate_speed;

    kaleidoscope.draw();

    requestAnimationFrame(draw);
}

function openImageFileAsync(file, callback) {
    if (file.type.lastIndexOf('image') !== 0) {
        alert('Not supported format.');
        return;
    }

    loadImageAsync(URL.createObjectURL(file), callback);
}

function loadImageAsync(source, callback) {
    var img = new Image();
    img.onload = function(e) {
        callback(e.target);
    };
    img.src = source;
}

function setImage(image) {
    kaleidoscope.setImage(image);
}

function loaded(){
    setTimeout(function(){
        $(".loading-screen").fadeOut(400,function(){
            $(".main-content").css("display", "block");
        });
    }, 1000)

    

}

function preloadImages(images, callback) {
    var count = images.length;
    if(count === 0) {
        callback();
    }
    var loaded = 0;
    $.each(images, function(index, image) {
        $('<img>').attr('src', image).on('load', function() { // the first argument could also be 'load error abort' if you wanted to *always* execute the callback
            loaded++;
            if (loaded === count) {
                callback();
            }
        });
    });
};

// use whatever callback you really want as the argument
preloadImages(["https://image.ibb.co/fsYvaf/wall-Of-Flowers.jpg", "https://image.ibb.co/iX8arz/bottom_boquet.png", "https://image.ibb.co/hd5gOe/flower_garland_with_us.png","https://image.ibb.co/bKkUxU/flower_garland.png"], function() {
    loaded()
});