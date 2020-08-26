function expo(canvas, style) {
  class Drawer {
    constructor(ctx) {
      this.ctx = ctx;
    }

    fillStyle(style) {
      this.ctx.fillStyle = style;
    }

    strokeStyle(style, width) {
      this.ctx.strokeStyle = style;
      this.ctx.strokeWidth = width | 1;
    }

    fillOval(x, y, rx, ry) {
      this.ctx.beginPath();
      this.ctx.ellipse(x, y, rx, ry, 0, 0, 2*Math.PI);
      this.ctx.fill();
    }

    line(x0, y0, x1, y1) {
      this.ctx.beginPath();
      this.ctx.moveTo(x0, y0);
      this.ctx.lineTo(x1, y1);
      this.ctx.stroke();
    }
  }

  const POSITIONS = {
    originalWidth: 320,
    originalHeight: 350,
    bodies: [
      [140, 40, 40, 40],
      [223, 54, 50, 50],
      [255, 112, 58, 25],
      [250, 168, 36, 40],
      [243, 249, 54, 46],
      [175, 297, 45, 48],
      [108, 292, 33, 33],
      [76, 244, 24, 41],
      [51, 186, 43, 46],
      [40, 115, 39, 37],
      [91, 135, 30, 30],
      [91, 79, 35, 34]
    ],
    eyes: [
      [229, 37, 23, 20],
      [261, 252, 28, 25],
      [171, 318, 16, 16],
      [64, 196, 18, 19],
      [30, 112, 18, 18]
    ]
  };

  const DEFAULT_STYLE = {
    body: '#ff0000',
    outerEye: '#ffffff',
    innerEye: '#0082ff',
    blinkEye: '#000000'
  };

  class Expo {
    constructor(context2d, style, width) {
      this.drawer = new Drawer(context2d);
      this.blinking = false;
      this.style = style;
      this.width = width;
      this.height = width * POSITIONS.originalHeight / POSITIONS.originalWidth;
    }

    blink(duration) {
      this.blinking = true;
      this.draw();
      window.setTimeout(() => {
        this.blinking = false;
        this.draw();
      }, duration);
    }

    transformX(x) {
      return x * this.width / POSITIONS.originalWidth;
    }

    transformY(y) {
      return y * this.height/ POSITIONS.originalHeight;
    }

    transformRect(rect) {
      return [
        this.transformX(rect[0]),
        this.transformY(rect[1]),
        this.transformX(rect[2]),
        this.transformY(rect[3]),
      ];
    }

    drawEye(position, pointer) {
      let x = position[0];
      let y = position[1];
      let rx = position[2];
      let ry = position[3];
      if (this.blinking) {
        this.drawer.strokeStyle(this.style.blinkEye, 1);
        this.drawer.line(x-rx, y + ry*0.2, x+rx, y + ry*0.2);
      } else {
        this.drawer.fillStyle(this.style.outerEye);
        this.drawer.fillOval(x, y, rx, ry);
        this.drawer.fillStyle(this.style.innerEye);
        let diffX = pointer[0] - x;
        let diffY = pointer[1] - y;
        let angle = Math.atan2(diffY, diffX);
        let d = Math.min(0.65, Math.sqrt(diffX * diffX + diffY * diffY)/(rx*rx));
        let r = ry*2/5;
        this.drawer.fillOval(x + rx * d * Math.cos(angle), y + ry * d * Math.sin(angle), r, r);
      }
    }

    draw(pointerX, pointerY) {
      this.drawer.fillStyle(this.style.body);
      POSITIONS.bodies.forEach((item) => {
        let transformed = this.transformRect(item);
        this.drawer.fillOval(transformed[0], transformed[1], transformed[2], transformed[3]);
      });

      POSITIONS.eyes.forEach((item) => {
        let transformed = this.transformRect(item);
        if (pointerX === undefined) {
          this.drawEye(transformed, [Math.random() * 600, Math.random() * 600]);
        } else {
          this.drawEye(transformed, [pointerX, pointerY]);
        }
      });
    };
  }

  const BLINK_CONFIG = {
    evaluationPeriod: 500,
    possibility: 0.05,
    minDuration: 100,
    maxDuration: 300,
  };

  let setup = (canvas, style) => {
    let expo = new Expo(canvas.getContext('2d'), style || DEFAULT_STYLE, canvas.width, canvas.height);

    window.addEventListener('mousemove', (e) => {
      expo.draw(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
    });

    window.setInterval(() => {
      if (Math.random() < BLINK_CONFIG.possibility) {
        expo.blink(BLINK_CONFIG.minDuration + BLINK_CONFIG.maxDuration * Math.random());
      }
    }, BLINK_CONFIG.evaluationPeriod);

    return expo;
  };

  setup(canvas, style).draw();
}
