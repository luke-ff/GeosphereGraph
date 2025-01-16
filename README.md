
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


## Konfiguration

```
{ station: _Number_,
  plots: _Number_,
  end: _DateObj_,
  range: _Number_,
  plotsettings: _Object_ }
```

### station

Die Station kann über Geosphere gefunden werden: https://dataset.api.hub.geosphere.at/v1/station/current/tawes-v1-10min/metadata  
Mattsee: 11152  
Salzburg-Flughafen: 11150  

### plots
Die folgenden Werte addiert ergeben die angezeigten Graphen:  
GeosphereGraph.TL       Lufttemperatur  
GeosphereGraph.P        Luftdruck (reduziert auf Meereshöhe)  
GeosphereGraph.DD       Windrichtung  
GeosphereGraph.FF       Windgeschwindigkeit  
GeosphereGraph.FD       Windrichtung und -geschwindigkeit  

### end
Enddatum des Graphen (Default: Aktuelle Uhrzeit)

### range
Breite des Graphen in Stunden

### plotsettings
Zusätzliche Einstellungen für die Graphen, siehe auch https://observablehq.com/plot/features/plots#layout-options
````
{       width:600,
        height:200,
        marginLeft:50,
        marginRight:30}
```
