
# Geosphere Graph


## Einbettung in HTML-Seite


```
<div id="container">
<script type="module">
import {GeosphereGraph} from 'https://cdn.jsdelivr.net/gh/luke-ff/GeosphereGraph/geosphere.js';
GeosphereGraph.run( document.getElementById("container"), 
        { station: 11152,
          plots: GeosphereGraph.LT + GeosphereGraph.P }
</script>
```


## station

Die Station kann über Geosphere gefunden werden: https://dataset.api.hub.geosphere.at/v1/station/current/tawes-v1-10min/metadata
Mattsee: 11152
Salzburg-Flughafen: 11150
