# VisPan - Visual Pan

A jQuery plugin for panning website visuals and screenshots by mouse movement in a fixed height &lt;div&gt;

[Demo](https://studiole.uk/code/vispan)

## Install

Packages are available via Bower and NPM

```
npm install --save vispan
```

```
bower install --save vispan
```

## Use

Include `dist/css/vispan.css` and `dist/js/vispan.js` in your page, ensuring jQuery is loaded first.

``` html
<!-- css -->
<link rel="stylesheet" href="bower_components/vispan/dist/css/vispan.css">
<!-- jQuery -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<!-- VisPan -->
<script src="bower_components/vispan/dist/js/vispan.js"></script>
```

Format your website visuals/slides in the following format

``` html
<div id="visuals">
  <div><img src="assets/img/web/home.jpg"></div>
  <div><img src="assets/img/web/about.jpg"></div>
  <div><img src="assets/img/web/contact-us.jpg"></div>
</div>
```

Give `#visuals` a fixed height

``` css
#visuals {
  height: 420px;
}
```

Finally, call the vispan method in your javascript

``` js
$(document).ready(function() {
  $('#visuals').vispan()
})
```
