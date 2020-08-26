# expo
Render a cute creature into a canvas element.

## Usage

[Simple Example](index.html)

[More Examples](sample.html)

Example:
```
<canvas id="target" width="320" height="350"></canvas>
<script src="https://ykmr1224.github.io/expo/expo.js"></script>
<script lang="javascript">
    expo(document.getElementById('target'));
</script>
```

Colors are customizable:
```
<canvas id="target" width="320" height="350"></canvas>
<script src="https://ykmr1224.github.io/expo/expo.js"></script>
<script lang="javascript">
    expo(document.getElementById('target'), {
        body: '#0082ff',
        outerEye: '#aaff82',
        innerEye: '#ff8200',
        blinkEye: '#000000'
    });
</script>
```
