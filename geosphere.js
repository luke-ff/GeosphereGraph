import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm";


export const GeosphereGraph = (function() {

    

    
    var url = "https://dataset.api.hub.geosphere.at/v1/station/historical/tawes-v1-10min"
    var searchParams = {
        "station_ids":11152,
        "parameters":"TL,DD,DDX,FF,FFX,PRED",
    }


    const baseSettings = {
        marginLeft:50,
        marginRight:30,
        style: {
            fontSize:'10pt',
        }
    }

    var overrideSettings = {}
    
    function run(container, settings = {end: new Date(), range: 3, plots: 15, plotsettings: {}}) {

        if (typeof settings.end == "undefined") settings.end=new Date();
        if (typeof settings.range == "undefined") settings.range=3;
        if (typeof settings.plots == "undefined") settings.plots=15;
        if (typeof settings.plotsettings  == "undefined") settings.plotsettings={};
        if (typeof settings.station != "undefined") {
            searchParams.station_ids = settings.station;
        }
        
        overrideSettings = Object.assign(baseSettings, settings.plotsettings);

        searchParams.end = settings.end.toJSON();
        var start = new Date( settings.end.toJSON() );
        start.setHours(settings.end.getHours()-settings.range);
        searchParams.start = start.toJSON();
            
        fetch( url + "?" + new URLSearchParams(searchParams), {
            method: "GET"
        } ).then( response => {
    		if (!response.ok) {
    			throw("Kann Daten nicht laden")
    		} else {
    			return response.json() ;
    		}
    	} ).then( (json) => {
            plot(json, container, settings.plots);
        } ).catch( e => {
            console.log(e);
    		throw e;
    	});
        
    }

    var hourFormat = (d) => {
          return new Intl.DateTimeFormat('de-DE', {
              timeStyle: 'short'
         }).format(d);
    }

    
    function plot( jsondata, container, which ) {

        var mstoknots = 1.9438;

        const toKnots = ( a ) => { return (a == null)?null:(a*mstoknots); };
        
        
        var data = jsondata.timestamps.map( (ts, idx) => {
            return {
                "ts": new Date(ts), 
                "tl": jsondata.features[0].properties.parameters.TL.data[idx],
                "dd": jsondata.features[0].properties.parameters.DD.data[idx],
                "ddx": jsondata.features[0].properties.parameters.DDX.data[idx],
                "ff": toKnots( jsondata.features[0].properties.parameters.FF.data[idx] ) ,
                "ffx": toKnots( jsondata.features[0].properties.parameters.FFX.data[idx] ),
                "pred": jsondata.features[0].properties.parameters.PRED.data[idx],
            };
        });

        
        if (which & 1) container.appendChild(onePlot("Temperatur", data, "°C", ["tl"]));
        if (which & 2) container.appendChild(onePlot("Luftdruck", data, "hPa", ["pred"]));
        if (which & 4) container.appendChild(onePlot("Wind / Böen", data, "kts", [{"field":"ff", "extras":{"markerEnd":"dot",}},{"field":"ffx", "extras":{"stroke":"#999", "strokeWidth": 1}}]));
        if (which & 8) container.appendChild(onePlot("Windrichtung", data, "°", [{"field":"dd", "extras":{"markerEnd":"dot"}},{"field":"ddx", "extras":{"stroke":"#999", "strokeWidth": 1}}],[Plot.axisY([0,90,180,270,360],{anchor: "right",}) ],{y: {
                                    axis: "left", 
                                    ticks: [0,45,90,135,180,225,270,315,360],
    								tickSize:1,
    								label: "°",
    								grid: true,
    							}} ));

        if (which & 16) container.appendChild(windplot(data));
        
        console.log(data);
    

    }
        
    function onePlot(title,data,ylabel,valarr,extramarks=[],plotextras={}) {
            const marks =  valarr.map( (settings, idx) => {

                            
                            if (typeof settings == "string") {
                                settings = {
                                    "field":settings, 
                                    "extras": {
                                            "stroke":"#000", 
                                            "strokeWidth": 2 / (idx+1),
                                    }
                                };
                            }

                            const plotsettings = Object.assign({
                    										x: d => d.ts,
                    										y: settings.field,
                                                            tip: true
                                            }, settings.extras );
                
                            return Plot.lineY(data, plotsettings);
            });

            marks.push(...extramarks);
        
            var field1 = valarr[0];
            if (typeof field1 != "string") {
                field1 = valarr[0].field;
            }

            marks.push(Plot.crosshairX(data, {
                            x: d => d.ts,
                            y: d => d[field1],
                        }));



            const plotConfig = Object.assign({
    							style: {
    								background: "transparent",
    							},
    							x: {
    								type: "time",
    								tickFormat: hourFormat,
                                    grid: true,
                                    label: ""
    							},
    							y: {
                                    axis: "left", 
    								tickSize:1,
    								label: ylabel,
    								grid: true,
    							},
    							
    							marks: marks,
    							title: title,
    							
    		},plotextras,overrideSettings);
        
            return Plot.plot(plotConfig);

    }


    function windplot(data, plotextras={}) {

        const nf = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 })
        
        const marks = [Plot.vectorX(data, {
                x:"ts",
                rotate:"dd" ,
                length: 20,
                stroke:"ff",
            }), Plot.tip(data, Plot.pointer({
                x:"ts",
                title: (d) => `Windrichtung: ${d.dd}°\n\nWindspeed: ${nf.format(d.ff)} kts\n\nBöen: ${nf.format(d.ffx)}kts aus ${d.ddx}°`
            }))
                       
        ];

        const plotConfig = Object.assign({
            style: {
                background: "transparent",
            },
            insetLeft:40,
            color: {label: "Speed (kts)", zero: true, legend: true, domain:[0,20]},
            x: {
                type: "time",
                tickFormat: hourFormat,
                grid: true,
                label: "",
            },
            /*y: {
                axis: "left", 
                tickSize:1,
                label: "",
                grid: true,
            },*/
            marks: marks,
    		title: "Wind"
        },plotextras,overrideSettings, {height:140, marginLeft:20, marginRight:20});
        
        return Plot.plot(plotConfig);
        
    }
    

    return {
        "run": run,
        "TL": 1,
        "P": 2,
        "FF": 4,
        "DD": 8,
        "FD": 16
    }

})();
